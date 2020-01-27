const { createCipheriv, createDecipheriv, getCiphers } = require('crypto')

const uint64be = require('../help/uint64be')
const timingSafeEqual = require('../help/timing_safe_equal')
const { KEYOBJECT } = require('../help/consts')
const { asInput } = require('../help/key_object')

const checkInput = (data) => {
  if (data !== undefined && data.length % 8 !== 0) {
    throw new Error('invalid data length')
  }
}

const IV = Buffer.alloc(8, 'a6', 'hex')

const xor = (a, b) => {
  const len = Math.max(a.length, b.length)
  const result = Buffer.alloc(len)
  for (let idx = 0; len > idx; idx++) {
    result[idx] = (a[idx] || 0) ^ (b[idx] || 0)
  }

  return result
}

const split = (input, size) => {
  const output = []
  for (let idx = 0; input.length > idx; idx += size) {
    output.push(input.slice(idx, idx + size))
  }
  return output
}

const wrapKey = (size, { [KEYOBJECT]: keyObject }, payload) => {
  const key = asInput(keyObject, false)
  const iv = Buffer.alloc(16)
  let R = split(payload, 8)
  let A
  let B
  let count
  A = IV
  for (let jdx = 0; jdx < 6; jdx++) {
    for (let idx = 0; R.length > idx; idx++) {
      count = (R.length * jdx) + idx + 1
      const cipher = createCipheriv(`aes${size}`, key, iv)
      B = Buffer.concat([A, R[idx]])
      B = cipher.update(B)

      A = xor(B.slice(0, 8), uint64be(count))
      R[idx] = B.slice(8, 16)
    }
  }
  R = [A].concat(R)

  return { wrapped: Buffer.concat(R) }
}

const unwrapKey = (size, { [KEYOBJECT]: keyObject }, payload) => {
  const key = asInput(keyObject, false)
  checkInput(payload)

  const iv = Buffer.alloc(16)

  let R = split(payload, 8)
  let A
  let B
  let count
  A = R[0]
  R = R.slice(1)
  for (let jdx = 5; jdx >= 0; --jdx) {
    for (let idx = R.length - 1; idx >= 0; --idx) {
      count = (R.length * jdx) + idx + 1
      B = xor(A, uint64be(count))
      B = Buffer.concat([B, R[idx], iv])
      const cipher = createDecipheriv(`aes${size}`, key, iv)
      B = cipher.update(B)

      A = B.slice(0, 8)
      R[idx] = B.slice(8, 16)
    }
  }

  if (!timingSafeEqual(IV, A)) {
    throw new Error('unwrap failed')
  }

  return Buffer.concat(R)
}

module.exports = (JWA, JWK) => {
  ['A128KW', 'A192KW', 'A256KW'].forEach((jwaAlg) => {
    const size = parseInt(jwaAlg.substr(1, 3), 10)
    if (getCiphers().includes(`aes${size}`)) {
      JWA.keyManagementEncrypt.set(jwaAlg, wrapKey.bind(undefined, size))
      JWA.keyManagementDecrypt.set(jwaAlg, unwrapKey.bind(undefined, size))
      JWK.oct.wrapKey[jwaAlg] = JWK.oct.unwrapKey[jwaAlg] = key => (key.use === 'enc' || key.use === undefined) && key.length === size
    }
  })
}
