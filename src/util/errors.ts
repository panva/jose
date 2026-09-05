/**
 * JOSE module errors and error codes
 *
 * These are exported (as the `errors` namespace) from the main `'jose'` module entry point as well
 * as from the subpath export `'jose/errors'`.
 *
 * @module
 */

import type * as types from '../types.d.ts'

/**
 * Stable error codes used by this module.
 *
 * {@link AnyJOSEError} pairs each subclass with its error code to form a discriminated union.
 *
 * @example
 *
 * ```ts
 * function handle(err: jose.errors.AnyJOSEError) {
 *   switch (err.code) {
 *     case 'ERR_JWT_EXPIRED':
 *       console.log(err.payload) // narrowed to JWTExpired
 *       break
 *     case 'ERR_JWKS_MULTIPLE_MATCHING_KEYS':
 *       break
 *   }
 * }
 * ```
 */
export type JOSEErrorCode =
  | 'ERR_JOSE_ALG_NOT_ALLOWED'
  | 'ERR_JOSE_GENERIC'
  | 'ERR_JOSE_NOT_SUPPORTED'
  | 'ERR_JWE_DECRYPTION_FAILED'
  | 'ERR_JWE_INVALID'
  | 'ERR_JWK_INVALID'
  | 'ERR_JWKS_INVALID'
  | 'ERR_JWKS_MULTIPLE_MATCHING_KEYS'
  | 'ERR_JWKS_NO_MATCHING_KEY'
  | 'ERR_JWKS_TIMEOUT'
  | 'ERR_JWS_INVALID'
  | 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED'
  | 'ERR_JWT_CLAIM_VALIDATION_FAILED'
  | 'ERR_JWT_EXPIRED'
  | 'ERR_JWT_INVALID'

/**
 * Shared details of JWT claim or header validation failures.
 *
 * {@link JWTExpired} does not extend {@link JWTClaimValidationFailed}. Use
 * {@link JWTClaimValidationError} or the {@link JOSEError.code code} discriminant to handle both.
 */
export interface JWTClaimValidationFailure {
  /** Claim or header that failed validation. */
  claim: string

  /** Reason code for the validation failure. */
  reason: JWTClaimValidationReason

  /** The parsed JWT Claims Set; validation of other claims may be incomplete. */
  payload: types.JWTPayload
}

/**
 * Reason codes produced by JWT Claims Set validation.
 *
 * @ignore
 */
export type JWTClaimValidationReason =
  'check_failed' | 'invalid' | 'mismatch' | 'missing' | 'unspecified' | (string & {})

/**
 * Base class for JOSE errors.
 *
 * @example
 *
 * Checking thrown error is a JOSE one
 *
 * ```js
 * if (err instanceof jose.errors.JOSEError) {
 *   // ...
 * }
 * ```
 */
export class JOSEError extends Error {
  /**
   * Stable code identifying the error class.
   *
   * @ignore
   */
  static code: JOSEErrorCode | (string & {}) = 'ERR_JOSE_GENERIC'

  /** Stable code identifying the error class. Use {@link AnyJOSEError} to narrow subclasses by code. */
  code: JOSEErrorCode | (string & {}) = 'ERR_JOSE_GENERIC'

  /** @ignore */
  constructor(message?: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = this.constructor.name
    // V8-only, absent in JavaScriptCore and SpiderMonkey
    ;(
      Error as { captureStackTrace?: (target: object, constructor?: Function) => void }
    ).captureStackTrace?.(this, this.constructor)
  }
}

/**
 * Thrown when JWT claim or header validation fails. Expiration is reported separately as
 * {@link JWTExpired}.
 *
 * @example
 *
 * Checking thrown error is this one using a stable error code
 *
 * ```js
 * if (err.code === 'ERR_JWT_CLAIM_VALIDATION_FAILED') {
 *   // ...
 * }
 * ```
 *
 * @example
 *
 * Checking thrown error is this one using `instanceof`
 *
 * ```js
 * if (err instanceof jose.errors.JWTClaimValidationFailed) {
 *   // ...
 * }
 * ```
 */
export class JWTClaimValidationFailed extends JOSEError implements JWTClaimValidationFailure {
  /** @ignore */
  static override code: JOSEErrorCode | (string & {}) = 'ERR_JWT_CLAIM_VALIDATION_FAILED'

