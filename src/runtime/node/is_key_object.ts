import { KeyObject } from 'crypto'

export default function isKeyObject(obj: unknown): obj is KeyObject {
  return obj != null && obj instanceof KeyObject
}
