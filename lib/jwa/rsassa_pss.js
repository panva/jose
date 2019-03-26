const { strict: assert } = require('assert')
const { createSign, createVerify, constants } = require('crypto')

const { KEYOBJECT } = require('../help/symbols')
const resolveNodeAlg = require('../help/node_alg')

const sign = (nodeAlg, { [KEYOBJECT]: keyObject, length }, payload) => {
  const sign = createSign(nodeAlg)
  sign.update(payload)

  return sign.sign({
    key: keyObject,
    padding: constants.RSA_PKCS1_PSS_PADDING,
    saltLength: constants.RSA_PSS_SALTLEN_DIGEST
  })
}

const verify = (nodeAlg, { [KEYOBJECT]: keyObject, length }, payload, signature) => {
  const verify = createVerify(nodeAlg)
  verify.update(payload)

  return verify.verify({
    key: keyObject,
    padding: constants.RSA_PKCS1_PSS_PADDING,
    saltLength: constants.RSA_PSS_SALTLEN_DIGEST
  }, signature)
}

module.exports = (JWA) => {
  ['PS256', 'PS384', 'PS512'].forEach((jwaAlg) => {
    const nodeAlg = resolveNodeAlg(jwaAlg)

    assert(!JWA.sign.has(jwaAlg), `sign alg ${jwaAlg} already registered`)
    assert(!JWA.verify.has(jwaAlg), `verify alg ${jwaAlg} already registered`)

    JWA.sign.set(jwaAlg, sign.bind(undefined, nodeAlg))
    JWA.verify.set(jwaAlg, verify.bind(undefined, nodeAlg))
  })
}
