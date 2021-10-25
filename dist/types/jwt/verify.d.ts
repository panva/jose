import type { KeyLike, VerifyOptions, JWTClaimVerificationOptions, JWSHeaderParameters, GetKeyFunction, FlattenedJWSInput, JWTVerifyResult, ResolvedKey } from '../types';
export interface JWTVerifyOptions extends VerifyOptions, JWTClaimVerificationOptions {
}
export interface JWTVerifyGetKey extends GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput> {
}
export declare function jwtVerify(jwt: string | Uint8Array, key: KeyLike | Uint8Array, options?: JWTVerifyOptions): Promise<JWTVerifyResult>;
export declare function jwtVerify(jwt: string | Uint8Array, getKey: JWTVerifyGetKey, options?: JWTVerifyOptions): Promise<JWTVerifyResult & ResolvedKey>;
