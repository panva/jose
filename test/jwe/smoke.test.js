const test = require('ava')

const { randomBytes } = require('crypto')

const { encrypt, decrypt } = require('../../lib/jwe')
const { JWK: { importKey } } = require('../..')

const PAYLOAD = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
const ENCS = [
  'A128GCM',
  'A192GCM',
  'A256GCM',
  'A128CBC-HS256',
  'A192CBC-HS384',
  'A256CBC-HS512'
]

const fixtures = require('../fixtures')

const smoke = (t, eKey, dKey, alg, enc) => {
  const encrypted = encrypt(PAYLOAD, eKey, { alg, enc })
  t.truthy(encrypted)
  const decrypted = decrypt(encrypted, dKey)
  t.deepEqual(decrypted, Buffer.from(PAYLOAD))
  const encrypted2 = encrypt(PAYLOAD, dKey, { alg, enc })
  t.truthy(encrypted2)
  const decrypted2 = decrypt(encrypted, dKey)
  t.deepEqual(decrypted2, Buffer.from(PAYLOAD))
}

Object.entries(fixtures.PEM).forEach(([type, { private: key, public: pub }]) => {
  const eKey = importKey(pub)
  const dKey = importKey(key)

  eKey.algorithms('wrapKey').forEach((alg) => {
    ENCS.forEach((enc) => {
      if (alg === 'ECDH-ES' && ['A192CBC-HS384', 'A256CBC-HS512'].includes(enc)) return
      test(`key ${type} > alg ${alg} > ${enc}`, smoke, eKey, dKey, alg, enc)
    })
  })
});

[16, 24, 32, 48, 64].forEach((len) => {
  const sym = importKey(randomBytes(len))
  sym.algorithms('wrapKey').forEach((alg) => {
    sym.algorithms('encrypt').forEach((enc) => {
      test(`key ${sym.kty} > alg ${alg} > ${enc}`, smoke, sym, sym, alg, enc)
    })
  })
})