  /** A unique error code for {@link JWTClaimValidationFailed}. */
  override code: JOSEErrorCode | (string & {}) = 'ERR_JWT_CLAIM_VALIDATION_FAILED'

  /** The {@link JWTClaimValidationFailure} details carried by this error. */
  declare cause: JWTClaimValidationFailure

  /** Claim or header that failed validation. */
  claim: string

  /** Reason code for the validation failure. */
  reason: JWTClaimValidationReason

  /**
   * The parsed JWT Claims Set; validation of other claims may be incomplete. With
   * {@link jwt/verify.jwtVerify jwtVerify} and {@link jwt/decrypt.jwtDecrypt jwtDecrypt}, token
   * authentication precedes claim validation. {@link jwt/unsecured.UnsecuredJWT.decode} does not
   * authenticate tokens.
   */
  payload: types.JWTPayload

  /** @ignore */
  constructor(
    message: string,
    payload: types.JWTPayload,
    claim = 'unspecified',
    reason: JWTClaimValidationReason = 'unspecified',
  ) {
    super(message, { cause: { claim, reason, payload } })
    this.claim = claim
    this.reason = reason
    this.payload = payload
  }
}

/**
 * Thrown when a JWT has expired or exceeds the configured maximum token age.
 *
 * @example
 *
 * Checking thrown error is this one using a stable error code
 *
 * ```js
 * if (err.code === 'ERR_JWT_EXPIRED') {
 *   // ...
 * }
 * ```
 *
 * @example
 *
 * Checking thrown error is this one using `instanceof`
 *
 * ```js
 * if (err instanceof jose.errors.JWTExpired) {
 *   // ...
 * }
 * ```
 */
export class JWTExpired extends JOSEError implements JWTClaimValidationFailure {
  /** @ignore */
  static override code: JOSEErrorCode | (string & {}) = 'ERR_JWT_EXPIRED'

  /** A unique error code for {@link JWTExpired}. */
  override code: JOSEErrorCode | (string & {}) = 'ERR_JWT_EXPIRED'

  /** The {@link JWTClaimValidationFailure} details carried by this error. */
  declare cause: JWTClaimValidationFailure

  /** Claim or header that failed validation. */
  claim: string

  /** Reason code for the validation failure. */
  reason: JWTClaimValidationReason

  /**
   * The parsed JWT Claims Set; validation of other claims may be incomplete. With
   * {@link jwt/verify.jwtVerify jwtVerify} and {@link jwt/decrypt.jwtDecrypt jwtDecrypt}, token
   * authentication precedes claim validation. {@link jwt/unsecured.UnsecuredJWT.decode} does not
   * authenticate tokens.
   */
  payload: types.JWTPayload

  /** @ignore */
  constructor(
    message: string,
    payload: types.JWTPayload,
    claim = 'unspecified',
    reason: JWTClaimValidationReason = 'unspecified',
  ) {
    super(message, { cause: { claim, reason, payload } })
    this.claim = claim
    this.reason = reason
    this.payload = payload
  }
}

/**
 * Thrown when an algorithm is disallowed by configuration.
 *
 * @example
 *
 * Checking thrown error is this one using a stable error code
 *
 * ```js
 * if (err.code === 'ERR_JOSE_ALG_NOT_ALLOWED') {
 *   // ...
 * }
 * ```
 *
 * @example
 *
 * Checking thrown error is this one using `instanceof`
 *
 * ```js
 * if (err instanceof jose.errors.JOSEAlgNotAllowed) {
 *   // ...
 * }
 * ```
 */
export class JOSEAlgNotAllowed extends JOSEError {
  /** @ignore */
  static override code: JOSEErrorCode | (string & {}) = 'ERR_JOSE_ALG_NOT_ALLOWED'

  /** A unique error code for {@link JOSEAlgNotAllowed}. */
  override code: JOSEErrorCode | (string & {}) = 'ERR_JOSE_ALG_NOT_ALLOWED'
}

