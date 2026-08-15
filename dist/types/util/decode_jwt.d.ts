import type * as types from '../types.d.ts';
/**
 * Decodes a signed JSON Web Token payload. This does not validate the JWT Claims Set types or
 * values. This does not validate the JWS Signature. For a proper Signed JWT Claims Set validation
 * and JWS signature verification use `jose.jwtVerify()`. For an encrypted JWT Claims Set validation
 * and JWE decryption use `jose.jwtDecrypt()`.
 *
 * @param jwt JWT token in compact JWS serialization.
 */
export declare function decodeJwt<PayloadType = types.JWTPayload>(jwt: string): PayloadType & types.JWTPayload & ([PayloadType] extends [object] ? unknown : unknown extends PayloadType ? unknown : never);
