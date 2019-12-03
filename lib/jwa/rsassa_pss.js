const { strict: assert } = require('assert')
const {
  sign: signOneShot,
  verify: verifyOneShot,
  createSign,
  createVerify,
  constants
} = require('crypto')

const { KEYOBJECT } = require('../help/consts')
const resolveNodeAlg = require('../help/node_alg')
const { asInput } = require('../help/key_object')

let sign, verify

if (signOneShot) {
  sign = (nodeAlg, { [KEYOBJECT]: keyObject }, payload) => {
    return signOneShot(nodeAlg, payload, {
      key: asInput(keyObject, false),
      padding: constants.RSA_PKCS1_PSS_PADDING,
      saltLength: constants.RSA_PSS_SALTLEN_DIGEST
    })
  }
} else {
  sign = (nodeAlg, { [KEYOBJECT]: keyObject }, payload) => {
    const key = asInput(keyObject, false)
    return createSign(nodeAlg).update(payload).sign({
      key,
      padding: constants.RSA_PKCS1_PSS_PADDING,
      saltLength: constants.RSA_PSS_SALTLEN_DIGEST
    })
  }
}

if (verifyOneShot) {
  verify = (nodeAlg, { [KEYOBJECT]: keyObject }, payload, signature) => {
    return verifyOneShot(nodeAlg, payload, {
      key: asInput(keyObject, false),
      padding: constants.RSA_PKCS1_PSS_PADDING,
      saltLength: constants.RSA_PSS_SALTLEN_DIGEST
    }, signature)
  }
} else {
  verify = (nodeAlg, { [KEYOBJECT]: keyObject }, payload, signature) => {
    const key = asInput(keyObject, true)
    return createVerify(nodeAlg).update(payload).verify({
      key,
      padding: constants.RSA_PKCS1_PSS_PADDING,
      saltLength: constants.RSA_PSS_SALTLEN_DIGEST
    }, signature)
  }
}

const LENGTHS = {
  PS256: 528,
  PS384: 784,
  PS512: 1040
}

module.exports = (JWA, JWK) => {
  ['PS256', 'PS384', 'PS512'].forEach((jwaAlg) => {
    const nodeAlg = resolveNodeAlg(jwaAlg)

    assert(!JWA.sign.has(jwaAlg), `sign alg ${jwaAlg} already registered`)
    assert(!JWA.verify.has(jwaAlg), `verify alg ${jwaAlg} already registered`)

    JWA.sign.set(jwaAlg, sign.bind(undefined, nodeAlg))
    JWA.verify.set(jwaAlg, verify.bind(undefined, nodeAlg))
    JWK.RSA.sign[jwaAlg] = key => key.private && JWK.RSA.verify[jwaAlg](key)
    JWK.RSA.verify[jwaAlg] = key => (key.use === 'sig' || key.use === undefined) && key.length >= LENGTHS[jwaAlg]
  })
}
