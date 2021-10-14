import type { KeyLike, DecryptOptions, JWEHeaderParameters, GetKeyFunction, FlattenedJWE, GeneralJWE, GeneralDecryptResult, ResolvedKey } from '../../types';
export interface GeneralDecryptGetKey extends GetKeyFunction<JWEHeaderParameters, FlattenedJWE> {
}
declare function generalDecrypt(jwe: GeneralJWE, key: KeyLike | Uint8Array, options?: DecryptOptions): Promise<GeneralDecryptResult>;
declare function generalDecrypt(jwe: GeneralJWE, getKey: GeneralDecryptGetKey, options?: DecryptOptions): Promise<GeneralDecryptResult & ResolvedKey>;
export { generalDecrypt };
export default generalDecrypt;
export type { KeyLike, GeneralJWE, DecryptOptions, GeneralDecryptResult };
