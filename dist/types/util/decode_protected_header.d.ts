import type { JWSHeaderParameters, JWEHeaderParameters } from '../types';
export declare type ProtectedHeaderParameters = JWSHeaderParameters & JWEHeaderParameters;
declare function decodeProtectedHeader(token: string | object): ProtectedHeaderParameters;
export { decodeProtectedHeader };
export default decodeProtectedHeader;
