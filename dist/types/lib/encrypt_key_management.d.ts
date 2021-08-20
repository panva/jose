import type { KeyLike, JWEKeyManagementHeaderParameters } from '../types';
import type { JWEKeyManagementHeaderResults } from '../types.i';
declare function encryptKeyManagement(alg: string, enc: string, key: KeyLike, providedCek?: Uint8Array, providedParameters?: JWEKeyManagementHeaderParameters): Promise<{
    cek: KeyLike;
    encryptedKey?: Uint8Array;
    parameters?: JWEKeyManagementHeaderResults;
}>;
export default encryptKeyManagement;
