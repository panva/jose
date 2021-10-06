import type { CompactVerifyResult, FlattenedJWSInput, GetKeyFunction, JWSHeaderParameters, KeyLike, VerifyOptions, ResolvedKey } from '../../types';
export interface CompactVerifyGetKey extends GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput> {
}
declare function compactVerify(jws: string | Uint8Array, key: KeyLike | Uint8Array, options?: VerifyOptions): Promise<CompactVerifyResult>;
declare function compactVerify(jws: string | Uint8Array, getKey: CompactVerifyGetKey, options?: VerifyOptions): Promise<CompactVerifyResult & ResolvedKey>;
export { compactVerify };
export default compactVerify;
export type { KeyLike, VerifyOptions, CompactVerifyResult };
