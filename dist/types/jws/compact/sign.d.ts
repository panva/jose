import type * as t from '../../types.d.ts';
/** Produces JWS Compact Serialization using a digital signature or MAC. */
export declare class CompactSign {
    #private;
    /**
     * Creates a signer for JWS Compact Serialization.
     *
     * @param payload JWS Payload bytes to sign or MAC.
     */
    constructor(payload: Uint8Array);
    /** Sets the JWS Protected Header. May only be called once. */
    setProtectedHeader(protectedHeader: t.CompactJWSHeaderParameters): this;
    /**
     * Computes the JWS Signature (digital signature or MAC) and returns the JWS Compact
     * Serialization.
     *
     * @param key Private key or shared secret. See
     *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
     */
    sign(key: t.KeyInput, options?: t.SignOptions): Promise<string>;
}
