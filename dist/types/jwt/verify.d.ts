import type { KeyLike, VerifyOptions, JWTPayload, JWTClaimVerificationOptions, JWSHeaderParameters, GetKeyFunction, FlattenedJWSInput, JWTVerifyResult, ResolvedKey } from '../types';
interface JWTVerifyOptions extends VerifyOptions, JWTClaimVerificationOptions {
}
export interface JWTVerifyGetKey extends GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput> {
}
declare function jwtVerify(jwt: string | Uint8Array, key: KeyLike | Uint8Array, options?: JWTVerifyOptions): Promise<JWTVerifyResult>;
declare function jwtVerify(jwt: string | Uint8Array, getKey: JWTVerifyGetKey, options?: JWTVerifyOptions): Promise<JWTVerifyResult & ResolvedKey>;
export { jwtVerify };
export default jwtVerify;
export type { KeyLike, JWTPayload, JWTVerifyOptions, JWSHeaderParameters, GetKeyFunction, JWTVerifyResult, };
