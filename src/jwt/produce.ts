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
   * @param input "nbf" (Not Before) Claim value to set on the JWT Claims Set. 
   *   
   *   - If a `number` is passed as an argument, it's used as the `nbf` claim directly.
   *   
   *   - If a `Date` object is passed, the value is converted to unix timestamp and used as `nbf` claim.
   *   
   *   - If a `string` is passed it is resolved to a time span, and then added to the current unix timestamp.
   *   
   *   Format used for timespan should be a number followed by a unit, such as "5 minutes" or "1 day".
   * 
   *   Valid units are: "sec", "secs", "second", "seconds", "s", "minute", "minutes", "min", "mins", "m",
   *   "hour", "hours", "hr", "hrs", "h", "day", "days", "d", "week", "weeks", "w", "year", "years".
   *   
   *   If the string is suffixed with "ago" or "from now", or prefixed with a "-", the resulting number of seconds gets subtracted from the current unix timestamp.
   * 
   * @throws {TypeError} When input string is in bad format or numeric input is infinite.
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
   * Set the `exp` (Expiration Time) Claim.
   * 
   * @param input "exp" (Expiration Time) Claim value to set on the JWT Claims Set. 
   *   
   *   - If a `number` is passed as an argument, it's used as the `exp` claim directly.
   *   
   *   - If a `Date` object is passed, the value is converted to unix timestamp and used as `exp` claim.
   *   
   *   - If a `string` is passed it is resolved to a time span, and then added to the current unix timestamp.
   *   
   *   Format used for timespan should be a number followed by a unit, such as "5 minutes" or "1 day".
   * 
   *   Valid units are: "sec", "secs", "second", "seconds", "s", "minute", "minutes", "min", "mins", "m",
   *   "hour", "hours", "hr", "hrs", "h", "day", "days", "d", "week", "weeks", "w", "year", "years".
   *   
   *   If the string is suffixed with "ago" or "from now", or prefixed with a "-", the resulting number of seconds gets subtracted from the current unix timestamp.
   * 
   * @throws {TypeError} When input string is in bad format or numeric input is infinite.
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
   * @param input "iat" (Expiration Time) Claim value to set on the JWT Claims Set. 
   *   
   *   - If a `number` is passed as an argument, it's used as the `iat` claim directly.
   *   
   *   - If a `Date` object is passed, the value is converted to unix timestamp and used as `iat` claim.
   *   
   *   - If a `string` is passed it is resolved to a time span, and then added to the current unix timestamp.
   *   
   *   Format used for timespan should be a number followed by a unit, such as "5 minutes" or "1 day".
   * 
   *   Valid units are: "sec", "secs", "second", "seconds", "s", "minute", "minutes", "min", "mins", "m",
   *   "hour", "hours", "hr", "hrs", "h", "day", "days", "d", "week", "weeks", "w", "year", "years".
   *   
   *   If the string is suffixed with "ago" or "from now", or prefixed with a "-", the resulting number of seconds gets subtracted from the current unix timestamp.
   * 
   * @throws {TypeError} When input string is in bad format or numeric input is infinite.
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
