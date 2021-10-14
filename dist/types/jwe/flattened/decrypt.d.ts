import type { FlattenedDecryptResult, KeyLike, FlattenedJWE, JWEHeaderParameters, DecryptOptions, GetKeyFunction, ResolvedKey } from '../../types';
export interface FlattenedDecryptGetKey extends GetKeyFunction<JWEHeaderParameters | undefined, FlattenedJWE> {
}
declare function flattenedDecrypt(jwe: FlattenedJWE, key: KeyLike | Uint8Array, options?: DecryptOptions): Promise<FlattenedDecryptResult>;
declare function flattenedDecrypt(jwe: FlattenedJWE, getKey: FlattenedDecryptGetKey, options?: DecryptOptions): Promise<FlattenedDecryptResult & ResolvedKey>;
export { flattenedDecrypt };
export default flattenedDecrypt;
export type { KeyLike, FlattenedJWE, JWEHeaderParameters, DecryptOptions, FlattenedDecryptResult };
