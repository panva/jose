import type { GeneralJWSInput, GeneralVerifyResult, FlattenedJWSInput, GetKeyFunction, JWSHeaderParameters, KeyLike, VerifyOptions, ResolvedKey } from '../../types';
export interface GeneralVerifyGetKey extends GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput> {
}
declare function generalVerify(jws: GeneralJWSInput, key: KeyLike | Uint8Array, options?: VerifyOptions): Promise<GeneralVerifyResult>;
declare function generalVerify(jws: GeneralJWSInput, getKey: GeneralVerifyGetKey, options?: VerifyOptions): Promise<GeneralVerifyResult & ResolvedKey>;
export { generalVerify };
export default generalVerify;
export type { KeyLike, GeneralJWSInput, VerifyOptions, GeneralVerifyResult };
