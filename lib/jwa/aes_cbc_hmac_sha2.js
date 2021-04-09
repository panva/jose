const { createCipheriv, createDecipheriv, getCiphers } = require('crypto')

const uint64be = require('../help/uint64be')
const timingSafeEqual = require('../help/timing_safe_equal')
const { KEYOBJECT } = require('../help/consts')
const { JWEInvalid, JWEDecryptionFailed } = require('../errors')

const checkInput = function (size, iv, tag) {
  if (iv.length !== 16) {
    throw new JWEInvalid('invalid iv')
  }
  if (arguments.length === 3) {
    if (tag.length !== size / 8) {
      throw new JWEInvalid('invalid tag')
    }
  }
}

const encrypt = (size, sign, { [KEYOBJECT]: keyObject }, cleartext, { iv, aad = Buffer.alloc(0) }) => {
  const key = keyObject.export()
  checkInput(size, iv)

  const keySize = size / 8
  const encKey = key.slice(keySize)
  const cipher = createCipheriv(`aes-${size}-cbc`, encKey, iv)
  const ciphertext = Buffer.concat([cipher.update(cleartext), cipher.final()])
  const macData = Buffer.concat([aad, iv, ciphertext, uint64be(aad.length * 8)])

  const macKey = key.slice(0, keySize)
  const tag = sign({ [KEYOBJECT]: macKey }, macData).slice(0, keySize)

  return { ciphertext, tag }
}

const decrypt = (size, sign, { [KEYOBJECT]: keyObject }, ciphertext, { iv, tag = Buffer.alloc(0), aad = Buffer.alloc(0) }) => {
  checkInput(size, iv, tag)

  const keySize = size / 8
  const key = keyObject.export()
  const encKey = key.slice(keySize)
  const macKey = key.slice(0, keySize)

  const macData = Buffer.concat([aad, iv, ciphertext, uint64be(aad.length * 8)])
  const expectedTag = sign({ [KEYOBJECT]: macKey }, macData, tag).slice(0, keySize)
  const macCheckPassed = timingSafeEqual(tag, expectedTag)

  if (!macCheckPassed) {
    throw new JWEDecryptionFailed()
  }

  let cleartext
  try {
    const cipher = createDecipheriv(`aes-${size}-cbc`, encKey, iv)
    cleartext = Buffer.concat([cipher.update(ciphertext), cipher.final()])
  } catch (err) {}

  if (!cleartext) {
    throw new JWEDecryptionFailed()
  }

  return cleartext
}

module.exports = (JWA, JWK) => {
  ['A128CBC-HS256', 'A192CBC-HS384', 'A256CBC-HS512'].forEach((jwaAlg) => {
    const size = parseInt(jwaAlg.substr(1, 3), 10)
    const sign = JWA.sign.get(`HS${size * 2}`)
    if (getCiphers().includes(`aes-${size}-cbc`)) {
      JWA.encrypt.set(jwaAlg, encrypt.bind(undefined, size, sign))
      JWA.decrypt.set(jwaAlg, decrypt.bind(undefined, size, sign))
      JWK.oct.encrypt[jwaAlg] = JWK.oct.decrypt[jwaAlg] = key => (key.use === 'enc' || key.use === undefined) && key.length / 2 === size
    }
  })
}
