import type * as t from '../../types.d.ts';
/** Dynamic key resolver for Flattened JWS verification. */
export interface FlattenedVerifyGetKey<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array> extends t.GetKeyFunction<t.JWSHeaderParameters, t.FlattenedJWSInput, KeyType | t.KeyObject | t.JWK> {
}
/**
 * Verifies a Flattened JWS signature and decodes its payload.
 *
 * @param key Key to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 */
export declare function flattenedVerify(jws: t.FlattenedJWSInput, key: t.KeyInput, options?: t.VerifyOptions): Promise<t.FlattenedVerifyResult>;
/**
 * Verifies a Flattened JWS signature and decodes its payload, resolving the key dynamically. The
 * result additionally carries the {@link t.ResolvedKey.key resolved key}.
 *
 * @param getKey Function resolving a key to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 */
export declare function flattenedVerify<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array>(jws: t.FlattenedJWSInput, getKey: FlattenedVerifyGetKey<KeyType>, options?: t.VerifyOptions): Promise<t.FlattenedVerifyResult & t.ResolvedKey<KeyType>>;
/**
 * Accepts either form of the `key` argument. Use this overload when forwarding a value that may be
 * either a key or a key resolution function; `key` is present on the result only when a resolution
 * function was used.
 *
 * @param key Key, or function resolving a key, to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 */
export declare function flattenedVerify(jws: t.FlattenedJWSInput, key: t.KeyInput | FlattenedVerifyGetKey, options?: t.VerifyOptions): Promise<t.FlattenedVerifyResult & Partial<t.ResolvedKey>>;
