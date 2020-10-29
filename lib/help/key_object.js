const { keyObjectSupported } = require('./runtime_support')

let createPublicKey
let createPrivateKey
let createSecretKey
let KeyObject
let asInput

if (keyObjectSupported) {
  ({ createPublicKey, createPrivateKey, createSecretKey, KeyObject } = require('crypto'))
  asInput = (input) => input
} else {
  const { EOL } = require('os')

  const errors = require('../errors')
  const isObject = require('./is_object')
  const asn1 = require('./asn1')
  const toInput = Symbol('toInput')

  const namedCurve = Symbol('namedCurve')

  asInput = (keyObject, needsPublic) => {
    if (keyObject instanceof KeyObject) {
      return keyObject[toInput](needsPublic)
    }

    return createSecretKey(keyObject)[toInput](needsPublic)
  }

  const pemToDer = pem => Buffer.from(pem.replace(/(?:-----(?:BEGIN|END)(?: (?:RSA|EC))? (?:PRIVATE|PUBLIC) KEY-----|\s)/g, ''), 'base64')
  const derToPem = (der, label) => `-----BEGIN ${label}-----${EOL}${(der.toString('base64').match(/.{1,64}/g) || []).join(EOL)}${EOL}-----END ${label}-----`
  const unsupported = (input) => {
    const label = typeof input === 'string' ? input : `OID ${input.join('.')}`
    throw new errors.JOSENotSupported(`${label} is not supported in your Node.js runtime version`)
  }

  KeyObject = class KeyObject {
    export ({ cipher, passphrase, type, format } = {}) {
      if (this._type === 'secret') {
        return this._buffer
      }

      if (this._type === 'public') {
        if (this.asymmetricKeyType === 'rsa') {
          switch (type) {
            case 'pkcs1':
              if (format === 'pem') {
                return this._pem
              }

              return pemToDer(this._pem)
            case 'spki': {
              const PublicKeyInfo = asn1.get('PublicKeyInfo')
              const pem = PublicKeyInfo.encode({
                algorithm: {
                  algorithm: 'rsaEncryption',
                  parameters: { type: 'null' }
                },
                publicKey: {
                  unused: 0,
                  data: pemToDer(this._pem)
                }
              }, 'pem', { label: 'PUBLIC KEY' })

              return format === 'pem' ? pem : pemToDer(pem)
            }
            default:
              throw new TypeError(`The value ${type} is invalid for option "type"`)
          }
        }

        if (this.asymmetricKeyType === 'ec') {
          if (type !== 'spki') {
            throw new TypeError(`The value ${type} is invalid for option "type"`)
          }

          if (format === 'pem') {
            return this._pem
          }

          return pemToDer(this._pem)
        }
      }

      if (this._type === 'private') {
        if (passphrase !== undefined || cipher !== undefined) {
          throw new errors.JOSENotSupported('encrypted private keys are not supported in your Node.js runtime version')
        }

        if (type === 'pkcs8') {
          if (this._pkcs8) {
            if (format === 'der' && typeof this._pkcs8 === 'string') {
              return pemToDer(this._pkcs8)
            }

            if (format === 'pem' && Buffer.isBuffer(this._pkcs8)) {
              return derToPem(this._pkcs8, 'PRIVATE KEY')
            }

            return this._pkcs8
          }

          if (this.asymmetricKeyType === 'rsa') {
            const parsed = this._asn1
            const RSAPrivateKey = asn1.get('RSAPrivateKey')
            const privateKey = RSAPrivateKey.encode(parsed)
            const PrivateKeyInfo = asn1.get('PrivateKeyInfo')
            const pkcs8 = PrivateKeyInfo.encode({
              version: 0,
              privateKey,
              algorithm: {
                algorithm: 'rsaEncryption',
                parameters: { type: 'null' }
              }
            })

            this._pkcs8 = pkcs8

            return this.export({ type, format })
          }

          if (this.asymmetricKeyType === 'ec') {
            const parsed = this._asn1
            const ECPrivateKey = asn1.get('ECPrivateKey')
            const privateKey = ECPrivateKey.encode({
              version: parsed.version,
              privateKey: parsed.privateKey,
              publicKey: parsed.publicKey
            })
            const PrivateKeyInfo = asn1.get('PrivateKeyInfo')
            const pkcs8 = PrivateKeyInfo.encode({
              version: 0,
              privateKey,
              algorithm: {
                algorithm: 'ecPublicKey',
                parameters: this._asn1.parameters
              }
            })

            this._pkcs8 = pkcs8

            return this.export({ type, format })
          }
        }

        if (this.asymmetricKeyType === 'rsa' && type === 'pkcs1') {
          if (format === 'pem') {
            return this._pem
          }

          return pemToDer(this._pem)
        } else if (this.asymmetricKeyType === 'ec' && type === 'sec1') {
          if (format === 'pem') {
            return this._pem
          }

          return pemToDer(this._pem)
        } else {
          throw new TypeError(`The value ${type} is invalid for option "type"`)
        }
      }
    }

    get type () {
      return this._type
    }

    get asymmetricKeyType () {
      return this._asymmetricKeyType
    }

    get symmetricKeySize () {
      return this._symmetricKeySize
    }

    [toInput] (needsPublic) {
      switch (this._type) {
        case 'secret':
          return this._buffer
        case 'public':
          return this._pem
        default:
          if (needsPublic) {
            if (!('_pub' in this)) {
              this._pub = createPublicKey(this)
            }

            return this._pub[toInput](false)
          }

          return this._pem
      }
    }
  }

  createSecretKey = (buffer) => {
    if (!Buffer.isBuffer(buffer) || !buffer.length) {
      throw new TypeError('input must be a non-empty Buffer instance')
    }

    const keyObject = new KeyObject()
    keyObject._buffer = Buffer.from(buffer)
    keyObject._symmetricKeySize = buffer.length
    keyObject._type = 'secret'

    return keyObject
  }

  createPublicKey = (input) => {
    if (input instanceof KeyObject) {
      if (input.type !== 'private') {
        throw new TypeError(`Invalid key object type ${input.type}, expected private.`)
      }

      switch (input.asymmetricKeyType) {
        case 'ec': {
          const PublicKeyInfo = asn1.get('PublicKeyInfo')
          const key = PublicKeyInfo.encode({
            algorithm: {
              algorithm: 'ecPublicKey',
              parameters: input._asn1.parameters
            },
            publicKey: input._asn1.publicKey
          })

          return createPublicKey({ key, format: 'der', type: 'spki' })
        }
        case 'rsa': {
          const RSAPublicKey = asn1.get('RSAPublicKey')
          const key = RSAPublicKey.encode(input._asn1)
          return createPublicKey({ key, format: 'der', type: 'pkcs1' })
        }
      }
    }

    if (typeof input === 'string' || Buffer.isBuffer(input)) {
      input = { key: input, format: 'pem' }
    }

    if (!isObject(input)) {
      throw new TypeError('input must be a string, Buffer or an object')
    }

    const { format, passphrase } = input
    let { key, type } = input

    if (typeof key !== 'string' && !Buffer.isBuffer(key)) {
      throw new TypeError('key must be a string or Buffer')
    }

    if (format !== 'pem' && format !== 'der') {
      throw new TypeError('format must be one of "pem" or "der"')
    }

    let label
    if (format === 'pem') {
      key = key.toString()
      switch (key.split(/\r?\n/g)[0].toString()) {
        case '-----BEGIN PUBLIC KEY-----':
          type = 'spki'
          label = 'PUBLIC KEY'
          break
        case '-----BEGIN RSA PUBLIC KEY-----':
          type = 'pkcs1'
          label = 'RSA PUBLIC KEY'
          break
        case '-----BEGIN CERTIFICATE-----':
          throw new errors.JOSENotSupported('X.509 certificates are not supported in your Node.js runtime version')
        case '-----BEGIN PRIVATE KEY-----':
        case '-----BEGIN EC PRIVATE KEY-----':
        case '-----BEGIN RSA PRIVATE KEY-----':
          return createPublicKey(createPrivateKey(key))
        default:
          throw new TypeError('unknown/unsupported PEM type')
      }
    }

    switch (type) {
      case 'spki': {
        const PublicKeyInfo = asn1.get('PublicKeyInfo')
        const parsed = PublicKeyInfo.decode(key, format, { label })

        let type, keyObject
        switch (parsed.algorithm.algorithm) {
          case 'ecPublicKey': {
            keyObject = new KeyObject()
            keyObject._asn1 = parsed
            keyObject._asymmetricKeyType = 'ec'
            keyObject._type = 'public'
            keyObject._pem = PublicKeyInfo.encode(parsed, 'pem', { label: 'PUBLIC KEY' })

            break
          }
          case 'rsaEncryption': {
            type = 'pkcs1'
            keyObject = createPublicKey({ type, key: parsed.publicKey.data, format: 'der' })
            break
          }
          default:
            unsupported(parsed.algorithm.algorithm)
        }

        return keyObject
      }
      case 'pkcs1': {
        const RSAPublicKey = asn1.get('RSAPublicKey')
        const parsed = RSAPublicKey.decode(key, format, { label })

        // special case when private pkcs1 PEM / DER is used with createPublicKey
        if (parsed.n === BigInt(0)) {
          return createPublicKey(createPrivateKey({ key, format, type, passphrase }))
        }

        const keyObject = new KeyObject()
        keyObject._asn1 = parsed
        keyObject._asymmetricKeyType = 'rsa'
        keyObject._type = 'public'
        keyObject._pem = RSAPublicKey.encode(parsed, 'pem', { label: 'RSA PUBLIC KEY' })

        return keyObject
      }
      case 'pkcs8':
      case 'sec1':
        return createPublicKey(createPrivateKey({ format, key, type, passphrase }))
      default:
        throw new TypeError(`The value ${type} is invalid for option "type"`)
    }
  }

  createPrivateKey = (input, hints) => {
    if (typeof input === 'string' || Buffer.isBuffer(input)) {
      input = { key: input, format: 'pem' }
    }

    if (!isObject(input)) {
      throw new TypeError('input must be a string, Buffer or an object')
    }

    const { format, passphrase } = input
    let { key, type } = input

    if (typeof key !== 'string' && !Buffer.isBuffer(key)) {
      throw new TypeError('key must be a string or Buffer')
    }

    if (passphrase !== undefined) {
      throw new errors.JOSENotSupported('encrypted private keys are not supported in your Node.js runtime version')
    }

    if (format !== 'pem' && format !== 'der') {
      throw new TypeError('format must be one of "pem" or "der"')
    }

    let label
    if (format === 'pem') {
      key = key.toString()
      switch (key.split(/\r?\n/g)[0].toString()) {
        case '-----BEGIN PRIVATE KEY-----':
          type = 'pkcs8'
          label = 'PRIVATE KEY'
          break
        case '-----BEGIN EC PRIVATE KEY-----':
          type = 'sec1'
          label = 'EC PRIVATE KEY'
          break
        case '-----BEGIN RSA PRIVATE KEY-----':
          type = 'pkcs1'
          label = 'RSA PRIVATE KEY'
          break
        default:
          throw new TypeError('unknown/unsupported PEM type')
      }
    }

    switch (type) {
      case 'pkcs8': {
        const PrivateKeyInfo = asn1.get('PrivateKeyInfo')
        const parsed = PrivateKeyInfo.decode(key, format, { label })

        let type, keyObject
        switch (parsed.algorithm.algorithm) {
          case 'ecPublicKey': {
            type = 'sec1'
            keyObject = createPrivateKey({ type, key: parsed.privateKey, format: 'der' }, { [namedCurve]: parsed.algorithm.parameters.value })
            break
          }
          case 'rsaEncryption': {
            type = 'pkcs1'
            keyObject = createPrivateKey({ type, key: parsed.privateKey, format: 'der' })
            break
          }
          default:
            unsupported(parsed.algorithm.algorithm)
        }

        keyObject._pkcs8 = key
        return keyObject
      }
      case 'pkcs1': {
        const RSAPrivateKey = asn1.get('RSAPrivateKey')
        const parsed = RSAPrivateKey.decode(key, format, { label })

        const keyObject = new KeyObject()
        keyObject._asn1 = parsed
        keyObject._asymmetricKeyType = 'rsa'
        keyObject._type = 'private'
        keyObject._pem = RSAPrivateKey.encode(parsed, 'pem', { label: 'RSA PRIVATE KEY' })

        return keyObject
      }
      case 'sec1': {
        const ECPrivateKey = asn1.get('ECPrivateKey')
        let parsed = ECPrivateKey.decode(key, format, { label })

        if (!('parameters' in parsed) && !hints[namedCurve]) {
          throw new Error('invalid sec1')
        } else if (!('parameters' in parsed)) {
          parsed = { ...parsed, parameters: { type: 'namedCurve', value: hints[namedCurve] } }
        }

        const keyObject = new KeyObject()
        keyObject._asn1 = parsed
        keyObject._asymmetricKeyType = 'ec'
        keyObject._type = 'private'
        keyObject._pem = ECPrivateKey.encode(parsed, 'pem', { label: 'EC PRIVATE KEY' })

        return keyObject
      }
      default:
        throw new TypeError(`The value ${type} is invalid for option "type"`)
    }
  }
}

module.exports = { createPublicKey, createPrivateKey, createSecretKey, KeyObject, asInput }
