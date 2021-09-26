import type { KeyLike, JWEKeyManagementHeaderParameters, JWEHeaderParameters, EncryptOptions } from '../../types';
declare class CompactEncrypt {
    private _flattened;
    constructor(plaintext: Uint8Array);
    setContentEncryptionKey(cek: Uint8Array): this;
    setInitializationVector(iv: Uint8Array): this;
    setProtectedHeader(protectedHeader: JWEHeaderParameters): this;
    setKeyManagementParameters(parameters: JWEKeyManagementHeaderParameters): this;
    encrypt(key: KeyLike, options?: EncryptOptions): Promise<string>;
}
export { CompactEncrypt };
export default CompactEncrypt;
export type { KeyLike, JWEKeyManagementHeaderParameters, JWEHeaderParameters };
