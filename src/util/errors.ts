/* eslint-disable max-classes-per-file */

/**
 * A generic Error subclass that all other specific
 * JOSE Error subclasses inherit from.
 */
export class JOSEError extends Error {
  /**
   * A unique error code for the particular error subclass.
   */
  code = 'ERR_JOSE_GENERIC'

  constructor(message?: string) {
    super(message)
    this.name = this.constructor.name
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

/**
 * An error subclass thrown when a JWT Claim Set member validation fails.
 */
export class JWTClaimValidationFailed extends JOSEError {
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
 * An error subclass thrown when a JOSE Algorithm is not allowed per developer preference.
 */
export class JOSEAlgNotAllowed extends JOSEError {
  code = 'ERR_JOSE_ALG_NOT_ALLOWED'
}

/**
 * An error subclass thrown when a particular feature or algorithm is not supported by this
 * implementation or JOSE in general.
 */
export class JOSENotSupported extends JOSEError {
  code = 'ERR_JOSE_NOT_SUPPORTED'
}

/**
 * An error subclass thrown when a JWE ciphertext decryption fails.
 */
export class JWEDecryptionFailed extends JOSEError {
  code = 'ERR_JWE_DECRYPTION_FAILED'

  message = 'decryption operation failed'
}

/**
 * An error subclass thrown when a JWE is invalid.
 */
export class JWEInvalid extends JOSEError {
  code = 'ERR_JWE_INVALID'
}

/**
 * An error subclass thrown when a JWS is invalid.
 */
export class JWSInvalid extends JOSEError {
  code = 'ERR_JWS_INVALID'
}

/**
 * An error subclass thrown when a JWT is invalid.
 */
export class JWTInvalid extends JOSEError {
  code = 'ERR_JWT_INVALID'
}

/**
 * An error subclass thrown when a JWK is invalid.
 */
export class JWKInvalid extends JOSEError {
  code = 'ERR_JWK_INVALID'
}

/**
 * An error subclass thrown when a JWKS is invalid.
 */
export class JWKSInvalid extends JOSEError {
  code = 'ERR_JWKS_INVALID'
}

/**
 * An error subclass thrown when no keys match from a JWKS.
 */
export class JWKSNoMatchingKey extends JOSEError {
  code = 'ERR_JWKS_NO_MATCHING_KEY'

  message = 'no applicable key found in the JSON Web Key Set'
}

/**
 * An error subclass thrown when multiple keys match from a JWKS.
 */
export class JWKSMultipleMatchingKeys extends JOSEError {
  code = 'ERR_JWKS_MULTIPLE_MATCHING_KEYS'

  message = 'multiple matching keys found in the JSON Web Key Set'
}

/**
 * An error subclass thrown when JWS signature verification fails.
 */
export class JWSSignatureVerificationFailed extends JOSEError {
  code = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED'

  message = 'signature verification failed'
}

/**
 * An error subclass thrown when a JWT is expired.
 */
export class JWTExpired extends JWTClaimValidationFailed {
  code = 'ERR_JWT_EXPIRED'
}
