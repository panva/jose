import { FlattenedEncrypt } from '../flattened/encrypt.js';
import { assertNotSet } from '../../lib/helpers.js';
import { JWEInvalid } from '../../util/errors.js';
import { generateCek } from '../../lib/content_encryption.js';
import { encryptKeyManagement } from '../../lib/key_management.js';
import { encode as b64u } from '../../util/base64url.js';
import { validateCritDuplicates } from '../../lib/options.js';
import { checkEncryptHeaders, encryptJWE } from '../../lib/jwe_encrypt.js';
import { prepareKey } from '../../lib/key.js';
import { jweAlgorithm } from '../../lib/jwe_algorithms.js';
class IndividualRecipient {
    #parent;
    unprotectedHeader;
    keyManagementParameters;
    key;
    options;
    constructor(enc, key, options) {
        this.#parent = enc;
        this.key = key;
        this.options = options;
    }
    setUnprotectedHeader(unprotectedHeader) {
        assertNotSet(this.unprotectedHeader, 'setUnprotectedHeader');
        this.unprotectedHeader = unprotectedHeader;
        return this;
    }
    setKeyManagementParameters(parameters) {
        assertNotSet(this.keyManagementParameters, 'setKeyManagementParameters');
        this.keyManagementParameters = parameters;
        return this;
    }
    addRecipient(...args) {
        return this.#parent.addRecipient(...args);
    }
    encrypt(...args) {
        return this.#parent.encrypt(...args);
    }
    done() {
        return this.#parent;
    }
}
export class GeneralEncrypt {
    #plaintext;
    #recipients = [];
    #protectedHeader;
    #unprotectedHeader;
    #aad;
    constructor(plaintext) {
        this.#plaintext = plaintext;
    }
    addRecipient(key, options) {
        const recipient = new IndividualRecipient(this, key, { crit: options?.crit });
        this.#recipients.push(recipient);
        return recipient;
    }
    setProtectedHeader(protectedHeader) {
        assertNotSet(this.#protectedHeader, 'setProtectedHeader');
        this.#protectedHeader = protectedHeader;
        return this;
    }
    setSharedUnprotectedHeader(sharedUnprotectedHeader) {
        assertNotSet(this.#unprotectedHeader, 'setSharedUnprotectedHeader');
        this.#unprotectedHeader = sharedUnprotectedHeader;
        return this;
    }
    setAdditionalAuthenticatedData(aad) {
        this.#aad = aad;
        return this;
    }
    async encrypt() {
        if (!this.#recipients.length) {
            throw new JWEInvalid('at least one recipient must be added');
        }
        if (!(this.#plaintext instanceof Uint8Array)) {
            throw new TypeError('plaintext must be an instance of Uint8Array');
        }
        if (this.#recipients.length === 1) {
            const [recipient] = this.#recipients;
            const flattened = await new FlattenedEncrypt(this.#plaintext)
                .setAdditionalAuthenticatedData(this.#aad)
                .setProtectedHeader(this.#protectedHeader)
                .setSharedUnprotectedHeader(this.#unprotectedHeader)
                .setUnprotectedHeader(recipient.unprotectedHeader)
                .setKeyManagementParameters(recipient.keyManagementParameters)
                .encrypt(recipient.key, { ...recipient.options });
            const jwe = {
                ciphertext: flattened.ciphertext,
                iv: flattened.iv,
                recipients: [{}],
                tag: flattened.tag,
            };
            if (flattened.aad)
                jwe.aad = flattened.aad;
            if (flattened.protected)
                jwe.protected = flattened.protected;
            if (flattened.unprotected)
                jwe.unprotected = flattened.unprotected;
            if (flattened.encrypted_key)
                jwe.recipients[0].encrypted_key = flattened.encrypted_key;
            if (flattened.header)
                jwe.recipients[0].header = flattened.header;
            return jwe;
        }
        validateCritDuplicates(JWEInvalid, this.#protectedHeader);
        let enc;
        const inputs = [];
        const checked = [];
        for (let i = 0; i < this.#recipients.length; i++) {
            const recipient = this.#recipients[i];
            const input = {
                plaintext: this.#plaintext,
                protectedHeader: this.#protectedHeader,
                unprotectedHeader: recipient.unprotectedHeader,
                sharedUnprotectedHeader: this.#unprotectedHeader,
                aad: this.#aad,
                keyManagementParameters: recipient.keyManagementParameters,
                crit: recipient.options.crit,
                unprotectedParameters: true,
            };
            const headers = checkEncryptHeaders(input);
            inputs.push(input);
            checked.push(headers);
            if (headers.alg === 'dir' || headers.alg === 'ECDH-ES') {
                throw new JWEInvalid('"dir" and "ECDH-ES" alg may only be used with a single recipient');
            }
            if (!enc) {
                enc = headers.enc;
            }
            else if (enc !== headers.enc) {
                throw new JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter must be the same for all recipients');
            }
        }
        const cek = generateCek(checked[0].encEntry);
        const jwe = {
            ciphertext: '',
            recipients: [],
        };
        for (let i = 0; i < this.#recipients.length; i++) {
            const recipient = this.#recipients[i];
            const target = {};
            jwe.recipients.push(target);
            if (i === 0) {
                const flattened = await encryptJWE({ ...inputs[0], cek }, checked[0], recipient.key);
                jwe.ciphertext = flattened.ciphertext;
                jwe.iv = flattened.iv;
                jwe.tag = flattened.tag;
                if (flattened.aad)
                    jwe.aad = flattened.aad;
                if (flattened.protected)
                    jwe.protected = flattened.protected;
                if (flattened.unprotected)
                    jwe.unprotected = flattened.unprotected;
                target.encrypted_key = flattened.encrypted_key;
                if (flattened.header)
                    target.header = flattened.header;
                continue;
            }
            const { alg } = checked[i];
            const k = await prepareKey(jweAlgorithm(alg), recipient.key, 'encrypt');
            const { encryptedKey, parameters } = await encryptKeyManagement(alg, checked[i].encEntry, k, cek, recipient.keyManagementParameters);
            target.encrypted_key = b64u(encryptedKey);
            if (recipient.unprotectedHeader || parameters)
                target.header = { ...recipient.unprotectedHeader, ...parameters };
        }
        return jwe;
    }
}
