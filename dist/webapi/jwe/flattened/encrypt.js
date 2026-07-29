import { unprotected, assertNotSet } from '../../lib/helpers.js';
import { JWEInvalid } from '../../util/errors.js';
import { createJWE } from '../../lib/jwe_encrypt.js';
import { validateCritDuplicates } from '../../lib/options.js';
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
        if (!(plaintext instanceof Uint8Array)) {
            throw new TypeError('plaintext must be an instance of Uint8Array');
        }
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
        if (!this.#protectedHeader && !this.#unprotectedHeader && !this.#sharedUnprotectedHeader) {
            throw new JWEInvalid('either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()');
        }
        validateCritDuplicates(JWEInvalid, this.#protectedHeader);
        return createJWE({
            plaintext: this.#plaintext,
            protectedHeader: this.#protectedHeader,
            unprotectedHeader: this.#unprotectedHeader,
            sharedUnprotectedHeader: this.#sharedUnprotectedHeader,
            aad: this.#aad,
            cek: this.#cek,
            iv: this.#iv,
            keyManagementParameters: this.#keyManagementParameters,
            crit: options?.crit,
            unprotectedParameters: options ? unprotected in options : false,
        }, key);
    }
}
