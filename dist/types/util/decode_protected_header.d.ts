import type * as types from '../types.d.ts';
/** JWE and JWS Header Parameters */
export type ProtectedHeaderParameters = types.JWSHeaderParameters & types.JWEHeaderParameters;
/**
 * Decodes the Protected Header of a JWE/JWS/JWT token utilizing any JOSE serialization.
 *
 * @param token JWE/JWS/JWT token in any JOSE serialization.
 */
export declare function decodeProtectedHeader(token: string | object): ProtectedHeaderParameters;
