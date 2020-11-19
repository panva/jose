import { KeyObject, createPublicKey } from 'crypto'

import type { JWKConvertFunction } from '../interfaces.d'
import type { JWK } from '../../types.d'
import { encode as base64url } from './base64url.js'
import Asn1SequenceDecoder from './asn1_sequence_decoder.js'
import { JOSENotSupported } from '../../util/errors.js'
import getNamedCurve from './get_named_curve.js'

const keyToJWK: JWKConvertFunction = (key: KeyObject): JWK => {
  if (!(key instanceof KeyObject)) {
    throw new TypeError('invalid key argument type')
  }

  switch (key.type) {
    case 'secret':
      return {
        kty: 'oct',
        k: base64url(key.export()),
      }
    case 'private':
    case 'public': {
      switch (key.asymmetricKeyType) {
        case 'rsa': {
          const der = key.export({ format: 'der', type: 'pkcs1' })
          const dec = new Asn1SequenceDecoder(der)
          if (key.type === 'private') {
            dec.unsignedInteger() // TODO: Don't ignore this
          }
          const n = base64url(dec.unsignedInteger())
          const e = base64url(dec.unsignedInteger())
          let jwk: JWK
          if (key.type === 'private') {
            jwk = {
              d: base64url(dec.unsignedInteger()),
              p: base64url(dec.unsignedInteger()),
              q: base64url(dec.unsignedInteger()),
              dp: base64url(dec.unsignedInteger()),
              dq: base64url(dec.unsignedInteger()),
              qi: base64url(dec.unsignedInteger()),
            }
          }
          dec.end()
          return { kty: 'RSA', n, e, ...jwk! }
        }
        case 'ec': {
          const crv = getNamedCurve(key)
          let len: number
          let offset: number
          let correction: number
          switch (crv) {
            case 'secp256k1':
              len = 64
              offset = 31 + 2
              correction = -1
              break
            case 'P-256':
              len = 64
              offset = 34 + 2
              correction = -1
              break
            case 'P-384':
              len = 96
              offset = 33 + 2
              correction = -3
              break
            case 'P-521':
              len = 132
              offset = 33 + 2
              correction = -3
              break
            default:
              throw new JOSENotSupported('unsupported curve')
          }
          if (key.type === 'public') {
            const der = key.export({ type: 'spki', format: 'der' })
            return {
              kty: 'EC',
              crv,
              x: base64url(der.subarray(-len, -len / 2)),
              y: base64url(der.subarray(-len / 2)),
            }
          }
          const der = key.export({ type: 'pkcs8', format: 'der' })
          if (der.length < 100) {
            offset += correction
          }
          return {
            ...keyToJWK(createPublicKey(key)),
            d: base64url(der.subarray(offset, offset + len / 2)),
          }
        }
        case 'ed25519':
        case 'x25519': {
          const crv = getNamedCurve(key)
          if (key.type === 'public') {
            const der = key.export({ type: 'spki', format: 'der' })
            return {
              kty: 'OKP',
              crv,
              x: base64url(der.subarray(-32)),
            }
          }

          const der = key.export({ type: 'pkcs8', format: 'der' })
          return {
            ...keyToJWK(createPublicKey(key)),
            d: base64url(der.subarray(-32)),
          }
        }
        case 'ed448':
        case 'x448': {
          const crv = getNamedCurve(key)
          if (key.type === 'public') {
            const der = key.export({ type: 'spki', format: 'der' })
            return {
              kty: 'OKP',
              crv,
              x: base64url(der.subarray(crv === 'Ed448' ? -57 : -56)),
            }
          }

          const der = key.export({ type: 'pkcs8', format: 'der' })
          return {
            ...keyToJWK(createPublicKey(key)),
            d: base64url(der.subarray(crv === 'Ed448' ? -57 : -56)),
          }
        }
        default:
          throw new JOSENotSupported('unsupported key asymmetricKeyType')
      }
    }
    default:
      throw new JOSENotSupported('unsupported key type')
  }
}
export default keyToJWK
