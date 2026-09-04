import type * as t from '../../types.d.ts';
/** Builds and signs Compact JWS strings. */
export declare class CompactSign {
    #private;
    /**
     * {@link CompactSign} constructor
     *
     * @param payload Binary representation of the payload to sign.
     */
    constructor(payload: Uint8Array);
    /** Sets the JWS Protected Header on the CompactSign object. */
    setProtectedHeader(protectedHeader: t.CompactJWSHeaderParameters): this;
    /**
     * Signs and resolves the value of the Compact JWS string.
     *
     * @param key Private Key or Secret to sign the JWS with. See
     *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
     */
    sign(key: t.KeyInput, options?: t.SignOptions): Promise<string>;
}
