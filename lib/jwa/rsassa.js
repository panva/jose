const { createSign, createVerify } = require('crypto')

const { KEYOBJECT } = require('../help/consts')
const resolveNodeAlg = require('../help/node_alg')
const { asInput } = require('../help/key_object')

const sign = (nodeAlg, { [KEYOBJECT]: keyObject }, payload) => {
  return createSign(nodeAlg).update(payload).sign(asInput(keyObject, false))
}

const verify = (nodeAlg, { [KEYOBJECT]: keyObject }, payload, signature) => {
  return createVerify(nodeAlg).update(payload).verify(asInput(keyObject, true), signature)
}

const LENGTHS = {
  RS256: 0,
  RS384: 624,
  RS512: 752
}

module.exports = (JWA, JWK) => {
  ['RS256', 'RS384', 'RS512'].forEach((jwaAlg) => {
    const nodeAlg = resolveNodeAlg(jwaAlg)
    JWA.sign.set(jwaAlg, sign.bind(undefined, nodeAlg))
    JWA.verify.set(jwaAlg, verify.bind(undefined, nodeAlg))
    JWK.RSA.sign[jwaAlg] = key => key.private && JWK.RSA.verify[jwaAlg](key)
    JWK.RSA.verify[jwaAlg] = key => (key.use === 'sig' || key.use === undefined) && key.length >= LENGTHS[jwaAlg]
  })
}
