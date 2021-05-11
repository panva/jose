import * as crypto from 'crypto'
import * as util from 'util'

// @ts-expect-error
const webcrypto = <Crypto>crypto.webcrypto

export default webcrypto

let impl: (obj: unknown) => obj is CryptoKey

// @ts-expect-error
if (util.types.isCryptoKey) {
  impl = function isCryptoKey(obj): obj is CryptoKey {
    // @ts-expect-error
    return <boolean>util.types.isCryptoKey(obj)
  }
} else if (webcrypto) {
  impl = function isCryptoKey(obj): obj is CryptoKey {
    //@ts-expect-error
    return obj != null && obj instanceof webcrypto.CryptoKey;
  }
} else {
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  impl = (obj): obj is CryptoKey => false
}

export { impl as isCryptoKey }

function getHashLength(hash: KeyAlgorithm) {
  return parseInt(hash?.name.substr(4), 10)
}

function getNamedCurve(alg: string) {
  switch (alg) {
    case 'ES256':
      return 'P-256'
    case 'ES384':
      return 'P-384'
    case 'ES512':
      return 'P-521'
  }
}

export function getKeyObject(key: CryptoKey, alg?: string, usage?: Set<KeyUsage>) {
  if (!alg) {
    // @ts-expect-error
    return <crypto.KeyObject>crypto.KeyObject.from(key)
  }

  if (usage && !key.usages.find(Set.prototype.has.bind(usage))) {
    throw new TypeError('CryptoKey does not support this operation')
  }

  switch (alg) {
    case 'HS256':
    case 'HS384':
    case 'HS512':
      if (
        key.algorithm.name !== 'HMAC' ||
        getHashLength((<HmacKeyAlgorithm>key.algorithm).hash) !== parseInt(alg.substr(2), 10)
      ) {
        throw new TypeError('CryptoKey does not support this operation')
      }
      break
    case 'RS256':
    case 'RS384':
    case 'RS512':
      if (
        key.algorithm.name !== 'RSASSA-PKCS1-v1_5' ||
        getHashLength((<RsaHashedKeyAlgorithm>key.algorithm).hash) !== parseInt(alg.substr(2), 10)
      ) {
        throw new TypeError('CryptoKey does not support this operation')
      }
      break
    case 'PS256':
    case 'PS384':
    case 'PS512':
      if (
        key.algorithm.name !== 'RSA-PSS' ||
        getHashLength((<RsaHashedKeyAlgorithm>key.algorithm).hash) !== parseInt(alg.substr(2), 10)
      ) {
        throw new TypeError('CryptoKey does not support this operation')
      }
      break
    case 'ES256':
    case 'ES384':
    case 'ES512':
      if (
        key.algorithm.name !== 'ECDSA' ||
        (<EcKeyAlgorithm>key.algorithm).namedCurve !== getNamedCurve(alg)
      ) {
        throw new TypeError('CryptoKey does not support this operation')
      }
      break
    case 'A128GCM':
    case 'A192GCM':
    case 'A256GCM':
      if (
        key.algorithm.name !== 'AES-GCM' ||
        (<AesKeyAlgorithm>key.algorithm).length !== parseInt(alg.substr(1, 3), 10)
      ) {
        throw new TypeError('CryptoKey does not support this operation')
      }
      break
    case 'A128KW':
    case 'A192KW':
    case 'A256KW':
      if (
        key.algorithm.name !== 'AES-KW' ||
        (<AesKeyAlgorithm>key.algorithm).length !== parseInt(alg.substr(1, 3), 10)
      ) {
        throw new TypeError('CryptoKey does not support this operation')
      }
      break
    case 'ECDH-ES':
      if (key.algorithm.name !== 'ECDH') {
        throw new TypeError('CryptoKey does not support this operation')
      }
      break
    case 'PBES2-HS256+A128KW':
    case 'PBES2-HS384+A192KW':
    case 'PBES2-HS512+A256KW':
      if (key.algorithm.name !== 'PBKDF2') {
        throw new TypeError('CryptoKey does not support this operation')
      }
      break
    case 'RSA-OAEP':
    case 'RSA-OAEP-256':
    case 'RSA-OAEP-384':
    case 'RSA-OAEP-512':
      if (
        key.algorithm.name !== 'RSA-OAEP' ||
        getHashLength((<RsaHashedKeyAlgorithm>key.algorithm).hash) !==
          (parseInt(alg.substr(9), 10) || 1)
      ) {
        throw new TypeError('CryptoKey does not support this operation')
      }
      break
    default:
      throw new TypeError('CryptoKey does not support this operation')
  }

  // @ts-expect-error
  return <crypto.KeyObject>crypto.KeyObject.from(key)
}
