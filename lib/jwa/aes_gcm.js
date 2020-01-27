const { createCipheriv, createDecipheriv, getCiphers } = require('crypto')

const { KEYOBJECT } = require('../help/consts')
const { JWEInvalid, JWEDecryptionFailed } = require('../errors')
const { asInput } = require('../help/key_object')

const checkInput = function (size, iv, tag) {
  if (iv.length !== 12) {
    throw new JWEInvalid('invalid iv')
  }
  if (arguments.length === 3) {
    if (tag.length !== 16) {
      throw new JWEInvalid('invalid tag')
    }
  }
}

const encrypt = (size, { [KEYOBJECT]: keyObject }, cleartext, { iv, aad = Buffer.alloc(0) }) => {
  const key = asInput(keyObject, false)
  checkInput(size, iv)

  const cipher = createCipheriv(`aes-${size}-gcm`, key, iv, { authTagLength: 16 })
  cipher.setAAD(aad)

  const ciphertext = Buffer.concat([cipher.update(cleartext), cipher.final()])
  const tag = cipher.getAuthTag()

  return { ciphertext, tag }
}

const decrypt = (size, { [KEYOBJECT]: keyObject }, ciphertext, { iv, tag = Buffer.alloc(0), aad = Buffer.alloc(0) }) => {
  const key = asInput(keyObject, false)
  checkInput(size, iv, tag)

  try {
    const cipher = createDecipheriv(`aes-${size}-gcm`, key, iv, { authTagLength: 16 })
    cipher.setAuthTag(tag)
    cipher.setAAD(aad)

    return Buffer.concat([cipher.update(ciphertext), cipher.final()])
  } catch (err) {
    throw new JWEDecryptionFailed()
  }
}

module.exports = (JWA, JWK) => {
  ['A128GCM', 'A192GCM', 'A256GCM'].forEach((jwaAlg) => {
    const size = parseInt(jwaAlg.substr(1, 3), 10)
    if (getCiphers().includes(`aes-${size}-gcm`)) {
      JWA.encrypt.set(jwaAlg, encrypt.bind(undefined, size))
      JWA.decrypt.set(jwaAlg, decrypt.bind(undefined, size))
      JWK.oct.encrypt[jwaAlg] = JWK.oct.decrypt[jwaAlg] = key => (key.use === 'enc' || key.use === undefined) && key.length === size
    }
  })
}
