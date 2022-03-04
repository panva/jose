import type { FlattenedDecryptResult, KeyLike, FlattenedJWE, JWEHeaderParameters, DecryptOptions, GetKeyFunction, ResolvedKey } from '../../types';
export interface FlattenedDecryptGetKey extends GetKeyFunction<JWEHeaderParameters | undefined, FlattenedJWE> {
}
export declare function flattenedDecrypt(jwe: FlattenedJWE, key: KeyLike | Uint8Array, options?: DecryptOptions): Promise<FlattenedDecryptResult>;
export declare function flattenedDecrypt(jwe: FlattenedJWE, getKey: FlattenedDecryptGetKey, options?: DecryptOptions): Promise<FlattenedDecryptResult & ResolvedKey>;
