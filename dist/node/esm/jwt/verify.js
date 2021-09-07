import verify from '../jws/compact/verify.js';
import jwtPayload from '../lib/jwt_claims_set.js';
import { JWTInvalid } from '../util/errors.js';
async function jwtVerify(jwt, key, options) {
    var _a;
    const verified = await verify(jwt, key, options);
    if (((_a = verified.protectedHeader.crit) === null || _a === void 0 ? void 0 : _a.includes('b64')) && verified.protectedHeader.b64 === false) {
        throw new JWTInvalid('JWTs MUST NOT use unencoded payload');
    }
    const payload = jwtPayload(verified.protectedHeader, verified.payload, options);
    return { payload, protectedHeader: verified.protectedHeader };
}
export { jwtVerify };
export default jwtVerify;
