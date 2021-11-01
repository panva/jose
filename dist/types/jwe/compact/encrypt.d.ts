import type { KeyLike, JWEKeyManagementHeaderParameters, JWEHeaderParameters, EncryptOptions } from '../../types';
export declare class CompactEncrypt {
    private _flattened;
    constructor(plaintext: Uint8Array);
    setContentEncryptionKey(cek: Uint8Array): this;
    setInitializationVector(iv: Uint8Array): this;
    setProtectedHeader(protectedHeader: JWEHeaderParameters): this;
    setKeyManagementParameters(parameters: JWEKeyManagementHeaderParameters): this;
    encrypt(key: KeyLike | Uint8Array, options?: EncryptOptions): Promise<string>;
}
