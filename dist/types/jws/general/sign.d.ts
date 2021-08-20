import type { KeyLike, GeneralJWS, JWSHeaderParameters, SignOptions } from '../../types';
export interface Signature {
    setProtectedHeader(protectedHeader: JWSHeaderParameters): Signature;
    setUnprotectedHeader(unprotectedHeader: JWSHeaderParameters): Signature;
}
declare class GeneralSign {
    private _payload;
    private _signatures;
    constructor(payload: Uint8Array);
    addSignature(key: KeyLike, options?: SignOptions): Signature;
    sign(): Promise<GeneralJWS>;
}
export { GeneralSign };
export default GeneralSign;
export type { KeyLike, GeneralJWS, JWSHeaderParameters };
