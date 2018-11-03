const base64url = require('../help/base64url')

const serializers = require('./serializers')
const { Recipients, Recipient } = require('./recipients')
const Key = require('../jwk/base')

const map = new WeakMap()
function get (instance, property) {
  return map.get(instance)[property]
}

class Sign {
  constructor (payload, sharedProtectedHeader, sharedUnprotectedHeader) {
    if (!Buffer.isBuffer(payload) && !(typeof payload === 'string')) {
      payload = JSON.stringify(payload)
    }

    Object.freeze(sharedProtectedHeader)
    Object.freeze(sharedUnprotectedHeader)

    map.set(this, {
      payload: base64url.encode(payload),
      recipients: new Recipients()
    })

    if (typeof sharedProtectedHeader !== 'undefined') {
      map.get(this).sharedProtectedHeader = sharedProtectedHeader
    }

    if (typeof sharedUnprotectedHeader !== 'undefined') {
      map.get(this).sharedUnprotectedHeader = sharedUnprotectedHeader
    }
  }

  /*
   * @private
   */
  get payload () {
    return get(this, 'payload')
  }

  /*
   * @private
   */
  get sharedProtectedHeader () {
    return get(this, 'sharedProtectedHeader')
  }

  /*
   * @private
   */
  get sharedUnprotectedHeader () {
    return get(this, 'sharedUnprotectedHeader')
  }

  /*
   * @public
   */
  recipient (key, protectedHeader, unprotectedHeader) {
    if (!(key instanceof Key)) {
      throw new TypeError('key must be an instance of a key instantiated by JWK.importKey')
    }
    const recipient = new Recipient(key, protectedHeader, unprotectedHeader)
    get(this, 'recipients').add(recipient)
    return this
  }

  /*
   * @public
   */
  sign (serialization = 'compact') {
    if (!serializers[serialization]) {
      throw new TypeError('invalid serialization')
    }
    serializers[serialization].validate(this, Array.from(get(this, 'recipients')))

    get(this, 'recipients').process(this.payload, this.sharedProtectedHeader, this.sharedUnprotectedHeader)

    return serializers[serialization](this.payload, Array.from(get(this, 'recipients')))
  }

  /*
   * @public
   */
  static sign (payload, key, protectedHeader, unprotectedHeader, serialization) {
    const jws = new this(payload, protectedHeader, unprotectedHeader)
    jws.recipient(key)
    const result = jws.sign(serialization)
    return result
  }
}

module.exports = Sign
