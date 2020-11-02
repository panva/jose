import type { JWTPayload } from '../types.d'
import epoch from './epoch.js'
import isObject from './is_object.js'
import secs from './secs.js'

/**
 * Generic class for JWT producing.
 */
export default class ProduceJWT {
  protected _payload!: JWTPayload

  /**
   * @param payload The JWT Claims Set object.
   */
  constructor(payload: JWTPayload) {
    if (!isObject(payload)) {
      throw new TypeError('JWT Claims Set MUST be an object')
    }
    this._payload = payload
  }

  /**
   * Set "iss" (Issuer) Claim.
   *
   * @param issuer "Issuer" Claim value to set on the JWT Claims Set.
   */
  setIssuer(issuer: string) {
    this._payload = { ...this._payload, iss: issuer }
    return this
  }

  /**
   * Set "sub" (Subject) Claim.
   *
   * @param subject "sub" (Subject) Claim value to set on the JWT Claims Set.
   */
  setSubject(subject: string) {
    this._payload = { ...this._payload, sub: subject }
    return this
  }

  /**
   * Set "aud" (Audience) Claim.
   *
   * @param audience "aud" (Audience) Claim value to set on the JWT Claims Set.
   */
  setAudience(audience: string | string[]) {
    this._payload = { ...this._payload, aud: audience }
    return this
  }

  /**
   * Set "jti" (JWT ID) Claim.
   *
   * @param jwtId "jti" (JWT ID) Claim value to set on the JWT Claims Set.
   */
  setJti(jwtId: string) {
    this._payload = { ...this._payload, jti: jwtId }
    return this
  }

  /**
   * Set "nbf" (Not Before) Claim.
   *
   * @param input "nbf" (Not Before) Claim value to set on the JWT Claims Set.
   * When number is passed that is used as a value, when string is passed
   * it is resolved to a time span and added to the current timestamp.
   */
  setNotBefore(input: number | string) {
    if (typeof input === 'number') {
      this._payload = { ...this._payload, nbf: input }
    } else {
      this._payload = { ...this._payload, nbf: epoch(new Date()) + secs(input) }
    }
    return this
  }

  /**
   * Set "exp" (Expiration Time) Claim.
   *
   * @param input "exp" (Expiration Time) Claim value to set on the JWT Claims Set.
   * When number is passed that is used as a value, when string is passed
   * it is resolved to a time span and added to the current timestamp.
   */
  setExpirationTime(input: number | string) {
    if (typeof input === 'number') {
      this._payload = { ...this._payload, exp: input }
    } else {
      this._payload = { ...this._payload, exp: epoch(new Date()) + secs(input) }
    }
    return this
  }

  /**
   * Set "iat" (Issued At) Claim.
   *
   * @param input "iat" (Issued At) Claim value to set on the JWT Claims Set.
   * Default is current timestamp.
   */
  setIssuedAt(input?: number) {
    if (typeof input === 'undefined') {
      this._payload = { ...this._payload, iat: epoch(new Date()) }
    } else {
      this._payload = { ...this._payload, iat: input }
    }
    return this
  }
}
