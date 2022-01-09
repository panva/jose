import type { KeyLike, DecryptOptions, JWEHeaderParameters, GetKeyFunction, FlattenedJWE, GeneralJWE, GeneralDecryptResult, ResolvedKey } from '../../types';
export interface GeneralDecryptGetKey extends GetKeyFunction<JWEHeaderParameters, FlattenedJWE> {
}
export declare function generalDecrypt(jwe: GeneralJWE, key: KeyLike | Uint8Array, options?: DecryptOptions): Promise<GeneralDecryptResult>;
export declare function generalDecrypt(jwe: GeneralJWE, getKey: GeneralDecryptGetKey, options?: DecryptOptions): Promise<GeneralDecryptResult & ResolvedKey>;
