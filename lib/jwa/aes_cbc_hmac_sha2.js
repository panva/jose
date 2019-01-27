const { createCipheriv, createDecipheriv } = require('crypto')
const { timingSafeEqual } = require('crypto')
const { strict: assert } = require('assert')

const { TODO } = require('../errors')
const uint64be = require('../help/uint64be')

const ivCheck = (iv) => {
  if (!iv || iv.length !== 16) {
    throw new TODO('invalid iv')
  }
}

const encrypt = (size, sign, { keyObject }, cleartext, { iv, aad = Buffer.alloc(0) }) => {
  const key = keyObject.export()
  ivCheck(iv)

  const keySize = size / 8
  const encKey = key.slice(keySize)
  const cipher = createCipheriv(`AES-${size}-CBC`, encKey, iv)
  const ciphertext = Buffer.concat([cipher.update(cleartext), cipher.final()])
  const macData = Buffer.concat([aad, iv, ciphertext, uint64be(aad.length * 8)])

  const macKey = key.slice(0, keySize)
  const tag = sign({ keyObject: macKey }, macData).slice(0, keySize)

  return { ciphertext, tag }
}

const verify = (actual, expected) => {
  if (expected.length !== actual.length) {
    return timingSafeEqual(actual, Buffer.allocUnsafe(actual.length))
  }

  return timingSafeEqual(actual, expected)
}

const decrypt = (size, sign, { keyObject }, ciphertext, { iv, tag = Buffer.alloc(0), aad = Buffer.alloc(0) }) => {
  const key = keyObject.export()
  ivCheck(iv)

  const keySize = size / 8
  const encKey = key.slice(keySize)
  const macKey = key.slice(0, keySize)

  const macData = Buffer.concat([aad, iv, ciphertext, uint64be(aad.length * 8)])

  const expectedTag = sign({ keyObject: macKey }, macData, tag).slice(0, keySize)

  if (!verify(tag, expectedTag)) {
    throw new TODO('mac check failed')
  }

  const cipher = createDecipheriv(`AES-${size}-CBC`, encKey, iv)

  return Buffer.concat([cipher.update(ciphertext), cipher.final()])
}

module.exports = (JWA) => {
  ['A128CBC-HS256', 'A192CBC-HS384', 'A256CBC-HS512'].forEach((jwaAlg) => {
    const size = parseInt(jwaAlg.substr(1, 3), 10)

    assert(!JWA.encrypt.has(jwaAlg), `encrypt alg ${jwaAlg} already registered`)
    assert(!JWA.decrypt.has(jwaAlg), `decrypt alg ${jwaAlg} already registered`)

    JWA.encrypt.set(jwaAlg, encrypt.bind(undefined, size, JWA.sign.get(`HS${size * 2}`)))
    JWA.decrypt.set(jwaAlg, decrypt.bind(undefined, size, JWA.sign.get(`HS${size * 2}`)))
  })
}
