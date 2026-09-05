import type * as t from '../types.d.ts';
/** @param payload Initial JWT Claims Set. Defaults to an empty object. */
declare const EncryptJWT_base: new (payload?: t.JWTPayload) => t.ProduceJWT;
/** Builds and encrypts Compact JWE-formatted JSON Web Tokens. */
export declare class EncryptJWT extends EncryptJWT_base {
    #private;
    /**
     * Sets the JWE Protected Header. May only be called once.
     *
     * @param protectedHeader JWE Protected Header. Must contain an "alg" (JWE Algorithm) and "enc"
     *   (JWE Encryption Algorithm) properties.
     */
    setProtectedHeader(protectedHeader: t.CompactJWEHeaderParameters): this;
    /**
     * Sets JWE Key Management parameters, such as ECDH-ES "apu" and "apv" or PBES2 "p2c", and adds
     * them to the appropriate JOSE Header. Use this instead of the header setters for algorithm
     * inputs. May only be called once.
     */
    setKeyManagementParameters(parameters: t.JWEKeyManagementHeaderParameters): this;
    /**
     * Sets the content encryption key. By default, a suitable random key is generated for the JWE
     * "enc" (Encryption Algorithm). May only be called once.
     *
     * @deprecated For testing and vector validation only; allow random generation in production.
     */
    setContentEncryptionKey(cek: Uint8Array): this;
    /**
     * Sets the Initialization Vector for content encryption. By default, a suitable random IV is
     * generated for the JWE "enc" (Encryption Algorithm). May only be called once.
     *
     * @deprecated For testing and vector validation only; allow random generation in production.
     */
    setInitializationVector(iv: Uint8Array): this;
    /**
     * Replicates the "iss" (Issuer) Claim in the JWE Protected Header, exposing it without
     * decryption.
     */
    replicateIssuerAsHeader(): this;
    /**
     * Replicates the "sub" (Subject) Claim in the JWE Protected Header, exposing it without
     * decryption.
     */
    replicateSubjectAsHeader(): this;
    /**
     * Replicates the "aud" (Audience) Claim in the JWE Protected Header, exposing it without
     * decryption.
     */
    replicateAudienceAsHeader(): this;
    /**
     * Encrypts and returns the JWT.
     *
     * @param key Public key or shared secret to encrypt the JWT with. See
     *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
     */
    encrypt(key: t.KeyInput, options?: t.EncryptOptions): Promise<string>;
}
export {};
