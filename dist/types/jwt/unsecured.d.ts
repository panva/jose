/**
 * Unsecured (unsigned & unencrypted) JSON Web Tokens (JWT)
 *
 * @module
 */
import type * as types from '../types.d.ts';
import { ProduceJWT } from './produce.js';
/** Result of decoding an Unsecured JWT. */
export interface UnsecuredResult<PayloadType = types.JWTPayload> {
    payload: PayloadType & types.JWTPayload;
    header: types.JWSHeaderParameters;
}
/**
 * The UnsecuredJWT class is a utility for dealing with `{ "alg": "none" }` Unsecured JWTs.
 *
 * This class is exported (as a named export) from the main `'jose'` module entry point as well as
 * from its subpath export `'jose/jwt/unsecured'`.
 *
 */
export declare class UnsecuredJWT extends ProduceJWT {
    /** Encodes the Unsecured JWT. */
    encode(): string;
    /**
     * Decodes an unsecured JWT.
     *
     * @param jwt Unsecured JWT to decode the payload of.
     * @param options JWT Claims Set validation options.
     */
    static decode<PayloadType = types.JWTPayload>(jwt: string, options?: types.JWTClaimVerificationOptions): UnsecuredResult<PayloadType>;
}
