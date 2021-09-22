import { toSPKI as exportPublic } from '../runtime/asn1.js';
import { toPKCS8 as exportPrivate } from '../runtime/asn1.js';
import { fromKeyLike } from '../jwk/from_key_like.js';
export async function exportSPKI(key) {
    return exportPublic(key);
}
export async function exportPKCS8(key) {
    return exportPrivate(key);
}
export const exportJWK = (...args) => fromKeyLike(...args);
