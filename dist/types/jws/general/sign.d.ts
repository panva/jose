import type { KeyLike, GeneralJWS, JWSHeaderParameters, SignOptions } from '../../types';
export interface Signature {
    /**
     * Sets the JWS Protected Header on the Signature object.
     *
     * @param protectedHeader JWS Protected Header.
     */
    setProtectedHeader(protectedHeader: JWSHeaderParameters): Signature;
    /**
     * Sets the JWS Unprotected Header on the Signature object.
     *
     * @param unprotectedHeader JWS Unprotected Header.
     */
    setUnprotectedHeader(unprotectedHeader: JWSHeaderParameters): Signature;
    /**
     * A shorthand for calling addSignature() on the enclosing GeneralSign instance
     */
    addSignature(...args: Parameters<GeneralSign['addSignature']>): Signature;
    /**
     * A shorthand for calling encrypt() on the enclosing GeneralSign instance
     */
    sign(...args: Parameters<GeneralSign['sign']>): Promise<GeneralJWS>;
    /**
     * Returns the enclosing GeneralSign
     */
    done(): GeneralSign;
}
/**
 * The GeneralSign class is a utility for creating General JWS objects.
 *
 * @example Usage
 * ```js
 * const jws = await new jose.GeneralSign(
 *   new TextEncoder().encode(
 *     'It’s a dangerous business, Frodo, going out your door.'
 *   )
 * )
 *   .addSignature(ecPrivateKey)
 *   .setProtectedHeader({ alg: 'ES256' })
 *   .addSignature(rsaPrivateKey)
 *   .setProtectedHeader({ alg: 'PS256' })
 *   .sign()
 *
 * console.log(jws)
 * ```
 */
export declare class GeneralSign {
    private _payload;
    private _signatures;
    /**
     * @param payload Binary representation of the payload to sign.
     */
    constructor(payload: Uint8Array);
    /**
     * Adds an additional signature for the General JWS object.
     *
     * @param key Private Key or Secret to sign the individual JWS signature with.
     * @param options JWS Sign options.
     */
    addSignature(key: KeyLike | Uint8Array, options?: SignOptions): Signature;
    /**
     * Signs and resolves the value of the General JWS object.
     */
    sign(): Promise<GeneralJWS>;
}
