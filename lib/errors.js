const CODES = {
  JWSMissingAlg: 'ERR_JWS_ALG_MISSING',
  JWSInvalidHeader: 'ERR_JWS_INVALID_HEADER',
  JWSNoRecipients: 'ERR_JWS_NO_RECIPIENTS',
  JWSVerificationFailed: 'ERR_JWS_VERIFICATION_FAILED'
}

class JoseError extends Error {
  constructor (message) {
    super(message)
    this.name = this.constructor.name
    this.code = CODES[this.constructor.name]
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports.JWSMissingAlg = class JWSMissingAlg extends JoseError {}
module.exports.JWSInvalidHeader = class JWSInvalidHeader extends JoseError {}
module.exports.JWSNoRecipients = class JWSNoRecipients extends JoseError {}
module.exports.JWSVerificationFailed = class JWSVerificationFailed extends JoseError {}
