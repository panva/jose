const { createSecretKey } = require('crypto')
const base64url = require('../help/base64url')
const { detect: resolveSerialization } = require('./serializers')
const { TODO } = require('../errors')
const { decrypt, unwrapKey } = require('../jwa')
const JWK = require('../jwk')

const SINGLE_RECIPIENT = new Set(['compact', 'flattened'])

const disjoint = (prop, objA = {}, objB = {}) => {
  const a = objA[prop]
  const b = objB[prop]

  if (!a ^ !b) {
    return a || b
  }
}

const headerParams = (prot, unprotected) => {
  prot = prot ? base64url.JSON.decode(prot) : undefined

  const alg = disjoint('alg', prot, unprotected)
  const enc = disjoint('enc', prot, unprotected)
  const p2s = disjoint('p2s', prot, unprotected)
  const p2c = disjoint('p2c', prot, unprotected)
  const epk = disjoint('epk', prot, unprotected)
  const apu = disjoint('apu', prot, unprotected)
  const apv = disjoint('apv', prot, unprotected)
  const iv = disjoint('iv', prot, unprotected)
  const tag = disjoint('tag', prot, unprotected)

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
const jweDecrypt = (jwe, key) => {
  const serialization = resolveSerialization(jwe)
  let alg
  let ciphertext
  let enc
  let encryptedKey
  let iv
  let opts
  let prot // protected header
  let tag
  let unprotected
  let cek
  let aad

  if (SINGLE_RECIPIENT.has(serialization)) {
    if (serialization === 'compact') { // compact serialization format
      ([prot, encryptedKey, iv, ciphertext, tag] = jwe.split('.'))
      // TODO: assert prot, payload, signature
    } else { // flattened serialization format
      ({ protected: prot, encrypted_key: encryptedKey, iv, ciphertext, tag, unprotected, aad } = jwe)
    }

    opts = headerParams(prot, unprotected)
    ;({ alg, enc } = opts)

    // TODO: there should be no encryptedKey for ECDH-ES?
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

  const { recipients, unprotected: u2, ...root } = jwe

  // general serialization format
  for (const { header, ...recipient } of recipients) {
    try {
      // TODO: must be disjoint
      const u = {
        ...u2,
        ...header
      }
      return jweDecrypt({ unprotected: u, ...root, ...recipient }, key)
    } catch (err) {
      continue
    }
  }

  throw new TODO('decryption failed')
}

module.exports = jweDecrypt
