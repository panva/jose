import type { EncryptOptions, CompactJWEHeaderParameters, JWEKeyManagementHeaderParameters, KeyLike } from '../types';
import { ProduceJWT } from './produce';
export declare class EncryptJWT extends ProduceJWT {
    private _cek;
    private _iv;
    private _keyManagementParameters;
    private _protectedHeader;
    private _replicateIssuerAsHeader;
    private _replicateSubjectAsHeader;
    private _replicateAudienceAsHeader;
    setProtectedHeader(protectedHeader: CompactJWEHeaderParameters): this;
    setKeyManagementParameters(parameters: JWEKeyManagementHeaderParameters): this;
    setContentEncryptionKey(cek: Uint8Array): this;
    setInitializationVector(iv: Uint8Array): this;
    replicateIssuerAsHeader(): this;
    replicateSubjectAsHeader(): this;
    replicateAudienceAsHeader(): this;
    encrypt(key: KeyLike | Uint8Array, options?: EncryptOptions): Promise<string>;
}
