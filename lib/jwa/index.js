const { JWKKeySupport, JOSENotSupported } = require('../errors')

const JWA = {
  sign: new Map(),
  verify: new Map(),
  wrapKey: new Map(),
  unwrapKey: new Map(),
  encrypt: new Map(),
  decrypt: new Map()
}

// sign, verify
require('./hmac')(JWA)
require('./ecdsa')(JWA)
require('./rsassa')(JWA)
require('./rsassa_pss')(JWA)

// encrypt, decrypt
require('./aes_cbc_hmac_sha2')(JWA)
require('./aes_gcm')(JWA)

// wrapKey, unwrapKey
require('./rsaes')(JWA)
require('./aes_gcm_kw')(JWA)
require('./aes_kw')(JWA)
require('./pbes2')(JWA)
require('./ecdh/kw')(JWA)
require('./ecdh/dir')(JWA)

const check = (key, op, alg) => {
  if (JWA[op].has(alg)) {
    if (!key.algorithms(op).has(alg)) {
      throw new JWKKeySupport(`the key does not support ${alg} ${op} algorithm`)
    }
  } else {
    throw new JOSENotSupported(`unsupported ${op} alg: ${alg}`)
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
  wrapKey: (alg, key, payload, opts) => {
    check(key, 'wrapKey', alg)
    return JWA.wrapKey.get(alg)(key, payload, opts)
  },
  unwrapKey: (alg, key, payload, opts) => {
    check(key, 'unwrapKey', alg)
    return JWA.unwrapKey.get(alg)(key, payload, opts)
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
