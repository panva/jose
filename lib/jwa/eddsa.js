const { strict: assert } = require('assert')
const { sign: signOneShot, verify: verifyOneShot } = require('crypto')

const { KEYOBJECT } = require('../help/consts')

const sign = ({ [KEYOBJECT]: keyObject }, payload) => {
  return signOneShot(undefined, payload, keyObject)
}

const verify = ({ [KEYOBJECT]: keyObject }, payload, signature) => {
  return verifyOneShot(undefined, payload, keyObject, signature)
}

const ALG = 'EdDSA'

module.exports = (JWA) => {
  assert(!JWA.sign.has(ALG), `sign alg ${ALG} already registered`)
  assert(!JWA.verify.has(ALG), `verify alg ${ALG} already registered`)

  JWA.sign.set(ALG, sign)
  JWA.verify.set(ALG, verify)
}
