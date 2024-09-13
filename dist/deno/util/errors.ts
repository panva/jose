import type { JWTPayload, KeyLike } from '../types.d.ts'

/**
 * A generic Error that all other JOSE specific Error subclasses extend.
 *
 */
export class JOSEError extends Error {
  /**
   * A unique error code for the particular error subclass.
   *
   * @ignore
   */
  static get code(): string {
    return 'ERR_JOSE_GENERIC'
  }

  /** A unique error code for this particular error subclass. */
  code = 'ERR_JOSE_GENERIC'

  /** @ignore */
  constructor(message?: string) {
    super(message)
    this.name = this.constructor.name
    // @ts-ignore
    Error.captureStackTrace?.(this, this.constructor)
  }
}

/**
 * An error subclass thrown when a JWT Claim Set member validation fails.
 *
 */
export class JWTClaimValidationFailed extends JOSEError {
  /** @ignore */
  static get code(): 'ERR_JWT_CLAIM_VALIDATION_FAILED' {
    return 'ERR_JWT_CLAIM_VALIDATION_FAILED'
  }

  code = 'ERR_JWT_CLAIM_VALIDATION_FAILED'

  /** The Claim for which the validation failed. */
  claim: string

  /** Reason code for the validation failure. */
  reason: string

  /**
   * The parsed JWT Claims Set (aka payload). Other JWT claims may or may not have been verified at
   * this point. The JSON Web Signature (JWS) or a JSON Web Encryption (JWE) structures' integrity
   * has however been verified. Claims Set verification happens after the JWS Signature or JWE
   * Decryption processes.
   */
  payload: JWTPayload

  /** @ignore */
  constructor(message: string, payload: JWTPayload, claim = 'unspecified', reason = 'unspecified') {
    super(message)
    this.claim = claim
    this.reason = reason
    this.payload = payload
  }
}

/**
 * An error subclass thrown when a JWT is expired.
 *
 */
export class JWTExpired extends JOSEError implements JWTClaimValidationFailed {
  /** @ignore */
  static get code(): 'ERR_JWT_EXPIRED' {
    return 'ERR_JWT_EXPIRED'
  }

  code = 'ERR_JWT_EXPIRED'

  /** The Claim for which the validation failed. */
  claim: string

  /** Reason code for the validation failure. */
  reason: string

  /**
   * The parsed JWT Claims Set (aka payload). Other JWT claims may or may not have been verified at
   * this point. The JSON Web Signature (JWS) or a JSON Web Encryption (JWE) structures' integrity
   * has however been verified. Claims Set verification happens after the JWS Signature or JWE
   * Decryption processes.
   */
  payload: JWTPayload

  /** @ignore */
  constructor(message: string, payload: JWTPayload, claim = 'unspecified', reason = 'unspecified') {
    super(message)
    this.claim = claim
    this.reason = reason
    this.payload = payload
  }
}

/**
 * An error subclass thrown when a JOSE Algorithm is not allowed per developer preference.
 *
 */
export class JOSEAlgNotAllowed extends JOSEError {
  /** @ignore */
  static get code(): 'ERR_JOSE_ALG_NOT_ALLOWED' {
    return 'ERR_JOSE_ALG_NOT_ALLOWED'
  }

  code = 'ERR_JOSE_ALG_NOT_ALLOWED'
}

/**
 * An error subclass thrown when a particular feature or algorithm is not supported by this
 * implementation or JOSE in general.
 *
 */
export class JOSENotSupported extends JOSEError {
  /** @ignore */
  static get code(): 'ERR_JOSE_NOT_SUPPORTED' {
    return 'ERR_JOSE_NOT_SUPPORTED'
  }

  code = 'ERR_JOSE_NOT_SUPPORTED'
}

/**
 * An error subclass thrown when a JWE ciphertext decryption fails.
 *
 */
export class JWEDecryptionFailed extends JOSEError {
  /** @ignore */
  static get code(): 'ERR_JWE_DECRYPTION_FAILED' {
    return 'ERR_JWE_DECRYPTION_FAILED'
  }

  code = 'ERR_JWE_DECRYPTION_FAILED'

  message = 'decryption operation failed'
}

/**
 * An error subclass thrown when a JWE is invalid.
 *
 */
export class JWEInvalid extends JOSEError {
  /** @ignore */
  static get code(): 'ERR_JWE_INVALID' {
    return 'ERR_JWE_INVALID'
  }

  code = 'ERR_JWE_INVALID'
}

/**
 * An error subclass thrown when a JWS is invalid.
 *
 */
export class JWSInvalid extends JOSEError {
  /** @ignore */
  static get code(): 'ERR_JWS_INVALID' {
    return 'ERR_JWS_INVALID'
  }

  code = 'ERR_JWS_INVALID'
}

/**
 * An error subclass thrown when a JWT is invalid.
 *
 */
export class JWTInvalid extends JOSEError {
  /** @ignore */
  static get code(): 'ERR_JWT_INVALID' {
    return 'ERR_JWT_INVALID'
  }

  code = 'ERR_JWT_INVALID'
}

/**
 * An error subclass thrown when a JWK is invalid.
 *
 */
export class JWKInvalid extends JOSEError {
  /** @ignore */
  static get code(): 'ERR_JWK_INVALID' {
    return 'ERR_JWK_INVALID'
  }

  code = 'ERR_JWK_INVALID'
}

/**
 * An error subclass thrown when a JWKS is invalid.
 *
 */
export class JWKSInvalid extends JOSEError {
  /** @ignore */
  static get code(): 'ERR_JWKS_INVALID' {
    return 'ERR_JWKS_INVALID'
  }

  code = 'ERR_JWKS_INVALID'
}

/**
 * An error subclass thrown when no keys match from a JWKS.
 *
 */
export class JWKSNoMatchingKey extends JOSEError {
  /** @ignore */
  static get code(): 'ERR_JWKS_NO_MATCHING_KEY' {
    return 'ERR_JWKS_NO_MATCHING_KEY'
  }

  code = 'ERR_JWKS_NO_MATCHING_KEY'

  message = 'no applicable key found in the JSON Web Key Set'
}

/**
 * An error subclass thrown when multiple keys match from a JWKS.
 *
 */
export class JWKSMultipleMatchingKeys extends JOSEError {
  /** @ignore */
  [Symbol.asyncIterator]!: () => AsyncIterableIterator<KeyLike>

  static get code(): 'ERR_JWKS_MULTIPLE_MATCHING_KEYS' {
    return 'ERR_JWKS_MULTIPLE_MATCHING_KEYS'
  }

  code = 'ERR_JWKS_MULTIPLE_MATCHING_KEYS'

  message = 'multiple matching keys found in the JSON Web Key Set'
}

/**
 * Timeout was reached when retrieving the JWKS response.
 *
 */
export class JWKSTimeout extends JOSEError {
  /** @ignore */
  static get code(): 'ERR_JWKS_TIMEOUT' {
    return 'ERR_JWKS_TIMEOUT'
  }

  code = 'ERR_JWKS_TIMEOUT'

  message = 'request timed out'
}

/**
 * An error subclass thrown when JWS signature verification fails.
 *
 */
export class JWSSignatureVerificationFailed extends JOSEError {
  /** @ignore */
  static get code(): 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' {
    return 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED'
  }

  code = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED'

  message = 'signature verification failed'
}
