const { strict: assert } = require('assert')
const { publicEncrypt, privateDecrypt, constants } = require('crypto')

const { KEYOBJECT } = require('../help/consts')

const resolvePadding = (alg) => {
  switch (alg) {
    case 'RSA-OAEP-256':
    case 'RSA-OAEP':
      return constants.RSA_PKCS1_OAEP_PADDING
    case 'RSA1_5':
      return constants.RSA_PKCS1_PADDING
  }
}

const resolveOaepHash = (alg) => {
  switch (alg) {
    case 'RSA-OAEP-256':
      return 'sha256'
    case 'RSA-OAEP':
      return 'sha1'
    default:
      return undefined
  }
}

const wrapKey = (padding, oaepHash, { [KEYOBJECT]: keyObject }, payload) => {
  const key = keyObject.asInput ? keyObject.asInput(true) : keyObject
  return { wrapped: publicEncrypt({ key, oaepHash, padding }, payload) }
}

const unwrapKey = (padding, oaepHash, { [KEYOBJECT]: keyObject }, payload) => {
  const key = keyObject.asInput ? keyObject.asInput(false) : keyObject
  return privateDecrypt({ key, oaepHash, padding }, payload)
}

module.exports = (JWA) => {
  ['RSA1_5', 'RSA-OAEP', 'RSA-OAEP-256'].forEach((jwaAlg) => {
    const padding = resolvePadding(jwaAlg)
    const oaepHash = resolveOaepHash(jwaAlg)

    assert(!JWA.keyManagementEncrypt.has(jwaAlg), `keyManagementEncrypt alg ${jwaAlg} already registered`)
    assert(!JWA.keyManagementDecrypt.has(jwaAlg), `keyManagementDecrypt alg ${jwaAlg} already registered`)

    JWA.keyManagementEncrypt.set(jwaAlg, wrapKey.bind(undefined, padding, oaepHash))
    JWA.keyManagementDecrypt.set(jwaAlg, unwrapKey.bind(undefined, padding, oaepHash))
  })
}
