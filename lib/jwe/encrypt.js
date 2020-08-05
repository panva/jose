const { deflateRawSync } = require('zlib')

const { KEYOBJECT } = require('../help/consts')
const generateIV = require('../help/generate_iv')
const base64url = require('../help/base64url')
const getKey = require('../help/get_key')
const isObject = require('../help/is_object')
const { createSecretKey } = require('../help/key_object')
const deepClone = require('../help/deep_clone')
const importKey = require('../jwk/import')
const { JWEInvalid } = require('../errors')
const { check, keyManagementEncrypt, encrypt } = require('../jwa')

const serializers = require('./serializers')
const generateCEK = require('./generate_cek')
const validateHeaders = require('./validate_headers')

const PROCESS_RECIPIENT = Symbol('PROCESS_RECIPIENT')

class Encrypt {
  // TODO: in v2.x swap unprotectedHeader and aad
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

    this._recipients = []
    this._cleartext = cleartext
    this._aad = aad
    this._unprotected = unprotectedHeader ? deepClone(unprotectedHeader) : undefined
    this._protected = protectedHeader ? deepClone(protectedHeader) : undefined
  }

  /*
   * @public
   */
  recipient (key, header) {
    key = getKey(key)

    if (header !== undefined && !isObject(header)) {
      throw new TypeError('header argument must be a plain object when provided')
    }

    this._recipients.push({
      key,
      header: header ? deepClone(header) : undefined
    })

    return this
  }

  /*
   * @private
   */
  [PROCESS_RECIPIENT] (recipient) {
    const unprotectedHeader = this._unprotected
    const protectedHeader = this._protected
    const { length: recipientCount } = this._recipients

    const jweHeader = {
      ...protectedHeader,
      ...unprotectedHeader,
      ...recipient.header
    }
    const { key } = recipient

    const enc = jweHeader.enc
    let alg = jweHeader.alg

    if (key.use === 'sig') {
      throw new TypeError('a key with "use":"sig" is not usable for encryption')
    }

    if (alg === 'dir') {
      check(key, 'encrypt', enc)
    } else if (alg) {
      check(key, 'keyManagementEncrypt', alg)
    } else {
      alg = key.alg || [...key.algorithms('wrapKey')][0] || [...key.algorithms('deriveKey')][0]

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
          this._protected = { alg }
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
      this._cek = importKey(key[KEYOBJECT], { use: 'enc', alg: enc })
    } else {
      check(this._cek, 'encrypt', enc)
      ;({ wrapped, header: generatedHeader } = keyManagementEncrypt(alg, key, this._cek[KEYOBJECT].export(), { enc, alg }))
      if (alg === 'ECDH-ES') {
        this._cek = importKey(createSecretKey(wrapped), { use: 'enc', alg: enc })
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

    if (!this._recipients.length) {
      throw new JWEInvalid('missing recipients')
    }

    serializer.validate(this._protected, this._unprotected, this._aad, this._recipients)

    let enc = validateHeaders(this._protected, this._unprotected, this._recipients, false, this._protected ? this._protected.crit : undefined)
    if (!enc) {
      enc = 'A128CBC-HS256'
      if (this._protected) {
        this._protected.enc = enc
      } else {
        this._protected = { enc }
      }
    }
    const final = {}
    this._cek = generateCEK(enc)

    for (const recipient of this._recipients) {
      this[PROCESS_RECIPIENT](recipient)
    }

    const iv = generateIV(enc)
    final.iv = base64url.encodeBuffer(iv)

    if (this._recipients.length === 1 && this._recipients[0].generatedHeader) {
      const [{ generatedHeader }] = this._recipients
      delete this._recipients[0].generatedHeader
      this._protected = {
        ...this._protected,
        ...generatedHeader
      }
    }

    if (this._protected) {
      final.protected = base64url.JSON.encode(this._protected)
    }
    final.unprotected = this._unprotected

    let aad
    if (this._aad) {
      final.aad = base64url.encode(this._aad)
      aad = Buffer.concat([
        Buffer.from(final.protected || ''),
        Buffer.from('.'),
        Buffer.from(final.aad)
      ])
    } else {
      aad = Buffer.from(final.protected || '')
    }

    let cleartext = this._cleartext
    if (this._protected && 'zip' in this._protected) {
      cleartext = deflateRawSync(cleartext)
    }

    const { ciphertext, tag } = encrypt(enc, this._cek, cleartext, { iv, aad })
    final.tag = base64url.encodeBuffer(tag)
    final.ciphertext = base64url.encodeBuffer(ciphertext)

    return serializer(final, this._recipients)
  }
}

module.exports = Encrypt
