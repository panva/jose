import type { KeyLike, DecryptOptions, JWTPayload, JWTClaimVerificationOptions, GetKeyFunction, JWEHeaderParameters, FlattenedJWE, JWTDecryptResult } from '../types';
interface JWTDecryptOptions extends DecryptOptions, JWTClaimVerificationOptions {
}
export interface JWTDecryptGetKey extends GetKeyFunction<JWEHeaderParameters, FlattenedJWE> {
}
declare function jwtDecrypt(jwt: string | Uint8Array, key: KeyLike | JWTDecryptGetKey, options?: JWTDecryptOptions): Promise<JWTDecryptResult>;
export { jwtDecrypt };
export default jwtDecrypt;
export type { KeyLike, DecryptOptions, JWTPayload, JWTDecryptOptions, JWTDecryptResult };
