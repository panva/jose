import type { KeyLike, FlattenedJWE, JWEHeaderParameters, JWEKeyManagementHeaderParameters, EncryptOptions } from '../../types';
declare class FlattenedEncrypt {
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
    encrypt(key: KeyLike, options?: EncryptOptions): Promise<FlattenedJWE>;
}
export { FlattenedEncrypt };
export default FlattenedEncrypt;
export type { KeyLike, FlattenedJWE, JWEHeaderParameters, JWEKeyManagementHeaderParameters };
