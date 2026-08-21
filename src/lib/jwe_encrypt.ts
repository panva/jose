import type * as types from '../types.d.ts'
import { encode as b64u } from '../util/base64url.js'
import { encrypt } from './content_encryption.js'
import { encryptKeyManagement } from './key_management.js'
import { JOSENotSupported, JWEInvalid } from '../util/errors.js'
import { isDisjoint, isObject } from './type_checks.js'
import { concat, encode } from './buffer_utils.js'
import {
  serializeJoseHeader,
  validateCrit,
  validateCritDuplicates,
  JWE_RECOGNIZED,
} from './options.js'
import { prepareKey } from './key.js'
import { jweAlgorithm, jweEncryption } from './jwe_algorithms.js'
import type { JWEEncryption } from './jwe_algorithms.js'
import { compress } from './deflate.js'
import { unprotected } from './helpers.js'

export type EncryptInput = [
  plaintext: Uint8Array,
  protectedHeader: types.JWEHeaderParameters | undefined,
  unprotectedHeader: types.JWEHeaderParameters | undefined,
  sharedUnprotectedHeader: types.JWEHeaderParameters | undefined,
  aad: Uint8Array | undefined,
  cek: Uint8Array | undefined,
  iv: Uint8Array | undefined,
  keyManagementParameters: types.JWEKeyManagementHeaderParameters | undefined,
  crit: { [propName: string]: boolean } | undefined,
  /** Put the key management parameters in the Per-Recipient Unprotected Header. */
  unprotectedParameters: boolean,
]

export type CheckedHeaders = [
  joseHeader: types.JWEHeaderParameters,
  alg: string,
  enc: string,
  encEntry: JWEEncryption,
]

/** https://www.rfc-editor.org/rfc/rfc7516#section-7.2.1 */
export function checkDisjoint(
  protectedHeader: types.JWEHeaderParameters | undefined,
  unprotectedHeader: types.JWEHeaderParameters | undefined,
  sharedUnprotectedHeader: types.JWEHeaderParameters | undefined,
): void {
  if (!isDisjoint(protectedHeader, unprotectedHeader, sharedUnprotectedHeader)) {
    throw new JWEInvalid(
      'JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint',
    )
  }
}

/**
 * Validates the headers of one recipient. Split out so a General JWE can validate every recipient
 * up front and then encrypt without validating any of them a second time.
 */
export function checkEncryptHeaders(input: EncryptInput): CheckedHeaders {
  let [
    ,
    protectedHeader,
    unprotectedHeader,
    sharedUnprotectedHeader,
    aad,
    cek,
    iv,
    keyManagementParameters,
    crit,
  ] = input

  if (aad !== undefined && !(aad instanceof Uint8Array)) {
    throw new TypeError('JWE Additional Authenticated Data must be an instance of Uint8Array')
  }

  if (cek !== undefined && !(cek instanceof Uint8Array)) {
    throw new TypeError('JWE Content Encryption Key must be an instance of Uint8Array')
  }

  if (iv !== undefined && !(iv instanceof Uint8Array)) {
    throw new TypeError('JWE Initialization Vector must be an instance of Uint8Array')
  }

  if (protectedHeader !== undefined) {
    protectedHeader = serializeJoseHeader(JWEInvalid, protectedHeader)[0]
    input[1] = protectedHeader
  }
  if (unprotectedHeader !== undefined) {
    unprotectedHeader = serializeJoseHeader(JWEInvalid, unprotectedHeader)[0]
    input[2] = unprotectedHeader
  }
  if (sharedUnprotectedHeader !== undefined) {
    sharedUnprotectedHeader = serializeJoseHeader(JWEInvalid, sharedUnprotectedHeader)[0]
    input[3] = sharedUnprotectedHeader
  }

  if (keyManagementParameters !== undefined && !isObject(keyManagementParameters)) {
    throw new TypeError('JWE Key Management Parameters must be an object')
  }

  checkDisjoint(protectedHeader, unprotectedHeader, sharedUnprotectedHeader)

  const joseHeader: types.JWEHeaderParameters = {
    ...protectedHeader,
    ...unprotectedHeader,
    ...sharedUnprotectedHeader,
  }

  validateCritDuplicates(JWEInvalid, protectedHeader)
  validateCrit(JWEInvalid, JWE_RECOGNIZED, crit, protectedHeader, joseHeader)

  if (joseHeader.zip !== undefined && joseHeader.zip !== 'DEF') {
    throw new JOSENotSupported(
      'Unsupported JWE "zip" (Compression Algorithm) Header Parameter value.',
    )
  }

  if (joseHeader.zip !== undefined && !protectedHeader?.zip) {
    throw new JWEInvalid(
      'JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.',
    )
  }

  const { alg, enc } = joseHeader

  if (typeof alg !== 'string' || !alg) {
    throw new JWEInvalid('JWE "alg" (Algorithm) Header Parameter missing or invalid')
  }

  if (typeof enc !== 'string' || !enc) {
    throw new JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid')
  }

  return [joseHeader, alg, enc, jweEncryption(enc)]
}

