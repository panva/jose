const { createCipheriv, createDecipheriv } = require('crypto')
const { strict: assert } = require('assert')

const encrypt = (size, { keyObject }, cleartext, { iv, aad = Buffer.alloc(0) }) => {
  // TODO: commonCheck

  const cipher = createCipheriv(`AES-${size}-GCM`, keyObject, iv)
  cipher.setAAD(aad)

  const ciphertext = Buffer.concat([cipher.update(cleartext), cipher.final()])
  const tag = cipher.getAuthTag()

  return { ciphertext, tag }
}

const decrypt = (size, { keyObject }, ciphertext, { iv, tag = Buffer.alloc(0), aad = Buffer.alloc(0) }) => {
  // TODO: commonCheck

  const cipher = createDecipheriv(`AES-${size}-GCM`, keyObject, iv)
  cipher.setAuthTag(tag)
  cipher.setAAD(aad)

  return Buffer.concat([cipher.update(ciphertext), cipher.final()])
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
