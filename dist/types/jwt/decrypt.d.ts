import type * as t from '../types.d.ts';
/** JWE decryption and JWT Claims Set validation options. */
export interface JWTDecryptOptions extends t.DecryptOptions, t.JWTClaimVerificationOptions {
}
/**
 * Resolves a JWT decryption key. No token components have been authenticated when this function is
 * called.
 */
export interface JWTDecryptGetKey<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array> extends t.GetKeyFunction<t.CompactJWEHeaderParameters, t.FlattenedJWE, KeyType | t.KeyObject | t.JWK> {
}
/**
 * Decrypts a Compact JWE-formatted JWT and validates its Claims Set.
 *
 * @param key Private key or shared secret to decrypt and verify the JWT with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 */
export declare function jwtDecrypt<PayloadType = t.JWTPayload>(jwt: string | Uint8Array, key: t.KeyInput, options?: JWTDecryptOptions): Promise<t.JWTDecryptResult<PayloadType>>;
/**
 * Decrypts a JWT and validates its claims, returning the dynamically
 * {@link t.ResolvedKey.key resolved key}.
 *
 * @param getKey Function resolving a private key or shared secret to decrypt and verify the JWT
 *   with. See {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 */
export declare function jwtDecrypt<PayloadType = t.JWTPayload, KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array>(jwt: string | Uint8Array, getKey: JWTDecryptGetKey<KeyType>, options?: JWTDecryptOptions): Promise<t.JWTDecryptResult<PayloadType> & t.ResolvedKey<KeyType>>;
/**
 * Accepts a key or key resolver. Use this overload when forwarding either form; the result includes
 * `key` only when a resolver was used.
 *
 * @param key Private key or shared secret, or a function resolving one, to decrypt and verify the
 *   JWT with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 */
export declare function jwtDecrypt<PayloadType = t.JWTPayload>(jwt: string | Uint8Array, key: t.KeyInput | JWTDecryptGetKey, options?: JWTDecryptOptions): Promise<t.JWTDecryptResult<PayloadType> & Partial<t.ResolvedKey>>;
