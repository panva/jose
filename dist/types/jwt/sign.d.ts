import type * as t from '../types.d.ts';
/** @param payload Initial JWT Claims Set. Defaults to an empty object. */
declare const SignJWT_base: new (payload?: t.JWTPayload) => t.ProduceJWT;
/** Builds and signs Compact JWS-formatted JSON Web Tokens. */
export declare class SignJWT extends SignJWT_base {
    #private;
    /**
     * Sets the JWS Protected Header. May only be called once.
     *
     * @param protectedHeader JWS Protected Header. Must contain an "alg" (JWS Algorithm) property.
     */
    setProtectedHeader(protectedHeader: t.JWTHeaderParameters): this;
    /**
     * Signs and returns the JWT.
     *
     * @param key Private key or shared secret to sign the JWT with. See
     *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
     */
    sign(key: t.KeyInput, options?: t.SignOptions): Promise<string>;
}
export {};
