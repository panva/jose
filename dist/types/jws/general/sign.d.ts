import type * as types from '../../types.d.ts';
/** Used to build General JWS object's individual signatures. */
export interface Signature {
    /**
     * Sets the JWS Protected Header on the Signature object.
     *
     * @param protectedHeader JWS Protected Header.
     */
    setProtectedHeader(protectedHeader: types.JWSHeaderParameters): Signature;
    /**
     * Sets the JWS Unprotected Header on the Signature object.
     *
     * @param unprotectedHeader JWS Unprotected Header.
     */
    setUnprotectedHeader(unprotectedHeader: types.JWSHeaderParameters): Signature;
    /**
     * A shorthand for calling {@link GeneralSign.addSignature addSignature()} on the enclosing
     * {@link GeneralSign} instance.
     *
     * @param key Private Key or Secret to sign the individual JWS signature with. See
     *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
     * @param options JWS Sign options.
     */
    addSignature(key: types.KeyInput, options?: types.SignOptions): Signature;
    /**
     * A shorthand for calling {@link GeneralSign.sign sign()} on the enclosing {@link GeneralSign}
     * instance. Takes no arguments — each signature's key is supplied to {@link addSignature}.
     */
    sign(): Promise<types.GeneralJWS>;
    /** Returns the enclosing {@link GeneralSign} instance */
    done(): GeneralSign;
}
/** The GeneralSign class is used to build and sign General JWS objects. */
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
     * @param options JWS Sign options.
     */
    addSignature(key: types.KeyInput, options?: types.SignOptions): Signature;
    /** Signs and resolves the value of the General JWS object. */
    sign(): Promise<types.GeneralJWS>;
}
