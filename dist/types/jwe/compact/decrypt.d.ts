import type { KeyLike, DecryptOptions, CompactJWEHeaderParameters, GetKeyFunction, FlattenedJWE, CompactDecryptResult, ResolvedKey } from '../../types';
export interface CompactDecryptGetKey extends GetKeyFunction<CompactJWEHeaderParameters, FlattenedJWE> {
}
export declare function compactDecrypt(jwe: string | Uint8Array, key: KeyLike | Uint8Array, options?: DecryptOptions): Promise<CompactDecryptResult>;
export declare function compactDecrypt(jwe: string | Uint8Array, getKey: CompactDecryptGetKey, options?: DecryptOptions): Promise<CompactDecryptResult & ResolvedKey>;
