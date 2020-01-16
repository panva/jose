const CODES = {
  JOSEAlgNotWhitelisted: 'ERR_JOSE_ALG_NOT_WHITELISTED',
  JOSECritNotUnderstood: 'ERR_JOSE_CRIT_NOT_UNDERSTOOD',
  JOSEInvalidEncoding: 'ERR_JOSE_INVALID_ENCODING',
  JOSEMultiError: 'ERR_JOSE_MULTIPLE_ERRORS',
  JOSENotSupported: 'ERR_JOSE_NOT_SUPPORTED',
  JWEDecryptionFailed: 'ERR_JWE_DECRYPTION_FAILED',
  JWEInvalid: 'ERR_JWE_INVALID',
  JWKImportFailed: 'ERR_JWK_IMPORT_FAILED',
  JWKInvalid: 'ERR_JWK_INVALID',
  JWKKeySupport: 'ERR_JWK_KEY_SUPPORT',
  JWKSNoMatchingKey: 'ERR_JWKS_NO_MATCHING_KEY',
  JWSInvalid: 'ERR_JWS_INVALID',
  JWSVerificationFailed: 'ERR_JWS_VERIFICATION_FAILED',
  JWTClaimInvalid: 'ERR_JWT_CLAIM_INVALID',
  JWTExpired: 'ERR_JWT_EXPIRED',
  JWTMalformed: 'ERR_JWT_MALFORMED'
}

const DEFAULT_MESSAGES = {
  JWEDecryptionFailed: 'decryption operation failed',
  JWEInvalid: 'JWE invalid',
  JWKSNoMatchingKey: 'no matching key found in the KeyStore',
  JWSInvalid: 'JWS invalid',
  JWSVerificationFailed: 'signature verification failed'
}

class JOSEError extends Error {
  constructor (message) {
    super(message)
    if (message === undefined) {
      this.message = DEFAULT_MESSAGES[this.constructor.name]
    }
    this.name = this.constructor.name
    this.code = CODES[this.constructor.name]
    Error.captureStackTrace(this, this.constructor)
  }
}

const isMulti = e => e instanceof JOSEMultiError
class JOSEMultiError extends JOSEError {
  constructor (errors) {
    super()
    let i
    while ((i = errors.findIndex(isMulti)) && i !== -1) {
      errors.splice(i, 1, ...errors[i])
    }
    Object.defineProperty(this, 'errors', { value: errors })
  }

  * [Symbol.iterator] () {
    for (const error of this.errors) {
      yield error
    }
  }
}
module.exports.JOSEError = JOSEError

module.exports.JOSEAlgNotWhitelisted = class JOSEAlgNotWhitelisted extends JOSEError {}
module.exports.JOSECritNotUnderstood = class JOSECritNotUnderstood extends JOSEError {}
module.exports.JOSEInvalidEncoding = class JOSEInvalidEncoding extends JOSEError {}
module.exports.JOSEMultiError = JOSEMultiError
module.exports.JOSENotSupported = class JOSENotSupported extends JOSEError {}

module.exports.JWEDecryptionFailed = class JWEDecryptionFailed extends JOSEError {}
module.exports.JWEInvalid = class JWEInvalid extends JOSEError {}

module.exports.JWKImportFailed = class JWKImportFailed extends JOSEError {}
module.exports.JWKInvalid = class JWKInvalid extends JOSEError {}
module.exports.JWKKeySupport = class JWKKeySupport extends JOSEError {}

module.exports.JWKSNoMatchingKey = class JWKSNoMatchingKey extends JOSEError {}

module.exports.JWSInvalid = class JWSInvalid extends JOSEError {}
module.exports.JWSVerificationFailed = class JWSVerificationFailed extends JOSEError {}

class JWTClaimInvalid extends JOSEError {
  constructor (message, claim = 'unspecified', reason = 'unspecified') {
    super(message)
    this.claim = claim
    this.reason = reason
  }
}
module.exports.JWTClaimInvalid = JWTClaimInvalid
module.exports.JWTExpired = class JWTExpired extends JWTClaimInvalid {}
module.exports.JWTMalformed = class JWTMalformed extends JOSEError {}
