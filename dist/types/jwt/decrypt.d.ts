import type * as types from '../types.d.ts';
/** Combination of JWE Decryption options and JWT Claims Set verification options. */
export interface JWTDecryptOptions extends types.DecryptOptions, types.JWTClaimVerificationOptions {
}
/**
 * Interface for JWT Decryption dynamic key resolution. No token components have been verified at
 * the time of this function call.
 */
export interface JWTDecryptGetKey<KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array> extends types.GetKeyFunction<types.CompactJWEHeaderParameters, types.FlattenedJWE, KeyType | types.KeyObject | types.JWK> {
}
/**
 * Verifies the JWT format (to be a JWE Compact format), decrypts the ciphertext, validates the JWT
 * Claims Set.
 *
 * @param jwt JSON Web Token value (encoded as JWE).
 * @param key Private Key or Secret to decrypt and verify the JWT with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWT Decryption and JWT Claims Set validation options.
 */
export declare function jwtDecrypt<PayloadType = types.JWTPayload>(jwt: string | Uint8Array, key: types.KeyInput, options?: JWTDecryptOptions): Promise<types.JWTDecryptResult<PayloadType>>;
/**
 * Decrypts a JWT and validates its JWT Claims Set, resolving the key dynamically. The result
 * additionally carries the {@link types.ResolvedKey.key resolved key}.
 *
 * @param jwt JSON Web Token value (encoded as JWE).
 * @param getKey Function resolving Private Key or Secret to decrypt and verify the JWT with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWT Decryption and JWT Claims Set validation options.
 */
export declare function jwtDecrypt<PayloadType = types.JWTPayload, KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array>(jwt: string | Uint8Array, getKey: JWTDecryptGetKey<KeyType>, options?: JWTDecryptOptions): Promise<types.JWTDecryptResult<PayloadType> & types.ResolvedKey<KeyType>>;
/**
 * Accepts either form of the `key` argument. Use this overload when forwarding a value that may be
 * either a key or a key resolution function; `key` is present on the result only when a resolution
 * function was used.
 *
 * @param jwt JSON Web Token value (encoded as JWE).
 * @param key Private Key or Secret, or a function resolving one, to decrypt and verify the JWT
 *   with. See {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWT Decryption and JWT Claims Set validation options.
 */
export declare function jwtDecrypt<PayloadType = types.JWTPayload>(jwt: string | Uint8Array, key: types.KeyInput | JWTDecryptGetKey, options?: JWTDecryptOptions): Promise<types.JWTDecryptResult<PayloadType> & Partial<types.ResolvedKey>>;
