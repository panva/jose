import type { FlattenedDecryptResult, KeyLike, FlattenedJWE, JWEHeaderParameters, DecryptOptions, GetKeyFunction } from '../../types';
export interface FlattenedDecryptGetKey extends GetKeyFunction<JWEHeaderParameters | undefined, FlattenedJWE> {
}
declare function flattenedDecrypt(jwe: FlattenedJWE, key: KeyLike | FlattenedDecryptGetKey, options?: DecryptOptions): Promise<FlattenedDecryptResult>;
export { flattenedDecrypt };
export default flattenedDecrypt;
export type { KeyLike, FlattenedJWE, JWEHeaderParameters, DecryptOptions, FlattenedDecryptResult };
