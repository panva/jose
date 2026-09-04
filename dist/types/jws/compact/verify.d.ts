import type * as t from '../../types.d.ts';
/** Dynamic key resolver for Compact JWS verification. */
export interface CompactVerifyGetKey<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array> extends t.GetKeyFunction<t.CompactJWSHeaderParameters, t.FlattenedJWSInput, KeyType | t.KeyObject | t.JWK> {
}
/**
 * Verifies a Compact JWS signature and decodes its payload.
 *
 * @param key Key to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 */
export declare function compactVerify(jws: string | Uint8Array, key: t.KeyInput, options?: t.VerifyOptions): Promise<t.CompactVerifyResult>;
/**
 * Verifies a Compact JWS signature and decodes its payload, resolving the key dynamically. The
 * result additionally carries the {@link t.ResolvedKey.key resolved key}.
 *
 * @param getKey Function resolving a key to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 */
export declare function compactVerify<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array>(jws: string | Uint8Array, getKey: CompactVerifyGetKey<KeyType>, options?: t.VerifyOptions): Promise<t.CompactVerifyResult & t.ResolvedKey<KeyType>>;
/**
 * Accepts either form of the `key` argument. Use this overload when forwarding a value that may be
 * either a key or a key resolution function; `key` is present on the result only when a resolution
 * function was used.
 *
 * @param key Key, or function resolving a key, to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 */
export declare function compactVerify(jws: string | Uint8Array, key: t.KeyInput | CompactVerifyGetKey, options?: t.VerifyOptions): Promise<t.CompactVerifyResult & Partial<t.ResolvedKey>>;
