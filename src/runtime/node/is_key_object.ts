import { KeyObject } from 'crypto'
import * as util from 'util'

export default util.types.isKeyObject
  ? (obj: unknown): obj is KeyObject => util.types.isKeyObject(obj)
  : (obj: unknown): obj is KeyObject => obj != null && obj instanceof KeyObject
