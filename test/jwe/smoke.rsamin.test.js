const test = require('ava')

const { JWK: { asKey, generateSync } } = require('../..')
const registry = require('../../lib/registry')

const { JWE: { success, failure } } = require('../macros')

const ENCS = [...registry.JWA.encrypt.keys()]

{
  const rsa = generateSync('RSA')
  const dKey = asKey({ kty: 'RSA', e: rsa.e, n: rsa.n, d: rsa.d }, { calculateMissingRSAPrimes: true })
  const eKey = asKey({ kty: 'RSA', e: rsa.e, n: rsa.n })
  eKey.algorithms('wrapKey').forEach((alg) => {
    ENCS.forEach((enc) => {
      test(`key RSA (min) > alg ${alg} > ${enc}`, success, eKey, dKey, alg, enc)
      test(`key RSA (min) > alg ${alg} > ${enc} (negative cases)`, failure, eKey, dKey, alg, enc)
    })
  })
}
