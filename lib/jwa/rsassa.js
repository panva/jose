const { strict: assert } = require('assert')
const { createSign, createVerify, constants } = require('crypto')

const { KEYOBJECT } = require('../help/symbols')

const resolveNodeAlg = (alg) => {
  switch (alg) {
    case 'PS256':
    case 'RS256':
      return 'RSA-SHA256'
    case 'PS384':
    case 'RS384':
      return 'RSA-SHA384'
    case 'PS512':
    case 'RS512':
      return 'RSA-SHA512'
  }
}

const resolvePadding = (alg) => {
  if (alg.startsWith('RS')) {
    return constants.RSA_PKCS1_PADDING
  }

  return constants.RSA_PKCS1_PSS_PADDING
}

const sign = (nodeAlg, padding, { [KEYOBJECT]: keyObject }, payload) => {
  const sign = createSign(nodeAlg)
  sign.update(payload)
  return sign.sign({ key: keyObject, padding })
}

const verify = (nodeAlg, padding, { [KEYOBJECT]: keyObject }, payload, signature) => {
  const verify = createVerify(nodeAlg)
  verify.update(payload)
  return verify.verify({ key: keyObject, padding }, signature)
}

module.exports = (JWA) => {
  ['PS256', 'PS384', 'PS512', 'RS256', 'RS384', 'RS512'].forEach((jwaAlg) => {
    const nodeAlg = resolveNodeAlg(jwaAlg)
    const padding = resolvePadding(jwaAlg)

    assert(!JWA.sign.has(jwaAlg), `sign alg ${jwaAlg} already registered`)
    assert(!JWA.verify.has(jwaAlg), `verify alg ${jwaAlg} already registered`)

    JWA.sign.set(jwaAlg, sign.bind(undefined, nodeAlg, padding))
    JWA.verify.set(jwaAlg, verify.bind(undefined, nodeAlg, padding))
  })
}
