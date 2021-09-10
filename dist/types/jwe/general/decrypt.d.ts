import type { KeyLike, DecryptOptions, JWEHeaderParameters, GetKeyFunction, FlattenedJWE, GeneralJWE, GeneralDecryptResult } from '../../types';
export interface GeneralDecryptGetKey extends GetKeyFunction<JWEHeaderParameters, FlattenedJWE> {
}
declare function generalDecrypt(jwe: GeneralJWE, key: KeyLike | GeneralDecryptGetKey, options?: DecryptOptions): Promise<GeneralDecryptResult>;
export { generalDecrypt };
export default generalDecrypt;
export type { KeyLike, GeneralJWE, DecryptOptions, GeneralDecryptResult };
