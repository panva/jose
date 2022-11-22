import type { CompactJWSHeaderParameters, KeyLike, SignOptions } from '../../types';
/**
 * The CompactSign class is a utility for creating Compact JWS strings.
 *
 * @example Usage
 *
 * ```js
 * const jws = await new jose.CompactSign(
 *   new TextEncoder().encode('It’s a dangerous business, Frodo, going out your door.'),
 * )
 *   .setProtectedHeader({ alg: 'ES256' })
 *   .sign(privateKey)
 *
 * console.log(jws)
 * ```
 */
export declare class CompactSign {
    private _flattened;
    /** @param payload Binary representation of the payload to sign. */
    constructor(payload: Uint8Array);
    /**
     * Sets the JWS Protected Header on the Sign object.
     *
     * @param protectedHeader JWS Protected Header.
     */
    setProtectedHeader(protectedHeader: CompactJWSHeaderParameters): this;
    /**
     * Signs and resolves the value of the Compact JWS string.
     *
     * @param key Private Key or Secret to sign the JWS with.
     * @param options JWS Sign options.
     */
    sign(key: KeyLike | Uint8Array, options?: SignOptions): Promise<string>;
}
