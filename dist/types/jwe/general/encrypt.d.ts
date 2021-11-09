import type { KeyLike, GeneralJWE, JWEHeaderParameters, CritOption, DeflateOption } from '../../types';
export interface Recipient {
    setUnprotectedHeader(unprotectedHeader: JWEHeaderParameters): Recipient;
}
export declare class GeneralEncrypt {
    private _plaintext;
    private _recipients;
    private _protectedHeader;
    private _unprotectedHeader;
    private _aad;
    constructor(plaintext: Uint8Array);
    addRecipient(key: KeyLike | Uint8Array, options?: CritOption): Recipient;
    setProtectedHeader(protectedHeader: JWEHeaderParameters): this;
    setSharedUnprotectedHeader(sharedUnprotectedHeader: JWEHeaderParameters): this;
    setAdditionalAuthenticatedData(aad: Uint8Array): this;
    encrypt(options?: DeflateOption): Promise<GeneralJWE>;
}
