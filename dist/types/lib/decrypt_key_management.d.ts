import type { JWEHeaderParameters, KeyLike } from '../types';
import type { JWEKeyManagementHeaderResults } from '../types.i';
declare function decryptKeyManagement(alg: string, key: KeyLike, encryptedKey: Uint8Array | undefined, joseHeader: JWEKeyManagementHeaderResults & JWEHeaderParameters): Promise<KeyLike>;
export default decryptKeyManagement;
