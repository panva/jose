import { KeyObject } from 'crypto';
import * as util from 'util';
let impl;
if (util.types.isKeyObject) {
    impl = function isKeyObject(obj) {
        return util.types.isKeyObject(obj);
    };
}
else {
    impl = function isKeyObject(obj) {
        return obj != null && obj instanceof KeyObject;
    };
}
export default impl;
