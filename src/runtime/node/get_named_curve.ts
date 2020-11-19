import { KeyObject, createPublicKey } from 'crypto'
import { JOSENotSupported } from '../../util/errors.js'

const p256 = Buffer.from([42, 134, 72, 206, 61, 3, 1, 7])
const p384 = Buffer.from([43, 129, 4, 0, 34])
const p521 = Buffer.from([43, 129, 4, 0, 35])
const secp256k1 = Buffer.from([43, 129, 4, 0, 10])

const weakMap: WeakMap<KeyObject, string> = new WeakMap()

const getNamedCurve = (key: KeyObject): string => {
  if (key.type === 'secret') {
    throw new TypeError('only "private" or "public" key objects can be used for this operation')
  }
  switch (key.asymmetricKeyType) {
    case 'ed25519':
    case 'ed448':
      return `Ed${key.asymmetricKeyType.substr(2)}`
    case 'x25519':
    case 'x448':
      return `X${key.asymmetricKeyType.substr(1)}`
    case 'ec': {
      if (weakMap.has(key)) {
        return weakMap.get(key) as string
      }

      if (key.type === 'private') {
        const curve = getNamedCurve(createPublicKey(key))
        weakMap.set(key, curve)
        return curve
      }

      const buf = key.export({ format: 'der', type: 'spki' })
      const i = buf[1] < 128 ? 14 : 15
      const len = buf[i]
      const curveOid = buf.slice(i + 1, i + 1 + len)
      let curve: string
      if (curveOid.equals(p256)) {
        curve = 'P-256'
      } else if (curveOid.equals(p384)) {
        curve = 'P-384'
      } else if (curveOid.equals(p521)) {
        curve = 'P-521'
      } else if (curveOid.equals(secp256k1)) {
        curve = 'secp256k1'
      } else {
        throw new JOSENotSupported('unsupported curve for this operation')
      }
      weakMap.set(key, curve)
      return curve
    }
    default:
      throw new TypeError('invalid key asymmetric key type for this operation')
  }
}

export function setCurve(keyObject: KeyObject, curve: string) {
  weakMap.set(keyObject, curve)
}

export default getNamedCurve