/**
 * Thrown when a feature or algorithm is unsupported.
 *
 * @example
 *
 * Checking thrown error is this one using a stable error code
 *
 * ```js
 * if (err.code === 'ERR_JOSE_NOT_SUPPORTED') {
 *   // ...
 * }
 * ```
 *
 * @example
 *
 * Checking thrown error is this one using `instanceof`
 *
 * ```js
 * if (err instanceof jose.errors.JOSENotSupported) {
 *   // ...
 * }
 * ```
 */
export class JOSENotSupported extends JOSEError {
  /** @ignore */
  static override code: JOSEErrorCode | (string & {}) = 'ERR_JOSE_NOT_SUPPORTED'

  /** A unique error code for {@link JOSENotSupported}. */
  override code: JOSEErrorCode | (string & {}) = 'ERR_JOSE_NOT_SUPPORTED'
}

/**
 * Thrown when JWE ciphertext decryption or authentication fails.
 *
 * @example
 *
 * Checking thrown error is this one using a stable error code
 *
 * ```js
 * if (err.code === 'ERR_JWE_DECRYPTION_FAILED') {
 *   // ...
 * }
 * ```
 *
 * @example
 *
 * Checking thrown error is this one using `instanceof`
 *
 * ```js
 * if (err instanceof jose.errors.JWEDecryptionFailed) {
 *   // ...
 * }
 * ```
 */
export class JWEDecryptionFailed extends JOSEError {
  /** @ignore */
  static override code: JOSEErrorCode | (string & {}) = 'ERR_JWE_DECRYPTION_FAILED'

  /** A unique error code for {@link JWEDecryptionFailed}. */
  override code: JOSEErrorCode | (string & {}) = 'ERR_JWE_DECRYPTION_FAILED'

  /** @ignore */
  constructor(message = 'decryption operation failed', options?: { cause?: unknown }) {
    super(message, options)
  }
}

/**
 * Thrown when a JWE is invalid.
 *
 * @example
 *
 * Checking thrown error is this one using a stable error code
 *
 * ```js
 * if (err.code === 'ERR_JWE_INVALID') {
 *   // ...
 * }
 * ```
 *
 * @example
 *
 * Checking thrown error is this one using `instanceof`
 *
 * ```js
 * if (err instanceof jose.errors.JWEInvalid) {
 *   // ...
 * }
 * ```
 */
export class JWEInvalid extends JOSEError {
  /** @ignore */
  static override code: JOSEErrorCode | (string & {}) = 'ERR_JWE_INVALID'

  /** A unique error code for {@link JWEInvalid}. */
  override code: JOSEErrorCode | (string & {}) = 'ERR_JWE_INVALID'
}

/**
 * Thrown when a JWS is invalid.
 *
 * @example
 *
 * Checking thrown error is this one using a stable error code
 *
 * ```js
 * if (err.code === 'ERR_JWS_INVALID') {
 *   // ...
 * }
 * ```
 *
 * @example
 *
 * Checking thrown error is this one using `instanceof`
 *
 * ```js
 * if (err instanceof jose.errors.JWSInvalid) {
 *   // ...
 * }
 * ```
 */
export class JWSInvalid extends JOSEError {
  /** @ignore */
  static override code: JOSEErrorCode | (string & {}) = 'ERR_JWS_INVALID'

  /** A unique error code for {@link JWSInvalid}. */
  override code: JOSEErrorCode | (string & {}) = 'ERR_JWS_INVALID'
}

/**
 * Thrown when a JWT is invalid.
 *
 * @example
 *
 * Checking thrown error is this one using a stable error code
 *
 * ```js
 * if (err.code === 'ERR_JWT_INVALID') {
 *   // ...
 * }
 * ```
 *
 * @example
 *
 * Checking thrown error is this one using `instanceof`
 *
 * ```js
 * if (err instanceof jose.errors.JWTInvalid) {
 *   // ...
 * }
 * ```
 */
export class JWTInvalid extends JOSEError {
  /** @ignore */
  static override code: JOSEErrorCode | (string & {}) = 'ERR_JWT_INVALID'

  /** A unique error code for {@link JWTInvalid}. */
  override code: JOSEErrorCode | (string & {}) = 'ERR_JWT_INVALID'
}

