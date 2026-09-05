import type * as t from '../../types.d.ts';
/** Builds and encrypts Compact JWE strings. */
export declare class CompactEncrypt {
    #private;
    /**
     * Creates a Compact JWE encryptor.
     *
     * @param plaintext Binary representation of the plaintext to encrypt.
     */
    constructor(plaintext: Uint8Array);
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
    /** Sets the JWE Protected Header. May only be called once. */
    setProtectedHeader(protectedHeader: t.CompactJWEHeaderParameters): this;
    /**
     * Sets key management inputs such as ECDH-ES "apu"/"apv" or PBES2 "p2c". Use this method instead
     * of header setters; the resulting parameters are added to the JOSE header. May only be called
     * once.
     */
    setKeyManagementParameters(parameters: t.JWEKeyManagementHeaderParameters): this;
    /**
     * Encrypts the plaintext as a Compact JWE.
     *
     * @param key Public key or shared secret. See
     *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
     */
    encrypt(key: t.KeyInput, options?: t.EncryptOptions): Promise<string>;
}
