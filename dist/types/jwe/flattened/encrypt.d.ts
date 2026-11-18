import type * as t from '../../types.d.ts';
/** Produces flattened JWE JSON Serialization using authenticated encryption. */
export declare class FlattenedEncrypt {
    #private;
    /**
     * Creates an encryptor for flattened JWE JSON Serialization.
     *
     * @param plaintext Binary representation of the plaintext to encrypt.
     */
    constructor(plaintext: Uint8Array);
    /**
     * Sets key management inputs such as ECDH-ES "apu"/"apv" or PBES2 "p2c". Use this method instead
     * of header setters; the resulting parameters are added to the JOSE Header. May only be called
     * once.
     */
    setKeyManagementParameters(parameters: t.JWEKeyManagementHeaderParameters): this;
    /** Sets the JWE Protected Header. May only be called once. */
    setProtectedHeader(protectedHeader: t.JWEHeaderParameters): this;
    /** Sets the JWE Shared Unprotected Header. May only be called once. */
    setSharedUnprotectedHeader(sharedUnprotectedHeader: t.JWEHeaderParameters): this;
    /** Sets the JWE Per-Recipient Unprotected Header. May only be called once. */
    setUnprotectedHeader(unprotectedHeader: t.JWEHeaderParameters): this;
    /** Sets the JWE AAD, which is integrity protected but not encrypted. */
    setAdditionalAuthenticatedData(aad: Uint8Array): this;
    /**
     * Sets a content encryption key instead of generating a random one for the JWE "enc" algorithm.
     * May only be called once.
     *
     * @deprecated Use only for testing and vector validation.
     */
    setContentEncryptionKey(cek: Uint8Array): this;
    /**
     * Sets the content encryption IV instead of generating a random one for the JWE "enc" algorithm.
     * May only be called once.
     *
     * @deprecated Use only for testing and vector validation.
     */
    setInitializationVector(iv: Uint8Array): this;
    /**
     * Encrypts the plaintext and returns the flattened JWE JSON Serialization.
     *
     * @param key Public key or shared secret. See
     *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
     */
    encrypt(key: t.KeyInput, options?: t.EncryptOptions): Promise<t.FlattenedJWE>;
}
