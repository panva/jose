import type * as t from '../../types.d.ts';
/** Produces flattened JWS JSON Serialization using a digital signature or MAC. */
export declare class FlattenedSign {
    #private;
    /**
     * Creates a signer for flattened JWS JSON Serialization.
     *
     * @param payload JWS Payload bytes to sign or MAC.
     */
    constructor(payload: Uint8Array);
    /** Sets the JWS Protected Header. May only be called once. */
    setProtectedHeader(protectedHeader: t.JWSHeaderParameters): this;
    /** Sets the JWS Unprotected Header. May only be called once. */
    setUnprotectedHeader(unprotectedHeader: t.JWSHeaderParameters): this;
    /**
     * Computes the JWS Signature (digital signature or MAC) and returns the flattened JWS JSON
     * Serialization.
     *
     * @param key Private key or shared secret. See
     *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
     */
    sign(key: t.KeyInput, options?: t.SignOptions): Promise<t.FlattenedJWS>;
}
