const {
  createSign,
  createVerify,
  constants: { RSA_PKCS1_PSS_PADDING: padding, RSA_PSS_SALTLEN_DIGEST: saltLength }
} = require('crypto')
const { strict: assert } = require('assert')

const resolveNodeAlg = (alg) => {
  switch (alg) {
    case 'PS256':
      return 'RSA-SHA256'
    case 'PS384':
      return 'RSA-SHA384'
    case 'PS512':
      return 'RSA-SHA512'
  }
}

const sign = (jwaAlg, nodeAlg, { keyObject }, payload) => {
  const sign = createSign(nodeAlg)
  sign.update(payload)
  return sign.sign({ key: keyObject, padding, saltLength })
}

const verify = (jwaAlg, nodeAlg, { keyObject }, payload, signature) => {
  const verify = createVerify(nodeAlg)
  verify.update(payload)
  return verify.verify({ key: keyObject, padding, saltLength }, signature)
}

module.exports = (JWA) => {
  ['PS256', 'PS384', 'PS512'].forEach((jwaAlg) => {
    const nodeAlg = resolveNodeAlg(jwaAlg)

    assert(!JWA.sign.has(jwaAlg), `sign alg ${jwaAlg} already registered`)
    assert(!JWA.verify.has(jwaAlg), `verify alg ${jwaAlg} already registered`)

    JWA.sign.set(jwaAlg, sign.bind(undefined, jwaAlg, nodeAlg))
    JWA.verify.set(jwaAlg, verify.bind(undefined, jwaAlg, nodeAlg))
  })
}
