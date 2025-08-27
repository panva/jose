import type * as types from '../types.d.ts'

function unusable(name: string | number, prop = 'algorithm.name') {
  return new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`)
}

function isAlgorithm<T extends KeyAlgorithm>(
  algorithm: KeyAlgorithm,
  name: string,
): algorithm is T {
  return algorithm.name === name
}

function getHashLength(hash: KeyAlgorithm) {
  return parseInt(hash.name.slice(4), 10)
}

function getNamedCurve(alg: string) {
  switch (alg) {
    case 'ES256':
      return 'P-256'
    case 'ES384':
      return 'P-384'
    case 'ES512':
      return 'P-521'
    default:
      throw new Error('unreachable')
  }
}

function checkUsage(key: types.CryptoKey, usage?: KeyUsage) {
  if (usage && !key.usages.includes(usage)) {
    throw new TypeError(
      `CryptoKey does not support this operation, its usages must include ${usage}.`,
    )
  }
}

export function checkSigCryptoKey(key: types.CryptoKey, alg: string, usage: KeyUsage) {
  switch (alg) {
    case 'HS256':
    case 'HS384':
    case 'HS512': {
      if (!isAlgorithm<HmacKeyAlgorithm>(key.algorithm, 'HMAC')) throw unusable('HMAC')
      const expected = parseInt(alg.slice(2), 10)
      const actual = getHashLength(key.algorithm.hash)
      if (actual !== expected) throw unusable(`SHA-${expected}`, 'algorithm.hash')
      break
    }
    case 'RS256':
    case 'RS384':
    case 'RS512': {
      if (!isAlgorithm<RsaHashedKeyAlgorithm>(key.algorithm, 'RSASSA-PKCS1-v1_5'))
        throw unusable('RSASSA-PKCS1-v1_5')
      const expected = parseInt(alg.slice(2), 10)
      const actual = getHashLength(key.algorithm.hash)
      if (actual !== expected) throw unusable(`SHA-${expected}`, 'algorithm.hash')
      break
    }
    case 'PS256':
    case 'PS384':
    case 'PS512': {
      if (!isAlgorithm<RsaHashedKeyAlgorithm>(key.algorithm, 'RSA-PSS')) throw unusable('RSA-PSS')
      const expected = parseInt(alg.slice(2), 10)
      const actual = getHashLength(key.algorithm.hash)
      if (actual !== expected) throw unusable(`SHA-${expected}`, 'algorithm.hash')
      break
    }
    case 'Ed25519': // Fall through
    case 'EdDSA': {
      if (!isAlgorithm(key.algorithm, 'Ed25519')) throw unusable('Ed25519')
      break
    }
    case 'ML-DSA-44': // Fall through
    case 'ML-DSA-65': // Fall through
    case 'ML-DSA-87': {
      if (!isAlgorithm(key.algorithm, alg)) throw unusable(alg)
      break
    }
    case 'ES256':
    case 'ES384':
    case 'ES512': {
      if (!isAlgorithm<EcKeyAlgorithm>(key.algorithm, 'ECDSA')) throw unusable('ECDSA')
      const expected = getNamedCurve(alg)
      const actual = key.algorithm.namedCurve
      if (actual !== expected) throw unusable(expected, 'algorithm.namedCurve')
      break
    }
    default:
      throw new TypeError('CryptoKey does not support this operation')
  }

  checkUsage(key, usage)
}

export function checkEncCryptoKey(key: types.CryptoKey, alg: string, usage?: KeyUsage) {
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
      const expected = parseInt(alg.slice(9), 10) || 1
      const actual = getHashLength(key.algorithm.hash)
      if (actual !== expected) throw unusable(`SHA-${expected}`, 'algorithm.hash')
      break
    }
    default:
      throw new TypeError('CryptoKey does not support this operation')
  }

  checkUsage(key, usage)
}
