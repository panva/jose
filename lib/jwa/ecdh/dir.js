const { strict: assert } = require('assert')

const { KEYLENGTHS } = require('../../help/consts')
const { generateSync } = require('../../jwk/generate')

const derive = require('./derive')

const wrapKey = (key, payload, { enc }) => {
  const epk = generateSync(key.kty, key.crv)

  const derivedKey = derive(enc, KEYLENGTHS[enc], epk, key)

  return {
    wrapped: derivedKey,
    header: { epk: { kty: key.kty, crv: key.crv, x: epk.x, y: epk.y } }
  }
}

const unwrapKey = (key, payload, { apu, apv, epk, enc }) => {
  return derive(enc, KEYLENGTHS[enc], key, epk, { apu, apv })
}

const ALG = 'ECDH-ES'

module.exports = (JWA) => {
  assert(!JWA.keyManagementEncrypt.has(ALG), `keyManagementEncrypt alg ${ALG} already registered`)
  assert(!JWA.keyManagementDecrypt.has(ALG), `keyManagementDecrypt alg ${ALG} already registered`)

  JWA.keyManagementEncrypt.set(ALG, wrapKey)
  JWA.keyManagementDecrypt.set(ALG, unwrapKey)
}
