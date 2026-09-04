import type * as t from '../types.d.ts';
/** JWE and JWS Header Parameters. */
export type ProtectedHeaderParameters = t.JWSHeaderParameters & t.JWEHeaderParameters;
/**
 * Decodes the Protected Header of a JWE, JWS, or JWT in any JOSE serialization.
 *
 * @param token JWE/JWS/JWT token in any JOSE serialization.
 */
export declare function decodeProtectedHeader(token: string | object): ProtectedHeaderParameters;
