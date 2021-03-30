import globalThis from './global.js'

export default globalThis.crypto

export function isCryptoKey(key: unknown): key is CryptoKey {
  return key instanceof globalThis.CryptoKey
}
