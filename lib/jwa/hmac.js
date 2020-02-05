const { createHmac } = require('crypto')

const { KEYOBJECT } = require('../help/consts')
const timingSafeEqual = require('../help/timing_safe_equal')
const resolveNodeAlg = require('../help/node_alg')
const { asInput } = require('../help/key_object')

const sign = (jwaAlg, hmacAlg, { [KEYOBJECT]: keyObject }, payload) => {
  const hmac = createHmac(hmacAlg, asInput(keyObject, false))
  hmac.update(payload)
  return hmac.digest()
}

const verify = (jwaAlg, hmacAlg, key, payload, signature) => {
  const expected = sign(jwaAlg, hmacAlg, key, payload)
  const actual = signature

  return timingSafeEqual(actual, expected)
}

module.exports = (JWA, JWK) => {
  ['HS256', 'HS384', 'HS512'].forEach((jwaAlg) => {
    const hmacAlg = resolveNodeAlg(jwaAlg)
    JWA.sign.set(jwaAlg, sign.bind(undefined, jwaAlg, hmacAlg))
    JWA.verify.set(jwaAlg, verify.bind(undefined, jwaAlg, hmacAlg))
    JWK.oct.sign[jwaAlg] = JWK.oct.verify[jwaAlg] = key => key.use === 'sig' || key.use === undefined
  })
}
