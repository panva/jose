import type * as t from '../types.d.ts';
/** JWS verification and JWT Claims Set validation options. */
export interface JWTVerifyOptions extends t.VerifyOptions, t.JWTClaimVerificationOptions {
}
/**
 * Resolves a JWT verification key. No token components have been authenticated when this function
 * is called.
 */
export interface JWTVerifyGetKey<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array> extends t.GetKeyFunction<t.CompactJWSHeaderParameters, t.FlattenedJWSInput, KeyType | t.KeyObject | t.JWK> {
}
/**
 * Validates a JWT in JWS Compact Serialization (digital signature or MAC) and its JWT Claims Set.
 *
 * @param key Public key or shared secret to verify the JWT with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 */
export declare function jwtVerify<PayloadType = t.JWTPayload>(jwt: string | Uint8Array, key: t.KeyInput, options?: JWTVerifyOptions): Promise<t.JWTVerifyResult<PayloadType>>;
/**
 * Validates the JWT's JWS Signature (digital signature or MAC) and JWT Claims Set, returning the
 * resolved key.
 *
 * @param getKey Function resolving a public key or shared secret to verify the JWT with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 */
export declare function jwtVerify<PayloadType = t.JWTPayload, KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array>(jwt: string | Uint8Array, getKey: JWTVerifyGetKey<KeyType>, options?: JWTVerifyOptions): Promise<t.JWTVerifyResult<PayloadType> & t.ResolvedKey<KeyType>>;
/**
 * Accepts a key or key resolver. Use this overload when forwarding either form; the result includes
 * `key` only when a resolver was used.
 *
 * @param key Key, or function resolving a key, to verify the JWT with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 */
export declare function jwtVerify<PayloadType = t.JWTPayload>(jwt: string | Uint8Array, key: t.KeyInput | JWTVerifyGetKey, options?: JWTVerifyOptions): Promise<t.JWTVerifyResult<PayloadType> & Partial<t.ResolvedKey>>;
