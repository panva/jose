import * as crypto from 'crypto'
import * as util from 'util'

// @ts-ignore
const webcrypto = <Crypto>crypto.webcrypto

export default webcrypto

export const isCryptoKey = util.types.isCryptoKey
  ? (key: unknown): key is CryptoKey => util.types.isCryptoKey(key)
  : // @ts-expect-error
    (key: unknown): key is CryptoKey => false
