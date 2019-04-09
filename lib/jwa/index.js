const { JWKKeySupport, JOSENotSupported } = require('../errors')
const { KEY_MANAGEMENT_ENCRYPT, KEY_MANAGEMENT_DECRYPT } = require('../help/consts')

const JWA = {
  sign: new Map(),
  verify: new Map(),
  keyManagementEncrypt: new Map(),
  keyManagementDecrypt: new Map(),
  encrypt: new Map(),
  decrypt: new Map()
}

// sign, verify
require('./hmac')(JWA)
require('./ecdsa')(JWA)
require('./eddsa')(JWA)
require('./rsassa')(JWA)
require('./rsassa_pss')(JWA)

// encrypt, decrypt
require('./aes_cbc_hmac_sha2')(JWA)
require('./aes_gcm')(JWA)

// wrapKey, unwrapKey
require('./rsaes')(JWA)
require('./aes_gcm_kw')(JWA)
require('./aes_kw')(JWA)

// deriveKey
require('./pbes2')(JWA)
require('./ecdh/kw')(JWA)
require('./ecdh/dir')(JWA)

const check = (key, op, alg) => {
  let label
  let keyOp
  if (op === 'keyManagementEncrypt') {
    label = 'key management (encryption)'
    keyOp = KEY_MANAGEMENT_ENCRYPT
  } else if (op === 'keyManagementDecrypt') {
    label = 'key management (decryption)'
    keyOp = KEY_MANAGEMENT_DECRYPT
  }

  if (JWA[op].has(alg)) {
    if (!key.algorithms(keyOp).has(alg)) {
      throw new JWKKeySupport(`the key does not support ${alg} ${label || op} algorithm`)
    }
  } else {
    throw new JOSENotSupported(`unsupported ${label || op} alg: ${alg}`)
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
