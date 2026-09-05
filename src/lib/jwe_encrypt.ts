import type * as types from '../types.d.ts'
import { encode as b64u } from '../util/base64url.js'
import { encrypt } from './content_encryption.js'
import { encryptKeyManagement } from './key_management.js'
import { JWEInvalid } from '../util/errors.js'
import {
  assertUint8Array,
  isDisjoint,
  isObject,
  serializeJoseHeader,
  validateCrit,
  validateCritDuplicates,
  JWE_RECOGNIZED,
} from './validate.js'
import { encode } from './buffer_utils.js'
import { prepareKey } from './key.js'
import { JWE, jweAlgorithm, jweEncryption } from './jwe_algorithms.js'
import type { JWEAlgorithm, JWEEncryption } from './jwe_algorithms.js'
import { compress, validateZip } from './deflate.js'

export type EncryptInput = [
  plaintext: Uint8Array,
  protectedHeader?: types.JWEHeaderParameters,
  unprotectedHeader?: types.JWEHeaderParameters,
  sharedUnprotectedHeader?: types.JWEHeaderParameters,
  aad?: Uint8Array,
  cek?: Uint8Array,
  iv?: Uint8Array,
  keyManagementParameters?: types.JWEKeyManagementHeaderParameters,
  crit?: { [propName: string]: boolean },
  /** Put the key management parameters in the Per-Recipient Unprotected Header. */
  unprotectedParameters?: boolean,
]

export type CheckedHeaders = [
  joseHeader: types.JWEHeaderParameters,
  encEntry: JWEEncryption | undefined,
  algEntry: JWEAlgorithm | undefined,
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
 * up front and then encrypt without validating any of them a second time. Later recipients reuse
 * the first recipient's normalized shared headers.
 */
export function checkEncryptHeaders(
  input: EncryptInput,
  options?: types.EncryptOptions,
  sharedHeadersNormalized = false,
): CheckedHeaders {
  if (!input[1] && !input[2] && !input[3]) {
    throw new JWEInvalid(
      'either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()',
    )
  }

  if (options !== undefined) {
    input[8] = options?.crit
  }

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

  if (aad !== undefined) {
    assertUint8Array(aad, 'JWE Additional Authenticated Data')
  }

  if (cek !== undefined) {
    assertUint8Array(cek, 'JWE Content Encryption Key')
  }

  if (iv !== undefined) {
    assertUint8Array(iv, 'JWE Initialization Vector')
  }

  if (!sharedHeadersNormalized && protectedHeader !== undefined) {
    protectedHeader = serializeJoseHeader(JWEInvalid, protectedHeader)[0]
    input[1] = protectedHeader
  }
  if (unprotectedHeader !== undefined) {
    unprotectedHeader = serializeJoseHeader(JWEInvalid, unprotectedHeader)[0]
    input[2] = unprotectedHeader
  }
  if (!sharedHeadersNormalized && sharedUnprotectedHeader !== undefined) {
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

  validateZip(joseHeader, protectedHeader)

  const { alg, enc } = joseHeader

  if (typeof alg !== 'string' || !alg) {
    throw new JWEInvalid('JWE "alg" (Algorithm) Header Parameter missing or invalid')
  }

  const algEntry = JWE[alg]
  if (algEntry?.mode === 'integrated-encryption') {
    if (enc !== undefined) {
      throw new JWEInvalid(
        'JWE "enc" (Encryption Algorithm) Header Parameter must not be present for integrated encryption',
      )
    }
    if (cek !== undefined) {
      throw new TypeError(
        `setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${alg}`,
      )
    }
    if (iv !== undefined) {
      throw new TypeError(
        `setInitializationVector cannot be called with JWE "alg" (Algorithm) Header ${alg}`,
      )
    }
    return [joseHeader, undefined, algEntry]
  }

  if (typeof enc !== 'string' || !enc) {
    throw new JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid')
  }

  return [joseHeader, jweEncryption(enc), algEntry]
}

export async function encryptJWE(
  input: EncryptInput,
  checked: CheckedHeaders,
  key: types.KeyInput,
): Promise<types.FlattenedJWE> {
  const [joseHeader, encEntry, selected] = checked
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

  const algEntry = selected ?? jweAlgorithm(joseHeader.alg)
  let encryptedKey: Uint8Array | undefined
  let parameters: types.JWEHeaderParameters | undefined
  let cek: types.CryptoKey | Uint8Array
  if (algEntry.mode === 'integrated-encryption') {
    cek = await prepareKey(algEntry, key, 'encrypt')
  } else {
    ;[cek, encryptedKey, parameters] = await encryptKeyManagement(
      algEntry,
      encEntry!,
      key,
      joseHeader,
      providedCek,
      keyManagementParameters,
    )
  }

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

  const protectedHeaderS = protectedHeader ? b64u(JSON.stringify(protectedHeader)) : ''
  const aadMember = aad?.byteLength ? b64u(aad) : undefined
  const additionalData = encode(aadMember ? `${protectedHeaderS}.${aadMember}` : protectedHeaderS)

  let plaintext = inputPlaintext
  if (joseHeader.zip === 'DEF') {
    plaintext = await compress(plaintext).catch((cause) => {
      throw new JWEInvalid('Failed to compress plaintext', { cause })
    })
  }

  let ciphertext: Uint8Array
  let tag: Uint8Array | undefined
  let iv: Uint8Array | undefined
  if (algEntry.mode === 'integrated-encryption') {
    ;[encryptedKey, ciphertext] = await algEntry.encrypt(
      cek,
      plaintext,
      additionalData,
      protectedHeader,
      joseHeader,
      keyManagementParameters,
    )
  } else {
    ;({ ciphertext, tag, iv } = await encrypt(encEntry!, plaintext, cek, inputIv, additionalData))
  }

  const jwe: types.FlattenedJWE = {
    ciphertext: b64u(ciphertext),
  }

  if (iv) {
    jwe.iv = b64u(iv)
  }

  if (tag) {
    jwe.tag = b64u(tag)
  }

  if (encryptedKey?.byteLength) {
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
  return encryptJWE(input, checkEncryptHeaders(input, options), key)
}

export function compactJWE(jwe: types.FlattenedJWE): string {
  return [jwe.protected, jwe.encrypted_key, jwe.iv, jwe.ciphertext, jwe.tag].join('.')
}
