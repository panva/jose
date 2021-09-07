import type { JWSHeaderParameters, JWTPayload, KeyLike, SignOptions } from '../types';
import ProduceJWT from '../lib/jwt_producer';
declare class SignJWT extends ProduceJWT {
    private _protectedHeader;
    setProtectedHeader(protectedHeader: JWSHeaderParameters): this;
    sign(key: KeyLike, options?: SignOptions): Promise<string>;
}
export { SignJWT };
export default SignJWT;
export type { JWSHeaderParameters, JWTPayload, KeyLike };
