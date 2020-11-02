import type { KeyObject, SignKeyObjectInput } from 'crypto'
import { constants } from 'crypto'

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
      if (key.type === 'secret' || !['ed25519', 'ed448'].includes(key.asymmetricKeyType!)) {
        throw new TypeError('invalid key type or asymmetric key type for this operation')
      }

      return key

    case 'RS256':
    case 'RS384':
    case 'RS512':
      if (key.type === 'secret' || key.asymmetricKeyType !== 'rsa') {
        throw new TypeError('invalid key type or asymmetric key type for this operation')
      }
      checkModulusLength(key, alg)

      return key

    case 'PS256':
    case 'PS384':
    case 'PS512':
      if (key.type === 'secret' || key.asymmetricKeyType !== 'rsa') {
        throw new TypeError('invalid key type or asymmetric key type for this operation')
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
    case 'ES512':
      if (key.type === 'secret' || key.asymmetricKeyType !== 'ec') {
        throw new TypeError('invalid key type or asymmetric key type for this operation')
      }

      if (ecCurveAlgMap.get(alg) !== getNamedCurve(key)) {
        throw new TypeError('invalid key curve for the algorithm')
      }

      return { dsaEncoding: 'ieee-p1363', key }

    default:
      throw new JOSENotSupported(
        `alg ${alg} is unsupported either by JOSE or your javascript runtime`,
      )
  }
}
