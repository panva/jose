import { prepareVerify, verifyCompact } from '../../lib/jws_verify.js';
export async function compactVerify(jws, key, options) {
    const verified = await verifyCompact(jws, prepareVerify(options), key);
    const result = { payload: verified.payload, protectedHeader: verified.parsedProt };
    if (typeof key === 'function') {
        return { ...result, key: verified.key };
    }
    return result;
}
