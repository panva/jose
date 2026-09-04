import type * as t from '../../types.d.ts';
/** Configures an individual recipient in a General JWE. */
export interface Recipient {
    /** Sets the JWE Per-Recipient Unprotected Header on the Recipient object. */
    setUnprotectedHeader(unprotectedHeader: t.JWEHeaderParameters): Recipient;
    /**
     * Sets the JWE Key Management parameters to be used when encrypting. Use this method instead of
     * the header setters to configure algorithm inputs such as ECDH-ES "apu" (Agreement PartyUInfo)
     * and "apv" (Agreement PartyVInfo), or PBES2 "p2c" (PBES2 Count). The parameters are added to the
     * appropriate JOSE Header.
     */
    setKeyManagementParameters(parameters: t.JWEKeyManagementHeaderParameters): Recipient;
    /**
     * A shorthand for calling {@link GeneralEncrypt.addRecipient addRecipient()} on the enclosing
     * {@link GeneralEncrypt} instance.
     *
     * @param key Public Key or Secret to encrypt the Content Encryption Key for the recipient with.
     *   See {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
     */
    addRecipient(key: t.KeyInput, options?: t.CritOption): Recipient;
    /**
     * A shorthand for calling {@link GeneralEncrypt.encrypt encrypt()} on the enclosing
     * {@link GeneralEncrypt} instance. Takes no arguments — each recipient's key is supplied to
     * {@link addRecipient}.
     */
    encrypt(): Promise<t.GeneralJWE>;
    /** Returns the enclosing {@link GeneralEncrypt} instance */
    done(): GeneralEncrypt;
}
/** Builds and encrypts General JWE objects. */
export declare class GeneralEncrypt {
    #private;
    /**
     * {@link GeneralEncrypt} constructor
     *
     * @param plaintext Binary representation of the plaintext to encrypt.
     */
    constructor(plaintext: Uint8Array);
    /**
     * Adds an additional recipient for the General JWE object.
     *
     * @param key Public Key or Secret to encrypt the Content Encryption Key for the recipient with.
     *   See {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
     */
    addRecipient(key: t.KeyInput, options?: t.CritOption): Recipient;
    /** Sets the JWE Protected Header on the GeneralEncrypt object. */
    setProtectedHeader(protectedHeader: t.JWEHeaderParameters): this;
    /** Sets the JWE Shared Unprotected Header on the GeneralEncrypt object. */
    setSharedUnprotectedHeader(sharedUnprotectedHeader: t.JWEHeaderParameters): this;
    /** Sets the Additional Authenticated Data on the GeneralEncrypt object. */
    setAdditionalAuthenticatedData(aad: Uint8Array): this;
    /** Encrypts and resolves the value of the General JWE object. */
    encrypt(): Promise<t.GeneralJWE>;
}
