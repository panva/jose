const test = require('ava')

const { randomBytes } = require('crypto')

const { edDSASupported } = require('../../lib/help/node_support')
const { JWK: { asKey, generateSync } } = require('../..')

const ENCS = [
  'A128GCM',
  'A192GCM',
  'A256GCM',
  'A128CBC-HS256',
  'A192CBC-HS384',
  'A256CBC-HS512'
]

const fixtures = require('../fixtures')

const { JWE: { success, failure } } = require('../macros')

Object.entries(fixtures.PEM).forEach(([type, { private: key, public: pub }]) => {
  if (type === 'P-256K') return
  if ('electron' in process.versions && (type.startsWith('X') || type === 'Ed448' || type === 'secp256k1')) return
  if (!edDSASupported && (type.startsWith('Ed') || type.startsWith('X'))) return

  const eKey = asKey(pub)
  const dKey = asKey(key)

  ;[...eKey.algorithms('wrapKey'), ...eKey.algorithms('deriveKey')].forEach((alg) => {
    ENCS.forEach((enc) => {
      if (alg === 'ECDH-ES' && ['A192CBC-HS384', 'A256CBC-HS512'].includes(enc)) return
      test(`key ${type} > alg ${alg} > ${enc}`, success, eKey, dKey, alg, enc)
      test(`key ${type} > alg ${alg} > ${enc} (negative cases)`, failure, eKey, dKey, alg, enc)
    })
  })
})

;[16, 24, 32, 48, 64].forEach((len) => {
  const sym = asKey(randomBytes(len))
  ;[...sym.algorithms('wrapKey'), ...sym.algorithms('deriveKey')].forEach((alg) => {
    sym.algorithms('encrypt').forEach((enc) => {
      test(`key ${sym.kty} > alg ${alg} > ${enc}`, success, sym, sym, alg, enc)
      test(`key ${sym.kty} > alg ${alg} > ${enc} (negative cases)`, failure, sym, sym, alg, enc)
    })
  })
})

{
  const rsa = generateSync('RSA')
  const dKey = asKey({ kty: 'RSA', e: rsa.e, n: rsa.n, d: rsa.d }, { calculateMissingRSAPrimes: true })
  const eKey = asKey({ kty: 'RSA', e: rsa.e, n: rsa.n })
  eKey.algorithms('wrapKey').forEach((alg) => {
    ENCS.forEach((enc) => {
      if (alg === 'ECDH-ES' && ['A192CBC-HS384', 'A256CBC-HS512'].includes(enc)) return
      test(`key RSA (min) > alg ${alg} > ${enc}`, success, eKey, dKey, alg, enc)
      test(`key RSA (min) > alg ${alg} > ${enc} (negative cases)`, failure, eKey, dKey, alg, enc)
    })
  })
}
