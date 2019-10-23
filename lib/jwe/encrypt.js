const { deflateRawSync } = require('zlib')

const { KEYOBJECT } = require('../help/consts')
const generateIV = require('../help/generate_iv')
const base64url = require('../help/base64url')
const isObject = require('../help/is_object')
const { createSecretKey } = require('../help/key_object')
const deepClone = require('../help/deep_clone')
const Key = require('../jwk/key/base')
const importKey = require('../jwk/import')
const { JWEInvalid } = require('../errors')
const { check, keyManagementEncrypt, encrypt } = require('../jwa')

const serializers = require('./serializers')
const generateCEK = require('./generate_cek')
const validateHeaders = require('./validate_headers')

const PROCESS_RECIPIENT = Symbol('PROCESS_RECIPIENT')

const map = new WeakMap()

const i = (ctx) => {
  if (!map.has(ctx)) {
    map.set(ctx, {})
  }
  return map.get(ctx)
}

class Encrypt {
  constructor (cleartext, protectedHeader, unprotectedHeader, aad) {
    if (!Buffer.isBuffer(cleartext) && typeof cleartext !== 'string') {
      throw new TypeError('cleartext argument must be a Buffer or a string')
    }
    cleartext = Buffer.from(cleartext)

    if (aad !== undefined && !Buffer.isBuffer(aad) && typeof aad !== 'string') {
      throw new TypeError('aad argument must be a Buffer or a string when provided')
    }
    aad = aad ? Buffer.from(aad) : undefined

    if (protectedHeader !== undefined && !isObject(protectedHeader)) {
      throw new TypeError('protectedHeader argument must be a plain object when provided')
    }

    if (unprotectedHeader !== undefined && !isObject(unprotectedHeader)) {
      throw new TypeError('unprotectedHeader argument must be a plain object when provided')
    }

    i(this).recipients = []
    i(this).cleartext = cleartext
    i(this).aad = aad
    i(this).unprotected = unprotectedHeader ? deepClone(unprotectedHeader) : undefined
    i(this).protected = protectedHeader ? deepClone(protectedHeader) : undefined
  }

  /*
   * @public
   */
  recipient (key, header) {
    if (!(key instanceof Key)) {
      throw new TypeError('key must be an instance of a key instantiated by JWK.asKey')
    }

    if (header !== undefined && !isObject(header)) {
      throw new TypeError('header argument must be a plain object when provided')
    }

    i(this).recipients.push({
      key,
      header: header ? deepClone(header) : undefined
    })

    return this
  }

  /*
   * @private
   */
  [PROCESS_RECIPIENT] (recipient) {
    const unprotectedHeader = i(this).unprotected
    const protectedHeader = i(this).protected
    const { length: recipientCount } = i(this).recipients

    const jweHeader = {
      ...protectedHeader,
      ...unprotectedHeader,
      ...recipient.header
    }
    const { key } = recipient

    const enc = jweHeader.enc
    let alg = jweHeader.alg

    if (alg === 'dir') {
      check(key, 'encrypt', enc)
    } else if (alg) {
      check(key, 'keyManagementEncrypt', alg)
    } else {
      alg = [...key.algorithms('wrapKey')][0]
      alg = alg || [...key.algorithms('deriveKey')][0]

      if (alg === 'ECDH-ES' && recipientCount !== 1) {
        alg = [...key.algorithms('deriveKey')][1]
      }

      if (!alg) {
        throw new JWEInvalid('could not resolve a usable "alg" for a recipient')
      }

      if (recipientCount === 1) {
        if (protectedHeader) {
          protectedHeader.alg = alg
        } else {
          i(this).protected = { alg }
        }
      } else {
        if (recipient.header) {
          recipient.header.alg = alg
        } else {
          recipient.header = { alg }
        }
      }
    }

    let wrapped
    let generatedHeader

    if (key.kty === 'oct' && alg === 'dir') {
      i(this).cek = importKey(key[KEYOBJECT], { use: 'enc', alg: enc })
    } else {
      ({ wrapped, header: generatedHeader } = keyManagementEncrypt(alg, key, i(this).cek[KEYOBJECT].export(), { enc, alg }))
      if (alg === 'ECDH-ES') {
        i(this).cek = importKey(createSecretKey(wrapped), { use: 'enc', alg: enc })
      }
    }

    if (alg === 'dir' || alg === 'ECDH-ES') {
      recipient.encrypted_key = ''
    } else {
      recipient.encrypted_key = base64url.encodeBuffer(wrapped)
    }

    if (generatedHeader) {
      recipient.generatedHeader = generatedHeader
    }
  }

  /*
   * @public
   */
  encrypt (serialization) {
    const serializer = serializers[serialization]
    if (!serializer) {
      throw new TypeError('serialization must be one of "compact", "flattened", "general"')
    }

    if (!i(this).recipients.length) {
      throw new JWEInvalid('missing recipients')
    }

    serializer.validate(i(this).protected, i(this).unprotected, i(this).aad, i(this).recipients)

    let enc = validateHeaders(i(this).protected, i(this).unprotected, i(this).recipients, false, i(this).protected ? i(this).protected.crit : undefined)
    if (!enc) {
      enc = 'A128CBC-HS256'
      if (i(this).protected) {
        i(this).protected.enc = enc
      } else {
        i(this).protected = { enc }
      }
    }
    const final = {}
    i(this).cek = generateCEK(enc)

    i(this).recipients.forEach(this[PROCESS_RECIPIENT].bind(this))

    const iv = generateIV(enc)
    final.iv = base64url.encodeBuffer(iv)

    if (i(this).recipients.length === 1 && i(this).recipients[0].generatedHeader) {
      const [{ generatedHeader }] = i(this).recipients
      delete i(this).recipients[0].generatedHeader
      i(this).protected = {
        ...i(this).protected,
        ...generatedHeader
      }
    }

    if (i(this).protected) {
      final.protected = base64url.JSON.encode(i(this).protected)
    }
    final.unprotected = i(this).unprotected

    let aad
    if (i(this).aad) {
      final.aad = base64url.encode(i(this).aad)
      aad = Buffer.concat([Buffer.from(final.protected || ''), Buffer.from('.'), Buffer.from(final.aad)])
    } else {
      aad = Buffer.from(final.protected || '')
    }

    let cleartext = i(this).cleartext
    if (i(this).protected && 'zip' in i(this).protected) {
      cleartext = deflateRawSync(cleartext)
    }

    const { ciphertext, tag } = encrypt(enc, i(this).cek, cleartext, { iv, aad })
    final.tag = base64url.encodeBuffer(tag)
    final.ciphertext = base64url.encodeBuffer(ciphertext)

    return serializer(final, i(this).recipients)
  }
}

module.exports = Encrypt
