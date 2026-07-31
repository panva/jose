import { createSignature } from '../../lib/jws_sign.js';
import { JWSInvalid } from '../../util/errors.js';
import { assertNotSet } from '../../lib/helpers.js';
class IndividualSignature {
    #parent;
    protectedHeader;
    unprotectedHeader;
    options;
    key;
    constructor(sig, key, options) {
        this.#parent = sig;
        this.key = key;
        this.options = options;
    }
    setProtectedHeader(protectedHeader) {
        assertNotSet(this.protectedHeader, 'setProtectedHeader');
        this.protectedHeader = protectedHeader;
        return this;
    }
    setUnprotectedHeader(unprotectedHeader) {
        assertNotSet(this.unprotectedHeader, 'setUnprotectedHeader');
        this.unprotectedHeader = unprotectedHeader;
        return this;
    }
    addSignature(...args) {
        return this.#parent.addSignature(...args);
    }
    sign(...args) {
        return this.#parent.sign(...args);
    }
    done() {
        return this.#parent;
    }
}
export class GeneralSign {
    #payload;
    #signatures = [];
    constructor(payload) {
        this.#payload = payload;
    }
    addSignature(key, options) {
        const signature = new IndividualSignature(this, key, options);
        this.#signatures.push(signature);
        return signature;
    }
    async sign() {
        if (!this.#signatures.length) {
            throw new JWSInvalid('at least one signature must be added');
        }
        if (!(this.#payload instanceof Uint8Array)) {
            throw new TypeError('payload must be an instance of Uint8Array');
        }
        const jws = {
            signatures: [],
            payload: '',
        };
        const encoded = {};
        for (let i = 0; i < this.#signatures.length; i++) {
            const signature = this.#signatures[i];
            if (!signature.protectedHeader && !signature.unprotectedHeader) {
                throw new JWSInvalid('either setProtectedHeader or setUnprotectedHeader must be called before #sign()');
            }
            const { payload, ...rest } = await createSignature({
                payload: this.#payload,
                protectedHeader: signature.protectedHeader,
                unprotectedHeader: signature.unprotectedHeader,
                crit: signature.options?.crit,
                encoded,
            }, signature.key);
            if (signature.unprotectedHeader) {
                rest.header = signature.unprotectedHeader;
            }
            if (i === 0) {
                jws.payload = payload;
            }
            else if (jws.payload !== payload) {
                throw new JWSInvalid('inconsistent use of JWS Unencoded Payload (RFC7797)');
            }
            jws.signatures.push(rest);
        }
        return jws;
    }
}
