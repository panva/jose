import type { KeyObject } from 'node:crypto'
import * as util from 'node:util'

export default (obj: unknown): obj is KeyObject => util.types.isKeyObject(obj)
