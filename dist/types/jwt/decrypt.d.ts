import type { KeyLike, DecryptOptions, JWTClaimVerificationOptions, GetKeyFunction, CompactJWEHeaderParameters, FlattenedJWE, JWTDecryptResult, ResolvedKey } from '../types';
/**
 * Combination of JWE Decryption options and JWT Claims Set verification options.
 */
export interface JWTDecryptOptions extends DecryptOptions, JWTClaimVerificationOptions {
}
/**
 * Interface for JWT Decryption dynamic key resolution.
 * No token components have been verified at the time of this function call.
 */
export interface JWTDecryptGetKey extends GetKeyFunction<CompactJWEHeaderParameters, FlattenedJWE> {
}
/**
 * Verifies the JWT format (to be a JWE Compact format), decrypts the ciphertext, validates the JWT Claims Set.
 *
 * @param jwt JSON Web Token value (encoded as JWE).
 * @param key Private Key or Secret to decrypt and verify the JWT with.
 * @param options JWT Decryption and JWT Claims Set validation options.
 *
 * @example Usage
 * ```js
 * const jwt = 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..KVcNLqK-3-8ZkYIC.xSwF4VxO0kUMUD2W-cifsNUxnr-swyBq-nADBptyt6y9n79-iNc5b0AALJpRwc0wwDkJw8hNOMjApNUTMsK9b-asToZ3DXFMvwfJ6n1aWefvd7RsoZ2LInWFfVAuttJDzoGB.uuexQoWHwrLMEYRElT8pBQ'
 *
 * const { payload, protectedHeader } = await jose.jwtDecrypt(jwt, secretKey, {
 *   issuer: 'urn:example:issuer',
 *   audience: 'urn:example:audience'
 * })
 *
 * console.log(protectedHeader)
 * console.log(payload)
 * ```
 */
export declare function jwtDecrypt(jwt: string | Uint8Array, key: KeyLike | Uint8Array, options?: JWTDecryptOptions): Promise<JWTDecryptResult>;
/**
 * @param jwt JSON Web Token value (encoded as JWE).
 * @param getKey Function resolving Private Key or Secret to decrypt and verify the JWT with.
 * @param options JWT Decryption and JWT Claims Set validation options.
 */
export declare function jwtDecrypt(jwt: string | Uint8Array, getKey: JWTDecryptGetKey, options?: JWTDecryptOptions): Promise<JWTDecryptResult & ResolvedKey>;