/**
 * Thrown when a JWK is invalid.
 *
 * @example
 *
 * Checking thrown error is this one using a stable error code
 *
 * ```js
 * if (err.code === 'ERR_JWK_INVALID') {
 *   // ...
 * }
 * ```
 *
 * @example
 *
 * Checking thrown error is this one using `instanceof`
 *
 * ```js
 * if (err instanceof jose.errors.JWKInvalid) {
 *   // ...
 * }
 * ```
 */
export class JWKInvalid extends JOSEError {
  /** @ignore */
  static override code: JOSEErrorCode | (string & {}) = 'ERR_JWK_INVALID'

  /** A unique error code for {@link JWKInvalid}. */
  override code: JOSEErrorCode | (string & {}) = 'ERR_JWK_INVALID'
}

/**
 * Thrown when a JWKS is invalid.
 *
 * @example
 *
 * Checking thrown error is this one using a stable error code
 *
 * ```js
 * if (err.code === 'ERR_JWKS_INVALID') {
 *   // ...
 * }
 * ```
 *
 * @example
 *
 * Checking thrown error is this one using `instanceof`
 *
 * ```js
 * if (err instanceof jose.errors.JWKSInvalid) {
 *   // ...
 * }
 * ```
 */
export class JWKSInvalid extends JOSEError {
  /** @ignore */
  static override code: JOSEErrorCode | (string & {}) = 'ERR_JWKS_INVALID'

  /** A unique error code for {@link JWKSInvalid}. */
  override code: JOSEErrorCode | (string & {}) = 'ERR_JWKS_INVALID'
}

/**
 * Thrown when no keys match in a JWKS.
 *
 * @example
 *
 * Checking thrown error is this one using a stable error code
 *
 * ```js
 * if (err.code === 'ERR_JWKS_NO_MATCHING_KEY') {
 *   // ...
 * }
 * ```
 *
 * @example
 *
 * Checking thrown error is this one using `instanceof`
 *
 * ```js
 * if (err instanceof jose.errors.JWKSNoMatchingKey) {
 *   // ...
 * }
 * ```
 */
export class JWKSNoMatchingKey extends JOSEError {
  /** @ignore */
  static override code: JOSEErrorCode | (string & {}) = 'ERR_JWKS_NO_MATCHING_KEY'

  /** A unique error code for {@link JWKSNoMatchingKey}. */
  override code: JOSEErrorCode | (string & {}) = 'ERR_JWKS_NO_MATCHING_KEY'

  /** @ignore */
  constructor(
    message = 'no applicable key found in the JSON Web Key Set',
    options?: { cause?: unknown },
  ) {
    super(message, options)
  }
}

/**
 * Thrown when multiple keys match in a JWKS.
 *
 * @example
 *
 * Checking thrown error is this one using a stable error code
 *
 * ```js
 * if (err.code === 'ERR_JWKS_MULTIPLE_MATCHING_KEYS') {
 *   // ...
 * }
 * ```
 *
 * @example
 *
 * Checking thrown error is this one using `instanceof`
 *
 * ```js
 * if (err instanceof jose.errors.JWKSMultipleMatchingKeys) {
 *   // ...
 * }
 * ```
 */
export class JWKSMultipleMatchingKeys extends JOSEError {
  /**
   * Yields public keys matching the JWS Header so verification can be attempted with each. See the
   * {@link jwks/remote.createRemoteJWKSet createRemoteJWKSet} and
   * {@link jwks/local.createLocalJWKSet createLocalJWKSet} examples. Empty on manually constructed
   * errors.
   */
  [Symbol.asyncIterator]: () => AsyncIterableIterator<types.CryptoKey> = async function* () {}

  /** @ignore */
  static override code: JOSEErrorCode | (string & {}) = 'ERR_JWKS_MULTIPLE_MATCHING_KEYS'

  /** A unique error code for {@link JWKSMultipleMatchingKeys}. */
  override code: JOSEErrorCode | (string & {}) = 'ERR_JWKS_MULTIPLE_MATCHING_KEYS'

  /** @ignore */
  constructor(
    message = 'multiple matching keys found in the JSON Web Key Set',
    options?: { cause?: unknown },
  ) {
    super(message, options)
  }
}

