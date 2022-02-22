import type { GeneralJWSInput, GeneralVerifyResult, FlattenedJWSInput, GetKeyFunction, JWSHeaderParameters, KeyLike, VerifyOptions, ResolvedKey } from '../../types';
export interface GeneralVerifyGetKey extends GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput> {
}
export declare function generalVerify(jws: GeneralJWSInput, key: KeyLike | Uint8Array, options?: VerifyOptions): Promise<GeneralVerifyResult>;
export declare function generalVerify(jws: GeneralJWSInput, getKey: GeneralVerifyGetKey, options?: VerifyOptions): Promise<GeneralVerifyResult & ResolvedKey>;
