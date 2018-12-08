const { createSign, createVerify } = require('crypto')
const { strict: assert } = require('assert')

const resolveNodeAlg = (alg) => {
  switch (alg) {
    case 'RS256':
      return 'RSA-SHA256'
    case 'RS384':
      return 'RSA-SHA384'
    case 'RS512':
      return 'RSA-SHA512'
  }
}

const verify = (jwaAlg, nodeAlg, { keyObject }, payload, signature) => {
  const verify = createVerify(nodeAlg)
  verify.update(payload)
  return verify.verify(keyObject, signature)
}

const sign = (jwaAlg, nodeAlg, { keyObject }, payload) => {
  const sign = createSign(nodeAlg)
  sign.update(payload)
  return sign.sign(keyObject)
}

module.exports = (JWA) => {
  ['RS256', 'RS384', 'RS512'].forEach((jwaAlg) => {
    const nodeAlg = resolveNodeAlg(jwaAlg)

    assert(!JWA.sign.has(jwaAlg), `sign alg ${jwaAlg} already registered`)
    assert(!JWA.verify.has(jwaAlg), `verify alg ${jwaAlg} already registered`)

    JWA.sign.set(jwaAlg, sign.bind(undefined, jwaAlg, nodeAlg))
    JWA.verify.set(jwaAlg, verify.bind(undefined, jwaAlg, nodeAlg))
  })
}
