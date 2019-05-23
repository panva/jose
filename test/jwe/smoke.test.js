const test = require('ava')

const { randomBytes } = require('crypto')

const { encrypt, decrypt } = require('../../lib/jwe')
const { JWK: { importKey, generateSync }, errors } = require('../..')

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

const success = (t, eKey, dKey, alg, enc) => {
  const encrypted = encrypt(PAYLOAD, eKey, { alg, enc })
  t.truthy(encrypted)
  const decrypted = decrypt(encrypted, dKey)
  t.deepEqual(decrypted, Buffer.from(PAYLOAD))
  const encrypted2 = encrypt(PAYLOAD, dKey, { alg, enc })
  t.truthy(encrypted2)
  const decrypted2 = decrypt(encrypted, dKey)
  t.deepEqual(decrypted2, Buffer.from(PAYLOAD))
}

const failure = (t, eKey, dKey, alg, enc) => {
  const encrypted = encrypt.flattened(PAYLOAD, eKey, { alg, enc })
  t.truthy(encrypted)
  if (encrypted.encrypted_key) {
    const orig = encrypted.encrypted_key

    if (encrypted.encrypted_key.startsWith('-')) {
      encrypted.encrypted_key = `Q${encrypted.encrypted_key.substr(1)}`
    } else {
      encrypted.encrypted_key = `-${encrypted.encrypted_key.substr(1)}`
    }
    t.throws(() => {
      decrypt(encrypted, dKey)
    }, { instanceOf: errors.JWEDecryptionFailed, code: 'ERR_JWE_DECRYPTION_FAILED' })
    encrypted.encrypted_key = encrypted.encrypted_key.substr(4)
    t.throws(() => {
      decrypt(encrypted, dKey)
    }, { instanceOf: errors.JWEDecryptionFailed, code: 'ERR_JWE_DECRYPTION_FAILED' })
    encrypted.encrypted_key = orig
  }

  (() => {
    const orig = encrypted.protected

    if (encrypted.protected.startsWith('-')) {
      encrypted.protected = `Q${encrypted.protected.substr(1)}`
    } else {
      encrypted.protected = `-${encrypted.protected.substr(1)}`
    }
    t.throws(() => {
      decrypt(encrypted, dKey)
    }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'could not parse JWE protected header' })
    encrypted.protected = orig
  })()

  ;(() => {
    const orig = encrypted.protected
    delete encrypted.protected
    t.throws(() => {
      decrypt(encrypted, dKey)
    }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'missing Key Management algorithm' })
    encrypted.protected = orig
  })()

  ;['iv', 'ciphertext', 'tag'].forEach((prop) => {
    const orig = encrypted[prop]

    if (encrypted[prop].startsWith('-')) {
      encrypted[prop] = `Q${encrypted[prop].substr(1)}`
    } else {
      encrypted[prop] = `-${encrypted[prop].substr(1)}`
    }
    t.throws(() => {
      decrypt(encrypted, dKey)
    }, { instanceOf: errors.JWEDecryptionFailed, code: 'ERR_JWE_DECRYPTION_FAILED' })
    encrypted[prop] = orig
  })

  ;['iv', 'tag'].forEach((prop) => {
    const orig = encrypted[prop]

    encrypted[prop] = encrypted[prop].substr(4)
    t.throws(() => {
      decrypt(encrypted, dKey)
    }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID' })
    encrypted[prop] = orig
  })
}

Object.entries(fixtures.PEM).forEach(([type, { private: key, public: pub }]) => {
  const eKey = importKey(pub)
  const dKey = importKey(key)

  ;[...eKey.algorithms('wrapKey'), ...eKey.algorithms('deriveKey')].forEach((alg) => {
    ENCS.forEach((enc) => {
      if (alg === 'ECDH-ES' && ['A192CBC-HS384', 'A256CBC-HS512'].includes(enc)) return
      test(`key ${type} > alg ${alg} > ${enc}`, success, eKey, dKey, alg, enc)
      test(`key ${type} > alg ${alg} > ${enc} (negative cases)`, failure, eKey, dKey, alg, enc)
    })
  })
})

;[16, 24, 32, 48, 64].forEach((len) => {
  const sym = importKey(randomBytes(len))
  ;[...sym.algorithms('wrapKey'), ...sym.algorithms('deriveKey')].forEach((alg) => {
    sym.algorithms('encrypt').forEach((enc) => {
      test(`key ${sym.kty} > alg ${alg} > ${enc}`, success, sym, sym, alg, enc)
      test(`key ${sym.kty} > alg ${alg} > ${enc} (negative cases)`, failure, sym, sym, alg, enc)
    })
  })
})

{
  const rsa = generateSync('RSA')
  const dKey = importKey({ kty: 'RSA', e: rsa.e, n: rsa.n, d: rsa.d })
  const eKey = importKey({ kty: 'RSA', e: rsa.e, n: rsa.n })
  eKey.algorithms('wrapKey').forEach((alg) => {
    ENCS.forEach((enc) => {
      if (alg === 'ECDH-ES' && ['A192CBC-HS384', 'A256CBC-HS512'].includes(enc)) return
      test(`key RSA (min) > alg ${alg} > ${enc}`, success, eKey, dKey, alg, enc)
      test(`key RSA (min) > alg ${alg} > ${enc} (negative cases)`, failure, eKey, dKey, alg, enc)
    })
  })
}
