const test = require('ava')

const { randomBytes } = require('crypto')

const { edDSASupported, keyObjectSupported } = require('../../lib/help/runtime_support')
const { JWK: { asKey, generateSync } } = require('../..')

const fixtures = require('../fixtures')

const { JWS: { success, failure } } = require('../macros')

Object.entries(fixtures.PEM).forEach(([type, { private: key, public: pub }]) => {
  if ('electron' in process.versions && (type.startsWith('X') || type === 'Ed448' || type === 'secp256k1')) return
  if (!edDSASupported && (type.startsWith('Ed') || type.startsWith('X'))) return

  const sKey = asKey(key)
  const vKey = asKey(pub)

  sKey.algorithms('sign').forEach((alg) => {
    test(`key ${type} > alg ${alg}`, success, sKey, vKey, alg)
    test(`key ${type} > alg ${alg} (key as bare input)`, success, key, pub, alg)
    if (keyObjectSupported) {
      test(`key ${type} > alg ${alg} (key as keyObject)`, success, sKey.keyObject, vKey.keyObject, alg)
    }
    test(`key ${type} > alg ${alg} (key as JWK)`, success, sKey.toJWK(true), vKey.toJWK(false), alg)
    test(`key ${type} > alg ${alg} (negative cases)`, failure, sKey, vKey, alg)
    test(`key ${type} > alg ${alg} (negative cases, key as bare input)`, failure, key, pub, alg)
    if (keyObjectSupported) {
      test(`key ${type} > alg ${alg} (negative cases, key as keyObject)`, failure, sKey.keyObject, vKey.keyObject, alg)
    }
    test(`key ${type} > alg ${alg} (negative cases, key as JWK)`, failure, sKey.toJWK(true), vKey.toJWK(false), alg)
  })
})

const sk = randomBytes(32)
const sym = asKey(sk)
sym.algorithms('sign').forEach((alg) => {
  test(`key oct > alg ${alg}`, success, sym, sym, alg)
  test(`key oct > alg ${alg} (key as bare input)`, success, sk, sk, alg)
  if (keyObjectSupported) {
    test(`key oct > alg ${alg} (key as keyObject)`, success, sym.keyObject, sym.keyObject, alg)
  }
  test(`key oct > alg ${alg} (key as JWK)`, success, sym.toJWK(true), sym.toJWK(true), alg)
  test(`key oct > alg ${alg} (negative cases)`, failure, sym, sym, alg)
  test(`key oct > alg ${alg} (negative cases, key as bare input)`, failure, sk, sk, alg)
  if (keyObjectSupported) {
    test(`key oct > alg ${alg} (negative cases, key as keyObject)`, failure, sym.keyObject, sym.keyObject, alg)
  }
  test(`key oct > alg ${alg} (negative cases, key as JWK)`, failure, sym.toJWK(true), sym.toJWK(true), alg)
})

{
  const rsa = generateSync('RSA')
  const sKey = asKey({ kty: 'RSA', e: rsa.e, n: rsa.n, d: rsa.d }, { calculateMissingRSAPrimes: true })
  const vKey = asKey({ kty: 'RSA', e: rsa.e, n: rsa.n })
  sKey.algorithms('sign').forEach((alg) => {
    test(`key RSA (min) > alg ${alg}`, success, sKey, vKey, alg)
    test(`key RSA (min) > alg ${alg} (negative cases)`, failure, sKey, vKey, alg)
  })
}
