import type * as t from '../types.d.ts';
/** JWE decryption and JWT Claims Set validation options. */
export interface JWTDecryptOptions extends t.DecryptOptions, t.JWTClaimVerificationOptions {
}
/** Dynamic key resolver for JWT decryption. */
export interface JWTDecryptGetKey<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array> extends t.GetKeyFunction<t.CompactJWEHeaderParameters, t.FlattenedJWE, KeyType | t.KeyObject | t.JWK> {
}
/**
 * Decrypts a Compact JWE-formatted JWT and validates its Claims Set.
 *
 * @param key Private Key or Secret to decrypt and verify the JWT with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 */
export declare function jwtDecrypt<PayloadType = t.JWTPayload>(jwt: string | Uint8Array, key: t.KeyInput, options?: JWTDecryptOptions): Promise<t.JWTDecryptResult<PayloadType>>;
/**
 * Decrypts a JWT and validates its JWT Claims Set, resolving the key dynamically. The result
 * additionally carries the {@link t.ResolvedKey.key resolved key}.
 *
 * @param getKey Function resolving Private Key or Secret to decrypt and verify the JWT with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 */
export declare function jwtDecrypt<PayloadType = t.JWTPayload, KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array>(jwt: string | Uint8Array, getKey: JWTDecryptGetKey<KeyType>, options?: JWTDecryptOptions): Promise<t.JWTDecryptResult<PayloadType> & t.ResolvedKey<KeyType>>;
/**
 * Accepts either form of the `key` argument. Use this overload when forwarding a value that may be
 * either a key or a key resolution function; `key` is present on the result only when a resolution
 * function was used.
 *
 * @param key Private Key or Secret, or a function resolving one, to decrypt and verify the JWT
 *   with. See {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 */
export declare function jwtDecrypt<PayloadType = t.JWTPayload>(jwt: string | Uint8Array, key: t.KeyInput | JWTDecryptGetKey, options?: JWTDecryptOptions): Promise<t.JWTDecryptResult<PayloadType> & Partial<t.ResolvedKey>>;
