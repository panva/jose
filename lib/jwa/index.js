const { TODO } = require('../errors')

const JWA = {
  sign: new Map(),
  verify: new Map()
}

require('./hmac')(JWA)
require('./ecdsa')(JWA)
require('./rsassa_pss')(JWA)
require('./rsassa_pkcs1')(JWA)

module.exports = {
  sign: (alg, key, payload) => {
    if (!JWA.sign.has(alg)) {
      throw new TODO(`sign alg ${alg} not implemented`)
    }
    if (!key.algorithms('sign').has(alg)) {
      throw new TODO(`the key does not support ${alg} sign algorithm`)
    }

    return JWA.sign.get(alg)(key, payload)
  },
  verify: (alg, key, payload, signature) => {
    if (!JWA.verify.has(alg)) {
      throw new TODO(`verify alg ${alg} not implemented`)
    }
    if (!key.algorithms('verify').has(alg)) {
      throw new TODO(`the key does not support ${alg} verify algorithm`)
    }

    return JWA.verify.get(alg)(key, payload, signature)
  }
}
