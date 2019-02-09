const { TODO } = require('../errors')

function compactSerializer (payload, [recipient]) {
  return `${recipient.protected}.${payload}.${recipient.signature}`
}
compactSerializer.validate = (jws, recipients) => {
  if (recipients.length !== 1 || recipients.some(r => r.unprotectedHeader)) {
    throw new TypeError('JWS Compact Serialization doesn\'t support multiple recipients or JWS unprotected headers')
  }
}

function flattenedSerializer (payload, [recipient]) {
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

function generalSerializer (payload, recipients) {
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

function detect (input) {
  if (typeof input === 'string') {
    return 'compact'
  }

  if (typeof input === 'object' && typeof input.payload === 'string') {
    if (typeof input.signature === 'string') {
      return 'flattened'
    }

    if (Array.isArray(input.signatures)) {
      if (input.signatures.every(s => typeof s === 'object' && typeof 'signature' === 'string')) {
        return 'general'
      }
    }
  }

  throw new TODO('invalid serialization')
}

module.exports = {
  compact: compactSerializer,
  flattened: flattenedSerializer,
  general: generalSerializer,
  detect
}
