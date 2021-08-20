import type { JWSHeaderParameters, JWTClaimVerificationOptions, JWTPayload } from '../types';
import ProduceJWT from '../lib/jwt_producer';
interface UnsecuredResult {
    payload: JWTPayload;
    header: JWSHeaderParameters;
}
declare class UnsecuredJWT extends ProduceJWT {
    encode(): string;
    static decode(jwt: string, options?: JWTClaimVerificationOptions): UnsecuredResult;
}
export { UnsecuredJWT };
export default UnsecuredJWT;
export type { JWSHeaderParameters, JWTPayload, UnsecuredResult };
