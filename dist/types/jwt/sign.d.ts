import type { JWTHeaderParameters, KeyLike, SignOptions } from '../types';
import { ProduceJWT } from './produce';
export declare class SignJWT extends ProduceJWT {
    private _protectedHeader;
    setProtectedHeader(protectedHeader: JWTHeaderParameters): this;
    sign(key: KeyLike | Uint8Array, options?: SignOptions): Promise<string>;
}
