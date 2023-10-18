import * as crypto from 'node:crypto'
import * as util from 'node:util'

// @ts-ignore
const webcrypto = <Crypto>crypto.webcrypto

export default webcrypto

export const isCryptoKey = (key: unknown): key is CryptoKey => util.types.isCryptoKey(key)
