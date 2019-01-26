const { TODO } = require('../errors')

const JWA = {
  sign: new Map(),
  verify: new Map(),
  wrapKey: new Map(),
  unwrapKey: new Map(),
}

// sign, verify
require('./hmac')(JWA)
require('./ecdsa')(JWA)
require('./rsassa_pss')(JWA)
require('./rsassa_pkcs1')(JWA)

// wrapKey, unwrapKey
require('./rsaes')(JWA)

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
  },
  wrapKey: (alg, key, payload) => {
    if (!JWA.wrapKey.has(alg)) {
      throw new TODO(`wrapKey alg ${alg} not implemented`)
    }
    if (!key.algorithms('wrapKey').has(alg)) {
      throw new TODO(`the key does not support ${alg} wrapKey algorithm`)
    }

    return JWA.sign.get(alg)(key, payload)
  },
  unwrapKey: (alg, key, payload) => {
    if (!JWA.unwrapKey.has(alg)) {
      throw new TODO(`unwrapKey alg ${alg} not implemented`)
    }
    if (!key.algorithms('unwrapKey').has(alg)) {
      throw new TODO(`the key does not support ${alg} unwrapKey algorithm`)
    }

    return JWA.unwrapKey.get(alg)(key, payload)
  }
}
