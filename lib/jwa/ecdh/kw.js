const { strict: assert } = require('assert')

const ECKey = require('../../jwk/key/ec')
const derive = require('./derive')

const wrapKey = (kw, derive, key, payload) => {
  const epk = ECKey.generateSync(key.crv)

  const derivedKey = derive(epk, key, payload)

  const result = kw({ keyObject: derivedKey }, payload)
  result.header = { epk: { kty: 'EC', crv: key.crv, x: epk.x, y: epk.y } }

  return result
}

const unwrapKey = (kw, derive, key, payload, { apu, apv, epk }) => {
  const derivedKey = derive(key, epk, { apu, apv })
  return kw({ keyObject: derivedKey }, payload)
}

module.exports = (JWA) => {
  ['ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW'].forEach((jwaAlg) => {
    assert(!JWA.wrapKey.has(jwaAlg), `wrapKey alg ${jwaAlg} already registered`)
    assert(!JWA.unwrapKey.has(jwaAlg), `unwrapKey alg ${jwaAlg} already registered`)

    const kw = jwaAlg.substr(-6)
    const kwWrap = JWA.wrapKey.get(kw)
    const kwUnwrap = JWA.unwrapKey.get(kw)
    const keylen = parseInt(jwaAlg.substr(9, 3), 10)

    JWA.wrapKey.set(jwaAlg, wrapKey.bind(undefined, kwWrap, derive.bind(undefined, jwaAlg, keylen)))
    JWA.unwrapKey.set(jwaAlg, unwrapKey.bind(undefined, kwUnwrap, derive.bind(undefined, jwaAlg, keylen)))
  })
}
