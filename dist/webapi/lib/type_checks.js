export function assertUint8Array(input, label) {
    if (!(input instanceof Uint8Array)) {
        throw new TypeError(`${label} must be an instance of Uint8Array`);
    }
}
export function isObject(input) {
    if (typeof input !== 'object' ||
        input === null ||
        Object.prototype.toString.call(input) !== '[object Object]') {
        return false;
    }
    const prototype = Object.getPrototypeOf(input);
    return prototype === null || Object.getPrototypeOf(prototype) === null;
}
export function isJwkSet(input) {
    return (isObject(input) &&
        Array.isArray(input.keys) &&
        Array.from(input.keys).every(isObject));
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
