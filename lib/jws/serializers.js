const { TODO } = require('../errors')

function compactSerializer (payload, [{ signature, protected: prot }]) {
  return `${prot}.${payload}.${signature}`
}
compactSerializer.validate = (jws, recipients) => {
  if (recipients.length !== 1 || jws.sharedUnprotectedHeader || recipients.some(r => r.unprotectedHeader)) {
    throw new TypeError("JWS Compact Serialization doesn't support multiple recipients or JWS unprotected headers")
  }
}

function generalSerializer (payload, recipients) {
  return {
    payload,
    signatures: recipients.map(({ header, signature, protected: prot }) => {
      return {
        signature,
        ...prot ? { protected: prot } : undefined,
        ...header ? { header } : undefined
      }
    })
  }
}
generalSerializer.validate = () => {}

function flattenedSerializer (payload, [{ header, signature, protected: prot }]) {
  return {
    payload,
    signature,
    ...prot ? { protected: prot } : undefined,
    ...header ? { header } : undefined
  }
}
flattenedSerializer.validate = (jws, { length }) => {
  if (length !== 1) {
    throw new TypeError("Flattened JWS JSON Serialization doesn't support multiple recipients")
  }
}

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
