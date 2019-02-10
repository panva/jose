const serializers = require('./serializers')
const { JWENoRecipients } = require('../errors')
const Key = require('../jwk/key/base')
const { createSecretKey } = require('crypto')

const generateCEK = require('./generate_cek')
const generateIV = require('../help/generate_iv')

const base64url = require('../help/base64url')
const { check, wrapKey, encrypt } = require('../jwa')
const OctKey = require('../jwk/key/oct')
const validateHeaders = require('./validate_headers')

const encryptForRecipient = (encryptObj, recipient) => {
  const { protectedHeader, unprotectedHeader } = encryptObj

  const jweHeader = {
    ...protectedHeader,
    ...unprotectedHeader,
    ...recipient.header
  }
  const { key } = recipient

  const { alg, enc } = jweHeader

  if (alg === 'dir') {
    check(key, 'encrypt', enc)
  } else {
    check(key, 'wrapKey', alg)
  }

  let wrapped
  let generatedHeader
  let direct

  if (key.kty === 'oct' && alg === 'dir') {
    encryptObj.cek = new OctKey(key.keyObject, { use: 'enc', alg: enc })
    wrapped = ''
  } else {
    ({ wrapped, header: generatedHeader, direct } = wrapKey(alg, key, encryptObj.cek.keyObject.export(), { enc, alg }))
    if (direct) {
      encryptObj.cek = new OctKey(createSecretKey(wrapped), { use: 'enc', alg: enc })
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

class Encrypt {
  constructor (cleartext, protectedHeader, unprotectedHeader, aad) {
    // TODO: assert cleartext

    Object.assign(this, {
      cleartext,
      recipients: [],
      protectedHeader,
      unprotectedHeader,
      aad
    })
  }

  /*
   * @public
   */
  recipient (key, header) {
    if (!(key instanceof Key)) {
      throw new TypeError('key must be an instance of a key instantiated by JWK.importKey')
    }
    this.recipients.push({ key, header })
    return this
  }

  /*
   * @public
   */
  encrypt (serialization) {
    if (!this.recipients.length) {
      throw new JWENoRecipients('missing recipients')
    }

    const serializer = serializers[serialization]
    if (!serializer) {
      throw new TypeError('serialization must be one of "compact", "flattened", "general"')
    }
    serializer.validate(this, this.recipients)

    const enc = validateHeaders(this.protectedHeader, this.unprotectedHeader, this.recipients)
    const final = {}
    this.cek = generateCEK(enc)

    this.recipients.forEach(encryptForRecipient.bind(undefined, this))

    const iv = generateIV(enc)
    final.iv = base64url.encode(iv)

    if (this.recipients.length === 1 && this.recipients[0].generatedHeader) {
      const [{ generatedHeader }] = this.recipients
      delete this.recipients[0].generatedHeader
      this.protectedHeader = Object.assign({}, this.protectedHeader, generatedHeader)
    }

    if (this.protectedHeader) {
      final.protected = base64url.JSON.encode(this.protectedHeader)
    }
    final.unprotected = this.unprotectedHeader

    let aad
    if (this.aad) {
      final.aad = base64url.encode(this.aad)
      aad = Buffer.concat([Buffer.from(final.protected || ''), Buffer.from('.'), Buffer.from(final.aad)])
    } else {
      aad = Buffer.from(final.protected || '')
    }

    let cleartext
    if (!Buffer.isBuffer(this.cleartext) && !(typeof this.cleartext === 'string')) {
      cleartext = base64url.JSON.encode(this.cleartext)
    } else {
      cleartext = this.cleartext
    }

    const { ciphertext, tag } = encrypt(enc, this.cek, cleartext, { iv, aad })
    final.tag = base64url.encode(tag)
    final.ciphertext = base64url.encode(ciphertext)

    return serializer(final, this.recipients)
  }
}

module.exports = Encrypt
