import type * as t from '../../types.d.ts';
/** Configures an individual signature in a General JWS. */
export interface Signature {
    /** Sets the JWS Protected Header on the Signature object. */
    setProtectedHeader(protectedHeader: t.JWSHeaderParameters): Signature;
    /** Sets the JWS Unprotected Header on the Signature object. */
    setUnprotectedHeader(unprotectedHeader: t.JWSHeaderParameters): Signature;
    /**
     * A shorthand for calling {@link GeneralSign.addSignature addSignature()} on the enclosing
     * {@link GeneralSign} instance.
     *
     * @param key Private Key or Secret to sign the individual JWS signature with. See
     *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
     */
    addSignature(key: t.KeyInput, options?: t.SignOptions): Signature;
    /**
     * A shorthand for calling {@link GeneralSign.sign sign()} on the enclosing {@link GeneralSign}
     * instance. Takes no arguments — each signature's key is supplied to {@link addSignature}.
     */
    sign(): Promise<t.GeneralJWS>;
    /** Returns the enclosing {@link GeneralSign} instance */
    done(): GeneralSign;
}
/** Builds and signs General JWS objects. */
export declare class GeneralSign {
    #private;
    /**
     * {@link GeneralSign} constructor
     *
     * @param payload Binary representation of the payload to sign.
     */
    constructor(payload: Uint8Array);
    /**
     * Adds an additional signature for the General JWS object.
     *
     * @param key Private Key or Secret to sign the individual JWS signature with. See
     *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
     */
    addSignature(key: t.KeyInput, options?: t.SignOptions): Signature;
    /** Signs and resolves the value of the General JWS object. */
    sign(): Promise<t.GeneralJWS>;
}
