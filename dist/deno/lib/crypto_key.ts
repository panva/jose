import { isCloudflareWorkers, isNodeJs } from '../runtime/env.ts'

function unusable(name: string | number, prop = 'algorithm.name') {
  return new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`)
}

function isAlgorithm<T = KeyAlgorithm>(algorithm: any, name: string): algorithm is T {
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

function checkUsage(key: CryptoKey, usages: KeyUsage[]) {
  if (usages.length && !usages.some((expected) => key.usages.includes(expected))) {
    let msg = 'CryptoKey does not support this operation, its usages must include '
    if (usages.length > 2) {
      const last = usages.pop()
      msg += `one of ${usages.join(', ')}, or ${last}.`
    } else if (usages.length === 2) {
      msg += `one of ${usages[0]} or ${usages[1]}.`
    } else {
      msg += `${usages[0]}.`
    }

    throw new TypeError(msg)
  }
}

export function checkSigCryptoKey(key: CryptoKey, alg: string, ...usages: KeyUsage[]) {
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
    case isNodeJs() && 'EdDSA': {
      if (key.algorithm.name !== 'NODE-ED25519' && key.algorithm.name !== 'NODE-ED448')
        throw unusable('NODE-ED25519 or NODE-ED448')
      break
    }
    case isCloudflareWorkers() && 'EdDSA': {
      if (!isAlgorithm(key.algorithm, 'NODE-ED25519')) throw unusable('NODE-ED25519')
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

  checkUsage(key, usages)
}

export function checkEncCryptoKey(key: CryptoKey, alg: string, ...usages: KeyUsage[]) {
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
    case 'ECDH-ES':
      if (!isAlgorithm(key.algorithm, 'ECDH')) throw unusable('ECDH')
      break
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

  checkUsage(key, usages)
}
