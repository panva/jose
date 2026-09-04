import type * as t from '../types.d.ts';
/**
 * EncryptJWT constructor
 *
 * @param payload The JWT Claims Set object. Defaults to an empty object.
 */
declare const EncryptJWT_base: new (payload?: t.JWTPayload) => t.ProduceJWT;
/** Builds and encrypts Compact JWE-formatted JSON Web Tokens. */
export declare class EncryptJWT extends EncryptJWT_base {
    #private;
    /**
     * Sets the JWE Protected Header on the EncryptJWT object.
     *
     * @param protectedHeader JWE Protected Header. Must contain an "alg" (JWE Algorithm) and "enc"
     *   (JWE Encryption Algorithm) properties.
     */
    setProtectedHeader(protectedHeader: t.CompactJWEHeaderParameters): this;
    /**
     * Sets the JWE Key Management parameters to be used when encrypting. Use this method instead of
     * the header setters to configure algorithm inputs such as ECDH-ES "apu" (Agreement PartyUInfo)
     * and "apv" (Agreement PartyVInfo), or PBES2 "p2c" (PBES2 Count). The parameters are added to the
     * appropriate JOSE Header.
     */
    setKeyManagementParameters(parameters: t.JWEKeyManagementHeaderParameters): this;
    /**
     * Sets a content encryption key to use, by default a random suitable one is generated for the JWE
     * "enc" (Encryption Algorithm) Header Parameter.
     *
     * @deprecated You should not use this method. It is only really intended for test and vector
     *   validation purposes.
     */
    setContentEncryptionKey(cek: Uint8Array): this;
    /**
     * Sets the JWE Initialization Vector to use for content encryption, by default a random suitable
     * one is generated for the JWE "enc" (Encryption Algorithm) Header Parameter.
     *
     * @deprecated You should not use this method. It is only really intended for test and vector
     *   validation purposes.
     */
    setInitializationVector(iv: Uint8Array): this;
    /** Replicates the "iss" (Issuer) Claim as a JWE Protected Header Parameter. */
    replicateIssuerAsHeader(): this;
    /** Replicates the "sub" (Subject) Claim as a JWE Protected Header Parameter. */
    replicateSubjectAsHeader(): this;
    /** Replicates the "aud" (Audience) Claim as a JWE Protected Header Parameter. */
    replicateAudienceAsHeader(): this;
    /**
     * Encrypts and returns the JWT.
     *
     * @param key Public Key or Secret to encrypt the JWT with. See
     *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
     */
    encrypt(key: t.KeyInput, options?: t.EncryptOptions): Promise<string>;
}
export {};
