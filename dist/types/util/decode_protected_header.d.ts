import type * as t from '../types.d.ts';
/** JWE and JWS Header Parameters returned by {@link decodeProtectedHeader}. */
export type ProtectedHeaderParameters = t.JWSHeaderParameters & t.JWEHeaderParameters;
/**
 * Decodes the Protected Header of a JWE, JWS, or JWT without authenticating the token.
 *
 * @param token Compact token or JSON serialization object with a `protected` member.
 * @returns The parsed Protected Header.
 */
export declare function decodeProtectedHeader(token: string | object): ProtectedHeaderParameters;
