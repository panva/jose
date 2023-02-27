import type { KeyLike, DecryptOptions, JWTClaimVerificationOptions, GetKeyFunction, CompactJWEHeaderParameters, FlattenedJWE, JWTDecryptResult, ResolvedKey } from '../types';
/** Combination of JWE Decryption options and JWT Claims Set verification options. */
export interface JWTDecryptOptions extends DecryptOptions, JWTClaimVerificationOptions {
}
/**
 * Interface for JWT Decryption dynamic key resolution. No token components have been verified at
 * the time of this function call.
 */
export interface JWTDecryptGetKey extends GetKeyFunction<CompactJWEHeaderParameters, FlattenedJWE> {
}
/**
 * Verifies the JWT format (to be a JWE Compact format), decrypts the ciphertext, validates the JWT
 * Claims Set.
 *
 * @example Usage
 *
 * ```js
 * const secret = jose.base64url.decode('zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lvI')
 * const jwt =
 *   'eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..MB66qstZBPxAXKdsjet_lA.WHbtJTl4taHp7otOHLq3hBvv0yNPsPEKHYInmCPdDDeyV1kU-f-tGEiU4FxlSqkqAT2hVs8_wMNiQFAzPU1PUgIqWCPsBrPP3TtxYsrtwagpn4SvCsUsx0Mhw9ZhliAO8CLmCBQkqr_T9AcYsz5uZw.7nX9m7BGUu_u1p1qFHzyIg'
 *
 * const { payload, protectedHeader } = await jose.jwtDecrypt(jwt, secret, {
 *   issuer: 'urn:example:issuer',
 *   audience: 'urn:example:audience',
 * })
 *
 * console.log(protectedHeader)
 * console.log(payload)
 * ```
 *
 * @param jwt JSON Web Token value (encoded as JWE).
 * @param key Private Key or Secret to decrypt and verify the JWT with.
 * @param options JWT Decryption and JWT Claims Set validation options.
 */
export declare function jwtDecrypt(jwt: string | Uint8Array, key: KeyLike | Uint8Array, options?: JWTDecryptOptions): Promise<JWTDecryptResult>;
/**
 * @param jwt JSON Web Token value (encoded as JWE).
 * @param getKey Function resolving Private Key or Secret to decrypt and verify the JWT with.
 * @param options JWT Decryption and JWT Claims Set validation options.
 */
export declare function jwtDecrypt<T extends KeyLike = KeyLike>(jwt: string | Uint8Array, getKey: JWTDecryptGetKey, options?: JWTDecryptOptions): Promise<JWTDecryptResult & ResolvedKey<T>>;
