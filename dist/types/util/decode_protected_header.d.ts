import type { JWSHeaderParameters, JWEHeaderParameters } from '../types';
export declare type ProtectedHeaderParameters = JWSHeaderParameters & JWEHeaderParameters;
export declare function decodeProtectedHeader(token: string | object): ProtectedHeaderParameters;
