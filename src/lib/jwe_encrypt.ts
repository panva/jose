import type * as types from '../types.d.ts'
import { encode as b64u } from '../util/base64url.js'
import { encrypt } from './content_encryption.js'
import { encryptKeyManagement } from './key_management.js'
import { JOSENotSupported, JWEInvalid } from '../util/errors.js'
import { isDisjoint } from './type_checks.js'
import { concat, encode } from './buffer_utils.js'
import { validateCrit, JWE_RECOGNIZED } from './options.js'
import { prepareKey } from './key.js'
import { JWE, jweAlgorithm, jweEncryption } from './jwe_algorithms.js'
import type { JWEAlgorithm, JWEEncryption } from './jwe_algorithms.js'
import { compress } from './deflate.js'
import { assertCryptoKey } from './is_key_like.js'
import { checkHPKEHeaders, seal } from './hpke.js'

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
  enc: string | undefined,
  encEntry: JWEEncryption | undefined,
  algEntry: JWEAlgorithm,
]

/**
 * Validates the headers of one recipient. Split out so a General JWE can validate every recipient
 * up front and then encrypt without validating any of them a second time.
 */
export function checkEncryptHeaders(input: EncryptInput): CheckedHeaders {
  const [, protectedHeader, unprotectedHeader, sharedUnprotectedHeader, , , , , crit] = input

  if (!isDisjoint(protectedHeader, unprotectedHeader, sharedUnprotectedHeader)) {
    throw new JWEInvalid(
      'JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint',
    )
  }

  const joseHeader: types.JWEHeaderParameters = {
    ...protectedHeader,
    ...unprotectedHeader,
    ...sharedUnprotectedHeader,
  }

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

  const algEntry: JWEAlgorithm | undefined = JWE[alg]
  if (algEntry?.hpke) {
    checkHPKEHeaders(alg, protectedHeader?.alg, joseHeader)
    return [joseHeader, alg, undefined, undefined, algEntry]
  }

  if (typeof enc !== 'string' || !enc) {
    throw new JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid')
  }

  return [joseHeader, alg, enc, jweEncryption(enc), algEntry ?? jweAlgorithm(alg)]
}

export async function encryptJWE(
  input: EncryptInput,
  checked: CheckedHeaders,
  key: types.KeyInput,
): Promise<types.FlattenedJWE> {
  const [joseHeader, alg, , encEntry, algEntry] = checked
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

  if (providedCek && (alg === 'dir' || alg === 'ECDH-ES' || algEntry.hpke)) {
    throw new TypeError(
      `setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${alg}`,
    )
  }

  let cek!: types.CryptoKey | Uint8Array
  let encryptedKey: Uint8Array | undefined
  let parameters: types.JWEHeaderParameters | undefined
  let hpkeKey: types.CryptoKey | undefined

  if (algEntry.hpke) {
    if (inputIv) {
      throw new TypeError(
        `setInitializationVector cannot be called with JWE "alg" (Algorithm) Header ${alg}`,
      )
    }

    if (keyManagementParameters && Object.keys(keyManagementParameters).length !== 0) {
      throw new TypeError(
        `setKeyManagementParameters cannot be called with JWE "alg" (Algorithm) Header ${alg}`,
      )
    }

    const k = await prepareKey(algEntry, key, 'encrypt')
    assertCryptoKey(k)
    hpkeKey = k
  } else {
    const k = await prepareKey(alg === 'dir' ? encEntry! : algEntry, key, 'encrypt')
    ;[cek, encryptedKey, parameters] = await encryptKeyManagement(
      alg,
      encEntry!,
      k,
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

  let ciphertext: Uint8Array
  let tag: Uint8Array | undefined
  let iv: Uint8Array | undefined
  if (hpkeKey) {
    ;[encryptedKey, ciphertext] = await seal(algEntry, hpkeKey, plaintext, additionalData)
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
): Promise<types.FlattenedJWE> {
  return encryptJWE(input, checkEncryptHeaders(input), key)
}
