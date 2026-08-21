import { assertNotSet } from '../../lib/helpers.js';
import { assertUint8Array } from '../../lib/type_checks.js';
import { createJWE } from '../../lib/jwe_encrypt.js';
export class CompactEncrypt {
    #plaintext;
    #protectedHeader;
    #cek;
    #iv;
    #keyManagementParameters;
    constructor(plaintext) {
        assertUint8Array(plaintext, 'plaintext');
        this.#plaintext = plaintext;
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
    setProtectedHeader(protectedHeader) {
        assertNotSet(this.#protectedHeader, 'setProtectedHeader');
        this.#protectedHeader = protectedHeader;
        return this;
    }
    setKeyManagementParameters(parameters) {
        assertNotSet(this.#keyManagementParameters, 'setKeyManagementParameters');
        this.#keyManagementParameters = parameters;
        return this;
    }
    async encrypt(key, options) {
        const jwe = await createJWE([
            this.#plaintext,
            this.#protectedHeader,
            undefined,
            undefined,
            undefined,
            this.#cek,
            this.#iv,
            this.#keyManagementParameters,
            undefined,
            false,
        ], key, options);
        return [jwe.protected, jwe.encrypted_key, jwe.iv, jwe.ciphertext, jwe.tag].join('.');
    }
}
