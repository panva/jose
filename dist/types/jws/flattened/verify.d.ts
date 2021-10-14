import type { FlattenedVerifyResult, KeyLike, FlattenedJWSInput, JWSHeaderParameters, VerifyOptions, GetKeyFunction, ResolvedKey } from '../../types';
export interface FlattenedVerifyGetKey extends GetKeyFunction<JWSHeaderParameters | undefined, FlattenedJWSInput> {
}
export declare function flattenedVerify(jws: FlattenedJWSInput, key: KeyLike | Uint8Array, options?: VerifyOptions): Promise<FlattenedVerifyResult>;
export declare function flattenedVerify(jws: FlattenedJWSInput, getKey: FlattenedVerifyGetKey, options?: VerifyOptions): Promise<FlattenedVerifyResult & ResolvedKey>;
