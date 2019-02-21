const base64url = require('../help/base64url')

const serializers = require('./serializers')
const Key = require('../jwk/key/base')
const { JWSInvalidHeader, JWSNoRecipients } = require('../errors')
const { check, sign } = require('../jwa')
const isDisjoint = require('../help/is_disjoint')
const isObject = require('../help/is_object')
const deepClone = require('../help/deep_clone')

const RECIPIENTS = Symbol('RECIPIENTS')
const PAYLOAD = Symbol('PAYLOAD')
const PROCESS_RECIPIENT = Symbol('PROCESS_RECIPIENT')
const B64 = Symbol('b64')

class Sign {
  constructor (payload) {
    if (!Buffer.isBuffer(payload) && typeof payload !== 'string' && !isObject(payload)) {
      throw new TypeError('payload argument must be a Buffer, string or an object')
    }

    if (isObject(payload)) {
      payload = base64url.JSON.encode(payload)
    } else {
      payload = base64url.encode(payload)
    }

    Object.assign(this, {
      [PAYLOAD]: payload,
      [RECIPIENTS]: []
    })
  }

  /*
   * @public
   */
  recipient (key, protectedHeader, unprotectedHeader) {
    if (!(key instanceof Key)) {
      throw new TypeError('key must be an instance of a key instantiated by JWK.importKey')
    }

    if (protectedHeader !== undefined && !isObject(protectedHeader)) {
      throw new TypeError('protectedHeader argument must be a plain object when provided')
    }

    if (unprotectedHeader !== undefined && !isObject(unprotectedHeader)) {
      throw new TypeError('unprotectedHeader argument must be a plain object when provided')
    }

    if (!isDisjoint(protectedHeader, unprotectedHeader)) {
      throw new JWSInvalidHeader('JWS Protected and JWS Unprotected Header Parameter names must be disjoint')
    }

    this[RECIPIENTS].push({
      key,
      protectedHeader: protectedHeader ? deepClone(protectedHeader) : undefined,
      unprotectedHeader: unprotectedHeader ? deepClone(unprotectedHeader) : undefined
    })

    return this
  }

  /*
   * @private
   */
  [PROCESS_RECIPIENT] (recipient) {
    const { key, protectedHeader, unprotectedHeader } = recipient

    const joseHeader = {
      protected: protectedHeader || {},
      unprotected: unprotectedHeader || {}
    }

    let alg = joseHeader.protected.alg || joseHeader.unprotected.alg

    if (alg) {
      check(key, 'sign', alg)
    } else {
      alg = [...key.algorithms('sign')][0]
      if (recipient.protectedHeader) {
        joseHeader.protected.alg = recipient.protectedHeader.alg = alg
      } else {
        joseHeader.protected = recipient.protectedHeader = { alg }
      }
    }

    if (!alg) {
      throw new JWSInvalidHeader('could not resolve a usable "alg" for a recipient')
    }

    if (joseHeader.protected.crit && joseHeader.protected.crit.includes('b64')) {
      if (B64 in this && this[B64] !== joseHeader.protected.b64) {
        throw new JWSInvalidHeader('the "b64" Header Parameter value MUST be the same for all recipients')
      } else {
        this[B64] = joseHeader.protected.b64
      }
      if (!joseHeader.protected.b64) {
        this[PAYLOAD] = base64url.decode(this[PAYLOAD])
      }
    }

    recipient.header = unprotectedHeader
    recipient.protected = Object.keys(joseHeader.protected).length ? base64url.JSON.encode(joseHeader.protected) : ''
    recipient.signature = base64url.encode(sign(alg, key, `${recipient.protected}.${this[PAYLOAD]}`))
  }

  /*
   * @public
   */
  sign (serialization) {
    const serializer = serializers[serialization]
    if (!serializer) {
      throw new TypeError('serialization must be one of "compact", "flattened", "general"')
    }

    if (!this[RECIPIENTS].length) {
      throw new JWSNoRecipients('missing recipients')
    }

    serializer.validate(this, this[RECIPIENTS])

    this[RECIPIENTS].forEach(this[PROCESS_RECIPIENT].bind(this))

    return serializer(this[PAYLOAD], this[RECIPIENTS])
  }
}

module.exports = Sign
