const { strict: assert } = require('assert')

const sign = (key, payload) => Buffer.from('')
const verify = (key, payload, signature) => !signature.length

module.exports = (JWA, JWK) => {
  const jwaAlg = 'none'

  assert(!JWA.sign.has(jwaAlg), `sign alg ${jwaAlg} already registered`)
  assert(!JWA.verify.has(jwaAlg), `verify alg ${jwaAlg} already registered`)

  JWA.sign.set(jwaAlg, sign)
  JWA.verify.set(jwaAlg, verify)
}
