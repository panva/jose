const { TODO } = require('../errors')

function compactSerializer (enc, [recipient]) {
  return `${enc.protected}.${recipient.encrypted_key}.${enc.iv}.${enc.ciphertext}.${enc.tag}`
}
compactSerializer.validate = (jwe, recipients) => {
  if (recipients.length !== 1 || jwe.aad || jwe.unprotectedHeader || recipients.some(({ header }) => header)) {
    throw new TypeError('JWE Compact Serialization doesn\'t support multiple recipients, JWE unprotected headers or AAD')
  }
}

function flattenedSerializer (enc, [recipient]) {
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

function generalSerializer (enc, recipients) {
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

function detect (input) {
  if (typeof input === 'string') {
    return 'compact'
  }

  if (typeof input === 'object') {
    if ('recipients' in input && 'ciphertext' in input && Array.isArray(input.recipients)) {
      if (!input.recipients.every(s => 'encrypted_key' in s)) {
        throw new TODO('invalid serialization')
      }

      return 'general'
    }

    return 'flattened'
  }

  throw new TODO('invalid serialization')
}

module.exports = {
  compact: compactSerializer,
  flattened: flattenedSerializer,
  general: generalSerializer,
  detect
}
