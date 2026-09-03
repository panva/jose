import type * as types from '../types.d.ts'
import { encode as b64u } from '../util/base64url.js'
import { checkCekLength, encrypt, generateCek } from './content_encryption.js'
import { JWEInvalid } from '../util/errors.js'
import { assertUint8Array, isDisjoint, isObject } from './type_checks.js'
import { concat, encode } from './buffer_utils.js'
import {
  serializeJoseHeader,
  validateCrit,
  validateCritDuplicates,
  JWE_RECOGNIZED,
} from './options.js'
import { prepareKey } from './key.js'
import { validateZip } from './deflate.js'
import { unprotected } from './helpers.js'
import {
  checkProducedEncryptedKey,
  invalidJWEKeyManagementMode,
  isJWECEKTransport,
  resolveJWEContentEncryption,
  resolveJWEKeyManagement,
  type JWEAlgorithmSet,
  type JWECEKTransportCapability,
  type JWECompressionCapability,
  type JWEContentEncryptionCapability,
  type JWEKeyManagementOperation,
} from './jwe_algorithm.js'

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
  encEntry: Readonly<JWEContentEncryptionCapability> | undefined,
  compression: Readonly<JWECompressionCapability> | undefined,
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
export function checkEncryptHeaders(
  input: EncryptInput,
  algorithms: JWEAlgorithmSet,
): CheckedHeaders {
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

  const compression = validateZip(joseHeader, protectedHeader, algorithms)
  const { alg, enc } = joseHeader

  if (typeof alg !== 'string' || !alg) {
    throw new JWEInvalid('JWE "alg" (Algorithm) Header Parameter missing or invalid')
  }

  if (algorithms.alg[alg]?.mode === 'integrated-encryption') {
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
    return [joseHeader, alg, undefined, undefined, compression]
  }

  if (typeof enc !== 'string' || !enc) {
    throw new JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid')
  }

  return [joseHeader, alg, enc, resolveJWEContentEncryption(algorithms, enc), compression]
}

/** Prepares a recipient key and transports one caller- or core-owned CEK. */
export async function transportCek(
  alg: Readonly<JWECEKTransportCapability>,
  enc: Readonly<JWEContentEncryptionCapability>,
  key: types.KeyInput,
  providedCek: Uint8Array | undefined,
  joseHeader: types.JWEHeaderParameters,
  providedParameters: types.JWEKeyManagementHeaderParameters | undefined,
): Promise<
  [cek: Uint8Array, encryptedKey: Uint8Array, parameters: types.JWEHeaderParameters | undefined]
> {
  const preparedKey = await prepareKey(alg.key, key, 'encrypt')
  const cek = providedCek ?? generateCek(enc)
  checkCekLength(cek, enc.cekBits)
  const [encryptedKey, parameters] = await alg.encrypt(
    enc,
    preparedKey,
    cek,
    joseHeader,
    providedParameters,
  )
  checkProducedEncryptedKey(encryptedKey)
  return [cek, encryptedKey, parameters]
}

export async function encryptJWE(
  input: EncryptInput,
  checked: CheckedHeaders,
  key: types.KeyInput,
  algorithms: JWEAlgorithmSet,
  resolvedAlgEntry?: Readonly<JWEKeyManagementOperation>,
): Promise<types.FlattenedJWE> {
  const [joseHeader, alg, , encEntry, compression] = checked
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

  const algEntry =
    resolvedAlgEntry ?? algorithms.alg[alg] ?? resolveJWEKeyManagement(algorithms, alg)
  if (providedCek !== undefined && !isJWECEKTransport(algEntry)) {
    throw new TypeError(
      `setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${alg}`,
    )
  }

  let encryptedKey: Uint8Array | undefined
  let parameters: types.JWEHeaderParameters | undefined
  let cek: types.CryptoKey | Uint8Array | undefined
  let integratedKey: types.CryptoKey | Uint8Array | undefined
  switch (algEntry.mode) {
    case 'direct-encryption':
      cek = await prepareKey(encEntry!.key, key, 'encrypt')
      break
    case 'direct-key-agreement': {
      const preparedKey = await prepareKey(algEntry.key, key, 'encrypt')
      ;[cek, parameters] = await algEntry.encrypt(
        encEntry!,
        preparedKey,
        joseHeader,
        keyManagementParameters,
      )
      break
    }
    case 'key-wrapping':
    case 'key-encryption':
    case 'key-agreement-with-key-wrapping':
      ;[cek, encryptedKey, parameters] = await transportCek(
        algEntry,
        encEntry!,
        key,
        providedCek,
        joseHeader,
        keyManagementParameters,
      )
      break
    case 'integrated-encryption':
      integratedKey = await prepareKey(algEntry.key, key, 'encrypt')
      break
    default:
      invalidJWEKeyManagementMode(algEntry)
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
  if (compression) {
    plaintext = await compression.compress(plaintext).catch((cause) => {
      throw new JWEInvalid('Failed to compress plaintext', { cause })
    })
  }

  let ciphertext: Uint8Array
  let tag: Uint8Array | undefined
  let iv: Uint8Array | undefined
  if (algEntry.mode === 'integrated-encryption') {
    ;[encryptedKey, ciphertext] = await algEntry.encrypt(
      integratedKey!,
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
  algorithms: JWEAlgorithmSet,
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

  return encryptJWE(input, checkEncryptHeaders(input, algorithms), key, algorithms)
}
