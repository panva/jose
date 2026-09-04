import type * as t from '../types.d.ts';
/** JWS verification and JWT Claims Set validation options. */
export interface JWTVerifyOptions extends t.VerifyOptions, t.JWTClaimVerificationOptions {
}
/** Dynamic key resolver for JWT verification. */
export interface JWTVerifyGetKey<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array> extends t.GetKeyFunction<t.CompactJWSHeaderParameters, t.FlattenedJWSInput, KeyType | t.KeyObject | t.JWK> {
}
/**
 * Verifies a Compact JWS-formatted JWT and validates its Claims Set.
 *
 * @param key Key to verify the JWT with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 */
export declare function jwtVerify<PayloadType = t.JWTPayload>(jwt: string | Uint8Array, key: t.KeyInput, options?: JWTVerifyOptions): Promise<t.JWTVerifyResult<PayloadType>>;
/**
 * @param getKey Function resolving a key to verify the JWT with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 */
export declare function jwtVerify<PayloadType = t.JWTPayload, KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array>(jwt: string | Uint8Array, getKey: JWTVerifyGetKey<KeyType>, options?: JWTVerifyOptions): Promise<t.JWTVerifyResult<PayloadType> & t.ResolvedKey<KeyType>>;
/**
 * Accepts either form of the `key` argument. Use this overload when forwarding a value that may be
 * either a key or a key resolution function; `key` is present on the result only when a resolution
 * function was used.
 *
 * @param key Key, or function resolving a key, to verify the JWT with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 */
export declare function jwtVerify<PayloadType = t.JWTPayload>(jwt: string | Uint8Array, key: t.KeyInput | JWTVerifyGetKey, options?: JWTVerifyOptions): Promise<t.JWTVerifyResult<PayloadType> & Partial<t.ResolvedKey>>;
