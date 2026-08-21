export function validateExtractableOption(extractable) {
    if (extractable !== undefined && typeof extractable !== 'boolean') {
        throw new TypeError('"extractable" option must be a boolean');
    }
    return extractable;
}
