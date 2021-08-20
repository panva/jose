import type { KeyLike, DecryptOptions, JWEHeaderParameters, GetKeyFunction, FlattenedJWE, CompactDecryptResult } from '../../types.d';
export interface CompactDecryptGetKey extends GetKeyFunction<JWEHeaderParameters, FlattenedJWE> {
}
declare function compactDecrypt(jwe: string | Uint8Array, key: KeyLike | CompactDecryptGetKey, options?: DecryptOptions): Promise<CompactDecryptResult>;
export { compactDecrypt };
export default compactDecrypt;
export type { KeyLike, DecryptOptions, CompactDecryptResult };
