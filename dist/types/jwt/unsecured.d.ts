import type { JWSHeaderParameters, JWTClaimVerificationOptions, JWTPayload } from '../types';
import { ProduceJWT } from './produce';
export interface UnsecuredResult {
    payload: JWTPayload;
    header: JWSHeaderParameters;
}
/**
 * The UnsecuredJWT class is a utility for dealing with `{ "alg": "none" }` Unsecured JWTs.
 *
 * @example Encoding
 *
 * ```js
 * const unsecuredJwt = new jose.UnsecuredJWT({ 'urn:example:claim': true })
 *   .setIssuedAt()
 *   .setIssuer('urn:example:issuer')
 *   .setAudience('urn:example:audience')
 *   .setExpirationTime('2h')
 *   .encode()
 *
 * console.log(unsecuredJwt)
 * ```
 *
 * @example Decoding
 *
 * ```js
 * const payload = jose.UnsecuredJWT.decode(jwt, {
 *   issuer: 'urn:example:issuer',
 *   audience: 'urn:example:audience',
 * })
 *
 * console.log(payload)
 * ```
 */
export declare class UnsecuredJWT extends ProduceJWT {
    /** Encodes the Unsecured JWT. */
    encode(): string;
    /**
     * Decodes an unsecured JWT.
     *
     * @param jwt Unsecured JWT to decode the payload of.
     * @param options JWT Claims Set validation options.
     */
    static decode(jwt: string, options?: JWTClaimVerificationOptions): UnsecuredResult;
}
