const CODES = {
  JWSInvalidHeader: 'ERR_JWS_INVALID_HEADER',
  JWSMissingAlg: 'ERR_JWS_ALG_MISSING',
  JWSNoRecipients: 'ERR_JWS_NO_RECIPIENTS',
  JWSVerificationFailed: 'ERR_JWS_VERIFICATION_FAILED',
  JWTAudienceMismatch: 'ERR_JWT_AUDIENCE_MISMATCH',
  JWTInvalidAlgorithm: 'ERR_JWT_INVALID_ALGORITHM',
  JWTIssuerMismatch: 'ERR_JWT_ISSUER_MISMATCH',
  JWTNonceMismatch: 'ERR_JWT_NONCE_MISMATCH',
  JWTSubjectMismatch: 'ERR_JWT_SUBJECT_MISMATCH',
  JWTTokenIdMismatch: 'ERR_JWT_TOKEN_ID_MISMATCH'
}

class JoseError extends Error {
  constructor (message) {
    super(message)
    this.name = this.constructor.name
    this.code = CODES[this.constructor.name]
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports.JWSInvalidHeader = class JWSInvalidHeader extends JoseError {}
module.exports.JWSMissingAlg = class JWSMissingAlg extends JoseError {}
module.exports.JWSNoRecipients = class JWSNoRecipients extends JoseError {}
module.exports.JWSVerificationFailed = class JWSVerificationFailed extends JoseError {}
module.exports.JWTAudienceMismatch = class JWTAudienceMismatch extends JoseError {}
module.exports.JWTInvalidAlgorithm = class JWTInvalidAlgorithm extends JoseError {}
module.exports.JWTIssuerMismatch = class JWTIssuerMismatch extends JoseError {}
module.exports.JWTNonceMismatch = class JWTNonceMismatch extends JoseError {}
module.exports.JWTSubjectMismatch = class JWTSubjectMismatch extends JoseError {}
module.exports.JWTTokenIdMismatch = class JWTTokenIdMismatch extends JoseError {}
