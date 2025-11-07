/**
 * Decrypting JSON Web Encryption (JWE) in Flattened JSON Serialization
 *
 * @module
 */

import type * as types from '../../types.d.ts'
import { decode as b64u } from '../../util/base64url.js'
import { decrypt } from '../../lib/decrypt.js'
import { Open as hpke, isIntegratedEncryption, info } from '../../lib/hpke.js'
import {
  JOSEAlgNotAllowed,
  JOSENotSupported,
  JWEInvalid,
  JWEDecryptionFailed,
} from '../../util/errors.js'
import { isDisjoint } from '../../lib/is_disjoint.js'
import { isObject } from '../../lib/is_object.js'
import { decryptKeyManagement } from '../../lib/decrypt_key_management.js'
import { decoder, concat, encode } from '../../lib/buffer_utils.js'
import { generateCek } from '../../lib/cek.js'
import { validateCrit } from '../../lib/validate_crit.js'
import { validateAlgorithms } from '../../lib/validate_algorithms.js'
import { normalizeKey } from '../../lib/normalize_key.js'
import { checkKeyType } from '../../lib/check_key_type.js'
import { assertCryptoKey } from '../../lib/is_key_like.js'

/**
 * Interface for Flattened JWE Decryption dynamic key resolution. No token components have been
 * verified at the time of this function call.
 */
export interface FlattenedDecryptGetKey extends types.GetKeyFunction<
  types.JWEHeaderParameters | undefined,
  types.FlattenedJWE
> {}

/**
 * Decrypts a Flattened JWE.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/jwe/flattened/decrypt'`.
 *
 * @example
 *
 * ```js
 * const jwe = {
 *   ciphertext: '9EzjFISUyoG-ifC2mSihfP0DPC80yeyrxhTzKt1C_VJBkxeBG0MI4Te61Pk45RAGubUvBpU9jm4',
 *   iv: '8Fy7A_IuoX5VXG9s',
 *   tag: 'W76IYV6arGRuDSaSyWrQNg',
 *   encrypted_key:
 *     'Z6eD4UK_yFb5ZoKvKkGAdqywEG_m0e4IYo0x8Vf30LAMJcsc-_zSgIeiF82teZyYi2YYduHKoqImk7MRnoPZOlEs0Q5BNK1OgBmSOhCE8DFyqh9Zh48TCTP6lmBQ52naqoUJFMtHzu-0LwZH26hxos0GP3Dt19O379MJB837TdKKa87skq0zHaVLAquRHOBF77GI54Bc7O49d8aOrSu1VEFGMThlW2caspPRiTSePDMDPq7_WGk50izRhB3Asl9wmP9wEeaTrkJKRnQj5ips1SAZ1hDBsqEQKKukxP1HtdcopHV5_qgwU8Hjm5EwSLMluMQuiE6hwlkXGOujZLVizA',
 *   aad: 'VGhlIEZlbGxvd3NoaXAgb2YgdGhlIFJpbmc',
 *   protected: 'eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIn0',
 * }
 *
 * const { plaintext, protectedHeader, additionalAuthenticatedData } =
 *   await jose.flattenedDecrypt(jwe, privateKey)
 *
 * console.log(protectedHeader)
 * const decoder = new TextDecoder()
 * console.log(decoder.decode(plaintext))
 * console.log(decoder.decode(additionalAuthenticatedData))
 * ```
 *
 * @param jwe Flattened JWE.
 * @param key Private Key or Secret to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWE Decryption options.
 */
export function flattenedDecrypt(
  jwe: types.FlattenedJWE,
  key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array,
  options?: types.DecryptOptions,
): Promise<types.FlattenedDecryptResult>
/**
 * @param jwe Flattened JWE.
 * @param getKey Function resolving Private Key or Secret to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWE Decryption options.
 */
