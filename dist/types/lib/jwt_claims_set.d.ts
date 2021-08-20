import type { JWTPayload, JWTClaimVerificationOptions, JWEHeaderParameters, JWSHeaderParameters } from '../types';
declare const _default: (protectedHeader: JWEHeaderParameters | JWSHeaderParameters, encodedPayload: Uint8Array, options?: JWTClaimVerificationOptions) => JWTPayload;
export default _default;
