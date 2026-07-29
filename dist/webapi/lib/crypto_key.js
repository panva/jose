const unusable = (name, prop = 'algorithm.name') => new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`);
export function checkUsage(key, usage) {
    if (usage && !key.usages.includes(usage)) {
        throw new TypeError(`CryptoKey does not support this operation, its usages must include ${usage}.`);
    }
}
export function checkCryptoKey(key, expected, usage) {
    const algorithm = key.algorithm;
    if (algorithm.name !== expected.name) {
        throw unusable(expected.name);
    }
    if (expected.hash && algorithm.hash?.name !== expected.hash) {
        throw unusable(expected.hash, 'algorithm.hash');
    }
    if (expected.namedCurve && algorithm.namedCurve !== expected.namedCurve) {
        throw unusable(expected.namedCurve, 'algorithm.namedCurve');
    }
    if (expected.length !== undefined && algorithm.length !== expected.length) {
        throw unusable(expected.length, 'algorithm.length');
    }
    checkUsage(key, usage);
}
