export function assertCryptoKey(key) {
    if (!isCryptoKey(key)) {
        throw new Error('CryptoKey instance expected');
    }
}
export const isCryptoKey = (key) => key?.[Symbol.toStringTag] === 'CryptoKey';
export const isKeyObject = (key) => key?.[Symbol.toStringTag] === 'KeyObject';
export const isKeyLike = (key) => isCryptoKey(key) || isKeyObject(key);
