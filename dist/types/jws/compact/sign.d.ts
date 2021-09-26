import type { JWSHeaderParameters, KeyLike, SignOptions } from '../../types';
declare class CompactSign {
    private _flattened;
    constructor(payload: Uint8Array);
    setProtectedHeader(protectedHeader: JWSHeaderParameters): this;
    sign(key: KeyLike, options?: SignOptions): Promise<string>;
}
export { CompactSign };
export default CompactSign;
export type { JWSHeaderParameters, KeyLike };
