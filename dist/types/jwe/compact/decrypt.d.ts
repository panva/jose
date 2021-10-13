import type { KeyLike, DecryptOptions, JWEHeaderParameters, GetKeyFunction, FlattenedJWE, CompactDecryptResult, ResolvedKey } from '../../types';
export interface CompactDecryptGetKey extends GetKeyFunction<JWEHeaderParameters, FlattenedJWE> {
}
declare function compactDecrypt(jwe: string | Uint8Array, key: KeyLike | Uint8Array, options?: DecryptOptions): Promise<CompactDecryptResult>;
declare function compactDecrypt(jwe: string | Uint8Array, getKey: CompactDecryptGetKey, options?: DecryptOptions): Promise<CompactDecryptResult & ResolvedKey>;
export { compactDecrypt };
export default compactDecrypt;
export type { KeyLike, DecryptOptions, CompactDecryptResult };
