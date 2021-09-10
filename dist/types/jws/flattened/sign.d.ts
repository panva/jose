import type { KeyLike, FlattenedJWS, JWSHeaderParameters, SignOptions } from '../../types';
declare class FlattenedSign {
    private _payload;
    private _protectedHeader;
    private _unprotectedHeader;
    constructor(payload: Uint8Array);
    setProtectedHeader(protectedHeader: JWSHeaderParameters): this;
    setUnprotectedHeader(unprotectedHeader: JWSHeaderParameters): this;
    sign(key: KeyLike, options?: SignOptions): Promise<FlattenedJWS>;
}
export { FlattenedSign };
export default FlattenedSign;
export type { KeyLike, FlattenedJWS, JWSHeaderParameters };
