const { strict: assert } = require('assert')
const { createHmac } = require('crypto')

const { KEYOBJECT } = require('../help/consts')
const timingSafeEqual = require('../help/timing_safe_equal')
const resolveNodeAlg = require('../help/node_alg')

const sign = (jwaAlg, hmacAlg, { [KEYOBJECT]: keyObject }, payload) => {
  const hmac = createHmac(hmacAlg, keyObject.asInput ? keyObject.asInput() : keyObject)
  hmac.update(payload)
  return hmac.digest()
}

const verify = (jwaAlg, hmacAlg, { [KEYOBJECT]: keyObject }, payload, signature) => {
  const hmac = createHmac(hmacAlg, keyObject.asInput ? keyObject.asInput() : keyObject)
  hmac.update(payload)
  const expected = hmac.digest()
  const actual = signature

  return timingSafeEqual(actual, expected)
}

module.exports = (JWA) => {
  ['HS256', 'HS384', 'HS512'].forEach((jwaAlg) => {
    const hmacAlg = resolveNodeAlg(jwaAlg)

    assert(!JWA.sign.has(jwaAlg), `sign alg ${jwaAlg} already registered`)
    assert(!JWA.verify.has(jwaAlg), `verify alg ${jwaAlg} already registered`)

    JWA.sign.set(jwaAlg, sign.bind(undefined, jwaAlg, hmacAlg))
    JWA.verify.set(jwaAlg, verify.bind(undefined, jwaAlg, hmacAlg))
  })
}
