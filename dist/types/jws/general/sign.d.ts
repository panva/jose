import type * as t from '../../types.d.ts';
/** Configures an individual JWS Signature (digital signature or MAC) in a General JWS. */
export interface Signature {
    /** Sets the JWS Protected Header. May only be called once. */
    setProtectedHeader(protectedHeader: t.JWSHeaderParameters): Signature;
    /** Sets the JWS Unprotected Header. May only be called once. */
    setUnprotectedHeader(unprotectedHeader: t.JWSHeaderParameters): Signature;
    /**
     * Adds another signature to the enclosing {@link GeneralSign} and returns its configuration.
     *
     * @param key Private key or shared secret. See
     *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
     */
    addSignature(key: t.KeyInput, options?: t.SignOptions): Signature;
    /** Computes all JWS Signatures on the enclosing {@link GeneralSign}, using their configured keys. */
    sign(): Promise<t.GeneralJWS>;
    /** Returns the enclosing {@link GeneralSign} instance. */
    done(): GeneralSign;
}
/** Produces general JWS JSON Serialization using digital signatures or MACs. */
export declare class GeneralSign {
    #private;
    /**
     * Creates a signer for general JWS JSON Serialization.
     *
     * @param payload JWS Payload bytes to sign or MAC.
     */
    constructor(payload: Uint8Array);
    /**
     * Adds a signature and returns its configuration.
     *
     * @param key Private key or shared secret. See
     *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
     */
    addSignature(key: t.KeyInput, options?: t.SignOptions): Signature;
    /**
     * Computes each JWS Signature (digital signature or MAC) and returns the general JWS JSON
     * Serialization.
     */
    sign(): Promise<t.GeneralJWS>;
}
