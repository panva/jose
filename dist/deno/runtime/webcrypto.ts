export default crypto

export const isCryptoKey = (key: unknown): key is CryptoKey => key instanceof CryptoKey
