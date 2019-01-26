const { strict: assert } = require('assert')

const generateIV = require('../help/generate_iv')
const base64url = require('../help/base64url')

module.exports = (JWA) => {
  ['A128GCMKW', 'A192GCMKW', 'A256GCMKW'].forEach((jwaAlg) => {
    assert(!JWA.wrapKey.has(jwaAlg), `wrapKey alg ${jwaAlg} already registered`)
    assert(!JWA.unwrapKey.has(jwaAlg), `unwrapKey alg ${jwaAlg} already registered`)

    const encAlg = jwaAlg.substr(0, 7)
    const encrypt = JWA.encrypt.get(encAlg)
    const decrypt = JWA.decrypt.get(encAlg)

    JWA.wrapKey.set(jwaAlg, (...args) => {
      const iv = generateIV(jwaAlg)
      const { ciphertext, tag } = encrypt(...args, { iv })
      return [ciphertext, { tag: base64url.encode(tag), iv: base64url.encode(iv) }]
    })
    JWA.unwrapKey.set(jwaAlg, decrypt)
  })
}
