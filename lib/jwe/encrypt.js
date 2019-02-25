const { createSecretKey } = require('crypto')
const { deflateRawSync } = require('zlib')

const serializers = require('./serializers')
const { JWEInvalid } = require('../errors')
const Key = require('../jwk/key/base')

const generateCEK = require('./generate_cek')
const generateIV = require('../help/generate_iv')

const base64url = require('../help/base64url')
const { check, wrapKey, encrypt } = require('../jwa')
const OctKey = require('../jwk/key/oct')
const validateHeaders = require('./validate_headers')
const isObject = require('../help/is_object')
const deepClone = require('../help/deep_clone')

const AAD = Symbol('AAD')
const CEK = Symbol('CEK')
const CLEARTEXT = Symbol('CLEARTEXT')
const PROCESS_RECIPIENT = Symbol('PROCESS_RECIPIENT')
const PROTECTED = Symbol('PROTECTED')
const RECIPIENTS = Symbol('RECIPIENTS')
const UNPROTECTED = Symbol('UNPROTECTED')

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

    Object.assign(this, {
      [CLEARTEXT]: cleartext,
      [RECIPIENTS]: [],
      [PROTECTED]: protectedHeader ? deepClone(protectedHeader) : undefined,
      [UNPROTECTED]: unprotectedHeader ? deepClone(unprotectedHeader) : undefined,
      [AAD]: aad
    })
  }

  /*
   * @public
   */
  recipient (key, header) {
    if (!(key instanceof Key)) {
      throw new TypeError('key must be an instance of a key instantiated by JWK.importKey')
    }

    if (header !== undefined && !isObject(header)) {
      throw new TypeError('header argument must be a plain object when provided')
    }

    this[RECIPIENTS].push({
      key,
      header: header ? deepClone(header) : undefined
    })

    return this
  }

  /*
   * @private
   */
  [PROCESS_RECIPIENT] (recipient) {
    const { [PROTECTED]: protectedHeader, [UNPROTECTED]: unprotectedHeader, [RECIPIENTS]: { length: recipientCount } } = this

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
      check(key, 'wrapKey', alg)
    } else {
      alg = [...key.algorithms('wrapKey')][0]

      if (alg === 'ECDH-ES' && recipientCount !== 1) {
        alg = [...key.algorithms('wrapKey')][1]
      }

      if (!alg) {
        throw new JWEInvalid('could not resolve a usable "alg" for a recipient')
      }

      if (recipientCount === 1) {
        if (protectedHeader) {
          protectedHeader.alg = alg
        } else {
          this[PROTECTED] = { alg }
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
    let direct

    if (key.kty === 'oct' && alg === 'dir') {
      this[CEK] = new OctKey(key.keyObject, { use: 'enc', alg: enc })
      wrapped = ''
    } else {
      ({ wrapped, header: generatedHeader, direct } = wrapKey(alg, key, this[CEK].keyObject.export(), { enc, alg }))
      if (direct) {
        this[CEK] = new OctKey(createSecretKey(wrapped), { use: 'enc', alg: enc })
      }
    }

    if (alg === 'dir' || alg === 'ECDH-ES') {
      recipient.encrypted_key = ''
    } else {
      recipient.encrypted_key = base64url.encode(wrapped)
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

    if (!this[RECIPIENTS].length) {
      throw new JWEInvalid('missing recipients')
    }

    serializer.validate(this[PROTECTED], this[UNPROTECTED], this[AAD], this[RECIPIENTS])

    let enc = validateHeaders(this[PROTECTED], this[UNPROTECTED], this[RECIPIENTS], false, this[PROTECTED] ? this[PROTECTED].crit : undefined)
    if (!enc) {
      enc = 'A128CBC-HS256'
      if (this[PROTECTED]) {
        this[PROTECTED].enc = enc
      } else {
        this[PROTECTED] = { enc }
      }
    }
    const final = {}
    this[CEK] = generateCEK(enc)

    this[RECIPIENTS].forEach(this[PROCESS_RECIPIENT].bind(this))

    const iv = generateIV(enc)
    final.iv = base64url.encode(iv)

    if (this[RECIPIENTS].length === 1 && this[RECIPIENTS][0].generatedHeader) {
      const [{ generatedHeader }] = this[RECIPIENTS]
      delete this[RECIPIENTS][0].generatedHeader
      this[PROTECTED] = Object.assign({}, this[PROTECTED], generatedHeader)
    }

    if (this[PROTECTED]) {
      final.protected = base64url.JSON.encode(this[PROTECTED])
    }
    final.unprotected = this[UNPROTECTED]

    let aad
    if (this[AAD]) {
      final.aad = base64url.encode(this[AAD])
      aad = Buffer.concat([Buffer.from(final.protected || ''), Buffer.from('.'), Buffer.from(final.aad)])
    } else {
      aad = Buffer.from(final.protected || '')
    }

    let cleartext = this[CLEARTEXT]
    if (this[PROTECTED] && 'zip' in this[PROTECTED]) {
      cleartext = deflateRawSync(cleartext)
    }

    const { ciphertext, tag } = encrypt(enc, this[CEK], cleartext, { iv, aad })
    final.tag = base64url.encode(tag)
    final.ciphertext = base64url.encode(ciphertext)

    return serializer(final, this[RECIPIENTS])
  }
}

module.exports = Encrypt
