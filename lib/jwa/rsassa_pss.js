const { strict: assert } = require('assert')
const { sign: signOneShot, verify: verifyOneShot, constants } = require('crypto')

const { KEYOBJECT } = require('../help/consts')
const resolveNodeAlg = require('../help/node_alg')

const sign = (nodeAlg, { [KEYOBJECT]: keyObject }, payload) => {
  return signOneShot(nodeAlg, payload, {
    key: keyObject,
    padding: constants.RSA_PKCS1_PSS_PADDING,
    saltLength: constants.RSA_PSS_SALTLEN_DIGEST
  })
}

const verify = (nodeAlg, { [KEYOBJECT]: keyObject }, payload, signature) => {
  return verifyOneShot(nodeAlg, payload, {
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
