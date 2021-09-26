import type { KeyLike, DecryptOptions, JWTPayload, JWTClaimVerificationOptions, GetKeyFunction, JWEHeaderParameters, FlattenedJWE, JWTDecryptResult, ResolvedKey } from '../types';
interface JWTDecryptOptions extends DecryptOptions, JWTClaimVerificationOptions {
}
export interface JWTDecryptGetKey extends GetKeyFunction<JWEHeaderParameters, FlattenedJWE> {
}
declare function jwtDecrypt(jwt: string | Uint8Array, key: KeyLike, options?: JWTDecryptOptions): Promise<JWTDecryptResult>;
declare function jwtDecrypt(jwt: string | Uint8Array, getKey: JWTDecryptGetKey, options?: JWTDecryptOptions): Promise<JWTDecryptResult & ResolvedKey>;
export { jwtDecrypt };
export default jwtDecrypt;
export type { KeyLike, DecryptOptions, JWTPayload, JWTDecryptOptions, JWTDecryptResult };
