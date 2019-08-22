const test = require('ava')

const { edDSASupported } = require('../../lib/help/node_support')
const { JWK: { asKey, generateSync } } = require('../..')

const fixtures = require('../fixtures')

const { JWS: { success, failure } } = require('../macros')

Object.entries(fixtures.PEM).forEach(([type, { private: key, public: pub }]) => {
  if (type === 'P-256K') return
  if ('electron' in process.versions && (type.startsWith('X') || type === 'Ed448' || type === 'secp256k1')) return
  if (!edDSASupported && (type.startsWith('Ed') || type.startsWith('X'))) return

  const sKey = asKey(key)
  const vKey = asKey(pub)

  sKey.algorithms('sign').forEach((alg) => {
    test(`key ${type} > alg ${alg}`, success, sKey, vKey, alg)
    test(`key ${type} > alg ${alg} (negative cases)`, failure, sKey, vKey, alg)
  })
})

const sym = generateSync('oct')
sym.algorithms('sign').forEach((alg) => {
  test(`key ${sym.kty} > alg ${alg}`, success, sym, sym, alg)
  test(`key ${sym.kty} > alg ${alg} (negative cases)`, failure, sym, sym, alg)
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
