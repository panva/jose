const base64url = require('../help/base64url')
const isDisjoint = require('../help/is_disjoint')
const isObject = require('../help/is_object')
const deepClone = require('../help/deep_clone')
const { JWSInvalid } = require('../errors')
const { sign } = require('../jwa')
const getKey = require('../help/get_key')

const serializers = require('./serializers')

const PROCESS_RECIPIENT = Symbol('PROCESS_RECIPIENT')

class Sign {
  constructor (payload) {
    if (typeof payload === 'string') {
      payload = base64url.encode(payload)
    } else if (Buffer.isBuffer(payload)) {
      payload = base64url.encodeBuffer(payload)
      this._binary = true
    } else if (isObject(payload)) {
      payload = base64url.JSON.encode(payload)
    } else {
      throw new TypeError('payload argument must be a Buffer, string or an object')
    }

    this._payload = payload
    this._recipients = []
  }

  /*
   * @public
   */
  recipient (key, protectedHeader, unprotectedHeader) {
    key = getKey(key)

    if (protectedHeader !== undefined && !isObject(protectedHeader)) {
      throw new TypeError('protectedHeader argument must be a plain object when provided')
    }

    if (unprotectedHeader !== undefined && !isObject(unprotectedHeader)) {
      throw new TypeError('unprotectedHeader argument must be a plain object when provided')
    }

    if (!isDisjoint(protectedHeader, unprotectedHeader)) {
      throw new JWSInvalid('JWS Protected and JWS Unprotected Header Parameter names must be disjoint')
    }

    this._recipients.push({
      key,
      protectedHeader: protectedHeader ? deepClone(protectedHeader) : undefined,
      unprotectedHeader: unprotectedHeader ? deepClone(unprotectedHeader) : undefined
    })

    return this
  }

  /*
   * @private
   */
  [PROCESS_RECIPIENT] (recipient, first) {
    const { key, protectedHeader, unprotectedHeader } = recipient

    if (key.use === 'enc') {
      throw new TypeError('a key with "use":"enc" is not usable for signing')
    }

    const joseHeader = {
      protected: protectedHeader || {},
      unprotected: unprotectedHeader || {}
    }

    let alg = joseHeader.protected.alg || joseHeader.unprotected.alg

    if (!alg) {
      alg = key.alg || [...key.algorithms('sign')][0]
      if (recipient.protectedHeader) {
        joseHeader.protected.alg = recipient.protectedHeader.alg = alg
      } else {
        joseHeader.protected = recipient.protectedHeader = { alg }
      }
    }

    if (!alg) {
      throw new JWSInvalid('could not resolve a usable "alg" for a recipient')
    }

    recipient.header = unprotectedHeader
    recipient.protected = Object.keys(joseHeader.protected).length ? base64url.JSON.encode(joseHeader.protected) : ''

    if (first && joseHeader.protected.crit && joseHeader.protected.crit.includes('b64') && joseHeader.protected.b64 === false) {
      if (this._binary) {
        this._payload = base64url.decodeToBuffer(this._payload)
      } else {
        this._payload = base64url.decode(this._payload)
      }
    }

    const data = Buffer.concat([
      Buffer.from(recipient.protected || ''),
      Buffer.from('.'),
      Buffer.from(this._payload)
    ])

    recipient.signature = base64url.encodeBuffer(sign(alg, key, data))
  }

  /*
   * @public
   */
  sign (serialization) {
    const serializer = serializers[serialization]
    if (!serializer) {
      throw new TypeError('serialization must be one of "compact", "flattened", "general"')
    }

    if (!this._recipients.length) {
      throw new JWSInvalid('missing recipients')
    }

    serializer.validate(this, this._recipients)

    this._recipients.forEach((recipient, i) => {
      this[PROCESS_RECIPIENT](recipient, i === 0)
    })

    return serializer(this._payload, this._recipients)
  }
}

module.exports = Sign
