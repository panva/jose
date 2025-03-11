/**
 * JSON Web Token (JWT) Signing (JWT is in JWS format)
 *
 * @module
 */

import { CompactSign } from '../jws/compact/sign.ts'
import { JWTInvalid } from '../util/errors.ts'
import type * as types from '../types.d.ts'
import { ProduceJWT } from './produce.ts'

/**
 * The SignJWT class is used to build and sign Compact JWS formatted JSON Web Tokens.
 *
 * This class is exported (as a named export) from the main `'jose'` module entry point as well as
 * from its subpath export `'jose/jwt/sign'`.
 *
 */
export class SignJWT implements types.ProduceJWT {
  #protectedHeader!: types.JWTHeaderParameters

  #jwt: ProduceJWT

  /**
   * {@link SignJWT} constructor
   *
   * @param payload The JWT Claims Set object. Defaults to an empty object.
   */
  constructor(payload: types.JWTPayload = {}) {
    this.#jwt = new ProduceJWT(payload)
  }

  setIssuer(issuer: string): this {
    this.#jwt.iss = issuer
    return this
  }

  setSubject(subject: string): this {
    this.#jwt.sub = subject
    return this
  }

  setAudience(audience: string | string[]): this {
    this.#jwt.aud = audience
    return this
  }

  setJti(jwtId: string): this {
    this.#jwt.jti = jwtId
    return this
  }

  setNotBefore(input: number | string | Date): this {
    this.#jwt.nbf = input
    return this
  }

  setExpirationTime(input: number | string | Date): this {
    this.#jwt.exp = input
    return this
  }

  setIssuedAt(input?: number | string | Date): this {
    this.#jwt.iat = input
    return this
  }

  /**
   * Sets the JWS Protected Header on the SignJWT object.
   *
   * @param protectedHeader JWS Protected Header. Must contain an "alg" (JWS Algorithm) property.
   */
  setProtectedHeader(protectedHeader: types.JWTHeaderParameters): this {
    this.#protectedHeader = protectedHeader
    return this
  }

  /**
   * Signs and returns the JWT.
   *
   * @param key Private Key or Secret to sign the JWT with. See
   *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
   * @param options JWT Sign options.
   */
  async sign(
    key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array,
    options?: types.SignOptions,
  ): Promise<string> {
    const sig = new CompactSign(this.#jwt.data())
    sig.setProtectedHeader(this.#protectedHeader)
    if (
      Array.isArray(this.#protectedHeader?.crit) &&
      this.#protectedHeader.crit.includes('b64') &&
      // @ts-expect-error
      this.#protectedHeader.b64 === false
    ) {
      throw new JWTInvalid('JWTs MUST NOT use unencoded payload')
    }
    return sig.sign(key, options)
  }
}