export function flattenedDecrypt(
  jwe: types.FlattenedJWE,
  getKey: FlattenedDecryptGetKey,
  options?: types.DecryptOptions,
): Promise<types.FlattenedDecryptResult & types.ResolvedKey>
export async function flattenedDecrypt(
  jwe: types.FlattenedJWE,
  key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array | FlattenedDecryptGetKey,
  options?: types.DecryptOptions,
) {
  if (!isObject(jwe)) {
    throw new JWEInvalid('Flattened JWE must be an object')
  }

  if (jwe.protected === undefined && jwe.header === undefined && jwe.unprotected === undefined) {
    throw new JWEInvalid('JOSE Header missing')
  }

  if (jwe.iv !== undefined && typeof jwe.iv !== 'string') {
    throw new JWEInvalid('JWE Initialization Vector incorrect type')
  }

  if (typeof jwe.ciphertext !== 'string') {
    throw new JWEInvalid('JWE Ciphertext missing or incorrect type')
  }

  if (jwe.tag !== undefined && typeof jwe.tag !== 'string') {
    throw new JWEInvalid('JWE Authentication Tag incorrect type')
  }

  if (jwe.protected !== undefined && typeof jwe.protected !== 'string') {
    throw new JWEInvalid('JWE Protected Header incorrect type')
  }

  if (jwe.encrypted_key !== undefined && typeof jwe.encrypted_key !== 'string') {
    throw new JWEInvalid('JWE Encrypted Key incorrect type')
  }

  if (jwe.aad !== undefined && typeof jwe.aad !== 'string') {
    throw new JWEInvalid('JWE AAD incorrect type')
  }

  if (jwe.header !== undefined && !isObject(jwe.header)) {
    throw new JWEInvalid('JWE Shared Unprotected Header incorrect type')
  }

  if (jwe.unprotected !== undefined && !isObject(jwe.unprotected)) {
    throw new JWEInvalid('JWE Per-Recipient Unprotected Header incorrect type')
  }

  let parsedProt!: types.JWEHeaderParameters | undefined
  if (jwe.protected) {
    try {
      const protectedHeader = b64u(jwe.protected)
      parsedProt = JSON.parse(decoder.decode(protectedHeader))
    } catch {
      throw new JWEInvalid('JWE Protected Header is invalid')
    }
  }
  if (!isDisjoint(parsedProt, jwe.header, jwe.unprotected)) {
    throw new JWEInvalid(
      'JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint',
    )
  }

  const joseHeader: types.JWEHeaderParameters = {
    ...parsedProt,
    ...jwe.header,
    ...jwe.unprotected,
  }

  validateCrit(JWEInvalid, new Map(), options?.crit, parsedProt, joseHeader)

  if (joseHeader.zip !== undefined) {
    throw new JOSENotSupported(
      'JWE "zip" (Compression Algorithm) Header Parameter is not supported.',
    )
  }

  const { alg, enc } = joseHeader

  if (typeof alg !== 'string' || !alg) {
    throw new JWEInvalid('missing JWE Algorithm (alg) in JWE Header')
  }

  const hpkeIe = isIntegratedEncryption(alg)

  if (hpkeIe) {
    if (enc) {
      throw new JWEInvalid(
        'JWE "enc" (Encryption Algorithm) Header Parameter must be missing when using HPKE Integrated Encryption',
      )
    }

    if (joseHeader.psk_id !== undefined && !parsedProt?.psk_id) {
      throw new JWEInvalid('HPKE "psk_id" (Pre-Shared Key ID) must be in a protected header')
    }

    if (!parsedProt?.alg) {
      throw new JWEInvalid(
        'JWE "alg" (Algorithm) must be in a protected header when using HPKE Integrated Encryption',
      )
    }
  } else if (typeof enc !== 'string' || !enc) {
    throw new JWEInvalid('missing JWE Encryption Algorithm (enc) in JWE Header')
  }

  const keyManagementAlgorithms =
    options && validateAlgorithms('keyManagementAlgorithms', options.keyManagementAlgorithms)
  const contentEncryptionAlgorithms =
    options &&
    validateAlgorithms('contentEncryptionAlgorithms', options.contentEncryptionAlgorithms)

  if (
    (keyManagementAlgorithms && !keyManagementAlgorithms.has(alg)) ||
    (!keyManagementAlgorithms && alg.startsWith('PBES2'))
  ) {
    throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed')
  }

  if (contentEncryptionAlgorithms && !contentEncryptionAlgorithms.has(enc!)) {
    throw new JOSEAlgNotAllowed('"enc" (Encryption Algorithm) Header Parameter value not allowed')
  }

  let encryptedKey!: Uint8Array
  if (jwe.encrypted_key !== undefined) {
    try {
      encryptedKey = b64u(jwe.encrypted_key!)
    } catch {
      throw new JWEInvalid('Failed to base64url decode the encrypted_key')
    }
  }

  let resolvedKey = false
  if (typeof key === 'function') {
    key = await key(parsedProt, jwe)
    resolvedKey = true
  }
  checkKeyType(alg === 'dir' ? enc! : alg, key, 'decrypt')

  const k = await normalizeKey(key, alg)
  let cek: types.CryptoKey | Uint8Array
  if (!hpkeIe) {
    try {
      cek = await decryptKeyManagement(alg, k, encryptedKey, joseHeader, options)
    } catch (err) {
      if (
        err instanceof TypeError ||
        err instanceof JWEInvalid ||
        err instanceof JOSENotSupported
      ) {
        throw err
      }
      // https://www.rfc-editor.org/rfc/rfc7516#section-11.5
      // To mitigate the attacks described in RFC 3218, the
      // recipient MUST NOT distinguish between format, padding, and length
      // errors of encrypted keys.  It is strongly recommended, in the event
      // of receiving an improperly formatted key, that the recipient
      // substitute a randomly generated CEK and proceed to the next step, to
      // mitigate timing attacks.
      cek = generateCek(enc!)
    }
  }

  let iv: Uint8Array | undefined
  let tag: Uint8Array | undefined
  if (jwe.iv !== undefined) {
    try {
      iv = b64u(jwe.iv)
    } catch {
      throw new JWEInvalid('Failed to base64url decode the iv')
    }
  }
  if (jwe.tag !== undefined) {
    try {
      tag = b64u(jwe.tag)
    } catch {
      throw new JWEInvalid('Failed to base64url decode the tag')
    }
  }

  const protectedHeader: Uint8Array =
    jwe.protected !== undefined ? encode(jwe.protected) : new Uint8Array()
  let additionalData: Uint8Array

  if (jwe.aad !== undefined) {
    additionalData = concat(protectedHeader, encode('.'), encode(jwe.aad))
  } else {
    additionalData = protectedHeader
  }

  let ciphertext: Uint8Array
  try {
    ciphertext = b64u(jwe.ciphertext)
  } catch {
    throw new JWEInvalid('Failed to base64url decode the ciphertext')
  }

  let plaintext: Uint8Array
  if (hpkeIe) {
    assertCryptoKey(k)
    const psk = options?.psk
    let psk_id!: Uint8Array
    if (parsedProt?.psk_id) {
      try {
        psk_id = b64u(parsedProt.psk_id)
      } catch {
        throw new JWEInvalid('Failed to base64url decode the psk_id')
      }
    }
    try {
      plaintext = await hpke(
        alg,
        encryptedKey,
        k,
        new Uint8Array(),
        additionalData,
        ciphertext,
        psk,
        psk_id,
      )
    } catch (err) {
      if (
        err instanceof TypeError ||
        err instanceof JWEInvalid ||
        err instanceof JOSENotSupported
      ) {
        throw err
      }
      throw new JWEDecryptionFailed()
    }
  } else {
    plaintext = await decrypt(enc!, cek!, ciphertext, iv, tag, additionalData)
  }

  const result: types.FlattenedDecryptResult = { plaintext }

  if (jwe.protected !== undefined) {
    result.protectedHeader = parsedProt
  }

  if (jwe.aad !== undefined) {
    try {
      result.additionalAuthenticatedData = b64u(jwe.aad!)
    } catch {
      throw new JWEInvalid('Failed to base64url decode the aad')
    }
  }

  if (jwe.unprotected !== undefined) {
    result.sharedUnprotectedHeader = jwe.unprotected
  }

  if (jwe.header !== undefined) {
    result.unprotectedHeader = jwe.header
  }

  if (resolvedKey) {
    return { ...result, key: k }
  }

  return result
}
