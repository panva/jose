import type { JWEHeaderParameters, KeyLike } from '../types.d';
import type { JWEKeyManagementHeaderResults } from '../types.i.d';
declare function decryptKeyManagement(alg: string, key: KeyLike, encryptedKey: Uint8Array | undefined, joseHeader: JWEKeyManagementHeaderResults & JWEHeaderParameters): Promise<KeyLike>;
export default decryptKeyManagement;
