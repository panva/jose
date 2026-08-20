export function validateExtractableOption(extractable: unknown): void {
  if (extractable !== undefined && typeof extractable !== 'boolean') {
    throw new TypeError('"extractable" option must be a boolean')
  }
}
