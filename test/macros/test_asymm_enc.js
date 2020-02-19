const test = require('ava')

const { keyObjectSupported } = require('../../lib/help/runtime_support')
const { JWK: { asKey } } = require('../..')
const registry = require('../../lib/registry')

const fixtures = require('../fixtures')
const { JWE: { success, failure } } = require('../macros')

const ENCS = [...registry.JWA.encrypt.keys()]

module.exports = (type) => {
  const { private: key, public: pub, testEnc = true } = fixtures.PEM[type]

  if (!testEnc) return

  const eKey = asKey(pub)
  const dKey = asKey(key)

  ;[...eKey.algorithms('wrapKey'), ...eKey.algorithms('deriveKey')].forEach((alg) => {
    ENCS.forEach((enc) => {
      test(`key ${type} > alg ${alg} > ${enc}`, success, eKey, dKey, alg, enc)
      test(`key ${type} > alg ${alg} > ${enc} (key as bare input)`, success, pub, key, alg, enc)
      if (keyObjectSupported) {
        test(`key ${type} > alg ${alg} > ${enc} (key as keyObject)`, success, eKey.keyObject, dKey.keyObject, alg, enc)
      }
      test(`key ${type} > alg ${alg} > ${enc} (key as JWK)`, success, eKey.toJWK(false), dKey.toJWK(true), alg, enc)
      test(`key ${type} > alg ${alg} > ${enc} (negative cases)`, failure, eKey, dKey, alg, enc)
      test(`key ${type} > alg ${alg} > ${enc} (negative cases, key as bare input)`, failure, pub, key, alg, enc)
      if (keyObjectSupported) {
        test(`key ${type} > alg ${alg} > ${enc} (negative cases, key as keyObject)`, failure, eKey.keyObject, dKey.keyObject, alg, enc)
      }
      test(`key ${type} > alg ${alg} > ${enc} (negative cases, key as JWK)`, failure, eKey.toJWK(false), dKey.toJWK(true), alg, enc)
    })
  })
}
