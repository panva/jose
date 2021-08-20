import type { EncryptOptions, JWEHeaderParameters, JWEKeyManagementHeaderParameters, JWTPayload, KeyLike } from '../types';
import ProduceJWT from '../lib/jwt_producer';
declare class EncryptJWT extends ProduceJWT {
    private _cek;
    private _iv;
    private _keyManagementParameters;
    private _protectedHeader;
    private _replicateIssuerAsHeader;
    private _replicateSubjectAsHeader;
    private _replicateAudienceAsHeader;
    setProtectedHeader(protectedHeader: JWEHeaderParameters): this;
    setKeyManagementParameters(parameters: JWEKeyManagementHeaderParameters): this;
    setContentEncryptionKey(cek: Uint8Array): this;
    setInitializationVector(iv: Uint8Array): this;
    replicateIssuerAsHeader(): this;
    replicateSubjectAsHeader(): this;
    replicateAudienceAsHeader(): this;
    encrypt(key: KeyLike, options?: EncryptOptions): Promise<string>;
}
export { EncryptJWT };
export default EncryptJWT;
export type { JWEHeaderParameters, JWTPayload, KeyLike };
