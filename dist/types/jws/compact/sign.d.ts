import type { JWSHeaderParameters, KeyLike, SignOptions } from '../../types';
export declare class CompactSign {
    private _flattened;
    constructor(payload: Uint8Array);
    setProtectedHeader(protectedHeader: JWSHeaderParameters): this;
    sign(key: KeyLike | Uint8Array, options?: SignOptions): Promise<string>;
}
