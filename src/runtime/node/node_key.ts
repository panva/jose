import { constants } from 'crypto'
import type { KeyObject, SignKeyObjectInput } from 'crypto'

import getNamedCurve from './get_named_curve.js'
import { JOSENotSupported } from '../../util/errors.js'
import checkModulusLength from './check_modulus_length.js'

const ecCurveAlgMap = new Map([
  ['ES256', 'P-256'],
  ['ES256K', 'secp256k1'],
  ['ES384', 'P-384'],
  ['ES512', 'P-521'],
])

export default function keyForCrypto(alg: string, key: KeyObject): KeyObject | SignKeyObjectInput {
  switch (alg) {
    case 'EdDSA':
      if (!['ed25519', 'ed448'].includes(key.asymmetricKeyType!)) {
        throw new TypeError(
          'Invalid key for this operation, its asymmetricKeyType must be ed25519 or ed448',
        )
      }

      return key

    case 'RS256':
    case 'RS384':
    case 'RS512':
      if (key.asymmetricKeyType !== 'rsa') {
        throw new TypeError('Invalid key for this operation, its asymmetricKeyType must be rsa')
      }
      checkModulusLength(key, alg)

      return key

    case 'PS256':
    case 'PS384':
    case 'PS512':
      if (key.asymmetricKeyType !== 'rsa') {
        throw new TypeError('Invalid key for this operation, its asymmetricKeyType must be rsa')
      }
      checkModulusLength(key, alg)

      return {
        key,
        padding: constants.RSA_PKCS1_PSS_PADDING,
        saltLength: constants.RSA_PSS_SALTLEN_DIGEST,
      }

    case 'ES256':
    case 'ES256K':
    case 'ES384':
    case 'ES512': {
      if (key.asymmetricKeyType !== 'ec') {
        throw new TypeError('Invalid key for this operation, its asymmetricKeyType must be ec')
      }

      const actual = getNamedCurve(key)
      const expected = ecCurveAlgMap.get(alg)
      if (actual !== expected) {
        throw new TypeError(
          `Invalid key curve for the algorithm, its curve must be ${expected}, got ${actual}`,
        )
      }

      return { dsaEncoding: 'ieee-p1363', key }
    }
    default:
      throw new JOSENotSupported(
        `alg ${alg} is not supported either by JOSE or your javascript runtime`,
      )
  }
}
