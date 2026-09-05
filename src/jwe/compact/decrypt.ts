/**
 * Decrypting JSON Web Encryption (JWE) in Compact Serialization
 *
 * @module
 */

import { prepareDecrypt, decryptCompact } from '../../lib/jwe_decrypt.js'
import type { DecryptGetKey } from '../../lib/jwe_decrypt.js'
import type * as types from '../../types.d.ts'

/**
 * Resolves a key for Compact JWE decryption from unverified headers and token data.
 *
 * @typeParam KeyType Type definition of the keys the function resolves. Narrowing it is what lets
 *   {@link types.ResolvedKey.key ResolvedKey.key} be inferred at the call site.
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
 * @param key Private key or shared secret. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWE Decryption options.
 */
export function compactDecrypt(
  jwe: string | Uint8Array,
  key: types.KeyInput,
  options?: types.DecryptOptions,
): Promise<types.CompactDecryptResult>
/**
 * Decrypts a Compact JWE with a dynamically resolved key, included in the result.
 *
 * @param jwe Compact JWE.
 * @param getKey Resolves a private key or shared secret from unverified token data.
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
 * Decrypts a Compact JWE with a key or key resolver. The result includes `key` only when a resolver
 * is used.
 *
 * @param jwe Compact JWE.
 * @param key Private key or shared secret, or a function resolving one.
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
  return decryptCompact(jwe, prepareDecrypt(options), key as types.KeyInput | DecryptGetKey)
}
