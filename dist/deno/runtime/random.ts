import crypto from './webcrypto.ts'

const random = crypto.getRandomValues.bind(crypto)

export default random
