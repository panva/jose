import verify from '../flattened/verify.js';
import { JWSInvalid } from '../../util/errors.js';
import { decoder } from '../../lib/buffer_utils.js';
async function compactVerify(jws, key, options) {
    if (jws instanceof Uint8Array) {
        jws = decoder.decode(jws);
    }
    if (typeof jws !== 'string') {
        throw new JWSInvalid('Compact JWS must be a string or Uint8Array');
    }
    const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split('.');
    if (length !== 3) {
        throw new JWSInvalid('Invalid Compact JWS');
    }
    const verified = await verify({
        payload: (payload || undefined),
        protected: protectedHeader || undefined,
        signature: (signature || undefined),
    }, key, options);
    return { payload: verified.payload, protectedHeader: verified.protectedHeader };
}
export { compactVerify };
export default compactVerify;
