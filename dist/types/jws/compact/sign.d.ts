import type * as t from '../../types.d.ts';
/** Builds and signs Compact JWS strings. */
export declare class CompactSign {
    #private;
    /**
     * Creates a Compact JWS signer.
     *
     * @param payload Binary representation of the payload to sign.
     */
    constructor(payload: Uint8Array);
    /** Sets the JWS Protected Header. May only be called once. */
    setProtectedHeader(protectedHeader: t.CompactJWSHeaderParameters): this;
    /**
     * Signs the payload as a Compact JWS.
     *
     * @param key Private key or shared secret. See
     *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
     */
    sign(key: t.KeyInput, options?: t.SignOptions): Promise<string>;
}
