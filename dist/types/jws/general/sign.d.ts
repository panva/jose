import type { KeyLike, GeneralJWS, JWSHeaderParameters, SignOptions } from '../../types';
export interface Signature {
    setProtectedHeader(protectedHeader: JWSHeaderParameters): Signature;
    setUnprotectedHeader(unprotectedHeader: JWSHeaderParameters): Signature;
}
export declare class GeneralSign {
    private _payload;
    private _signatures;
    constructor(payload: Uint8Array);
    addSignature(key: KeyLike | Uint8Array, options?: SignOptions): Signature;
    sign(): Promise<GeneralJWS>;
}
