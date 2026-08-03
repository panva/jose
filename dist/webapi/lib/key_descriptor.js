export function table(entries) {
    const out = { __proto__: null };
    for (const alg in entries) {
        out[alg] = { ...entries[alg], alg };
    }
    return out;
}
