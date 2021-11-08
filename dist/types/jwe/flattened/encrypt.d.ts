import type { KeyLike, FlattenedJWE, JWEHeaderParameters, JWEKeyManagementHeaderParameters, EncryptOptions } from '../../types';
export declare const unprotected: unique symbol;
export declare class FlattenedEncrypt {
    private _plaintext;
    private _protectedHeader;
    private _sharedUnprotectedHeader;
    private _unprotectedHeader;
    private _aad;
    private _cek;
    private _iv;
    private _keyManagementParameters;
    constructor(plaintext: Uint8Array);
    setKeyManagementParameters(parameters: JWEKeyManagementHeaderParameters): this;
    setProtectedHeader(protectedHeader: JWEHeaderParameters): this;
    setSharedUnprotectedHeader(sharedUnprotectedHeader: JWEHeaderParameters): this;
    setUnprotectedHeader(unprotectedHeader: JWEHeaderParameters): this;
    setAdditionalAuthenticatedData(aad: Uint8Array): this;
    setContentEncryptionKey(cek: Uint8Array): this;
    setInitializationVector(iv: Uint8Array): this;
    encrypt(key: KeyLike | Uint8Array, options?: EncryptOptions): Promise<FlattenedJWE>;
}
