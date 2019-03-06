const isObject = require('../help/is_object')
let validateCrit = require('../help/validate_crit')

const { JWEInvalid } = require('../errors')

validateCrit = validateCrit.bind(undefined, JWEInvalid)

const compactSerializer = (final, [recipient]) => {
  return `${final.protected}.${recipient.encrypted_key}.${final.iv}.${final.ciphertext}.${final.tag}`
}
compactSerializer.validate = (protectedHeader, unprotectedHeader, aad, { 0: { header }, length }) => {
  if (length !== 1 || aad || unprotectedHeader || header) {
    throw new JWEInvalid('JWE Compact Serialization doesn\'t support multiple recipients, JWE unprotected headers or AAD')
  }
  validateCrit(protectedHeader, unprotectedHeader, protectedHeader ? protectedHeader.crit : undefined)
}

const flattenedSerializer = (final, [recipient]) => {
  const { header, encrypted_key: encryptedKey } = recipient

  return {
    ...(final.protected ? { protected: final.protected } : undefined),
    ...(final.unprotected ? { unprotected: final.unprotected } : undefined),
    ...(header ? { header } : undefined),
    ...(encryptedKey ? { encrypted_key: encryptedKey } : undefined),
    ...(final.aad ? { aad: final.aad } : undefined),
    iv: final.iv,
    ciphertext: final.ciphertext,
    tag: final.tag
  }
}
flattenedSerializer.validate = (protectedHeader, unprotectedHeader, aad, { 0: { header }, length }) => {
  if (length !== 1) {
    throw new JWEInvalid('Flattened JWE JSON Serialization doesn\'t support multiple recipients')
  }
  validateCrit(protectedHeader, { ...unprotectedHeader, ...header }, protectedHeader ? protectedHeader.crit : undefined)
}

const generalSerializer = (final, recipients) => {
  const result = {
    ...(final.protected ? { protected: final.protected } : undefined),
    ...(final.unprotected ? { unprotected: final.unprotected } : undefined),
    recipients: recipients.map(({ header, encrypted_key: encryptedKey, generatedHeader }) => {
      if (!header && !encryptedKey && !generatedHeader) {
        return false
      }

      return {
        ...(header || generatedHeader ? { header: { ...header, ...generatedHeader } } : undefined),
        ...(encryptedKey ? { encrypted_key: encryptedKey } : undefined)
      }
    }).filter(Boolean),
    ...(final.aad ? { aad: final.aad } : undefined),
    iv: final.iv,
    ciphertext: final.ciphertext,
    tag: final.tag
  }

  if (!result.recipients.length) {
    delete result.recipients
  }

  return result
}
generalSerializer.validate = (protectedHeader, unprotectedHeader, aad, recipients) => {
  recipients.forEach(({ header }) => {
    validateCrit(protectedHeader, { ...header, ...unprotectedHeader }, protectedHeader ? protectedHeader.crit : undefined)
  })
}

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
