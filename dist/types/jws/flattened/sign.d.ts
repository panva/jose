import type * as t from '../../types.d.ts';
/** Builds and signs Flattened JWS objects. */
export declare class FlattenedSign {
    #private;
    /**
     * Creates a Flattened JWS signer.
     *
     * @param payload Binary representation of the payload to sign.
     */
    constructor(payload: Uint8Array);
    /** Sets the JWS Protected Header. May only be called once. */
    setProtectedHeader(protectedHeader: t.JWSHeaderParameters): this;
    /** Sets the JWS Unprotected Header. May only be called once. */
    setUnprotectedHeader(unprotectedHeader: t.JWSHeaderParameters): this;
    /**
     * Signs the payload as a Flattened JWS.
     *
     * @param key Private key or shared secret. See
     *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
     */
    sign(key: t.KeyInput, options?: t.SignOptions): Promise<t.FlattenedJWS>;
}
