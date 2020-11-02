import { createSecretKey } from 'crypto'
import type { KeyObject } from 'crypto'

export default function getSecretKey(key: KeyObject | Uint8Array): KeyObject {
  let keyObject: KeyObject
  if (key instanceof Uint8Array) {
    keyObject = createSecretKey(key)
  } else {
    keyObject = key
  }

  return keyObject
}
