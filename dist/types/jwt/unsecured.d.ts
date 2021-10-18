import type { JWSHeaderParameters, JWTClaimVerificationOptions, JWTPayload } from '../types';
import { ProduceJWT } from './produce';
export interface UnsecuredResult {
    payload: JWTPayload;
    header: JWSHeaderParameters;
}
export declare class UnsecuredJWT extends ProduceJWT {
    encode(): string;
    static decode(jwt: string, options?: JWTClaimVerificationOptions): UnsecuredResult;
}
