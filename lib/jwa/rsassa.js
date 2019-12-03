const { strict: assert } = require('assert')
const { sign: signOneShot, verify: verifyOneShot, createSign, createVerify } = require('crypto')

const { KEYOBJECT } = require('../help/consts')
const resolveNodeAlg = require('../help/node_alg')
const { asInput } = require('../help/key_object')

let sign, verify

if (signOneShot) {
  sign = (nodeAlg, { [KEYOBJECT]: keyObject }, payload) => {
    return signOneShot(nodeAlg, payload, keyObject)
  }
} else {
  sign = (nodeAlg, { [KEYOBJECT]: keyObject }, payload) => {
    return createSign(nodeAlg).update(payload).sign(asInput(keyObject, false))
  }
}

if (verifyOneShot) {
  verify = (nodeAlg, { [KEYOBJECT]: keyObject }, payload, signature) => {
    return verifyOneShot(nodeAlg, payload, keyObject, signature)
  }
} else {
  verify = (nodeAlg, { [KEYOBJECT]: keyObject }, payload, signature) => {
    try {
      return createVerify(nodeAlg).update(payload).verify(asInput(keyObject, true), signature)
    } catch (err) {
      return false
    }
  }
}

const LENGTHS = {
  RS256: 0,
  RS384: 624,
  RS512: 752
}

module.exports = (JWA, JWK) => {
  ['RS256', 'RS384', 'RS512'].forEach((jwaAlg) => {
    const nodeAlg = resolveNodeAlg(jwaAlg)

    assert(!JWA.sign.has(jwaAlg), `sign alg ${jwaAlg} already registered`)
    assert(!JWA.verify.has(jwaAlg), `verify alg ${jwaAlg} already registered`)

    JWA.sign.set(jwaAlg, sign.bind(undefined, nodeAlg))
    JWA.verify.set(jwaAlg, verify.bind(undefined, nodeAlg))
    JWK.RSA.sign[jwaAlg] = key => key.private && JWK.RSA.verify[jwaAlg](key)
    JWK.RSA.verify[jwaAlg] = key => (key.use === 'sig' || key.use === undefined) && key.length >= LENGTHS[jwaAlg]
  })
}
