const base64url = require('../../lib/help/base64url')
const withoutRandom = ({ p2s, epk, iv, tag, ...rest } = {}) => rest
const decodeWithoutRandom = (input) => {
  return withoutRandom(base64url.JSON.decode(input))
}

module.exports = {
  enc: {
    compact (t, actual, expected) {
      const partsA = actual.split('.')
      const partsE = expected.split('.')

      partsE.forEach((part, i) => {
        t.is(partsA[i].length, part.length)
        if (i === 0) {
          t.deepEqual(decodeWithoutRandom(partsA[i]), decodeWithoutRandom(part))
        }
      })
    },
    flattened (t, actual, expected) {
      t.deepEqual(Object.keys(expected).sort(), Object.keys(actual).sort())

      t.is(!actual.protected ^ !expected.protected, 0)

      if (expected.protected) {
        t.is(actual.protected.length, expected.protected.length)
        t.deepEqual(decodeWithoutRandom(actual.protected), decodeWithoutRandom(expected.protected))
      }

      t.is(actual.aad, expected.aad)
      t.deepEqual(actual.header, expected.header)
      t.deepEqual(actual.unprotected, expected.unprotected)

      t.is(!actual.recipients ^ !expected.recipients, 0)
      t.is(!actual.encrypted_key ^ !expected.encrypted_key, 0)

      if (expected.encrypted_key) {
        t.is(actual.encrypted_key.length, expected.encrypted_key.length)
      }
      t.is(actual.iv.length, expected.iv.length)
      t.is(actual.ciphertext.length, expected.ciphertext.length)
      t.is(actual.tag.length, expected.tag.length)
    },
    general (t, actual, expected) {
      t.deepEqual(Object.keys(expected).sort(), Object.keys(actual).sort())

      t.is(!actual.protected ^ !expected.protected, 0)

      if (expected.protected) {
        t.is(actual.protected.length, expected.protected.length)
        t.deepEqual(decodeWithoutRandom(actual.protected), decodeWithoutRandom(expected.protected))
      }

      t.is(actual.aad, expected.aad)
      t.deepEqual(actual.unprotected, expected.unprotected)

      t.is(actual.iv.length, expected.iv.length)
      t.is(actual.ciphertext.length, expected.ciphertext.length)
      t.is(actual.tag.length, expected.tag.length)

      t.is(!actual.recipients ^ !expected.recipients, 0)

      if (actual.recipients) {
        t.true(Array.isArray(actual.recipients))
        expected.recipients.forEach((eRecipient, i) => {
          const aRecipient = actual.recipients[i]
          t.deepEqual(withoutRandom(aRecipient.header), withoutRandom(eRecipient.header))
          t.is(!aRecipient.encrypted_key ^ !eRecipient.encrypted_key, 0)

          if (eRecipient.encrypted_key) {
            t.is(aRecipient.encrypted_key.length, eRecipient.encrypted_key.length)
          }
        })
      }
    }
  }
}
