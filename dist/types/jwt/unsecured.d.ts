import type * as types from '../types.d.ts';
/** Result of decoding an Unsecured JWT. */
export interface UnsecuredResult<PayloadType = types.JWTPayload> {
    /** JWT Claims Set. */
    payload: PayloadType & types.JWTPayload & ([PayloadType] extends [object] ? unknown : unknown extends PayloadType ? unknown : never);
    /** The decoded JOSE Header; always `{ "alg": "none" }` for an Unsecured JWT. */
    header: types.JWSHeaderParameters;
}
/**
 * UnsecuredJWT constructor
 *
 * @param payload The JWT Claims Set object. Defaults to an empty object.
 */
declare const UnsecuredJWT_base: new (payload?: types.JWTPayload) => types.ProduceJWT;
/** The UnsecuredJWT class is a utility for dealing with `{ "alg": "none" }` Unsecured JWTs. */
export declare class UnsecuredJWT extends UnsecuredJWT_base {
    private jwt;
    /** Encodes the Unsecured JWT. */
    encode(): string;
    /**
     * Decodes an unsecured JWT.
     *
     * @param jwt Unsecured JWT to decode the payload of.
     * @param options JWT Claims Set validation options.
     */
    static decode<PayloadType = types.JWTPayload>(jwt: string, options?: types.JWTClaimVerificationOptions): UnsecuredResult<PayloadType>;
}
export {};
