import crypto from './webcrypto.ts'

export default crypto.getRandomValues.bind(crypto)
