import type * as t from '../../types.d.ts';
/** Resolves a key for Compact JWS verification from unverified headers and token data. */
export interface CompactVerifyGetKey<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array> extends t.GetKeyFunction<t.CompactJWSHeaderParameters, t.FlattenedJWSInput, KeyType | t.KeyObject | t.JWK> {
}
/**
 * Verifies a Compact JWS signature and decodes its payload.
 *
 * @param key Public key or shared secret. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 */
export declare function compactVerify(jws: string | Uint8Array, key: t.KeyInput, options?: t.VerifyOptions): Promise<t.CompactVerifyResult>;
/**
 * Verifies a Compact JWS signature and decodes its payload with a dynamically resolved key,
 * included in the result.
 *
 * @param getKey Resolves a public key or shared secret from unverified token data.
 */
export declare function compactVerify<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array>(jws: string | Uint8Array, getKey: CompactVerifyGetKey<KeyType>, options?: t.VerifyOptions): Promise<t.CompactVerifyResult & t.ResolvedKey<KeyType>>;
/**
 * Verifies a Compact JWS and decodes its payload using a key or key resolver. The result includes
 * `key` only when a resolver is used.
 *
 * @param key Public key or shared secret, or a function resolving one.
 */
export declare function compactVerify(jws: string | Uint8Array, key: t.KeyInput | CompactVerifyGetKey, options?: t.VerifyOptions): Promise<t.CompactVerifyResult & Partial<t.ResolvedKey>>;
