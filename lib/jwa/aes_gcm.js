const { createCipheriv, createDecipheriv } = require('crypto')
const { strict: assert } = require('assert')
const { JWEInvalid, JWEDecryptionFailed } = require('../errors')

const checkInput = (size, keyLen, iv, tag) => {
  if (keyLen * 8 !== size) {
    throw new JWEInvalid('invalid key length')
  }
  if (!iv) {
    throw new JWEInvalid('missing iv')
  }
  if (iv.length !== 12) {
    throw new JWEInvalid('invalid iv')
  }
  if (tag !== undefined && tag.length !== 16) {
    throw new JWEInvalid('invalid tag length')
  }
}

const encrypt = (size, { keyObject }, cleartext, { iv, aad = Buffer.alloc(0) }) => {
  checkInput(size, keyObject.symmetricKeySize, iv)

  const cipher = createCipheriv(`AES-${size}-GCM`, keyObject, iv)
  cipher.setAAD(aad)

  const ciphertext = Buffer.concat([cipher.update(cleartext), cipher.final()])
  const tag = cipher.getAuthTag()

  return { ciphertext, tag }
}

const decrypt = (size, { keyObject }, ciphertext, { iv, tag = Buffer.alloc(0), aad = Buffer.alloc(0) }) => {
  checkInput(size, keyObject.symmetricKeySize, iv, tag, aad)

  try {
    const cipher = createDecipheriv(`AES-${size}-GCM`, keyObject, iv)
    cipher.setAuthTag(tag)
    cipher.setAAD(aad)

    return Buffer.concat([cipher.update(ciphertext), cipher.final()])
  } catch (err) {
    throw new JWEDecryptionFailed()
  }
}

module.exports = (JWA) => {
  ['A128GCM', 'A192GCM', 'A256GCM'].forEach((jwaAlg) => {
    const size = parseInt(jwaAlg.substr(1, 3), 10)

    assert(!JWA.encrypt.has(jwaAlg), `encrypt alg ${jwaAlg} already registered`)
    assert(!JWA.decrypt.has(jwaAlg), `decrypt alg ${jwaAlg} already registered`)

    JWA.encrypt.set(jwaAlg, encrypt.bind(undefined, size))
    JWA.decrypt.set(jwaAlg, decrypt.bind(undefined, size))
  })
}
