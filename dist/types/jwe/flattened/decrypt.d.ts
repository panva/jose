import type * as t from '../../types.d.ts';
/** Resolves a key for Flattened JWE decryption from unverified headers and token data. */
export interface FlattenedDecryptGetKey<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array> extends t.GetKeyFunction<t.JWEHeaderParameters | undefined, t.FlattenedJWE, KeyType | t.KeyObject | t.JWK> {
}
/**
 * Decrypts a Flattened JWE.
 *
 * @param key Private key or shared secret. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 */
export declare function flattenedDecrypt(jwe: t.FlattenedJWE, key: t.KeyInput, options?: t.DecryptOptions): Promise<t.FlattenedDecryptResult>;
/**
 * Decrypts a Flattened JWE with a dynamically resolved key, included in the result.
 *
 * @param getKey Resolves a private key or shared secret from unverified token data.
 */
export declare function flattenedDecrypt<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array>(jwe: t.FlattenedJWE, getKey: FlattenedDecryptGetKey<KeyType>, options?: t.DecryptOptions): Promise<t.FlattenedDecryptResult & t.ResolvedKey<KeyType>>;
/**
 * Decrypts a Flattened JWE with a key or key resolver. The result includes `key` only when a
 * resolver is used.
 *
 * @param key Private key or shared secret, or a function resolving one.
 */
export declare function flattenedDecrypt(jwe: t.FlattenedJWE, key: t.KeyInput | FlattenedDecryptGetKey, options?: t.DecryptOptions): Promise<t.FlattenedDecryptResult & Partial<t.ResolvedKey>>;
