import { assertNotSet } from '../../lib/helpers.js';
import { createJWE } from '../../lib/jwe_encrypt.js';
import { assertUint8Array } from '../../lib/type_checks.js';
export class FlattenedEncrypt {
    #plaintext;
    #protectedHeader;
    #sharedUnprotectedHeader;
    #unprotectedHeader;
    #aad;
    #cek;
    #iv;
    #keyManagementParameters;
    constructor(plaintext) {
        assertUint8Array(plaintext, 'plaintext');
        this.#plaintext = plaintext;
    }
    setKeyManagementParameters(parameters) {
        assertNotSet(this.#keyManagementParameters, 'setKeyManagementParameters');
        this.#keyManagementParameters = parameters;
        return this;
    }
    setProtectedHeader(protectedHeader) {
        assertNotSet(this.#protectedHeader, 'setProtectedHeader');
        this.#protectedHeader = protectedHeader;
        return this;
    }
    setSharedUnprotectedHeader(sharedUnprotectedHeader) {
        assertNotSet(this.#sharedUnprotectedHeader, 'setSharedUnprotectedHeader');
        this.#sharedUnprotectedHeader = sharedUnprotectedHeader;
        return this;
    }
    setUnprotectedHeader(unprotectedHeader) {
        assertNotSet(this.#unprotectedHeader, 'setUnprotectedHeader');
        this.#unprotectedHeader = unprotectedHeader;
        return this;
    }
    setAdditionalAuthenticatedData(aad) {
        this.#aad = aad;
        return this;
    }
    setContentEncryptionKey(cek) {
        assertNotSet(this.#cek, 'setContentEncryptionKey');
        this.#cek = cek;
        return this;
    }
    setInitializationVector(iv) {
        assertNotSet(this.#iv, 'setInitializationVector');
        this.#iv = iv;
        return this;
    }
    async encrypt(key, options) {
        return createJWE([
            this.#plaintext,
            this.#protectedHeader,
            this.#unprotectedHeader,
            this.#sharedUnprotectedHeader,
            this.#aad,
            this.#cek,
            this.#iv,
            this.#keyManagementParameters,
            undefined,
            false,
        ], key, options);
    }
}
