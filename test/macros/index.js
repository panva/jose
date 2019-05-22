const { inspect } = require('util')

const errors = require('../../lib/errors')
const base64url = require('../../lib/help/base64url')
const { encrypt, decrypt } = require('../../lib/jwe')
const { sign, verify } = require('../../lib/jws')

const hasProperty = (t, obj, property, value, assertion = 'is') => {
  t.true(property in obj)
  if (value !== undefined) {
    t[assertion](obj[property], value)
  }
}

hasProperty.title = (title = '', obj, property, value) => `${title} has property \`${property}\` with value ${inspect(value)}`

const hasNoProperties = (t, obj, ...properties) => {
  t.plan(properties.length)
  for (const property of new Set(properties)) {
    if (property in obj) {
      t.fail(`expected property "${property}" not to be found`)
    } else {
      t.pass()
    }
  }
}
hasNoProperties.title = (title = '', obj, ...properties) => `${title} does not have properties ${properties.map(x => `\`${x}\``).join(', ')}`

const hasProperties = (t, obj, ...properties) => {
  t.plan(properties.length)
  for (const property of new Set(properties)) {
    if (property in obj) {
      t.pass()
    } else {
      t.fail(`expected property "${property}" to be found`)
    }
  }
}
hasProperties.title = (title = '', obj, ...properties) => `${title} has properties ${properties.map(x => `\`${x}\``).join(', ')}`

const compactJwt = (t, jwt, eHeader, ePayload) => {
  let [aHeader, aPayload] = jwt().split('.')
  aHeader = base64url.JSON.decode(aHeader)
  aPayload = base64url.JSON.decode(aPayload)

  t.deepEqual(aHeader, eHeader)
  t.deepEqual(aPayload, ePayload)
}

const JWSPAYLOAD = {}
const JWS = {
  success (t, sKey, vKey, alg) {
    const signed = sign(JWSPAYLOAD, sKey, { alg })
    t.truthy(signed)
    const verified = verify(signed, vKey)
    t.deepEqual(verified, {})
  },
  failure (t, sKey, vKey, alg) {
    const signed = sign.flattened(JWSPAYLOAD, sKey, { alg })
    t.truthy(signed)

    ;(() => {
      const orig = signed.protected

      if (signed.protected.startsWith('-')) {
        signed.protected = `Q${signed.protected.substr(1)}`
      } else {
        signed.protected = `-${signed.protected.substr(1)}`
      }
      t.throws(() => {
        verify(signed, vKey)
      }, { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: 'could not parse JWS protected header' })
      signed.protected = orig
    })()

    ;(() => {
      const orig = signed.protected
      delete signed.protected
      t.throws(() => {
        verify(signed, vKey)
      }, { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: 'missing JWS signature algorithm' })
      signed.protected = orig
    })()

    ;(() => {
      const orig = signed.signature

      if (signed.signature.startsWith('-')) {
        signed.signature = `Q${signed.signature.substr(1)}`
      } else {
        signed.signature = `-${signed.signature.substr(1)}`
      }
      t.throws(() => {
        verify(signed, vKey)
      }, { instanceOf: errors.JWSVerificationFailed, code: 'ERR_JWS_VERIFICATION_FAILED' })
      signed.signature = signed.signature.substr(4)
      t.throws(() => {
        verify(signed, vKey)
      }, { instanceOf: errors.JWSVerificationFailed, code: 'ERR_JWS_VERIFICATION_FAILED' })
      signed.signature = orig
    })()
  }
}

const JWEPAYLOAD = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
const JWE = {
  success (t, eKey, dKey, alg, enc) {
    const encrypted = encrypt(JWEPAYLOAD, eKey, { alg, enc })
    t.truthy(encrypted)
    const decrypted = decrypt(encrypted, dKey)
    t.deepEqual(decrypted, Buffer.from(JWEPAYLOAD))
    const encrypted2 = encrypt(JWEPAYLOAD, dKey, { alg, enc })
    t.truthy(encrypted2)
    const decrypted2 = decrypt(encrypted, dKey)
    t.deepEqual(decrypted2, Buffer.from(JWEPAYLOAD))
  },

  failure (t, eKey, dKey, alg, enc) {
    const encrypted = encrypt.flattened(JWEPAYLOAD, eKey, { alg, enc })
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
}

module.exports.compactJwt = compactJwt
module.exports.hasNoProperties = hasNoProperties
module.exports.hasProperties = hasProperties
module.exports.hasProperty = hasProperty
module.exports.JWE = JWE
module.exports.JWS = JWS
