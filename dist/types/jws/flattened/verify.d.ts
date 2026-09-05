import type * as t from '../../types.d.ts';
/** Resolves a key for Flattened JWS verification from unverified headers and token data. */
export interface FlattenedVerifyGetKey<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array> extends t.GetKeyFunction<t.JWSHeaderParameters, t.FlattenedJWSInput, KeyType | t.KeyObject | t.JWK> {
}
/**
 * Verifies a Flattened JWS signature and decodes its payload.
 *
 * @param key Public key or shared secret. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 */
export declare function flattenedVerify(jws: t.FlattenedJWSInput, key: t.KeyInput, options?: t.VerifyOptions): Promise<t.FlattenedVerifyResult>;
/**
 * Verifies a Flattened JWS signature and decodes its payload with a dynamically resolved key,
 * included in the result.
 *
 * @param getKey Resolves a public key or shared secret from unverified token data.
 */
export declare function flattenedVerify<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array>(jws: t.FlattenedJWSInput, getKey: FlattenedVerifyGetKey<KeyType>, options?: t.VerifyOptions): Promise<t.FlattenedVerifyResult & t.ResolvedKey<KeyType>>;
/**
 * Verifies a Flattened JWS and decodes its payload using a key or key resolver. The result includes
 * `key` only when a resolver is used.
 *
 * @param key Public key or shared secret, or a function resolving one.
 */
export declare function flattenedVerify(jws: t.FlattenedJWSInput, key: t.KeyInput | FlattenedVerifyGetKey, options?: t.VerifyOptions): Promise<t.FlattenedVerifyResult & Partial<t.ResolvedKey>>;