export async function encryptJWE(
  input: EncryptInput,
  checked: CheckedHeaders,
  key: types.KeyInput,
): Promise<types.FlattenedJWE> {
  const [joseHeader, alg, , encEntry] = checked
  const [
    inputPlaintext,
    inputProtectedHeader,
    inputUnprotectedHeader,
    sharedUnprotectedHeader,
    aad,
    providedCek,
    inputIv,
    keyManagementParameters,
    ,
    unprotectedParameters,
  ] = input
  let protectedHeader = inputProtectedHeader
  let unprotectedHeader = inputUnprotectedHeader

  if (providedCek && (alg === 'dir' || alg === 'ECDH-ES')) {
    throw new TypeError(
      `setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${alg}`,
    )
  }

  const algEntry = jweAlgorithm(alg)
  const k = await prepareKey(alg === 'dir' ? encEntry : algEntry, key, 'encrypt')
  const [cek, encryptedKey, parameters] = await encryptKeyManagement(
    alg,
    encEntry,
    k,
    providedCek,
    keyManagementParameters,
  )

  if (parameters) {
    if (unprotectedParameters) {
      unprotectedHeader = unprotectedHeader ? { ...unprotectedHeader, ...parameters } : parameters
    } else {
      protectedHeader = protectedHeader ? { ...protectedHeader, ...parameters } : parameters
    }

    // The generated Key Management Parameters join a header only after the input headers were
    // checked, so a name they collide with in another header would otherwise reach the result.
    checkDisjoint(protectedHeader, unprotectedHeader, sharedUnprotectedHeader)
  }

  let protectedHeaderS: string
  let protectedHeaderB: Uint8Array
  if (protectedHeader) {
    protectedHeaderS = b64u(JSON.stringify(protectedHeader))
    protectedHeaderB = encode(protectedHeaderS)
  } else {
    protectedHeaderS = ''
    protectedHeaderB = new Uint8Array()
  }

  let additionalData: Uint8Array
  let aadMember: string | undefined
  if (aad?.byteLength) {
    aadMember = b64u(aad)
    additionalData = concat(protectedHeaderB, encode('.'), encode(aadMember))
  } else {
    additionalData = protectedHeaderB
  }

  let plaintext = inputPlaintext
  if (joseHeader.zip === 'DEF') {
    plaintext = await compress(plaintext).catch((cause) => {
      throw new JWEInvalid('Failed to compress plaintext', { cause })
    })
  }

  const { ciphertext, tag, iv } = await encrypt(encEntry, plaintext, cek, inputIv, additionalData)

  const jwe: types.FlattenedJWE = {
    ciphertext: b64u(ciphertext),
  }

  if (iv) {
    jwe.iv = b64u(iv)
  }

  if (tag) {
    jwe.tag = b64u(tag)
  }

  if (encryptedKey) {
    jwe.encrypted_key = b64u(encryptedKey)
  }

  if (aadMember) {
    jwe.aad = aadMember
  }

  if (protectedHeader) {
    jwe.protected = protectedHeaderS
  }

  if (sharedUnprotectedHeader) {
    jwe.unprotected = sharedUnprotectedHeader
  }

  if (unprotectedHeader) {
    jwe.header = unprotectedHeader
  }

  return jwe
}

export async function createJWE(
  input: EncryptInput,
  key: types.KeyInput,
  options?: types.EncryptOptions,
): Promise<types.FlattenedJWE> {
  if (!input[1] && !input[2] && !input[3]) {
    throw new JWEInvalid(
      'either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()',
    )
  }

  if (options !== undefined) {
    input[8] = options?.crit
    input[9] = options ? unprotected in options : false
  }

  return encryptJWE(input, checkEncryptHeaders(input), key)
}
