export function table(entries) {
    const out = { __proto__: null };
    for (const alg of Object.keys(entries)) {
        out[alg] = { ...entries[alg], alg };
    }
    return out;
}
