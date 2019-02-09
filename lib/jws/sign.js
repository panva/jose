const base64url = require('../help/base64url')

const serializers = require('./serializers')
const Key = require('../jwk/key/base')
const { JWSInvalidHeader, JWSMissingAlg, TODO } = require('../errors')
const { sign } = require('../jwa')
const isDisjoint = require('../help/is_disjoint')

function process (payload, recipient) {
  const { key, protectedHeader, unprotectedHeader } = recipient

  const joseHeader = {
    protected: protectedHeader || {},
    unprotected: unprotectedHeader || {}
  }

  if (!isDisjoint(joseHeader.protected, joseHeader.unprotected)) {
    throw new JWSInvalidHeader('JWS Protected and JWS Unprotected Header Parameter names must be disjoint')
  }

  const { alg } = { ...joseHeader.protected, ...joseHeader.unprotected }
  if (!alg) {
    throw new JWSMissingAlg('every JOSE header must contain an "alg" parameter')
  }

  if (Object.keys(joseHeader.unprotected).length) {
    recipient.header = joseHeader.unprotected
  }
  recipient.protected = Object.keys(joseHeader.protected).length ? base64url.JSON.encode(joseHeader.protected) : ''
  recipient.signature = base64url.encode(sign(alg, key, `${recipient.protected}.${payload}`))
}

class Sign {
  constructor (payload) {
    // TODO: assert payload

    Object.assign(this, { payload, recipients: [] })
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
  sign (serialization) {
    if (typeof serialization !== 'string') {
      throw new TypeError('TODO')
    }
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

    this.recipients.forEach(process.bind(undefined, payload))

    return serializer(payload, this.recipients)
  }
}

module.exports = Sign
