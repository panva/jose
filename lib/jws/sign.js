const base64url = require('../help/base64url')

const serializers = require('./serializers')
const Key = require('../jwk/key/base')
const { JWSInvalidHeader, JWSMissingAlg, TODO } = require('../errors')
const { sign } = require('../jwa')

function process ({ payload, sharedProtectedHeader, sharedUnprotectedHeader }, recipient) {
  const { key, protectedHeader, unprotectedHeader } = recipient

  const joseHeader = {
    protected: {
      ...sharedProtectedHeader,
      ...protectedHeader
    },
    unprotected: {
      ...sharedUnprotectedHeader,
      ...unprotectedHeader
    }
  }
  const unprotectedKeys = new Set(Object.keys(joseHeader.unprotected))

  if (new Set(Object.keys(joseHeader.protected).filter(x => unprotectedKeys.has(x))).size) {
    throw new JWSInvalidHeader('JWS Protected and JWS Unprotected Header Parameter names must be disjoint')
  }

  const { alg } = { ...joseHeader.protected, ...joseHeader.unprotected }
  if (!alg) {
    throw new JWSMissingAlg('every JOSE header must contain an "alg" parameter')
  }

  if (Object.keys(joseHeader.unprotected).length) {
    recipient.header = joseHeader.unprotected
  }
  recipient.protected = base64url.JSON.encode(joseHeader.protected)
  recipient.signature = base64url.encode(sign(alg, key, `${recipient.protected}.${payload}`))
}

class Sign {
  constructor (payload, sharedProtectedHeader, sharedUnprotectedHeader) {
    // TODO: assert payload

    Object.assign(this, {
      payload,
      recipients: [],
      sharedProtectedHeader,
      sharedUnprotectedHeader
    })
  }

  /*
   * @public
   */
  recipient (key, protectedHeader, unprotectedHeader) {
    if (!(key instanceof Key)) {
      throw new TypeError('key must be an instance of a key instantiated by JWK.importKey')
    }
    this.recipients.push({ key, protectedHeader, unprotectedHeader })
    return this
  }

  /*
   * @public
   */
  sign (serialization = 'compact') {
    if (!this.recipients.length) {
      throw new TODO('missing recipients')
    }

    const serializer = serializers[serialization]
    if (!serializer) {
      throw new TODO('invalid serialization')
    }
    serializer.validate(this, this.recipients)

    let payload
    if (!Buffer.isBuffer(this.payload) && !(typeof this.payload === 'string')) {
      payload = base64url.JSON.encode(this.payload)
    } else {
      payload = base64url.encode(this.payload)
    }

    this.recipients.forEach(process.bind(undefined, {
      payload,
      sharedProtectedHeader: this.sharedProtectedHeader,
      sharedUnprotectedHeader: this.sharedUnprotectedHeader
    }))

    return serializer(payload, this.recipients)
  }
}

module.exports = Sign
