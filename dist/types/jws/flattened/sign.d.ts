import type { KeyLike, FlattenedJWS, JWSHeaderParameters, SignOptions } from '../../types';
export declare class FlattenedSign {
    private _payload;
    private _protectedHeader;
    private _unprotectedHeader;
    constructor(payload: Uint8Array);
    setProtectedHeader(protectedHeader: JWSHeaderParameters): this;
    setUnprotectedHeader(unprotectedHeader: JWSHeaderParameters): this;
    sign(key: KeyLike | Uint8Array, options?: SignOptions): Promise<FlattenedJWS>;
}
