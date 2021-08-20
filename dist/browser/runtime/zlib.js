import { JOSENotSupported } from '../util/errors.js';
export const inflate = async () => {
    throw new JOSENotSupported('JWE "zip" (Compression Algorithm) Header Parameter is not supported by your javascript runtime. You need to use the `inflateRaw` decrypt option to provide Inflate Raw implementation, e.g. using the "pako" module.');
};
export const deflate = async () => {
    throw new JOSENotSupported('JWE "zip" (Compression Algorithm) Header Parameter is not supported by your javascript runtime.');
};
