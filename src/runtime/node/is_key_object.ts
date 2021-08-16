import { KeyObject } from 'crypto'
import * as util from 'util'

let impl: (obj: unknown) => obj is KeyObject

if (util.types.isKeyObject) {
  impl = function isKeyObject(obj): obj is KeyObject {
    return util.types.isKeyObject(obj)
  }
} else {
  impl = function isKeyObject(obj): obj is KeyObject {
    return obj != null && obj instanceof KeyObject
  }
}

export default impl
