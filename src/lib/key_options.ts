export function validateExtractableOption(extractable: unknown): boolean | undefined {
  if (extractable !== undefined && typeof extractable !== 'boolean') {
    throw new TypeError('"extractable" option must be a boolean')
  }

  return extractable
}
