import type { KeyLike, VerifyOptions, JWTPayload, JWTClaimVerificationOptions, JWSHeaderParameters, GetKeyFunction, FlattenedJWSInput, JWTVerifyResult } from '../types';
interface JWTVerifyOptions extends VerifyOptions, JWTClaimVerificationOptions {
}
export interface JWTVerifyGetKey extends GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput> {
}
declare function jwtVerify(jwt: string | Uint8Array, key: KeyLike | JWTVerifyGetKey, options?: JWTVerifyOptions): Promise<JWTVerifyResult>;
export { jwtVerify };
export default jwtVerify;
export type { KeyLike, JWTPayload, JWTVerifyOptions, JWSHeaderParameters, GetKeyFunction, JWTVerifyResult, };
