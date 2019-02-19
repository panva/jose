const { JWSInvalid } = require('../errors')
const isObject = require('../help/is_object')

const compactSerializer = (payload, [recipient]) => {
  return `${recipient.protected}.${payload}.${recipient.signature}`
}
compactSerializer.validate = (jws, recipients) => {
  if (recipients.length !== 1 || recipients.some(r => r.unprotectedHeader)) {
    throw new TypeError('JWS Compact Serialization doesn\'t support multiple recipients or JWS unprotected headers')
  }
}

const flattenedSerializer = (payload, [recipient]) => {
  const { header, signature, protected: prot } = recipient

  return {
    payload,
    ...prot ? { protected: prot } : undefined,
    ...header ? { header } : undefined,
    signature
  }
}
flattenedSerializer.validate = (jws, { length }) => {
  if (length !== 1) {
    throw new TypeError('Flattened JWS JSON Serialization doesn\'t support multiple recipients')
  }
}

const generalSerializer = (payload, recipients) => {
  return {
    payload,
    signatures: recipients.map(({ header, signature, protected: prot }) => {
      return {
        ...prot ? { protected: prot } : undefined,
        ...header ? { header } : undefined,
        signature
      }
    })
  }
}
generalSerializer.validate = () => {}

const isJSON = (input) => {
  return isObject(input) && typeof input.payload === 'string'
}

const isValidRecipient = (recipient) => {
  return isObject(recipient) && typeof recipient.signature === 'string' &&
    (recipient.header === undefined || isObject(recipient.header)) &&
    (recipient.protected === undefined || typeof recipient.protected === 'string')
}

const isMultiRecipient = (input) => {
  if (Array.isArray(input.signatures) && input.signatures.every(isValidRecipient)) {
    return true
  }

  return false
}

const detect = (input) => {
  if (typeof input === 'string' && input.split('.').length === 3) {
    return 'compact'
  }

  if (isJSON(input)) {
    if (isMultiRecipient(input)) {
      return 'general'
    }

    if (isValidRecipient(input)) {
      return 'flattened'
    }
  }

  throw new JWSInvalid('JWS malformed or invalid serialization')
}

module.exports = {
  compact: compactSerializer,
  flattened: flattenedSerializer,
  general: generalSerializer,
  detect
}
