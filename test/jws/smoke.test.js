const test = require('ava')

const { sign, verify } = require('../../lib/jws')
const { JWK: { importKey, generateSync } } = require('../..')

const PAYLOAD = {}

const fixtures = require('../fixtures')

const smoke = (t, sKey, vKey, alg) => {
  const signed = sign(PAYLOAD, sKey, { alg })
  t.truthy(signed)
  const verified = verify(signed, vKey)
  t.deepEqual(verified, {})
}

Object.entries(fixtures.PEM).forEach(([type, { private: key, public: pub }]) => {
  const sKey = importKey(key)
  const vKey = importKey(pub)

  sKey.algorithms('sign').forEach((alg) => {
    test(`key ${type} > alg ${alg}`, smoke, sKey, vKey, alg)
  })
})

const sym = generateSync('oct')
sym.algorithms('sign').forEach((alg) => {
  test(`key ${sym.kty} > alg ${alg}`, smoke, sym, sym, alg)
})
