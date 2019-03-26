const { strict: assert } = require('assert')
const { createSign, createVerify } = require('crypto')

const { KEYOBJECT } = require('../help/symbols')
const resolveNodeAlg = require('../help/node_alg')

const sign = (nodeAlg, { [KEYOBJECT]: keyObject }, payload) => {
  const sign = createSign(nodeAlg)
  sign.update(payload)
  return sign.sign(keyObject)
}

const verify = (nodeAlg, { [KEYOBJECT]: keyObject }, payload, signature) => {
  const verify = createVerify(nodeAlg)
  verify.update(payload)
  return verify.verify(keyObject, signature)
}

module.exports = (JWA) => {
  ['RS256', 'RS384', 'RS512'].forEach((jwaAlg) => {
    const nodeAlg = resolveNodeAlg(jwaAlg)

    assert(!JWA.sign.has(jwaAlg), `sign alg ${jwaAlg} already registered`)
    assert(!JWA.verify.has(jwaAlg), `verify alg ${jwaAlg} already registered`)

    JWA.sign.set(jwaAlg, sign.bind(undefined, nodeAlg))
    JWA.verify.set(jwaAlg, verify.bind(undefined, nodeAlg))
  })
}
