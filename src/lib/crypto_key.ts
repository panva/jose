import type * as types from '../types.d.ts'

const unusable = (name: string | number, prop = 'algorithm.name') =>
  new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`)

const isAlgorithm = <T extends KeyAlgorithm>(
  algorithm: KeyAlgorithm,
  name: string,
): algorithm is T => algorithm.name === name

function getHashLength(hash: KeyAlgorithm) {
  return parseInt(hash.name.slice(4), 10)
}

function checkHashLength(algorithm: { hash: KeyAlgorithm }, expected: number) {
  const actual = getHashLength(algorithm.hash)
  if (actual !== expected) throw unusable(`SHA-${expected}`, 'algorithm.hash')
}

function checkUsage(key: types.CryptoKey, usage?: KeyUsage) {
  if (usage && !key.usages.includes(usage)) {
    throw new TypeError(
      `CryptoKey does not support this operation, its usages must include ${usage}.`,
    )
  }
}

export function checkEncCryptoKey(key: types.CryptoKey, alg: string, usage?: KeyUsage): void {
  switch (alg) {
    case 'A128GCM':
    case 'A192GCM':
    case 'A256GCM': {
      if (!isAlgorithm<AesKeyAlgorithm>(key.algorithm, 'AES-GCM')) throw unusable('AES-GCM')
      const expected = parseInt(alg.slice(1, 4), 10)
      const actual = key.algorithm.length
      if (actual !== expected) throw unusable(expected, 'algorithm.length')
      break
    }
    case 'A128KW':
    case 'A192KW':
    case 'A256KW': {
      if (!isAlgorithm<AesKeyAlgorithm>(key.algorithm, 'AES-KW')) throw unusable('AES-KW')
      const expected = parseInt(alg.slice(1, 4), 10)
      const actual = key.algorithm.length
      if (actual !== expected) throw unusable(expected, 'algorithm.length')
      break
    }
    case 'ECDH': {
      switch (key.algorithm.name) {
        case 'ECDH':
        case 'X25519':
          break
        default:
          throw unusable('ECDH or X25519')
      }
      break
    }
    case 'PBES2-HS256+A128KW':
    case 'PBES2-HS384+A192KW':
    case 'PBES2-HS512+A256KW':
      if (!isAlgorithm(key.algorithm, 'PBKDF2')) throw unusable('PBKDF2')
      break
    case 'RSA-OAEP':
    case 'RSA-OAEP-256':
    case 'RSA-OAEP-384':
    case 'RSA-OAEP-512': {
      if (!isAlgorithm<RsaHashedKeyAlgorithm>(key.algorithm, 'RSA-OAEP')) throw unusable('RSA-OAEP')
      checkHashLength(key.algorithm, parseInt(alg.slice(9), 10) || 1)
      break
    }
    default:
      throw new TypeError('CryptoKey does not support this operation')
  }

  checkUsage(key, usage)
}
