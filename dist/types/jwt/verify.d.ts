import type * as types from '../types.d.ts';
/** Combination of JWS Verification options and JWT Claims Set verification options. */
export interface JWTVerifyOptions extends types.VerifyOptions, types.JWTClaimVerificationOptions {
}
/**
 * Interface for JWT Verification dynamic key resolution. No token components have been verified at
 * the time of this function call.
 */
export interface JWTVerifyGetKey<KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array> extends types.GetKeyFunction<types.CompactJWSHeaderParameters, types.FlattenedJWSInput, KeyType | types.KeyObject | types.JWK> {
}
/**
 * Verifies the JWT format (to be a JWS Compact format), verifies the JWS signature, validates the
 * JWT Claims Set.
 *
 * @param jwt JSON Web Token value (encoded as JWS).
 * @param key Key to verify the JWT with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWT Decryption and JWT Claims Set validation options.
 */
export declare function jwtVerify<PayloadType = types.JWTPayload>(jwt: string | Uint8Array, key: types.KeyInput, options?: JWTVerifyOptions): Promise<types.JWTVerifyResult<PayloadType>>;
/**
 * @param jwt JSON Web Token value (encoded as JWS).
 * @param getKey Function resolving a key to verify the JWT with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWT Decryption and JWT Claims Set validation options.
 */
export declare function jwtVerify<PayloadType = types.JWTPayload, KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array>(jwt: string | Uint8Array, getKey: JWTVerifyGetKey<KeyType>, options?: JWTVerifyOptions): Promise<types.JWTVerifyResult<PayloadType> & types.ResolvedKey<KeyType>>;
/**
 * Accepts either form of the `key` argument. Use this overload when forwarding a value that may be
 * either a key or a key resolution function; `key` is present on the result only when a resolution
 * function was used.
 *
 * @param jwt JSON Web Token value (encoded as JWS).
 * @param key Key, or function resolving a key, to verify the JWT with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWT Decryption and JWT Claims Set validation options.
 */
export declare function jwtVerify<PayloadType = types.JWTPayload>(jwt: string | Uint8Array, key: types.KeyInput | JWTVerifyGetKey, options?: JWTVerifyOptions): Promise<types.JWTVerifyResult<PayloadType> & Partial<types.ResolvedKey>>;
