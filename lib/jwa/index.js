const { JWKKeySupport, JOSENotSupported } = require('../errors')
const { KEY_MANAGEMENT_ENCRYPT, KEY_MANAGEMENT_DECRYPT } = require('../help/consts')

const { JWA, JWK } = require('../registry')

// sign, verify
require('./hmac')(JWA, JWK)
require('./ecdsa')(JWA, JWK)
require('./eddsa')(JWA, JWK)
require('./rsassa_pss')(JWA, JWK)
require('./rsassa')(JWA, JWK)
require('./none')(JWA)

// encrypt, decrypt
require('./aes_cbc_hmac_sha2')(JWA, JWK)
require('./aes_gcm')(JWA, JWK)

// wrapKey, unwrapKey
require('./rsaes')(JWA, JWK)
require('./aes_kw')(JWA, JWK)
require('./aes_gcm_kw')(JWA, JWK)

// deriveKey
require('./pbes2')(JWA, JWK)
require('./ecdh/dir')(JWA, JWK)
require('./ecdh/kw')(JWA, JWK)

const check = (key, op, alg) => {
  const cache = `_${op}_${alg}`

  let label
  let keyOp
  if (op === 'keyManagementEncrypt') {
    label = 'key management (encryption)'
    keyOp = KEY_MANAGEMENT_ENCRYPT
  } else if (op === 'keyManagementDecrypt') {
    label = 'key management (decryption)'
    keyOp = KEY_MANAGEMENT_DECRYPT
  }

  if (cache in key) {
    if (key[cache]) {
      return
    }
    throw new JWKKeySupport(`the key does not support ${alg} ${label || op} algorithm`)
  }

  let value = true
  if (!JWA[op].has(alg)) {
    throw new JOSENotSupported(`unsupported ${label || op} alg: ${alg}`)
  } else if (!key.algorithms(keyOp).has(alg)) {
    value = false
  }

  Object.defineProperty(key, cache, { value, enumerable: false })

  if (!value) {
    return check(key, op, alg)
  }
}

module.exports = {
  check,
  sign: (alg, key, payload) => {
    check(key, 'sign', alg)
    return JWA.sign.get(alg)(key, payload)
  },
  verify: (alg, key, payload, signature) => {
    check(key, 'verify', alg)
    return JWA.verify.get(alg)(key, payload, signature)
  },
  keyManagementEncrypt: (alg, key, payload, opts) => {
    check(key, 'keyManagementEncrypt', alg)
    return JWA.keyManagementEncrypt.get(alg)(key, payload, opts)
  },
  keyManagementDecrypt: (alg, key, payload, opts) => {
    check(key, 'keyManagementDecrypt', alg)
    return JWA.keyManagementDecrypt.get(alg)(key, payload, opts)
  },
  encrypt: (alg, key, cleartext, opts) => {
    check(key, 'encrypt', alg)
    return JWA.encrypt.get(alg)(key, cleartext, opts)
  },
  decrypt: (alg, key, ciphertext, opts) => {
    check(key, 'decrypt', alg)
    return JWA.decrypt.get(alg)(key, ciphertext, opts)
  }
}
