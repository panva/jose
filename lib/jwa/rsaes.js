const { strict: assert } = require('assert')
const { publicEncrypt, privateDecrypt, constants } = require('crypto')

const { KEYOBJECT } = require('../help/consts')

const resolvePadding = (alg) => {
  switch (alg) {
    case 'RSA-OAEP':
      return constants.RSA_PKCS1_OAEP_PADDING
    case 'RSA1_5':
      return constants.RSA_PKCS1_PADDING
  }
}

const wrapKey = (padding, { [KEYOBJECT]: keyObject }, payload) => {
  return { wrapped: publicEncrypt({ key: keyObject, padding }, payload) }
}

const unwrapKey = (padding, { [KEYOBJECT]: keyObject }, payload) => {
  return privateDecrypt({ key: keyObject, padding }, payload)
}

module.exports = (JWA) => {
  ['RSA1_5', 'RSA-OAEP'].forEach((jwaAlg) => {
    const padding = resolvePadding(jwaAlg)

    assert(!JWA.keyManagementEncrypt.has(jwaAlg), `keyManagementEncrypt alg ${jwaAlg} already registered`)
    assert(!JWA.keyManagementDecrypt.has(jwaAlg), `keyManagementDecrypt alg ${jwaAlg} already registered`)

    JWA.keyManagementEncrypt.set(jwaAlg, wrapKey.bind(undefined, padding))
    JWA.keyManagementDecrypt.set(jwaAlg, unwrapKey.bind(undefined, padding))
  })
}
