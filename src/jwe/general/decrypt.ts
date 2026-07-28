/**
 * Decrypting JSON Web Encryption (JWE) in General JSON Serialization
 *
 * @module
 */

import { flattenedDecrypt } from '../flattened/decrypt.js'
import { JWEDecryptionFailed, JWEInvalid } from '../../util/errors.js'
import type * as types from '../../types.d.ts'
import { isObject } from '../../lib/type_checks.js'

/**
 * Interface for General JWE Decryption dynamic key resolution. No token components have been
 * verified at the time of this function call.
 *
 * @typeParam KeyType Type definition of the keys the function resolves. Narrowing it is what lets
 *   {@link types.ResolvedKey.key ResolvedKey.key} be inferred at the call site.
 */
export interface GeneralDecryptGetKey<
  KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array,
> extends types.GetKeyFunction<
  types.JWEHeaderParameters | undefined,
  types.FlattenedJWE,
  KeyType | types.KeyObject | types.JWK
> {}

/**
 * Decrypts a General JWE.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/jwe/general/decrypt'`.
 *
 * > [!NOTE]\
 * > The function iterates over the `recipients` array in the General JWE and returns the decryption
 * > result of the first recipient entry that can be successfully decrypted. The result only contains
 * > the plaintext and headers of that successfully decrypted recipient entry. Other recipient entries
 * > in the General JWE are not validated, and their headers are not included in the returned result.
 * > Recipients of a General JWE should only rely on the returned (decrypted) data.
 *
 * @example
 *
 * ```js
 * const jwe = {
 *   ciphertext: '9EzjFISUyoG-ifC2mSihfP0DPC80yeyrxhTzKt1C_VJBkxeBG0MI4Te61Pk45RAGubUvBpU9jm4',
 *   iv: '8Fy7A_IuoX5VXG9s',
 *   tag: 'W76IYV6arGRuDSaSyWrQNg',
 *   aad: 'VGhlIEZlbGxvd3NoaXAgb2YgdGhlIFJpbmc',
 *   protected: 'eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIn0',
 *   recipients: [
 *     {
 *       encrypted_key:
 *         'Z6eD4UK_yFb5ZoKvKkGAdqywEG_m0e4IYo0x8Vf30LAMJcsc-_zSgIeiF82teZyYi2YYduHKoqImk7MRnoPZOlEs0Q5BNK1OgBmSOhCE8DFyqh9Zh48TCTP6lmBQ52naqoUJFMtHzu-0LwZH26hxos0GP3Dt19O379MJB837TdKKa87skq0zHaVLAquRHOBF77GI54Bc7O49d8aOrSu1VEFGMThlW2caspPRiTSePDMDPq7_WGk50izRhB3Asl9wmP9wEeaTrkJKRnQj5ips1SAZ1hDBsqEQKKukxP1HtdcopHV5_qgwU8Hjm5EwSLMluMQuiE6hwlkXGOujZLVizA',
 *     },
 *   ],
 * }
 *
 * const { plaintext, protectedHeader, additionalAuthenticatedData } =
 *   await jose.generalDecrypt(jwe, privateKey)
 *
 * console.log(protectedHeader)
 * const decoder = new TextDecoder()
 * console.log(decoder.decode(plaintext))
 * console.log(decoder.decode(additionalAuthenticatedData))
 * ```
 *
 * @param jwe General JWE.
 * @param key Private Key or Secret to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWE Decryption options.
 */
export function generalDecrypt(
  jwe: types.GeneralJWE,
  key: types.KeyInput,
  options?: types.DecryptOptions,
): Promise<types.GeneralDecryptResult>
/**
 * Decrypts a General JWE, resolving the key dynamically. The result additionally carries the
 * {@link types.ResolvedKey.key resolved key}.
 *
 * @param jwe General JWE.
 * @param getKey Function resolving Private Key or Secret to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWE Decryption options.
 */
export function generalDecrypt<
  KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array,
>(
  jwe: types.GeneralJWE,
  getKey: GeneralDecryptGetKey<KeyType>,
  options?: types.DecryptOptions,
): Promise<types.GeneralDecryptResult & types.ResolvedKey<KeyType>>
/**
 * Accepts either form of the `key` argument. Use this overload when forwarding a value that may be
 * either a key or a key resolution function; `key` is present on the result only when a resolution
 * function was used.
 *
 * @param jwe General JWE.
 * @param key Private Key or Secret, or a function resolving one, to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWE Decryption options.
 */
export function generalDecrypt(
  jwe: types.GeneralJWE,
  key: types.KeyInput | GeneralDecryptGetKey,
  options?: types.DecryptOptions,
): Promise<types.GeneralDecryptResult & Partial<types.ResolvedKey>>
export async function generalDecrypt(
  jwe: types.GeneralJWE,
  key: types.KeyInput | GeneralDecryptGetKey,
  options?: types.DecryptOptions,
) {
  if (!isObject(jwe)) {
    throw new JWEInvalid('General JWE must be an object')
  }

  if (!Array.isArray(jwe.recipients) || !jwe.recipients.every(isObject)) {
    throw new JWEInvalid('JWE Recipients missing or incorrect type')
  }

  if (!jwe.recipients.length) {
    throw new JWEInvalid('JWE Recipients has no members')
  }

  for (const recipient of jwe.recipients) {
    try {
      return await flattenedDecrypt(
        {
          aad: jwe.aad,
          ciphertext: jwe.ciphertext,
          encrypted_key: recipient.encrypted_key,
          header: recipient.header,
          iv: jwe.iv,
          protected: jwe.protected,
          tag: jwe.tag,
          unprotected: jwe.unprotected,
        },
        key,
        options,
      )
    } catch {
      //
    }
  }
  throw new JWEDecryptionFailed()
}
