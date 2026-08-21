import { createSignature } from '../../lib/jws_sign.js';
import { JWSInvalid } from '../../util/errors.js';
import { assertNotSet } from '../../lib/helpers.js';
class IndividualSignature {
    #parent;
    state;
    constructor(sig, key, options) {
        this.#parent = sig;
        this.state = [undefined, undefined, key, options?.crit];
    }
    setProtectedHeader(protectedHeader) {
        assertNotSet(this.state[0], 'setProtectedHeader');
        this.state[0] = protectedHeader;
        return this;
    }
    setUnprotectedHeader(unprotectedHeader) {
        assertNotSet(this.state[1], 'setUnprotectedHeader');
        this.state[1] = unprotectedHeader;
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
        const encoded = [];
        let b64;
        for (let i = 0; i < this.#signatures.length; i++) {
            const signature = this.#signatures[i];
            const [protectedHeader, unprotectedHeader, key, crit] = signature.state;
            const [{ payload, ...rest }, signatureB64] = await createSignature({
                payload: this.#payload,
                protectedHeader,
                unprotectedHeader,
                crit,
                encoded,
            }, key);
            if (b64 === undefined) {
                b64 = signatureB64;
                jws.payload = payload;
            }
            else if (b64 !== signatureB64) {
                throw new JWSInvalid('inconsistent use of JWS Unencoded Payload (RFC7797)');
            }
            jws.signatures.push(rest);
        }
        return jws;
    }
}
