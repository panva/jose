/**
 * Decrypting JSON Web Encryption (JWE) in Compact Serialization
 *
 * @module
 */

import { flattenedDecrypt } from '../flattened/decrypt.js'
import type { FlattenedDecryptGetKey } from '../flattened/decrypt.js'
import { JWEInvalid } from '../../util/errors.js'
import { decoder } from '../../lib/buffer_utils.js'
import type * as types from '../../types.d.ts'

/**
 * Interface for Compact JWE Decryption dynamic key resolution. No token components have been
 * verified at the time of this function call.
 */
export interface CompactDecryptGetKey<
  KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array,
> extends types.GetKeyFunction<
  types.CompactJWEHeaderParameters,
  types.FlattenedJWE,
  KeyType | types.KeyObject | types.JWK
> {}

/**
 * Decrypts a Compact JWE.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/jwe/compact/decrypt'`.
 *
 * @example
 *
 * ```js
 * const jwe =
 *   'eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIn0.nyQ19eq9ogh9wA7fFtnI2oouzy5_8b5DeLkoRMfi2yijgfTs2zEnayCEofz_qhnL-nwszabd9qUeHv0-IwvhhJJS7GUJOU3ikiIe42qcIAFme1A_Fo9CTxw4XTOy-I5qanl8So91u6hwfyN1VxAqVLsSE7_23EC-gfGEg_5znew9PyXXsOIE-K_HH7IQowRrlZ1X_bM_Liu53RzDpLDvRz59mp3S8L56YqpM8FexFGTGpEaoTcEIst375qncYt3-79IVR7gZN1RWsWgjPatfvVbnh74PglQcATSf3UUhaW0OAKn6q7r3PDx6DIKQ35bgHQg5QopuN00eIfLQL2trGw.W3grIVj5HVuAb76X.6PcuDe5D6ttWFYyv0oqqdDXfI2R8wBg1F2Q80UUA_Gv8eEimNWfxIWdLxrjzgQGSvIhxmFKuLM0.a93_Ug3uZHuczj70Zavx8Q'
 *
 * const { plaintext, protectedHeader } = await jose.compactDecrypt(jwe, privateKey)
 *
 * console.log(protectedHeader)
 * console.log(new TextDecoder().decode(plaintext))
 * ```
 *
 * @param jwe Compact JWE.
 * @param key Private Key or Secret to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWE Decryption options.
 */
export function compactDecrypt(
  jwe: string | Uint8Array,
  key: types.KeyInput,
  options?: types.DecryptOptions,
): Promise<types.CompactDecryptResult>
/**
 * Decrypts a Compact JWE, resolving the key dynamically. The result additionally carries the
 * {@link types.ResolvedKey.key resolved key}.
 *
 * @param jwe Compact JWE.
 * @param getKey Function resolving Private Key or Secret to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWE Decryption options.
 */
export function compactDecrypt<
  KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array,
>(
  jwe: string | Uint8Array,
  getKey: CompactDecryptGetKey<KeyType>,
  options?: types.DecryptOptions,
): Promise<types.CompactDecryptResult & types.ResolvedKey<KeyType>>
/**
 * Accepts either form of the `key` argument. Use this overload when forwarding a value that may be
 * either a key or a key resolution function; `key` is present on the result only when a resolution
 * function was used.
 *
 * @param jwe Compact JWE.
 * @param key Private Key or Secret, or a function resolving one, to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWE Decryption options.
 */
export function compactDecrypt(
  jwe: string | Uint8Array,
  key: types.KeyInput | CompactDecryptGetKey,
  options?: types.DecryptOptions,
): Promise<types.CompactDecryptResult & Partial<types.ResolvedKey>>
export async function compactDecrypt(
  jwe: string | Uint8Array,
  key: types.KeyInput | CompactDecryptGetKey,
  options?: types.DecryptOptions,
) {
  if (jwe instanceof Uint8Array) {
    jwe = decoder.decode(jwe)
  }

  if (typeof jwe !== 'string') {
    throw new JWEInvalid('Compact JWE must be a string or Uint8Array')
  }
  const {
    0: protectedHeader,
    1: encryptedKey,
    2: iv,
    3: ciphertext,
    4: tag,
    length,
  } = jwe.split('.')

  if (length !== 5) {
    throw new JWEInvalid('Invalid Compact JWE')
  }

  const decrypted = await flattenedDecrypt(
    {
      ciphertext,
      iv: iv || undefined,
      protected: protectedHeader,
      tag: tag || undefined,
      encrypted_key: encryptedKey || undefined,
    },
    key as types.KeyInput | FlattenedDecryptGetKey,
    options,
  )

  const result = { plaintext: decrypted.plaintext, protectedHeader: decrypted.protectedHeader! }

  if (typeof key === 'function') {
    return { ...result, key: decrypted.key }
  }

  return result
}
