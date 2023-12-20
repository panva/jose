import type { JWTPayload } from '../types.d'
import epoch from '../lib/epoch.js'
import isObject from '../lib/is_object.js'
import secs from '../lib/secs.js'

function validateInput(label: string, input: number) {
  if (!Number.isFinite(input)) {
    throw new TypeError(`Invalid ${label} input`)
  }

  return input
}

/** Generic class for JWT producing. */
export class ProduceJWT {
  protected _payload!: JWTPayload

  /** @param payload The JWT Claims Set object. Defaults to an empty object. */
  constructor(payload: JWTPayload = {}) {
    if (!isObject(payload)) {
      throw new TypeError('JWT Claims Set MUST be an object')
    }
    this._payload = payload
  }

  /**
   * Set the "iss" (Issuer) Claim.
   *
   * @param issuer "Issuer" Claim value to set on the JWT Claims Set.
   */
  setIssuer(issuer: string) {
    this._payload = { ...this._payload, iss: issuer }
    return this
  }

  /**
   * Set the "sub" (Subject) Claim.
   *
   * @param subject "sub" (Subject) Claim value to set on the JWT Claims Set.
   */
  setSubject(subject: string) {
    this._payload = { ...this._payload, sub: subject }
    return this
  }

  /**
   * Set the "aud" (Audience) Claim.
   *
   * @param audience "aud" (Audience) Claim value to set on the JWT Claims Set.
   */
  setAudience(audience: string | string[]) {
    this._payload = { ...this._payload, aud: audience }
    return this
  }

  /**
   * Set the "jti" (JWT ID) Claim.
   *
   * @param jwtId "jti" (JWT ID) Claim value to set on the JWT Claims Set.
   */
  setJti(jwtId: string) {
    this._payload = { ...this._payload, jti: jwtId }
    return this
  }

  /**
   * Set the "nbf" (Not Before) Claim.
   *
   * @param input "nbf" (Not Before) Claim value to set on the JWT Claims Set. When number is passed
   *   that is used as a value, when string is passed it is resolved to a time span and added to the
   *   current timestamp.
   */
  setNotBefore(input: number | string | Date) {
    if (typeof input === 'number') {
      this._payload = { ...this._payload, nbf: validateInput('setNotBefore', input) }
    } else if (input instanceof Date) {
      this._payload = { ...this._payload, nbf: validateInput('setNotBefore', epoch(input)) }
    } else {
      this._payload = { ...this._payload, nbf: epoch(new Date()) + secs(input) }
    }
    return this
  }

  /**
   * Set the "exp" (Expiration Time) Claim.
   *
   * @param input "exp" (Expiration Time) Claim value to set on the JWT Claims Set. When number is
   *   passed that is used as a value, when string is passed it is resolved to a time span and added
   *   to the current timestamp.
   */
  setExpirationTime(input: number | string | Date) {
    if (typeof input === 'number') {
      this._payload = { ...this._payload, exp: validateInput('setExpirationTime', input) }
    } else if (input instanceof Date) {
      this._payload = { ...this._payload, exp: validateInput('setExpirationTime', epoch(input)) }
    } else {
      this._payload = { ...this._payload, exp: epoch(new Date()) + secs(input) }
    }
    return this
  }

  /**
   * Set the "iat" (Issued At) Claim.
   *
   * @param input "iat" (Issued At) Claim value to set on the JWT Claims Set. Default is current
   *   timestamp.
   */
  setIssuedAt(input?: number | string | Date) {
    if (typeof input === 'undefined') {
      this._payload = { ...this._payload, iat: epoch(new Date()) }
    } else if (input instanceof Date) {
      this._payload = { ...this._payload, iat: validateInput('setIssuedAt', epoch(input)) }
    } else if (typeof input === 'string') {
      this._payload = {
        ...this._payload,
        iat: validateInput('setIssuedAt', epoch(new Date()) + secs(input)),
      }
    } else {
      this._payload = { ...this._payload, iat: validateInput('setIssuedAt', input) }
    }
    return this
  }
}
