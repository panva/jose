const { strict: assert } = require('assert')

const { KEYOBJECT } = require('../../help/consts')
const { generateSync } = require('../../jwk/generate')

const derive = require('./derive')

const wrapKey = (wrap, derive, key, payload) => {
  const epk = generateSync(key.kty, key.crv)

  const derivedKey = derive(epk, key, payload)

  const result = wrap({ [KEYOBJECT]: derivedKey }, payload)
  result.header = { epk: { kty: key.kty, crv: key.crv, x: epk.x, y: epk.y } }

  return result
}

const unwrapKey = (unwrap, derive, key, payload, { apu, apv, epk }) => {
  const derivedKey = derive(key, epk, { apu, apv })

  return unwrap({ [KEYOBJECT]: derivedKey }, payload)
}

module.exports = (JWA) => {
  ['ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW'].forEach((jwaAlg) => {
    assert(!JWA.keyManagementEncrypt.has(jwaAlg), `keyManagementEncrypt alg ${jwaAlg} already registered`)
    assert(!JWA.keyManagementDecrypt.has(jwaAlg), `keyManagementDecrypt alg ${jwaAlg} already registered`)

    const kw = jwaAlg.substr(-6)
    const kwWrap = JWA.keyManagementEncrypt.get(kw)
    const kwUnwrap = JWA.keyManagementDecrypt.get(kw)
    const keylen = parseInt(jwaAlg.substr(9, 3), 10)

    JWA.keyManagementEncrypt.set(jwaAlg, wrapKey.bind(undefined, kwWrap, derive.bind(undefined, jwaAlg, keylen)))
    JWA.keyManagementDecrypt.set(jwaAlg, unwrapKey.bind(undefined, kwUnwrap, derive.bind(undefined, jwaAlg, keylen)))
  })
}
