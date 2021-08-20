import type { CompactVerifyResult, FlattenedJWSInput, GetKeyFunction, JWSHeaderParameters, KeyLike, VerifyOptions } from '../../types';
export interface CompactVerifyGetKey extends GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput> {
}
declare function compactVerify(jws: string | Uint8Array, key: KeyLike | CompactVerifyGetKey, options?: VerifyOptions): Promise<CompactVerifyResult>;
export { compactVerify };
export default compactVerify;
export type { KeyLike, VerifyOptions, CompactVerifyResult };
