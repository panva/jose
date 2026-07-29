import { JWSInvalid } from '../../util/errors.js';
import { createSignature } from '../../lib/jws_sign.js';
import { assertNotSet } from '../../lib/helpers.js';
export class FlattenedSign {
    #payload;
    #protectedHeader;
    #unprotectedHeader;
    constructor(payload) {
        if (!(payload instanceof Uint8Array)) {
            throw new TypeError('payload must be an instance of Uint8Array');
        }
        this.#payload = payload;
    }
    setProtectedHeader(protectedHeader) {
        assertNotSet(this.#protectedHeader, 'setProtectedHeader');
        this.#protectedHeader = protectedHeader;
        return this;
    }
    setUnprotectedHeader(unprotectedHeader) {
        assertNotSet(this.#unprotectedHeader, 'setUnprotectedHeader');
        this.#unprotectedHeader = unprotectedHeader;
        return this;
    }
    async sign(key, options) {
        if (!this.#protectedHeader && !this.#unprotectedHeader) {
            throw new JWSInvalid('either setProtectedHeader or setUnprotectedHeader must be called before #sign()');
        }
        const jws = await createSignature({
            payload: this.#payload,
            protectedHeader: this.#protectedHeader,
            unprotectedHeader: this.#unprotectedHeader,
            crit: options?.crit,
        }, key);
        if (this.#unprotectedHeader) {
            jws.header = this.#unprotectedHeader;
        }
        return jws;
    }
}
