const { improvedDH } = require('../../help/runtime_support')
const { KEYLENGTHS } = require('../../registry')
const { generateSync } = require('../../jwk/generate')

const derive = require('./derive')

const wrapKey = (key, payload, { enc }) => {
  const epk = generateSync(key.kty, key.crv)

  const derivedKey = derive(enc, KEYLENGTHS.get(enc), epk, key)

  return {
    wrapped: derivedKey,
    header: { epk: { kty: key.kty, crv: key.crv, x: epk.x, y: epk.y } }
  }
}

const unwrapKey = (key, payload, header) => {
  const { enc, epk } = header
  return derive(enc, KEYLENGTHS.get(enc), key, epk, header)
}

module.exports = (JWA, JWK) => {
  JWA.keyManagementEncrypt.set('ECDH-ES', wrapKey)
  JWA.keyManagementDecrypt.set('ECDH-ES', unwrapKey)
  JWK.EC.deriveKey['ECDH-ES'] = key => (key.use === 'enc' || key.use === undefined) && key.crv !== 'secp256k1'

  if (improvedDH) {
    JWK.OKP.deriveKey['ECDH-ES'] = key => (key.use === 'enc' || key.use === undefined) && key.keyObject.asymmetricKeyType.startsWith('x')
  }
}
