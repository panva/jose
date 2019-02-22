const CODES = {
  JOSEAlgNotWhitelisted: 'ERR_JOSE_ALG_NOT_WHITELISTED',
  JOSENotSupported: 'ERR_JOSE_NOT_SUPPORTED',
  JOSECritNotUnderstood: 'ERR_JOSE_CRIT_NOT_UNDERSTOOD',
  JWEDecryptionFailed: 'ERR_JWE_DECRYPTION_FAILED',
  JWEInvalid: 'ERR_JWE_INVALID',
  JWEInvalidHeader: 'ERR_JWE_INVALID_HEADER',
  JWENoRecipients: 'ERR_JWE_NO_RECIPIENTS',
  JWKImportFailed: 'ERR_JWK_IMPORT_FAILED',
  JWKKeySupport: 'ERR_JWK_KEY_SUPPORT',
  JWSInvalid: 'ERR_JWS_INVALID',
  JWSInvalidHeader: 'ERR_JWS_INVALID_HEADER',
  JWSNoRecipients: 'ERR_JWS_NO_RECIPIENTS',
  JWSVerificationFailed: 'ERR_JWS_VERIFICATION_FAILED'
}

const DEFAULT_MESSAGES = {
  JWEDecryptionFailed: 'decryption operation failed',
  JWEInvalid: 'JWE invalid',
  JWSInvalid: 'JWS invalid',
  JWSVerificationFailed: 'signature verification failed'
}

class JoseError extends Error {
  constructor (message) {
    super(message)
    if (message === undefined) {
      message = DEFAULT_MESSAGES[this.constructor.name]
    }
    this.name = this.constructor.name
    this.code = CODES[this.constructor.name]
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports.JOSEAlgNotWhitelisted = class JOSEAlgNotWhitelisted extends JoseError {}
module.exports.JOSENotSupported = class JOSENotSupported extends JoseError {}
module.exports.JOSECritNotUnderstood = class JOSECritNotUnderstood extends JoseError {}
module.exports.JWEDecryptionFailed = class JWEDecryptionFailed extends JoseError {}
module.exports.JWEInvalid = class JWEInvalid extends JoseError {}
module.exports.JWEInvalidHeader = class JWEInvalidHeader extends JoseError {}
module.exports.JWENoRecipients = class JWENoRecipients extends JoseError {}
module.exports.JWKImportFailed = class JWKImportFailed extends JoseError {}
module.exports.JWKKeySupport = class JWKKeySupport extends JoseError {}
module.exports.JWSInvalid = class JWSInvalid extends JoseError {}
module.exports.JWSInvalidHeader = class JWSInvalidHeader extends JoseError {}
module.exports.JWSNoRecipients = class JWSNoRecipients extends JoseError {}
module.exports.JWSVerificationFailed = class JWSVerificationFailed extends JoseError {}
