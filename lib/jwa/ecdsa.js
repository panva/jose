const { strict: assert } = require('assert')
const { sign: signOneShot, verify: verifyOneShot, createSign, createVerify } = require('crypto')

const { derToJose, joseToDer } = require('../help/ecdsa_signatures')
const { KEYOBJECT } = require('../help/consts')
const resolveNodeAlg = require('../help/node_alg')

let sign, verify

if (signOneShot) {
  sign = (jwaAlg, nodeAlg, { [KEYOBJECT]: keyObject }, payload) => {
    return derToJose(signOneShot(nodeAlg, payload, keyObject), jwaAlg)
  }
} else {
  sign = (jwaAlg, nodeAlg, { [KEYOBJECT]: keyObject }, payload) => {
    return derToJose(createSign(nodeAlg).update(payload).sign(keyObject.asInput()), jwaAlg)
  }
}

if (verifyOneShot) {
  verify = (jwaAlg, nodeAlg, { [KEYOBJECT]: keyObject }, payload, signature) => {
    try {
      return verifyOneShot(nodeAlg, payload, keyObject, joseToDer(signature, jwaAlg))
    } catch (err) {
      return false
    }
  }
} else {
  verify = (jwaAlg, nodeAlg, { [KEYOBJECT]: keyObject }, payload, signature) => {
    try {
      return createVerify(nodeAlg).update(payload).verify(keyObject.asInput(true), joseToDer(signature, jwaAlg))
    } catch (err) {
      return false
    }
  }
}

module.exports = (JWA) => {
  ['ES256', 'ES384', 'ES512', 'ES256K'].forEach((jwaAlg) => {
    const nodeAlg = resolveNodeAlg(jwaAlg)

    assert(!JWA.sign.has(jwaAlg), `sign alg ${jwaAlg} already registered`)
    assert(!JWA.verify.has(jwaAlg), `verify alg ${jwaAlg} already registered`)

    JWA.sign.set(jwaAlg, sign.bind(undefined, jwaAlg, nodeAlg))
    JWA.verify.set(jwaAlg, verify.bind(undefined, jwaAlg, nodeAlg))
  })
}
