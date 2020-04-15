const { createCipheriv, createDecipheriv, getCiphers } = require('crypto')

const { KEYOBJECT } = require('../help/consts')
const { asInput } = require('../help/key_object')

const checkInput = (data) => {
  if (data !== undefined && data.length % 8 !== 0) {
    throw new Error('invalid data length')
  }
}

const wrapKey = (alg, { [KEYOBJECT]: keyObject }, payload) => {
  const key = asInput(keyObject, false)
  const cipher = createCipheriv(alg, key, Buffer.alloc(8, 'a6', 'hex'))

  return { wrapped: Buffer.concat([cipher.update(payload), cipher.final()]) }
}

const unwrapKey = (alg, { [KEYOBJECT]: keyObject }, payload) => {
  const key = asInput(keyObject, false)
  checkInput(payload)
  const cipher = createDecipheriv(alg, key, Buffer.alloc(8, 'a6', 'hex'))

  return Buffer.concat([cipher.update(payload), cipher.final()])
}

module.exports = (JWA, JWK) => {
  ['A128KW', 'A192KW', 'A256KW'].forEach((jwaAlg) => {
    const size = parseInt(jwaAlg.substr(1, 3), 10)
    const alg = `aes${size}-wrap`
    if (getCiphers().includes(alg)) {
      JWA.keyManagementEncrypt.set(jwaAlg, wrapKey.bind(undefined, alg))
      JWA.keyManagementDecrypt.set(jwaAlg, unwrapKey.bind(undefined, alg))
      JWK.oct.wrapKey[jwaAlg] = JWK.oct.unwrapKey[jwaAlg] = key => (key.use === 'enc' || key.use === undefined) && key.length === size
    }
  })
}
