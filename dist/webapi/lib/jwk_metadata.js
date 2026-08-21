export function snapshotJwk(jwk) {
    return { __proto__: null, ...jwk };
}
export function normalizeJwk(jwk) {
    const normalized = snapshotJwk(jwk);
    if (normalized.ext !== undefined && typeof normalized.ext !== 'boolean') {
        throw new TypeError('"ext" (Extractable) Parameter must be a boolean');
    }
    if (normalized.key_ops !== undefined) {
        const value = normalized.key_ops;
        const keyOps = Array.isArray(value) ? [...value] : undefined;
        if (!keyOps ||
            keyOps.some((operation) => typeof operation !== 'string') ||
            new Set(keyOps).size !== keyOps.length) {
            throw new TypeError('"key_ops" (Key Operations) Parameter must be an array of unique strings');
        }
        normalized.key_ops = keyOps;
    }
    return normalized;
}
