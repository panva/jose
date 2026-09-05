import type * as t from '../types.d.ts';
/**
 * Decodes the Claims Set of a JWT in Compact JWS serialization without checking its signature or
 * validating claim types and values.
 *
 * @returns The parsed JWT Claims Set.
 */
export declare function decodeJwt<PayloadType = t.JWTPayload>(jwt: string): PayloadType & t.JWTPayload & ([PayloadType] extends [object] ? unknown : unknown extends PayloadType ? unknown : never);
