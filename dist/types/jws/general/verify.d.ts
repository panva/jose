import type { GeneralJWSInput, GeneralVerifyResult, FlattenedJWSInput, GetKeyFunction, JWSHeaderParameters, KeyLike, VerifyOptions } from '../../types';
export interface GeneralVerifyGetKey extends GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput> {
}
declare function generalVerify(jws: GeneralJWSInput, key: KeyLike | GeneralVerifyGetKey, options?: VerifyOptions): Promise<GeneralVerifyResult>;
export { generalVerify };
export default generalVerify;
export type { KeyLike, GeneralJWSInput, VerifyOptions, GeneralVerifyResult };
