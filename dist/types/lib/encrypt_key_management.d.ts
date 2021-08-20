import type { KeyLike, JWEKeyManagementHeaderParameters } from '../types.d';
import type { JWEKeyManagementHeaderResults } from '../types.i.d';
declare function encryptKeyManagement(alg: string, enc: string, key: KeyLike, providedCek?: Uint8Array, providedParameters?: JWEKeyManagementHeaderParameters): Promise<{
    cek: KeyLike;
    encryptedKey?: Uint8Array;
    parameters?: JWEKeyManagementHeaderResults;
}>;
export default encryptKeyManagement;
