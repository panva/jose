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
    state;
    constructor(enc, key, crit) {
        this.#parent = enc;
        this.state = [undefined, undefined, key, crit];
    }
    setUnprotectedHeader(unprotectedHeader) {
        assertNotSet(this.state[0], 'setUnprotectedHeader');
        this.state[0] = unprotectedHeader;
        return this;
    }
    setKeyManagementParameters(parameters) {
        assertNotSet(this.state[1], 'setKeyManagementParameters');
        this.state[1] = parameters;
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
function copyOptionalMembers(flattened, jwe, recipient) {
    const { aad, protected: protectedHeader, unprotected, header } = flattened;
    if (aad)
        jwe.aad = aad;
    if (protectedHeader)
        jwe.protected = protectedHeader;
    if (unprotected)
        jwe.unprotected = unprotected;
    if (header)
        recipient.header = header;
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
        const recipient = new IndividualRecipient(this, key, options?.crit);
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
            const [unprotectedHeader, keyManagementParameters, key, crit] = recipient.state;
            const flattened = await new FlattenedEncrypt(this.#plaintext)
                .setAdditionalAuthenticatedData(this.#aad)
                .setProtectedHeader(this.#protectedHeader)
                .setSharedUnprotectedHeader(this.#unprotectedHeader)
                .setUnprotectedHeader(unprotectedHeader)
                .setKeyManagementParameters(keyManagementParameters)
                .encrypt(key, { crit });
            const jwe = {
                ciphertext: flattened.ciphertext,
                iv: flattened.iv,
                recipients: [{}],
                tag: flattened.tag,
            };
            if (flattened.encrypted_key)
                jwe.recipients[0].encrypted_key = flattened.encrypted_key;
            copyOptionalMembers(flattened, jwe, jwe.recipients[0]);
            return jwe;
        }
        validateCritDuplicates(JWEInvalid, this.#protectedHeader);
        let enc;
        const inputs = [];
        const checked = [];
        for (let i = 0; i < this.#recipients.length; i++) {
            const recipient = this.#recipients[i];
            const [unprotectedHeader, keyManagementParameters, , crit] = recipient.state;
            const input = [
                this.#plaintext,
                this.#protectedHeader,
                unprotectedHeader,
                this.#unprotectedHeader,
                this.#aad,
                undefined,
                undefined,
                keyManagementParameters,
                crit,
                true,
            ];
            const headers = checkEncryptHeaders(input);
            inputs.push(input);
            checked.push(headers);
            if (headers[1] === 'dir' || headers[1] === 'ECDH-ES') {
                throw new JWEInvalid(`"${headers[1]}" alg may only have a single recipient`);
            }
            if (!enc) {
                enc = headers[2];
            }
            else if (enc !== headers[2]) {
                throw new JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter must be the same for all recipients');
            }
        }
        const cek = generateCek(checked[0][3]);
        const jwe = {
            ciphertext: '',
            recipients: [],
        };
        for (let i = 0; i < this.#recipients.length; i++) {
            const recipient = this.#recipients[i];
            const [unprotectedHeader, keyManagementParameters, key] = recipient.state;
            const target = {};
            jwe.recipients.push(target);
            if (i === 0) {
                inputs[0][5] = cek;
                const flattened = await encryptJWE(inputs[0], checked[0], key);
                jwe.ciphertext = flattened.ciphertext;
                jwe.iv = flattened.iv;
                jwe.tag = flattened.tag;
                target.encrypted_key = flattened.encrypted_key;
                copyOptionalMembers(flattened, jwe, target);
                continue;
            }
            const [, alg, , encEntry] = checked[i];
            const k = await prepareKey(jweAlgorithm(alg), key, 'encrypt');
            const [, encryptedKey, parameters] = await encryptKeyManagement(alg, encEntry, k, cek, keyManagementParameters);
            target.encrypted_key = b64u(encryptedKey);
            if (unprotectedHeader || parameters)
                target.header = { ...unprotectedHeader, ...parameters };
        }
        return jwe;
    }
}
