export function isObject(input) {
    if (typeof input !== 'object' ||
        input === null ||
        Object.prototype.toString.call(input) !== '[object Object]') {
        return false;
    }
    const prototype = Object.getPrototypeOf(input);
    if (prototype === null) {
        return true;
    }
    let proto = prototype;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    return prototype === proto;
}
export function isDisjoint(...headers) {
    const parameters = new Set();
    for (const header of headers) {
        if (!header)
            continue;
        for (const parameter of Object.keys(header)) {
            if (parameters.has(parameter)) {
                return false;
            }
            parameters.add(parameter);
        }
    }
    return true;
}
export const isJWK = (key) => isObject(key) && typeof key.kty === 'string';
export const isPrivateJWK = (key) => key.kty !== 'oct' &&
    ((key.kty === 'AKP' && typeof key.priv === 'string') || typeof key.d === 'string');
export const isPublicJWK = (key) => key.kty !== 'oct' && key.d === undefined && key.priv === undefined;
export const isSecretJWK = (key) => key.kty === 'oct' && typeof key.k === 'string';
