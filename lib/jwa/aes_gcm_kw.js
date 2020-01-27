const generateIV = require('../help/generate_iv')
const base64url = require('../help/base64url')

module.exports = (JWA, JWK) => {
  ['A128GCMKW', 'A192GCMKW', 'A256GCMKW'].forEach((jwaAlg) => {
    const encAlg = jwaAlg.substr(0, 7)
    const size = parseInt(jwaAlg.substr(1, 3), 10)
    const encrypt = JWA.encrypt.get(encAlg)
    const decrypt = JWA.decrypt.get(encAlg)

    if (encrypt && decrypt) {
      JWA.keyManagementEncrypt.set(jwaAlg, (key, payload) => {
        const iv = generateIV(jwaAlg)
        const { ciphertext, tag } = encrypt(key, payload, { iv })
        return {
          wrapped: ciphertext,
          header: { tag: base64url.encodeBuffer(tag), iv: base64url.encodeBuffer(iv) }
        }
      })
      JWA.keyManagementDecrypt.set(jwaAlg, decrypt)
      JWK.oct.wrapKey[jwaAlg] = JWK.oct.unwrapKey[jwaAlg] = key => (key.use === 'enc' || key.use === undefined) && key.length === size
    }
  })
}
