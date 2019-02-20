const { createSecretKey } = require('crypto')
const generateCEK = require('./generate_cek')
const base64url = require('../help/base64url')
const validateHeaders = require('./validate_headers')
const { detect: resolveSerialization } = require('./serializers')
const { JWEDecryptionFailed, JWEInvalid } = require('../errors')
const { check, decrypt, unwrapKey } = require('../jwa')
const JWK = require('../jwk')
const KeyStore = require('../jwks/keystore')
const Key = require('../jwk/key/base')

const SINGLE_RECIPIENT = new Set(['compact', 'flattened'])

const combineHeader = (prot = {}, unprotected = {}, header = {}) => {
  if (typeof prot === 'string') {
    prot = base64url.JSON.decode(prot)
  }

  const p2s = prot.p2s || unprotected.p2s || header.p2s
  const apu = prot.apu || unprotected.apu || header.apu
  const apv = prot.apv || unprotected.apv || header.apv
  const iv = prot.iv || unprotected.iv || header.iv
  const tag = prot.tag || unprotected.tag || header.tag

  return {
    ...prot,
    ...unprotected,
    ...header,
    ...(typeof p2s === 'string' ? { p2s: base64url.decodeToBuffer(p2s) } : undefined),
    ...(typeof apu === 'string' ? { apu: base64url.decodeToBuffer(apu) } : undefined),
    ...(typeof apv === 'string' ? { apv: base64url.decodeToBuffer(apv) } : undefined),
    ...(typeof iv === 'string' ? { iv: base64url.decodeToBuffer(iv) } : undefined),
    ...(typeof tag === 'string' ? { tag: base64url.decodeToBuffer(tag) } : undefined)
  }
}

/*
 * @public
 */
// TODO: option to return everything not just the payload
const jweDecrypt = (skipValidateHeaders, serialization, jwe, key, { crit = [] } = {}) => {
  if (!(key instanceof Key) && !(key instanceof KeyStore)) {
    throw new TypeError('key must be an instance of a key instantiated by JWK.importKey or a JWKS.KeyStore')
  }

  if (!Array.isArray(crit) || crit.some(s => typeof s !== 'string' || !s)) {
    throw new TypeError('"crit" option must be an array of non-empty strings')
  }

  if (!serialization) {
    serialization = resolveSerialization(jwe)
  } else if (serialization !== resolveSerialization(jwe)) {
    throw new JWEInvalid()
  }

  let alg, ciphertext, enc, encryptedKey, iv, opts, prot, tag, unprotected, cek, aad, header

  if (SINGLE_RECIPIENT.has(serialization)) {
    if (serialization === 'compact') { // compact serialization format
      ([prot, encryptedKey, iv, ciphertext, tag] = jwe.split('.'))
    } else { // flattened serialization format
      ({ protected: prot, encrypted_key: encryptedKey, iv, ciphertext, tag, unprotected, aad, header } = jwe)
    }

    if (!skipValidateHeaders) {
      validateHeaders(prot, unprotected, [{ header }], true, crit)
    }

    opts = combineHeader(prot, unprotected, header)

    if (key instanceof KeyStore) {
      const keystore = key
      let keys
      if (opts.alg === 'dir') {
        keys = keystore.all({ ...opts, alg: opts.enc })
      } else {
        keys = keystore.all(opts)
      }
      if (keys.length === 1) {
        key = keys[0]
      } else {
        for (const key of keys) {
          try {
            return jweDecrypt(true, serialization, jwe, key)
          } catch (err) {
            if (err instanceof JWEDecryptionFailed) {
              continue
            }
            throw err
          }
        }

        throw new JWEDecryptionFailed()
      }
    }

    ;({ alg, enc } = opts)

    if (alg === 'dir') {
      check(key, 'decrypt', enc)
    } else {
      check(key, 'unwrapKey', alg)
    }

    try {
      if (alg === 'dir') {
        cek = JWK.importKey(key, { alg: enc, use: 'enc' })
      } else if (alg === 'ECDH-ES') {
        const unwrapped = unwrapKey(alg, key, undefined, opts)
        cek = JWK.importKey(createSecretKey(unwrapped), { alg: enc, use: 'enc' })
      } else {
        const unwrapped = unwrapKey(alg, key, base64url.decodeToBuffer(encryptedKey), opts)
        cek = JWK.importKey(createSecretKey(unwrapped), { alg: enc, use: 'enc' })
      }
    } catch (err) {
      // To mitigate the attacks described in RFC 3218, the
      // recipient MUST NOT distinguish between format, padding, and length
      // errors of encrypted keys.  It is strongly recommended, in the event
      // of receiving an improperly formatted key, that the recipient
      // substitute a randomly generated CEK and proceed to the next step, to
      // mitigate timing attacks.
      cek = generateCEK(enc)
    }

    if (aad) {
      aad = Buffer.concat([
        Buffer.from(prot || ''),
        Buffer.from('.'),
        Buffer.from(aad)
      ])
    } else {
      aad = Buffer.from(prot || '')
    }

    try {
      iv = base64url.decodeToBuffer(iv)
    } catch (err) {}
    try {
      tag = base64url.decodeToBuffer(tag)
    } catch (err) {}

    const cleartext = decrypt(enc, cek, base64url.decodeToBuffer(ciphertext), { iv, tag, aad })

    return cleartext
  }

  validateHeaders(jwe.protected, jwe.unprotected, jwe.recipients.map(({ header }) => ({ header })), true, crit)

  // general serialization format
  const { recipients, ...root } = jwe
  for (const recipient of recipients) {
    try {
      return jweDecrypt(true, 'flattened', { ...root, ...recipient }, key)
    } catch (err) {
      continue
    }
  }

  throw new JWEDecryptionFailed()
}

module.exports = jweDecrypt.bind(undefined, false, undefined)
