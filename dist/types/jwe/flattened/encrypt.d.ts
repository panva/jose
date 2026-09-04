import type * as t from '../../types.d.ts';
/** Builds and encrypts Flattened JWE objects. */
export declare class FlattenedEncrypt {
    #private;
    /**
     * {@link FlattenedEncrypt} constructor
     *
     * @param plaintext Binary representation of the plaintext to encrypt.
     */
    constructor(plaintext: Uint8Array);
    /**
     * Sets the JWE Key Management parameters to be used when encrypting. Use this method instead of
     * the header setters to configure algorithm inputs such as ECDH-ES "apu" (Agreement PartyUInfo)
     * and "apv" (Agreement PartyVInfo), or PBES2 "p2c" (PBES2 Count). The parameters are added to the
     * appropriate JOSE Header.
     */
    setKeyManagementParameters(parameters: t.JWEKeyManagementHeaderParameters): this;
    /** Sets the JWE Protected Header on the FlattenedEncrypt object. */
    setProtectedHeader(protectedHeader: t.JWEHeaderParameters): this;
    /** Sets the JWE Shared Unprotected Header on the FlattenedEncrypt object. */
    setSharedUnprotectedHeader(sharedUnprotectedHeader: t.JWEHeaderParameters): this;
    /** Sets the JWE Per-Recipient Unprotected Header on the FlattenedEncrypt object. */
    setUnprotectedHeader(unprotectedHeader: t.JWEHeaderParameters): this;
    /** Sets the Additional Authenticated Data on the FlattenedEncrypt object. */
    setAdditionalAuthenticatedData(aad: Uint8Array): this;
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
    /**
     * Encrypts and resolves the value of the Flattened JWE object.
     *
     * @param key Public Key or Secret to encrypt the JWE with. See
     *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
     */
    encrypt(key: t.KeyInput, options?: t.EncryptOptions): Promise<t.FlattenedJWE>;
}
