import { isCryptoKey } from './webcrypto.js';
import isKeyObject from './is_key_object.js';
export default (key) => isKeyObject(key) || isCryptoKey(key);
const types = ['KeyObject'];
if (parseInt(process.versions.node) >= 16) {
    types.push('CryptoKey');
}
export { types };
