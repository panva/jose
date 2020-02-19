const test = require('ava')

const { randomBytes } = require('crypto')

const { keyObjectSupported } = require('../../lib/help/runtime_support')
const { JWK: { asKey } } = require('../..')
const registry = require('../../lib/registry')

const { JWE: { success, failure } } = require('../macros')

const ENCS = [...registry.JWA.encrypt.keys()]

;[16, 24, 32, 48, 64].forEach((len) => {
  const sk = randomBytes(len)
  const sym = asKey(sk)
  ;[...sym.algorithms('wrapKey'), 'dir'].forEach((alg) => {
    (alg === 'dir' ? sym.algorithms('encrypt') : ENCS).forEach((enc) => {
      test(`key ${sym.kty}(${len * 8} bits) > alg ${alg} > ${enc}`, success, sym, sym, alg, enc)
      test(`key ${sym.kty}(${len * 8} bits) > alg ${alg} > ${enc} (key as bare input)`, success, sk, sk, alg, enc)
      if (keyObjectSupported) {
        test(`key ${sym.kty}(${len * 8} bits) > alg ${alg} > ${enc} (key as keyobject)`, success, sym.keyObject, sym.keyObject, alg, enc)
      }
      test(`key ${sym.kty}(${len * 8} bits) > alg ${alg} > ${enc} (key as JWK)`, success, sym.toJWK(true), sym.toJWK(true), alg, enc)
      test(`key ${sym.kty}(${len * 8} bits) > alg ${alg} > ${enc} (negative cases, key as bare input)`, failure, sk, sk, alg, enc)
      if (keyObjectSupported) {
        test(`key ${sym.kty}(${len * 8} bits) > alg ${alg} > ${enc} (negative cases, key as keyobject)`, failure, sym.keyObject, sym.keyObject, alg, enc)
      }
      test(`key ${sym.kty}(${len * 8} bits) > alg ${alg} > ${enc} (negative cases, key as JWK)`, failure, sym.toJWK(true), sym.toJWK(true), alg, enc)
    })
  })
})

{
  // PBES2 derive only
  const sk = Buffer.from('hunter2', 'utf-8')
  const sym = asKey(sk)
  sym.algorithms('deriveKey').forEach((alg) => {
    ENCS.forEach((enc) => {
      test(`key ${sym.kty}(password) > alg ${alg} > ${enc}`, success, sym, sym, alg, enc)
      test(`key ${sym.kty}(password) > alg ${alg} > ${enc} (key as bare input)`, success, sk, sk, alg, enc)
      if (keyObjectSupported) {
        test(`key ${sym.kty}(password) > alg ${alg} > ${enc} (key as keyobject)`, success, sym.keyObject, sym.keyObject, alg, enc)
      }
      test(`key ${sym.kty}(password) > alg ${alg} > ${enc} (key as JWK)`, success, sym.toJWK(true), sym.toJWK(true), alg, enc)
      test(`key ${sym.kty}(password) > alg ${alg} > ${enc} (negative cases, key as bare input)`, failure, sk, sk, alg, enc)
      if (keyObjectSupported) {
        test(`key ${sym.kty}(password) > alg ${alg} > ${enc} (negative cases, key as keyobject)`, failure, sym.keyObject, sym.keyObject, alg, enc)
      }
      test(`key ${sym.kty}(password) > alg ${alg} > ${enc} (negative cases, key as JWK)`, failure, sym.toJWK(true), sym.toJWK(true), alg, enc)
    })
  })
}
