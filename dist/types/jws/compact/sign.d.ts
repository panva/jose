import type { CompactJWSHeaderParameters, KeyLike, SignOptions } from '../../types';
export declare class CompactSign {
    private _flattened;
    constructor(payload: Uint8Array);
    setProtectedHeader(protectedHeader: CompactJWSHeaderParameters): this;
    sign(key: KeyLike | Uint8Array, options?: SignOptions): Promise<string>;
}
