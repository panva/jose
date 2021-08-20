import type { JWSHeaderParameters, JWEHeaderParameters } from '../types.d';
export declare type ProtectedHeaderParameters = JWSHeaderParameters & JWEHeaderParameters;
declare function decodeProtectedHeader(token: string | object): ProtectedHeaderParameters;
export { decodeProtectedHeader };
export default decodeProtectedHeader;
