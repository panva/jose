import * as crypto from 'crypto';
import * as util from 'util';
const webcrypto = crypto.webcrypto;
export default webcrypto;
export const isCryptoKey = util.types.isCryptoKey
    ? (obj) => util.types.isCryptoKey(obj)
    :
        (obj) => false;
