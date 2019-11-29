const { strict: assert } = require('assert')
const { sign: signOneShot, verify: verifyOneShot, createSign, createVerify } = require('crypto')

const { derToJose, joseToDer } = require('../help/ecdsa_signatures')
const { KEYOBJECT } = require('../help/consts')
const resolveNodeAlg = require('../help/node_alg')
const { asInput } = require('../help/key_object')
const { dsaEncodingSupported } = require('../help/runtime_support')

let sign, verify

if (dsaEncodingSupported) { // >= 13.2.0
  sign = (jwaAlg, nodeAlg, { [KEYOBJECT]: keyObject }, payload) => {
    return signOneShot(nodeAlg, payload, { key: asInput(keyObject, false), dsaEncoding: 'ieee-p1363' })
  }
} else if (signOneShot) { // >= 12.0.0
  sign = (jwaAlg, nodeAlg, { [KEYOBJECT]: keyObject }, payload) => {
    return derToJose(signOneShot(nodeAlg, payload, asInput(keyObject, false)), jwaAlg)
  }
} else {
  sign = (jwaAlg, nodeAlg, { [KEYOBJECT]: keyObject }, payload) => {
    return derToJose(createSign(nodeAlg).update(payload).sign(asInput(keyObject, false)), jwaAlg)
  }
}

if (dsaEncodingSupported) { // >= 13.2.0
  verify = (jwaAlg, nodeAlg, { [KEYOBJECT]: keyObject }, payload, signature) => {
    try {
      return verifyOneShot(nodeAlg, payload, { key: asInput(keyObject, true), dsaEncoding: 'ieee-p1363' }, signature)
    } catch (err) {
      return false
    }
  }
} else if (verifyOneShot) { // >= 12.0.0
  verify = (jwaAlg, nodeAlg, { [KEYOBJECT]: keyObject }, payload, signature) => {
    try {
      return verifyOneShot(nodeAlg, payload, asInput(keyObject, true), joseToDer(signature, jwaAlg))
    } catch (err) {
      return false
    }
  }
} else {
  verify = (jwaAlg, nodeAlg, { [KEYOBJECT]: keyObject }, payload, signature) => {
    try {
      return createVerify(nodeAlg).update(payload).verify(asInput(keyObject, true), joseToDer(signature, jwaAlg))
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
