import type { JWSHeaderParameters, KeyLike, SignOptions } from '../types';
import { ProduceJWT } from './produce';
export declare class SignJWT extends ProduceJWT {
    private _protectedHeader;
    setProtectedHeader(protectedHeader: JWSHeaderParameters): this;
    sign(key: KeyLike | Uint8Array, options?: SignOptions): Promise<string>;
}