/**
 * Thrown when fetching a remote JWKS times out.
 *
 * @example
 *
 * Checking thrown error is this one using a stable error code
 *
 * ```js
 * if (err.code === 'ERR_JWKS_TIMEOUT') {
 *   // ...
 * }
 * ```
 *
 * @example
 *
 * Checking thrown error is this one using `instanceof`
 *
 * ```js
 * if (err instanceof jose.errors.JWKSTimeout) {
 *   // ...
 * }
 * ```
 */
export class JWKSTimeout extends JOSEError {
  /** @ignore */
  static override code: JOSEErrorCode | (string & {}) = 'ERR_JWKS_TIMEOUT'

  /** A unique error code for {@link JWKSTimeout}. */
  override code: JOSEErrorCode | (string & {}) = 'ERR_JWKS_TIMEOUT'

  /** @ignore */
  constructor(message = 'request timed out', options?: { cause?: unknown }) {
    super(message, options)
  }
}

/**
 * Thrown when JWS signature verification fails.
 *
 * @example
 *
 * Checking thrown error is this one using a stable error code
 *
 * ```js
 * if (err.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
 *   // ...
 * }
 * ```
 *
 * @example
 *
 * Checking thrown error is this one using `instanceof`
 *
 * ```js
 * if (err instanceof jose.errors.JWSSignatureVerificationFailed) {
 *   // ...
 * }
 * ```
 */
export class JWSSignatureVerificationFailed extends JOSEError {
  /** @ignore */
  static override code: JOSEErrorCode | (string & {}) = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED'

  /** A unique error code for {@link JWSSignatureVerificationFailed}. */
  override code: JOSEErrorCode | (string & {}) = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED'

  /** @ignore */
  constructor(message = 'signature verification failed', options?: { cause?: unknown }) {
    super(message, options)
  }
}

/**
 * Errors thrown during JWT Claims Set validation.
 *
 * {@link JWTExpired} does not extend {@link JWTClaimValidationFailed}, so a single `instanceof` check
 * cannot cover both. Use this type together with the {@link JOSEError.code code} discriminant when
 * handling either.
 *
 * @example
 *
 * ```ts
 * function isClaimValidationError(err: unknown): err is jose.errors.JWTClaimValidationError {
 *   return (
 *     err instanceof jose.errors.JWTClaimValidationFailed ||
 *     err instanceof jose.errors.JWTExpired
 *   )
 * }
 * ```
 */
export type JWTClaimValidationError = JWTClaimValidationFailed | JWTExpired

/**
 * Discriminated union of specific {@link JOSEError} subclasses, narrowed by `code`. Excludes base
 * {@link JOSEError} instances; use `instanceof JOSEError` to catch all module errors.
 *
 * Each subclass is paired with its {@link JOSEErrorCode}. That pairing lives here rather than on the
 * classes, so `code` stays assignable, writable, and overridable while values of this type can be
 * narrowed by their error code.
 *
 * Some JWKS HTTP failures use the base {@link JOSEError} class. This union is for values already
 * known to be one of the specific subclasses.
 */
export type AnyJOSEError =
  | (JOSEAlgNotAllowed & { code: 'ERR_JOSE_ALG_NOT_ALLOWED' })
  | (JOSENotSupported & { code: 'ERR_JOSE_NOT_SUPPORTED' })
  | (JWEDecryptionFailed & { code: 'ERR_JWE_DECRYPTION_FAILED' })
  | (JWEInvalid & { code: 'ERR_JWE_INVALID' })
  | (JWKInvalid & { code: 'ERR_JWK_INVALID' })
  | (JWKSInvalid & { code: 'ERR_JWKS_INVALID' })
  | (JWKSMultipleMatchingKeys & { code: 'ERR_JWKS_MULTIPLE_MATCHING_KEYS' })
  | (JWKSNoMatchingKey & { code: 'ERR_JWKS_NO_MATCHING_KEY' })
  | (JWKSTimeout & { code: 'ERR_JWKS_TIMEOUT' })
  | (JWSInvalid & { code: 'ERR_JWS_INVALID' })
  | (JWSSignatureVerificationFailed & { code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' })
  | (JWTClaimValidationFailed & { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED' })
  | (JWTExpired & { code: 'ERR_JWT_EXPIRED' })
  | (JWTInvalid & { code: 'ERR_JWT_INVALID' })
