/**
 * A generic Error subclass that all other specific
 * JOSE Error subclasses inherit from.
 */
export class JOSEError extends Error {
  /**
   * A unique error code for the particular error subclass.
   */
  static get code(): string {
    return 'ERR_JOSE_GENERIC'
  }

  /**
   * A unique error code for the particular error subclass.
   */
  code: string = 'ERR_JOSE_GENERIC'

  constructor(message?: string) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace?.(this, this.constructor)
  }
}

/**
 * An error subclass thrown when a JWT Claim Set member validation fails.
 */
export class JWTClaimValidationFailed extends JOSEError {
  static get code(): 'ERR_JWT_CLAIM_VALIDATION_FAILED' {
    return 'ERR_JWT_CLAIM_VALIDATION_FAILED'
  }

  code = 'ERR_JWT_CLAIM_VALIDATION_FAILED'

  /**
   * The Claim for which the validation failed.
   */
  claim: string

  /**
   * Reason code for the validation failure.
   */
  reason: string

  constructor(message: string, claim = 'unspecified', reason = 'unspecified') {
    super(message)
    this.claim = claim
    this.reason = reason
  }
}

/**
 * An error subclass thrown when a JWT is expired.
 */
export class JWTExpired extends JOSEError implements JWTClaimValidationFailed {
  static get code(): 'ERR_JWT_EXPIRED' {
    return 'ERR_JWT_EXPIRED'
  }

  code = 'ERR_JWT_EXPIRED'

  /**
   * The Claim for which the validation failed.
   */
  claim: string

  /**
   * Reason code for the validation failure.
   */
  reason: string

  constructor(message: string, claim = 'unspecified', reason = 'unspecified') {
    super(message)
    this.claim = claim
    this.reason = reason
  }
}

/**
 * An error subclass thrown when a JOSE Algorithm is not allowed per developer preference.
 */
export class JOSEAlgNotAllowed extends JOSEError {
  static get code(): 'ERR_JOSE_ALG_NOT_ALLOWED' {
    return 'ERR_JOSE_ALG_NOT_ALLOWED'
  }

  code = 'ERR_JOSE_ALG_NOT_ALLOWED'
}

/**
 * An error subclass thrown when a particular feature or algorithm is not supported by this
 * implementation or JOSE in general.
 */
export class JOSENotSupported extends JOSEError {
  static get code(): 'ERR_JOSE_NOT_SUPPORTED' {
    return 'ERR_JOSE_NOT_SUPPORTED'
  }

  code = 'ERR_JOSE_NOT_SUPPORTED'
}

/**
 * An error subclass thrown when a JWE ciphertext decryption fails.
 */
export class JWEDecryptionFailed extends JOSEError {
  static get code(): 'ERR_JWE_DECRYPTION_FAILED' {
    return 'ERR_JWE_DECRYPTION_FAILED'
  }

  code = 'ERR_JWE_DECRYPTION_FAILED'

  message = 'decryption operation failed'
}

/**
 * An error subclass thrown when a JWE is invalid.
 */
export class JWEInvalid extends JOSEError {
  static get code(): 'ERR_JWE_INVALID' {
    return 'ERR_JWE_INVALID'
  }

  code = 'ERR_JWE_INVALID'
}

/**
 * An error subclass thrown when a JWS is invalid.
 */
export class JWSInvalid extends JOSEError {
  static get code(): 'ERR_JWS_INVALID' {
    return 'ERR_JWS_INVALID'
  }

  code = 'ERR_JWS_INVALID'
}

/**
 * An error subclass thrown when a JWT is invalid.
 */
export class JWTInvalid extends JOSEError {
  static get code(): 'ERR_JWT_INVALID' {
    return 'ERR_JWT_INVALID'
  }

  code = 'ERR_JWT_INVALID'
}

/**
 * An error subclass thrown when a JWK is invalid.
 */
export class JWKInvalid extends JOSEError {
  static get code(): 'ERR_JWK_INVALID' {
    return 'ERR_JWK_INVALID'
  }

  code = 'ERR_JWK_INVALID'
}

/**
 * An error subclass thrown when a JWKS is invalid.
 */
export class JWKSInvalid extends JOSEError {
  static get code(): 'ERR_JWKS_INVALID' {
    return 'ERR_JWKS_INVALID'
  }

  code = 'ERR_JWKS_INVALID'
}

/**
 * An error subclass thrown when no keys match from a JWKS.
 */
export class JWKSNoMatchingKey extends JOSEError {
  static get code(): 'ERR_JWKS_NO_MATCHING_KEY' {
    return 'ERR_JWKS_NO_MATCHING_KEY'
  }

  code = 'ERR_JWKS_NO_MATCHING_KEY'

  message = 'no applicable key found in the JSON Web Key Set'
}

/**
 * An error subclass thrown when multiple keys match from a JWKS.
 */
export class JWKSMultipleMatchingKeys extends JOSEError {
  static get code(): 'ERR_JWKS_MULTIPLE_MATCHING_KEYS' {
    return 'ERR_JWKS_MULTIPLE_MATCHING_KEYS'
  }

  code = 'ERR_JWKS_MULTIPLE_MATCHING_KEYS'

  message = 'multiple matching keys found in the JSON Web Key Set'
}

/**
 * Timeout was reached when retrieving the JWKS response.
 */
export class JWKSTimeout extends JOSEError {
  static get code(): 'ERR_JWKS_TIMEOUT' {
    return 'ERR_JWKS_TIMEOUT'
  }

  code = 'ERR_JWKS_TIMEOUT'

  message = 'request timed out'
}

/**
 * An error subclass thrown when JWS signature verification fails.
 */
export class JWSSignatureVerificationFailed extends JOSEError {
  static get code(): 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' {
    return 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED'
  }

  code = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED'

  message = 'signature verification failed'
}
