import { KeyObject } from 'node:crypto'
import type { JWK } from '../../types.d'

export default (key: KeyObject | JWK, alg: string) => {
  let modulusLength: any
  try {
    if (key instanceof KeyObject) {
      modulusLength = key.asymmetricKeyDetails?.modulusLength
    } else {
      modulusLength = Buffer.from(key.n!, 'base64url').byteLength << 3
    }
  } catch {}

  if (typeof modulusLength !== 'number' || modulusLength < 2048) {
    throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`)
  }
}
