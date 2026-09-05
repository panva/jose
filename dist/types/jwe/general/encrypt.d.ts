import type * as t from '../../types.d.ts';
/** Configures an individual recipient in a General JWE. */
export interface Recipient {
    /** Sets the JWE Per-Recipient Unprotected Header. May only be called once. */
    setUnprotectedHeader(unprotectedHeader: t.JWEHeaderParameters): Recipient;
    /**
     * Sets key management inputs such as ECDH-ES "apu"/"apv" or PBES2 "p2c". Use this method instead
     * of header setters; the resulting parameters are added to the JOSE header. May only be called
     * once.
     */
    setKeyManagementParameters(parameters: t.JWEKeyManagementHeaderParameters): Recipient;
    /**
     * Adds another recipient to the enclosing {@link GeneralEncrypt} and returns its configuration.
     *
     * @param key Public key or shared secret. See
     *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
     */
    addRecipient(key: t.KeyInput, options?: t.CritOption): Recipient;
    /**
     * Encrypts for all recipients on the enclosing {@link GeneralEncrypt}, using their configured
     * keys.
     */
    encrypt(): Promise<t.GeneralJWE>;
    /** Returns the enclosing {@link GeneralEncrypt} instance. */
    done(): GeneralEncrypt;
}
/** Builds and encrypts General JWE objects. */
export declare class GeneralEncrypt {
    #private;
    /**
     * Creates a General JWE encryptor.
     *
     * @param plaintext Binary representation of the plaintext to encrypt.
     */
    constructor(plaintext: Uint8Array);
    /**
     * Adds a recipient and returns its configuration.
     *
     * @param key Public key or shared secret. See
     *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
     */
    addRecipient(key: t.KeyInput, options?: t.CritOption): Recipient;
    /** Sets the JWE Protected Header. May only be called once. */
    setProtectedHeader(protectedHeader: t.JWEHeaderParameters): this;
    /** Sets the JWE Shared Unprotected Header. May only be called once. */
    setSharedUnprotectedHeader(sharedUnprotectedHeader: t.JWEHeaderParameters): this;
    /** Sets additional data to authenticate without encrypting it. */
    setAdditionalAuthenticatedData(aad: Uint8Array): this;
    /** Encrypts the plaintext as a General JWE. */
    encrypt(): Promise<t.GeneralJWE>;
}
