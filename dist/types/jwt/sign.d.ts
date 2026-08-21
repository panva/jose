import type * as types from '../types.d.ts';
/**
 * SignJWT constructor
 *
 * @param payload The JWT Claims Set object. Defaults to an empty object.
 */
declare const SignJWT_base: new (payload?: types.JWTPayload) => types.ProduceJWT;
/** The SignJWT class is used to build and sign Compact JWS formatted JSON Web Tokens. */
export declare class SignJWT extends SignJWT_base {
    #private;
    /**
     * Sets the JWS Protected Header on the SignJWT object.
     *
     * @param protectedHeader JWS Protected Header. Must contain an "alg" (JWS Algorithm) property.
     */
    setProtectedHeader(protectedHeader: types.JWTHeaderParameters): this;
    /**
     * Signs and returns the JWT.
     *
     * @param key Private Key or Secret to sign the JWT with. See
     *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
     * @param options JWT Sign options.
     */
    sign(key: types.KeyInput, options?: types.SignOptions): Promise<string>;
}
export {};
