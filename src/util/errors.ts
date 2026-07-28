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
 * Every stable error code used by this module. {@link AnyJOSEError} pairs each subclass with the one
 * it is thrown with, making that union a discriminated one.
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
 * The shape shared by the two errors thrown during JWT Claims Set validation.
 *
 * > [!NOTE]\
 * > {@link JWTExpired} does not extend {@link JWTClaimValidationFailed}, so `instanceof
 * > JWTClaimValidationFailed` is `false` for an expired JWT. Use {@link JWTClaimValidationError} or
 * > the {@link JOSEError.code code} discriminant to handle both.
 */
export interface JWTClaimValidationFailure {
  /** The Claim for which the validation failed. */
  claim: string

  /** Reason code for the validation failure. */
  reason: JWTClaimValidationReason

  /** The parsed JWT Claims Set (aka payload). */
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
 * A generic Error that all other JOSE specific Error subclasses extend.
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
   * A unique error code for the particular error subclass.
   *
   * @ignore
   */
  static code: JOSEErrorCode | (string & {}) = 'ERR_JOSE_GENERIC'

  /**
   * A unique error code for {@link JOSEError}. Each subclass sets its own; see {@link AnyJOSEError}
   * to switch over them as a discriminated union.
   */
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
 * An error subclass thrown when a JWT Claim Set member validation fails.
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

  /** The {@link JWTClaimValidationFailure} carried by every instance of this error. */
  declare cause: JWTClaimValidationFailure

  /** The Claim for which the validation failed. */
  claim: string

  /** Reason code for the validation failure. */
  reason: JWTClaimValidationReason

  /**
   * The parsed JWT Claims Set (aka payload). Other JWT claims may or may not have been verified at
   * this point. The JSON Web Signature (JWS) or a JSON Web Encryption (JWE) structures' integrity
   * has however been verified. Claims Set verification happens after the JWS Signature or JWE
   * Decryption processes.
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
 * An error subclass thrown when a JWT is expired.
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

  /** The {@link JWTClaimValidationFailure} carried by every instance of this error. */
  declare cause: JWTClaimValidationFailure

  /** The Claim for which the validation failed. */
  claim: string

  /** Reason code for the validation failure. */
  reason: JWTClaimValidationReason

  /**
   * The parsed JWT Claims Set (aka payload). Other JWT claims may or may not have been verified at
   * this point. The JSON Web Signature (JWS) or a JSON Web Encryption (JWE) structures' integrity
   * has however been verified. Claims Set verification happens after the JWS Signature or JWE
   * Decryption processes.
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
 * An error subclass thrown when a JOSE Algorithm is not allowed per developer preference.
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
 * An error subclass thrown when a particular feature or algorithm is not supported by this
 * implementation or JOSE in general.
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
 * An error subclass thrown when a JWE ciphertext decryption fails.
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
 * An error subclass thrown when a JWE is invalid.
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
 * An error subclass thrown when a JWS is invalid.
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
 * An error subclass thrown when a JWT is invalid.
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
 * An error subclass thrown when a JWK is invalid.
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
 * An error subclass thrown when a JWKS is invalid.
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
 * An error subclass thrown when no keys match from a JWKS.
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
 * An error subclass thrown when multiple keys match from a JWKS.
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
   * Iterates the public keys that matched the JWS JOSE Header, so that verification can be
   * attempted with each in turn. See the {@link jwks/remote.createRemoteJWKSet createRemoteJWKSet}
   * and {@link jwks/local.createLocalJWKSet createLocalJWKSet} examples.
   *
   * Instances thrown by this module always iterate the matched keys. An instance constructed by
   * other code iterates nothing.
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
 * Timeout was reached when retrieving the JWKS response.
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
 * An error subclass thrown when JWS signature verification fails.
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
 * Union of the errors thrown during JWT Claims Set validation.
 *
 * {@link JWTExpired} does not extend {@link JWTClaimValidationFailed}, so a single `instanceof` check
 * cannot cover both. Use this type — together with the {@link JOSEError.code code} discriminant —
 * when handling either.
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
 * Union of every {@link JOSEError} subclass this module throws, each paired with the single
 * {@link JOSEErrorCode} it is thrown with. That pairing lives here rather than on the classes, so
 * that `code` stays assignable, writable, and overridable on them exactly as before, while a value
 * of this type can still be switched over as a discriminated union.
 *
 * > [!NOTE]\
 * > The base {@link JOSEError} is deliberately not a member — its `code` spans every value, which
 * > would defeat the discriminant. A small number of JSON Web Key Set HTTP failures are thrown as the
 * > base class itself, so `instanceof JOSEError` remains the catch-all; this union is for handling a
 * > value already known to be one of the specific errors.
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
