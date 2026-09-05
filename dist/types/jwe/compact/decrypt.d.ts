import type * as t from '../../types.d.ts';
/** Resolves a key for Compact JWE decryption from unverified headers and token data. */
export interface CompactDecryptGetKey<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array> extends t.GetKeyFunction<t.CompactJWEHeaderParameters, t.FlattenedJWE, KeyType | t.KeyObject | t.JWK> {
}
/**
 * Decrypts a Compact JWE.
 *
 * @param key Private key or shared secret. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 */
export declare function compactDecrypt(jwe: string | Uint8Array, key: t.KeyInput, options?: t.DecryptOptions): Promise<t.CompactDecryptResult>;
/**
 * Decrypts a Compact JWE with a dynamically resolved key, included in the result.
 *
 * @param getKey Resolves a private key or shared secret from unverified token data.
 */
export declare function compactDecrypt<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array>(jwe: string | Uint8Array, getKey: CompactDecryptGetKey<KeyType>, options?: t.DecryptOptions): Promise<t.CompactDecryptResult & t.ResolvedKey<KeyType>>;
/**
 * Decrypts a Compact JWE with a key or key resolver. The result includes `key` only when a resolver
 * is used.
 *
 * @param key Private key or shared secret, or a function resolving one.
 */
export declare function compactDecrypt(jwe: string | Uint8Array, key: t.KeyInput | CompactDecryptGetKey, options?: t.DecryptOptions): Promise<t.CompactDecryptResult & Partial<t.ResolvedKey>>;
