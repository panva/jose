const { strict: assert } = require('assert')
const { sign: signOneShot, verify: verifyOneShot, createSign, createVerify } = require('crypto')

const { KEYOBJECT } = require('../help/consts')
const resolveNodeAlg = require('../help/node_alg')

let sign, verify

if (signOneShot) {
  sign = (nodeAlg, { [KEYOBJECT]: keyObject }, payload) => {
    return signOneShot(nodeAlg, payload, keyObject)
  }
} else {
  sign = (nodeAlg, { [KEYOBJECT]: keyObject }, payload) => {
    return createSign(nodeAlg).update(payload).sign(keyObject.asInput())
  }
}

if (verifyOneShot) {
  verify = (nodeAlg, { [KEYOBJECT]: keyObject }, payload, signature) => {
    return verifyOneShot(nodeAlg, payload, keyObject, signature)
  }
} else {
  verify = (nodeAlg, { [KEYOBJECT]: keyObject }, payload, signature) => {
    try {
      return createVerify(nodeAlg).update(payload).verify(keyObject.asInput(true), signature)
    } catch (err) {
      return false
    }
  }
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
