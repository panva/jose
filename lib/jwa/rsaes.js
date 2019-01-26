const { strict: assert } = require('assert')
const { publicEncrypt, privateDecrypt, constants } = require('crypto')

const resolvePadding = (alg) => {
  switch (alg) {
    case 'RSA-OAEP':
      return constants.RSA_PKCS1_OAEP_PADDING
    case 'RSA1_5':
      return constants.RSA_PKCS1_PADDING
  }
}

const wrapKey = (padding, { keyObject }, payload) => {
  return publicEncrypt({ key: keyObject, padding }, payload)
}

const unwrapKey = (padding, { keyObject }, payload) => {
  return privateDecrypt({ key: keyObject, padding }, payload)
}

module.exports = (JWA) => {
  ['RSA1_5', 'RSA-OAEP'].forEach((jwaAlg) => {
    const padding = resolvePadding(jwaAlg)

    assert(!JWA.wrapKey.has(jwaAlg), `wrapKey alg ${jwaAlg} already registered`)
    assert(!JWA.unwrapKey.has(jwaAlg), `unwrapKey alg ${jwaAlg} already registered`)

    JWA.wrapKey.set(jwaAlg, wrapKey.bind(undefined, padding))
    JWA.unwrapKey.set(jwaAlg, unwrapKey.bind(undefined, padding))
  })
}
