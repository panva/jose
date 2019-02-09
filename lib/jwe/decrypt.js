const { createSecretKey } = require('crypto')
const base64url = require('../help/base64url')
const validateHeaders = require('./validate_headers')
const { detect: resolveSerialization } = require('./serializers')
const { TODO } = require('../errors')
const { decrypt, unwrapKey } = require('../jwa')
const JWK = require('../jwk')

const SINGLE_RECIPIENT = new Set(['compact', 'flattened'])

const headerParams = (prot = {}, unprotected = {}, header = {}) => {
  if (typeof prot === 'string') {
    prot = base64url.JSON.decode(prot)
  }

  const alg = prot.alg || unprotected.alg || header.alg
  const enc = prot.enc || unprotected.enc || header.enc
  const p2s = prot.p2s || unprotected.p2s || header.p2s
  const p2c = prot.p2c || unprotected.p2c || header.p2c
  const epk = prot.epk || unprotected.epk || header.epk
  const apu = prot.apu || unprotected.apu || header.apu
  const apv = prot.apv || unprotected.apv || header.apv
  const iv = prot.iv || unprotected.iv || header.iv
  const tag = prot.tag || unprotected.tag || header.tag

  return {
    alg,
    enc,
    ...(typeof p2c === 'number' ? { p2c } : undefined),
    ...(typeof p2s === 'string' ? { p2s: base64url.decodeToBuffer(p2s) } : undefined),
    ...(typeof epk === 'object' ? { epk } : undefined),
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
// TODO: add kid magic
const jweDecrypt = (skipValidateHeaders, serialization, jwe, key) => {
  if (!serialization) {
    serialization = resolveSerialization(jwe)
  }

  let alg, ciphertext, enc, encryptedKey, iv, opts, prot, tag, unprotected, cek, aad, header

  // TODO: To mitigate the attacks described in RFC 3218 [RFC3218], the
  // recipient MUST NOT distinguish between format, padding, and length
  // errors of encrypted keys.  It is strongly recommended, in the event
  // of receiving an improperly formatted key, that the recipient
  // substitute a randomly generated CEK and proceed to the next step, to
  // mitigate timing attacks.

  if (SINGLE_RECIPIENT.has(serialization)) {
    if (serialization === 'compact') { // compact serialization format
      ([prot, encryptedKey, iv, ciphertext, tag] = jwe.split('.'))
      // TODO: assert prot, payload, signature
    } else { // flattened serialization format
      ({ protected: prot, encrypted_key: encryptedKey, iv, ciphertext, tag, unprotected, aad, header } = jwe)
    }

    if (!skipValidateHeaders) {
      validateHeaders(prot, unprotected, [{ header }])
    }

    opts = headerParams(prot, unprotected, header)

    ;({ alg, enc } = opts)

    if (alg === 'dir') {
      // TODO: validate its a secret
      cek = JWK.importKey(key, { alg: enc, use: 'enc' })
    } else if (alg === 'ECDH-ES') {
      const unwrapped = unwrapKey(alg, key, undefined, opts)
      cek = JWK.importKey(createSecretKey(unwrapped), { alg: enc, use: 'enc' })
    } else {
      const unwrapped = unwrapKey(alg, key, base64url.decodeToBuffer(encryptedKey), opts)
      cek = JWK.importKey(createSecretKey(unwrapped), { alg: enc, use: 'enc' })
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

    // TODO: validate iv and tag presence
    const cleartext = decrypt(enc, cek, base64url.decodeToBuffer(ciphertext), {
      iv: base64url.decodeToBuffer(iv),
      tag: base64url.decodeToBuffer(tag),
      aad
    })

    return cleartext
  }

  validateHeaders(jwe.protected, jwe.unprotected, jwe.recipients.map(({ header }) => ({ header })))

  const { recipients, ...root } = jwe

  // general serialization format
  for (const recipient of recipients) {
    try {
      return jweDecrypt(true, 'flattened', { ...root, ...recipient }, key)
    } catch (err) {
      continue
    }
  }

  throw new TODO('decryption failed')
}

module.exports = jweDecrypt.bind(undefined, false, undefined)
