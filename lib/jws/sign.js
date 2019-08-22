const base64url = require('../help/base64url')
const isDisjoint = require('../help/is_disjoint')
const isObject = require('../help/is_object')
const deepClone = require('../help/deep_clone')
const Key = require('../jwk/key/base')
const { JWSInvalid } = require('../errors')
const { check, sign } = require('../jwa')

const serializers = require('./serializers')

const PROCESS_RECIPIENT = Symbol('PROCESS_RECIPIENT')

const map = new WeakMap()

const i = (ctx) => {
  if (!map.has(ctx)) {
    map.set(ctx, {})
  }
  return map.get(ctx)
}

class Sign {
  constructor (payload) {
    if (typeof payload === 'string') {
      payload = base64url.encode(payload)
    } else if (Buffer.isBuffer(payload)) {
      payload = base64url.encodeBuffer(payload)
    } else if (isObject(payload)) {
      payload = base64url.JSON.encode(payload)
    } else {
      throw new TypeError('payload argument must be a Buffer, string or an object')
    }

    i(this).payload = payload
    i(this).recipients = []
  }

  /*
   * @public
   */
  recipient (key, protectedHeader, unprotectedHeader) {
    if (!(key instanceof Key)) {
      throw new TypeError('key must be an instance of a key instantiated by JWK.asKey')
    }

    if (protectedHeader !== undefined && !isObject(protectedHeader)) {
      throw new TypeError('protectedHeader argument must be a plain object when provided')
    }

    if (unprotectedHeader !== undefined && !isObject(unprotectedHeader)) {
      throw new TypeError('unprotectedHeader argument must be a plain object when provided')
    }

    if (!isDisjoint(protectedHeader, unprotectedHeader)) {
      throw new JWSInvalid('JWS Protected and JWS Unprotected Header Parameter names must be disjoint')
    }

    i(this).recipients.push({
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
      throw new JWSInvalid('could not resolve a usable "alg" for a recipient')
    }

    if (joseHeader.protected.crit && joseHeader.protected.crit.includes('b64')) {
      if (i(this).b64 !== undefined && i(this).b64 !== joseHeader.protected.b64) {
        throw new JWSInvalid('the "b64" Header Parameter value MUST be the same for all recipients')
      } else {
        i(this).b64 = joseHeader.protected.b64
      }
      if (!joseHeader.protected.b64) {
        i(this).payload = base64url.decode(i(this).payload)
      }
    }

    recipient.header = unprotectedHeader
    recipient.protected = Object.keys(joseHeader.protected).length ? base64url.JSON.encode(joseHeader.protected) : ''
    recipient.signature = base64url.encodeBuffer(sign(alg, key, Buffer.from(`${recipient.protected}.${i(this).payload}`)))
  }

  /*
   * @public
   */
  sign (serialization) {
    const serializer = serializers[serialization]
    if (!serializer) {
      throw new TypeError('serialization must be one of "compact", "flattened", "general"')
    }

    if (!i(this).recipients.length) {
      throw new JWSInvalid('missing recipients')
    }

    serializer.validate(this, i(this).recipients)

    i(this).recipients.forEach(this[PROCESS_RECIPIENT].bind(this))

    return serializer(i(this).payload, i(this).recipients)
  }
}

module.exports = Sign
