import * as crypto from 'crypto'
import * as util from 'util'

// @ts-ignore
const webcrypto = <Crypto>crypto.webcrypto

export default webcrypto

export const isCryptoKey = util.types.isCryptoKey
  ? (obj: unknown): obj is CryptoKey => util.types.isCryptoKey(obj)
  : // @ts-expect-error
    (obj: unknown): obj is CryptoKey => false
