const { createSecretKey } = require('crypto')
const { deflateRawSync } = require('zlib')

const { KEYOBJECT } = require('../help/consts')
const generateIV = require('../help/generate_iv')
const base64url = require('../help/base64url')
const isObject = require('../help/is_object')
const deepClone = require('../help/deep_clone')
const Key = require('../jwk/key/base')
const importKey = require('../jwk/import')
const { JWEInvalid } = require('../errors')
const { check, keyManagementEncrypt, encrypt } = require('../jwa')

const serializers = require('./serializers')
const generateCEK = require('./generate_cek')
const validateHeaders = require('./validate_headers')

const PROCESS_RECIPIENT = Symbol('PROCESS_RECIPIENT')

class Encrypt {
  #aad
  #cek
  #unprotected
  #protected
  #cleartext
  #recipients

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

    this.#recipients = []
    this.#cleartext = cleartext
    this.#aad = aad
    this.#unprotected = unprotectedHeader ? deepClone(unprotectedHeader) : undefined
    this.#protected = protectedHeader ? deepClone(protectedHeader) : undefined
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

    this.#recipients.push({
      key,
      header: header ? deepClone(header) : undefined
    })

    return this
  }

  /*
   * @private
   */
  [PROCESS_RECIPIENT] (recipient) {
    const unprotectedHeader = this.#unprotected
    const protectedHeader = this.#protected
    const { length: recipientCount } = this.#recipients

    const jweHeader = {
      ...protectedHeader,
      ...unprotectedHeader,
      ...recipient.header
    }
    const { key } = recipient

    let enc = jweHeader.enc
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
          this.#protected = { alg }
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
      this.#cek = importKey(key[KEYOBJECT], { use: 'enc', alg: enc })
    } else {
      ({ wrapped, header: generatedHeader } = keyManagementEncrypt(alg, key, this.#cek[KEYOBJECT].export(), { enc, alg }))
      if (alg === 'ECDH-ES') {
        this.#cek = importKey(createSecretKey(wrapped), { use: 'enc', alg: enc })
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

    if (!this.#recipients.length) {
      throw new JWEInvalid('missing recipients')
    }

    serializer.validate(this.#protected, this.#unprotected, this.#aad, this.#recipients)

    let enc = validateHeaders(this.#protected, this.#unprotected, this.#recipients, false, this.#protected ? this.#protected.crit : undefined)
    if (!enc) {
      enc = 'A128CBC-HS256'
      if (this.#protected) {
        this.#protected.enc = enc
      } else {
        this.#protected = { enc }
      }
    }
    const final = {}
    this.#cek = generateCEK(enc)

    this.#recipients.forEach(this[PROCESS_RECIPIENT].bind(this))

    const iv = generateIV(enc)
    final.iv = base64url.encodeBuffer(iv)

    if (this.#recipients.length === 1 && this.#recipients[0].generatedHeader) {
      const [{ generatedHeader }] = this.#recipients
      delete this.#recipients[0].generatedHeader
      this.#protected = Object.assign({}, this.#protected, generatedHeader)
    }

    if (this.#protected) {
      final.protected = base64url.JSON.encode(this.#protected)
    }
    final.unprotected = this.#unprotected

    let aad
    if (this.#aad) {
      final.aad = base64url.encode(this.#aad)
      aad = Buffer.concat([Buffer.from(final.protected || ''), Buffer.from('.'), Buffer.from(final.aad)])
    } else {
      aad = Buffer.from(final.protected || '')
    }

    let cleartext = this.#cleartext
    if (this.#protected && 'zip' in this.#protected) {
      cleartext = deflateRawSync(cleartext)
    }

    const { ciphertext, tag } = encrypt(enc, this.#cek, cleartext, { iv, aad })
    final.tag = base64url.encodeBuffer(tag)
    final.ciphertext = base64url.encodeBuffer(ciphertext)

    return serializer(final, this.#recipients)
  }
}

module.exports = Encrypt
