import type * as t from '../../types.d.ts';
/** Dynamic key resolver for General JWE decryption. */
export interface GeneralDecryptGetKey<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array> extends t.GetKeyFunction<t.JWEHeaderParameters | undefined, t.FlattenedJWE, KeyType | t.KeyObject | t.JWK> {
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
 * @param key Private Key or Secret to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 */
export declare function generalDecrypt(jwe: t.GeneralJWE, key: t.KeyInput, options?: t.DecryptOptions): Promise<t.GeneralDecryptResult>;
/**
 * Decrypts a General JWE, resolving the key dynamically. The result additionally carries the
 * {@link t.ResolvedKey.key resolved key}.
 *
 * @param getKey Function resolving Private Key or Secret to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 */
export declare function generalDecrypt<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array>(jwe: t.GeneralJWE, getKey: GeneralDecryptGetKey<KeyType>, options?: t.DecryptOptions): Promise<t.GeneralDecryptResult & t.ResolvedKey<KeyType>>;
/**
 * Accepts either form of the `key` argument. Use this overload when forwarding a value that may be
 * either a key or a key resolution function; `key` is present on the result only when a resolution
 * function was used.
 *
 * @param key Private Key or Secret, or a function resolving one, to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 */
export declare function generalDecrypt(jwe: t.GeneralJWE, key: t.KeyInput | GeneralDecryptGetKey, options?: t.DecryptOptions): Promise<t.GeneralDecryptResult & Partial<t.ResolvedKey>>;
