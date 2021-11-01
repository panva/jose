export default crypto

export function isCryptoKey(key: unknown): key is CryptoKey {
  try {
    return (
      key != null &&
      typeof (<CryptoKey>key).extractable === 'boolean' &&
      typeof (<CryptoKey>key).algorithm.name === 'string' &&
      typeof (<CryptoKey>key).type === 'string'
    )
  } catch {
    return false
  }
}
