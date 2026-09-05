import type * as t from '../../types.d.ts';
/** Configures an individual signature in a General JWS. */
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
    /** Creates all signatures on the enclosing {@link GeneralSign}, using their configured keys. */
    sign(): Promise<t.GeneralJWS>;
    /** Returns the enclosing {@link GeneralSign} instance. */
    done(): GeneralSign;
}
/** Builds and signs General JWS objects. */
export declare class GeneralSign {
    #private;
    /**
     * Creates a General JWS signer.
     *
     * @param payload Binary representation of the payload to sign.
     */
    constructor(payload: Uint8Array);
    /**
     * Adds a signature and returns its configuration.
     *
     * @param key Private key or shared secret. See
     *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
     */
    addSignature(key: t.KeyInput, options?: t.SignOptions): Signature;
    /** Signs the payload as a General JWS. */
    sign(): Promise<t.GeneralJWS>;
}
