const { strict: assert } = require('assert')

const KEYLENGTHS = require('../../help/key_lengths')
const { generateSync } = require('../../jwk/generate')

const derive = require('./derive')

const wrapKey = (key, payload, { enc }) => {
  const epk = generateSync('EC', key.crv)

  const derivedKey = derive(enc, KEYLENGTHS[enc], epk, key)

  return {
    wrapped: derivedKey,
    header: { epk: { kty: 'EC', crv: key.crv, x: epk.x, y: epk.y } }
  }
}

const unwrapKey = (key, payload, { apu, apv, epk, enc }) => {
  return derive(enc, KEYLENGTHS[enc], key, epk, { apu, apv })
}

const ALG = 'ECDH-ES'

module.exports = (JWA) => {
  assert(!JWA.wrapKey.has(ALG), `wrapKey alg ${ALG} already registered`)
  assert(!JWA.unwrapKey.has(ALG), `unwrapKey alg ${ALG} already registered`)

  JWA.wrapKey.set(ALG, wrapKey)
  JWA.unwrapKey.set(ALG, unwrapKey)
}
