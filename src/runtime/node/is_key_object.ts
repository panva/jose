import { KeyObject } from 'crypto'
import * as util from 'util'

// eslint-disable-next-line import/no-mutable-exports
let impl: (obj: unknown) => obj is KeyObject

// @ts-expect-error
if (util.types.isKeyObject) {
  impl = function isKeyObject(obj): obj is KeyObject {
    // @ts-expect-error
    return <boolean>util.types.isKeyObject(obj)
  }
} else {
  impl = function isKeyObject(obj): obj is KeyObject {
    return obj != null && obj instanceof KeyObject
  }
}

export default impl
