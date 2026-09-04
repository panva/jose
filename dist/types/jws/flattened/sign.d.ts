import type * as t from '../../types.d.ts';
/** Builds and signs Flattened JWS objects. */
export declare class FlattenedSign {
    #private;
    /**
     * {@link FlattenedSign} constructor
     *
     * @param payload Binary representation of the payload to sign.
     */
    constructor(payload: Uint8Array);
    /** Sets the JWS Protected Header on the FlattenedSign object. */
    setProtectedHeader(protectedHeader: t.JWSHeaderParameters): this;
    /** Sets the JWS Unprotected Header on the FlattenedSign object. */
    setUnprotectedHeader(unprotectedHeader: t.JWSHeaderParameters): this;
    /**
     * Signs and resolves the value of the Flattened JWS object.
     *
     * @param key Private Key or Secret to sign the JWS with. See
     *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
     */
    sign(key: t.KeyInput, options?: t.SignOptions): Promise<t.FlattenedJWS>;
}
