import { prepareVerify, verifyCompact } from '../../lib/jws_verify.js';
export async function compactVerify(jws, key, options) {
    const verified = await verifyCompact(jws, prepareVerify(options), key);
    const result = { payload: verified[0], protectedHeader: verified[1] };
    if (typeof key === 'function') {
        return { ...result, key: verified[3] };
    }
    return result;
}
