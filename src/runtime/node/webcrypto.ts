import * as crypto from 'node:crypto'
import * as util from 'node:util'

// @ts-ignore
const webcrypto = crypto.webcrypto as Crypto

export default webcrypto

export const isCryptoKey = (key: unknown): key is CryptoKey => util.types.isCryptoKey(key)
