import type { FlattenedVerifyResult, KeyLike, FlattenedJWSInput, JWSHeaderParameters, VerifyOptions, GetKeyFunction, ResolvedKey } from '../../types';
export interface FlattenedVerifyGetKey extends GetKeyFunction<JWSHeaderParameters | undefined, FlattenedJWSInput> {
}
declare function flattenedVerify(jws: FlattenedJWSInput, key: KeyLike | Uint8Array, options?: VerifyOptions): Promise<FlattenedVerifyResult>;
declare function flattenedVerify(jws: FlattenedJWSInput, getKey: FlattenedVerifyGetKey, options?: VerifyOptions): Promise<FlattenedVerifyResult & ResolvedKey>;
export { flattenedVerify };
export default flattenedVerify;
export type { KeyLike, FlattenedJWSInput, GetKeyFunction, JWSHeaderParameters, VerifyOptions, FlattenedVerifyResult, };
