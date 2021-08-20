import type { FlattenedVerifyResult, KeyLike, FlattenedJWSInput, JWSHeaderParameters, VerifyOptions, GetKeyFunction } from '../../types';
export interface FlattenedVerifyGetKey extends GetKeyFunction<JWSHeaderParameters | undefined, FlattenedJWSInput> {
}
declare function flattenedVerify(jws: FlattenedJWSInput, key: KeyLike | FlattenedVerifyGetKey, options?: VerifyOptions): Promise<FlattenedVerifyResult>;
export { flattenedVerify };
export default flattenedVerify;
export type { KeyLike, FlattenedJWSInput, GetKeyFunction, JWSHeaderParameters, VerifyOptions, FlattenedVerifyResult, };
