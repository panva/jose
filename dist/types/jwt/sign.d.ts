import type { JWTHeaderParameters, KeyLike, SignOptions } from '../types';
import { ProduceJWT } from './produce';
/**
 * The SignJWT class is a utility for creating Compact JWS formatted JWT strings.
 *
 * @example Usage
 *
 * ```js
 * const jwt = await new jose.SignJWT({ 'urn:example:claim': true })
 *   .setProtectedHeader({ alg: 'ES256' })
 *   .setIssuedAt()
 *   .setIssuer('urn:example:issuer')
 *   .setAudience('urn:example:audience')
 *   .setExpirationTime('2h')
 *   .sign(privateKey)
 *
 * console.log(jwt)
 * ```
 */
export declare class SignJWT extends ProduceJWT {
    private _protectedHeader;
    /**
     * Sets the JWS Protected Header on the SignJWT object.
     *
     * @param protectedHeader JWS Protected Header. Must contain an "alg" (JWS Algorithm) property.
     */
    setProtectedHeader(protectedHeader: JWTHeaderParameters): this;
    /**
     * Signs and returns the JWT.
     *
     * @param key Private Key or Secret to sign the JWT with.
     * @param options JWT Sign options.
     */
    sign(key: KeyLike | Uint8Array, options?: SignOptions): Promise<string>;
}
