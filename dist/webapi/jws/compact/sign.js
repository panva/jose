import { FlattenedSign } from '../flattened/sign.js';
import { unencodedPayload } from '../../lib/jws_sign.js';
export class CompactSign {
    #flattened;
    #protectedHeader;
    constructor(payload) {
        this.#flattened = new FlattenedSign(payload);
    }
    setProtectedHeader(protectedHeader) {
        this.#flattened.setProtectedHeader(protectedHeader);
        this.#protectedHeader = protectedHeader;
        return this;
    }
    async sign(key, options) {
        if (unencodedPayload(this.#protectedHeader)) {
            throw new TypeError('use the flattened module for creating JWS with b64: false');
        }
        const jws = await this.#flattened.sign(key, options);
        return `${jws.protected}.${jws.payload}.${jws.signature}`;
    }
}
