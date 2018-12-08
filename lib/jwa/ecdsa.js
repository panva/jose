const { createSign, createVerify } = require('crypto')
const { strict: assert } = require('assert')
const { derToJose, joseToDer } = require('../help/ecdsa_signatures')

const resolveNodeAlg = (alg) => {
  switch (alg) {
    case 'ES256':
      return 'RSA-SHA256'
    case 'ES384':
      return 'RSA-SHA384'
    case 'ES512':
      return 'RSA-SHA512'
  }
}

const verify = (jwaAlg, nodeAlg, { keyObject }, payload, signature) => {
  const verify = createVerify(nodeAlg)
  verify.update(payload)

  try {
    return verify.verify(keyObject, joseToDer(signature, jwaAlg))
  } catch (err) {
    return false
  }
}

const sign = (jwaAlg, nodeAlg, { keyObject }, payload) => {
  const sign = createSign(nodeAlg)
  sign.update(payload)
  return derToJose(sign.sign(keyObject), jwaAlg)
}

module.exports = (JWA) => {
  ['ES256', 'ES384', 'ES512'].forEach((jwaAlg) => {
    const nodeAlg = resolveNodeAlg(jwaAlg)

    assert(!JWA.sign.has(jwaAlg), `sign alg ${jwaAlg} already registered`)
    assert(!JWA.verify.has(jwaAlg), `verify alg ${jwaAlg} already registered`)

    JWA.sign.set(jwaAlg, sign.bind(undefined, jwaAlg, nodeAlg))
    JWA.verify.set(jwaAlg, verify.bind(undefined, jwaAlg, nodeAlg))
  })
}
