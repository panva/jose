import type * as t from '../types.d.ts';
/** Decodes the Claims Set of a JWS-formatted JSON Web Token without verifying the signature. */
export declare function decodeJwt<PayloadType = t.JWTPayload>(jwt: string): PayloadType & t.JWTPayload & ([PayloadType] extends [object] ? unknown : unknown extends PayloadType ? unknown : never);
