import type * as t from '../types.d.ts';
/** Decoded Unsecured JWT. */
export interface UnsecuredResult<PayloadType = t.JWTPayload> {
    /** JWT Claims Set. */
    payload: PayloadType & t.JWTPayload & ([PayloadType] extends [object] ? unknown : unknown extends PayloadType ? unknown : never);
    /** The decoded JOSE Header; always `{ "alg": "none" }` for an Unsecured JWT. */
    header: t.JWSHeaderParameters;
}
/** @param payload Initial JWT Claims Set. Defaults to an empty object. */
declare const UnsecuredJWT_base: new (payload?: t.JWTPayload) => t.ProduceJWT;
/** Encodes and decodes `{ "alg": "none" }` Unsecured JWTs. */
export declare class UnsecuredJWT extends UnsecuredJWT_base {
    private jwt;
    /** Encodes the Unsecured JWT. */
    encode(): string;
    /** Decodes an unsecured JWT and validates its claims without authenticating the token. */
    static decode<PayloadType = t.JWTPayload>(jwt: string, options?: t.JWTClaimVerificationOptions): UnsecuredResult<PayloadType>;
}
export {};
