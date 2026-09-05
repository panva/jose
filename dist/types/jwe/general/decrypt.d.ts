import type * as t from '../../types.d.ts';
/** Resolves a key for General JWE decryption from unverified headers and token data. */
export interface GeneralDecryptGetKey<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array> extends t.GetKeyFunction<t.JWEHeaderParameters | undefined, t.FlattenedJWE, KeyType | t.KeyObject | t.JWK> {
}
/**
 * Decrypts a General JWE.
 *
 * > Note: Returns plaintext and headers from the first recipient that decrypts successfully. Other
 * > recipients may be inspected to enforce serialization rules, but their headers are not included in
 * > the result. Rely only on the returned data.
 *
 * @param key Private key or shared secret. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 */
export declare function generalDecrypt(jwe: t.GeneralJWE, key: t.KeyInput, options?: t.DecryptOptions): Promise<t.GeneralDecryptResult>;
/**
 * Decrypts a General JWE with a dynamically resolved key, included in the result.
 *
 * @param getKey Resolves a private key or shared secret from unverified token data.
 */
export declare function generalDecrypt<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array>(jwe: t.GeneralJWE, getKey: GeneralDecryptGetKey<KeyType>, options?: t.DecryptOptions): Promise<t.GeneralDecryptResult & t.ResolvedKey<KeyType>>;
/**
 * Decrypts a General JWE with a key or key resolver. The result includes `key` only when a resolver
 * is used.
 *
 * @param key Private key or shared secret, or a function resolving one.
 */
export declare function generalDecrypt(jwe: t.GeneralJWE, key: t.KeyInput | GeneralDecryptGetKey, options?: t.DecryptOptions): Promise<t.GeneralDecryptResult & Partial<t.ResolvedKey>>;
