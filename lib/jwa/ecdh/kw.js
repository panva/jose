const { improvedDH } = require('../../help/runtime_support')
const { KEYOBJECT } = require('../../help/consts')
const { generateSync } = require('../../jwk/generate')
const { name: secp256k1 } = require('../../jwk/key/secp256k1_crv')
const { ECDH_DERIVE_LENGTHS } = require('../../registry')

const derive = require('./derive')

const wrapKey = (wrap, derive, key, payload) => {
  const epk = generateSync(key.kty, key.crv)

  const derivedKey = derive(epk, key, payload)

  const result = wrap({ [KEYOBJECT]: derivedKey }, payload)
  result.header = result.header || {}
  Object.assign(result.header, { epk: { kty: key.kty, crv: key.crv, x: epk.x, y: epk.y } })

  return result
}

const unwrapKey = (unwrap, derive, key, payload, header) => {
  const { epk } = header
  const derivedKey = derive(key, epk, header)

  return unwrap({ [KEYOBJECT]: derivedKey }, payload, header)
}

module.exports = (JWA, JWK) => {
  ['ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW'].forEach((jwaAlg) => {
    const kw = jwaAlg.substr(-6)
    const kwWrap = JWA.keyManagementEncrypt.get(kw)
    const kwUnwrap = JWA.keyManagementDecrypt.get(kw)
    const keylen = parseInt(jwaAlg.substr(9, 3), 10)
    ECDH_DERIVE_LENGTHS.set(jwaAlg, keylen)

    if (kwWrap && kwUnwrap) {
      JWA.keyManagementEncrypt.set(jwaAlg, wrapKey.bind(undefined, kwWrap, derive.bind(undefined, jwaAlg, keylen)))
      JWA.keyManagementDecrypt.set(jwaAlg, unwrapKey.bind(undefined, kwUnwrap, derive.bind(undefined, jwaAlg, keylen)))
      JWK.EC.deriveKey[jwaAlg] = key => (key.use === 'enc' || key.use === undefined) && key.crv !== secp256k1

      if (improvedDH) {
        JWK.OKP.deriveKey[jwaAlg] = key => (key.use === 'enc' || key.use === undefined) && key.keyObject.asymmetricKeyType.startsWith('x')
      }
    }
  })
}
module.exports.wrapKey = wrapKey
module.exports.unwrapKey = unwrapKey
