import type * as t from '../types.d.ts';
export declare function decodeJwt<PayloadType, InferredPayloadType>(jwt: string): InferredPayloadType & t.JWTPayload & ([PayloadType] extends [object] ? unknown : unknown extends PayloadType ? unknown : never);
/**
 * Decodes the Claims Set of a JWT in JWS Compact Serialization without validating its JWS Signature
 * (digital signature or MAC) or claim types and values.
 *
 * @returns The parsed JWT Claims Set.
 */
export declare function decodeJwt<PayloadType = t.JWTPayload>(jwt: string): PayloadType & t.JWTPayload & ([PayloadType] extends [object] ? unknown : unknown extends PayloadType ? unknown : never);
