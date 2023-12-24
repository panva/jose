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
   * - If a `number` is passed as an argument it is used as the claim directly.
   * - If a `Date` instance is passed as an argument it is converted to unix timestamp and used as the
   *   claim.
   * - If a `string` is passed as an argument it is resolved to a time span, and then added to the
   *   current unix timestamp and used as the claim.
   *
   * Format used for time span should be a number followed by a unit, such as "5 minutes" or "1
   * day".
   *
   * Valid units are: "sec", "secs", "second", "seconds", "s", "minute", "minutes", "min", "mins",
   * "m", "hour", "hours", "hr", "hrs", "h", "day", "days", "d", "week", "weeks", "w", "year",
   * "years", "yr", "yrs", and "y".
   *
   * If the string is suffixed with "ago", or prefixed with a "-", the resulting time span gets
   * subtracted from the current unix timestamp. A "from now" suffix can also be used for
   * readability when adding to the current unix timestamp.
   *
   * @param input "nbf" (Not Before) Claim value to set on the JWT Claims Set.
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
   * - If a `number` is passed as an argument it is used as the claim directly.
   * - If a `Date` instance is passed as an argument it is converted to unix timestamp and used as the
   *   claim.
   * - If a `string` is passed as an argument it is resolved to a time span, and then added to the
   *   current unix timestamp and used as the claim.
   *
   * Format used for time span should be a number followed by a unit, such as "5 minutes" or "1
   * day".
   *
   * Valid units are: "sec", "secs", "second", "seconds", "s", "minute", "minutes", "min", "mins",
   * "m", "hour", "hours", "hr", "hrs", "h", "day", "days", "d", "week", "weeks", "w", "year",
   * "years", "yr", "yrs", and "y".
   *
   * If the string is suffixed with "ago", or prefixed with a "-", the resulting time span gets
   * subtracted from the current unix timestamp. A "from now" suffix can also be used for
   * readability when adding to the current unix timestamp.
   *
   * @param input "exp" (Expiration Time) Claim value to set on the JWT Claims Set.
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
   * - If no argument is used the current unix timestamp is used as the claim.
   * - If a `number` is passed as an argument it is used as the claim directly.
   * - If a `Date` instance is passed as an argument it is converted to unix timestamp and used as the
   *   claim.
   * - If a `string` is passed as an argument it is resolved to a time span, and then added to the
   *   current unix timestamp and used as the claim.
   *
   * Format used for time span should be a number followed by a unit, such as "5 minutes" or "1
   * day".
   *
   * Valid units are: "sec", "secs", "second", "seconds", "s", "minute", "minutes", "min", "mins",
   * "m", "hour", "hours", "hr", "hrs", "h", "day", "days", "d", "week", "weeks", "w", "year",
   * "years", "yr", "yrs", and "y".
   *
   * If the string is suffixed with "ago", or prefixed with a "-", the resulting time span gets
   * subtracted from the current unix timestamp. A "from now" suffix can also be used for
   * readability when adding to the current unix timestamp.
   *
   * @param input "iat" (Expiration Time) Claim value to set on the JWT Claims Set.
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
