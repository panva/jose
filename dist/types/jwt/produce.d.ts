import type * as types from '../types.d.ts';
export declare class ProduceJWT {
    #private;
    constructor(payload: types.JWTPayload);
    data(): Uint8Array;
    get iss(): string | undefined;
    set iss(value: string);
    get sub(): string | undefined;
    set sub(value: string);
    get aud(): string | string[] | undefined;
    set aud(value: string | string[]);
    get jti(): string | undefined;
    set jti(value: string);
    get nbf(): number | undefined;
    set nbf(value: number | string | Date);
    get exp(): number | undefined;
    set exp(value: number | string | Date);
    get iat(): number | undefined;
    set iat(value: number | string | Date | undefined);
}
