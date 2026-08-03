import type * as types from '../../types.d.ts';
/**
 * Interface for General JWE Decryption dynamic key resolution. No token components have been
 * verified at the time of this function call.
 */
export interface GeneralDecryptGetKey<KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array> extends types.GetKeyFunction<types.JWEHeaderParameters | undefined, types.FlattenedJWE, KeyType | types.KeyObject | types.JWK> {
}
/**
 * Decrypts a General JWE.
 *
 * > Note: The function iterates over the `recipients` array in the General JWE and returns the decryption
 * > result of the first recipient entry that can be successfully decrypted. The result only contains
 * > the plaintext and headers of that successfully decrypted recipient entry. Other recipient entries
 * > in the General JWE are not validated, and their headers are not included in the returned result.
 * > Recipients of a General JWE should only rely on the returned (decrypted) data.
 *
 * @param jwe General JWE.
 * @param key Private Key or Secret to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWE Decryption options.
 */
export declare function generalDecrypt(jwe: types.GeneralJWE, key: types.KeyInput, options?: types.DecryptOptions): Promise<types.GeneralDecryptResult>;
/**
 * Decrypts a General JWE, resolving the key dynamically. The result additionally carries the
 * {@link types.ResolvedKey.key resolved key}.
 *
 * @param jwe General JWE.
 * @param getKey Function resolving Private Key or Secret to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWE Decryption options.
 */
export declare function generalDecrypt<KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array>(jwe: types.GeneralJWE, getKey: GeneralDecryptGetKey<KeyType>, options?: types.DecryptOptions): Promise<types.GeneralDecryptResult & types.ResolvedKey<KeyType>>;
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
export declare function generalDecrypt(jwe: types.GeneralJWE, key: types.KeyInput | GeneralDecryptGetKey, options?: types.DecryptOptions): Promise<types.GeneralDecryptResult & Partial<types.ResolvedKey>>;
