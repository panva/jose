import type { JWTPayload } from '../types';
export default class ProduceJWT {
    protected _payload: JWTPayload;
    constructor(payload: JWTPayload);
    setIssuer(issuer: string): this;
    setSubject(subject: string): this;
    setAudience(audience: string | string[]): this;
    setJti(jwtId: string): this;
    setNotBefore(input: number | string): this;
    setExpirationTime(input: number | string): this;
    setIssuedAt(input?: number): this;
}
