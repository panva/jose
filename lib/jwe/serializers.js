const { JWEInvalid } = require('../errors')
const isObject = require('../help/is_object')

const compactSerializer = (enc, [recipient]) => {
  return `${enc.protected}.${recipient.encrypted_key}.${enc.iv}.${enc.ciphertext}.${enc.tag}`
}
compactSerializer.validate = (jwe, recipients) => {
  if (recipients.length !== 1 || jwe.aad || jwe.unprotectedHeader || recipients.some(({ header }) => header)) {
    throw new TypeError('JWE Compact Serialization doesn\'t support multiple recipients, JWE unprotected headers or AAD')
  }
}

const flattenedSerializer = (enc, [recipient]) => {
  const { header, encrypted_key: encryptedKey } = recipient

  return {
    ...(enc.protected ? { protected: enc.protected } : undefined),
    ...(enc.unprotected ? { unprotected: enc.unprotected } : undefined),
    ...(header ? { header } : undefined),
    ...(encryptedKey ? { encrypted_key: encryptedKey } : undefined),
    ...(enc.aad ? { aad: enc.aad } : undefined),
    iv: enc.iv,
    ciphertext: enc.ciphertext,
    tag: enc.tag
  }
}
flattenedSerializer.validate = (jwe, { length }) => {
  if (length !== 1) {
    throw new TypeError('Flattened JWE JSON Serialization doesn\'t support multiple recipients')
  }
}

const generalSerializer = (enc, recipients) => {
  const result = {
    ...(enc.protected ? { protected: enc.protected } : undefined),
    ...(enc.unprotected ? { unprotected: enc.unprotected } : undefined),
    recipients: recipients.map(({ header, encrypted_key: encryptedKey, generatedHeader }) => {
      if (!header && !encryptedKey && !generatedHeader) {
        return false
      }

      return {
        ...(header || generatedHeader ? { header: { ...header, ...generatedHeader } } : undefined),
        ...(encryptedKey ? { encrypted_key: encryptedKey } : undefined)
      }
    }).filter(Boolean),
    ...(enc.aad ? { aad: enc.aad } : undefined),
    iv: enc.iv,
    ciphertext: enc.ciphertext,
    tag: enc.tag
  }

  if (!result.recipients.length) {
    delete result.recipients
  }

  return result
}
generalSerializer.validate = () => {}

const isJSON = (input) => {
  return isObject(input) &&
    typeof input.ciphertext === 'string' &&
    typeof input.iv === 'string' &&
    typeof input.tag === 'string' &&
    (input.unprotected === undefined || isObject(input.unprotected)) &&
    (input.protected === undefined || typeof input.protected === 'string') &&
    (input.aad === undefined || typeof input.aad === 'string')
}

const isSingleRecipient = (input) => {
  return (input.encrypted_key === undefined || typeof input.encrypted_key === 'string') &&
    (input.header === undefined || isObject(input.header))
}

const isValidRecipient = (recipient) => {
  return isObject(recipient) && typeof recipient.encrypted_key === 'string' && (recipient.header === undefined || isObject(recipient.header))
}

const isMultiRecipient = (input) => {
  if (Array.isArray(input.recipients) && input.recipients.every(isValidRecipient)) {
    return true
  }

  return false
}

const detect = (input) => {
  if (typeof input === 'string' && input.split('.').length === 5) {
    return 'compact'
  }

  if (isJSON(input)) {
    if (isMultiRecipient(input)) {
      return 'general'
    }

    if (isSingleRecipient(input)) {
      return 'flattened'
    }
  }

  throw new JWEInvalid('JWE malformed or invalid serialization')
}

module.exports = {
  compact: compactSerializer,
  flattened: flattenedSerializer,
  general: generalSerializer,
  detect
}
