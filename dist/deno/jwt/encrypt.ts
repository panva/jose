/**
 * JSON Web Token (JWT) Encryption (JWT is in JWE format)
 *
 * @module
 */

import type * as types from '../types.d.ts'
import { CompactEncrypt } from '../jwe/compact/encrypt.ts'
import { JWTClaimsBuilder } from '../lib/jwt_claims_set.ts'

/**
 * The EncryptJWT class is used to build and encrypt Compact JWE formatted JSON Web Tokens.
 *
 * This class is exported (as a named export) from the main `'jose'` module entry point as well as
 * from its subpath export `'jose/jwt/encrypt'`.
 *
 */
export class EncryptJWT implements types.ProduceJWT {
  #cek!: Uint8Array

  #iv!: Uint8Array

  #keyManagementParameters!: types.JWEKeyManagementHeaderParameters

  #protectedHeader!: types.CompactJWEHeaderParameters

  #replicateIssuerAsHeader!: boolean

  #replicateSubjectAsHeader!: boolean

  #replicateAudienceAsHeader!: boolean

  #jwt: JWTClaimsBuilder

  /**
   * {@link EncryptJWT} constructor
   *
   * @param payload The JWT Claims Set object. Defaults to an empty object.
   */
  constructor(payload: types.JWTPayload = {}) {
    this.#jwt = new JWTClaimsBuilder(payload)
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
   * Sets the JWE Protected Header on the EncryptJWT object.
   *
   * @param protectedHeader JWE Protected Header. Must contain an "alg" (JWE Algorithm) and "enc"
   *   (JWE Encryption Algorithm) properties.
   */
  setProtectedHeader(protectedHeader: types.CompactJWEHeaderParameters): this {
    if (this.#protectedHeader) {
      throw new TypeError('setProtectedHeader can only be called once')
    }
    this.#protectedHeader = protectedHeader
    return this
  }

  /**
   * Sets the JWE Key Management parameters to be used when encrypting. Use of this is method is
   * really only needed for ECDH based algorithms when utilizing the "apu" (Agreement PartyUInfo) or
   * "apv" (Agreement PartyVInfo) parameters. Other parameters will always be randomly generated
   * when needed and missing.
   *
   * @param parameters JWE Key Management parameters.
   */
  setKeyManagementParameters(parameters: types.JWEKeyManagementHeaderParameters): this {
    if (this.#keyManagementParameters) {
      throw new TypeError('setKeyManagementParameters can only be called once')
    }
    this.#keyManagementParameters = parameters
    return this
  }

  /**
   * Sets a content encryption key to use, by default a random suitable one is generated for the JWE
   * enc" (Encryption Algorithm) Header Parameter.
   *
   * @deprecated You should not use this method. It is only really intended for test and vector
   *   validation purposes.
   *
   * @param cek JWE Content Encryption Key.
   */
  setContentEncryptionKey(cek: Uint8Array): this {
    if (this.#cek) {
      throw new TypeError('setContentEncryptionKey can only be called once')
    }
    this.#cek = cek
    return this
  }

  /**
   * Sets the JWE Initialization Vector to use for content encryption, by default a random suitable
   * one is generated for the JWE enc" (Encryption Algorithm) Header Parameter.
   *
   * @deprecated You should not use this method. It is only really intended for test and vector
   *   validation purposes.
   *
   * @param iv JWE Initialization Vector.
   */
  setInitializationVector(iv: Uint8Array): this {
    if (this.#iv) {
      throw new TypeError('setInitializationVector can only be called once')
    }
    this.#iv = iv
    return this
  }

  /**
   * Replicates the "iss" (Issuer) Claim as a JWE Protected Header Parameter.
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-5.3 RFC7519#section-5.3}
   */
  replicateIssuerAsHeader(): this {
    this.#replicateIssuerAsHeader = true
    return this
  }

  /**
   * Replicates the "sub" (Subject) Claim as a JWE Protected Header Parameter.
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-5.3 RFC7519#section-5.3}
   */
  replicateSubjectAsHeader(): this {
    this.#replicateSubjectAsHeader = true
    return this
  }

  /**
   * Replicates the "aud" (Audience) Claim as a JWE Protected Header Parameter.
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-5.3 RFC7519#section-5.3}
   */
  replicateAudienceAsHeader(): this {
    this.#replicateAudienceAsHeader = true
    return this
  }

  /**
   * Encrypts and returns the JWT.
   *
   * @param key Public Key or Secret to encrypt the JWT with. See
   *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
   * @param options JWE Encryption options.
   */
  async encrypt(
    key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array,
    options?: types.EncryptOptions,
  ): Promise<string> {
    const enc = new CompactEncrypt(this.#jwt.data())
    if (
      this.#protectedHeader &&
      (this.#replicateIssuerAsHeader ||
        this.#replicateSubjectAsHeader ||
        this.#replicateAudienceAsHeader)
    ) {
      this.#protectedHeader = {
        ...this.#protectedHeader,
        iss: this.#replicateIssuerAsHeader ? this.#jwt.iss : undefined,
        sub: this.#replicateSubjectAsHeader ? this.#jwt.sub : undefined,
        aud: this.#replicateAudienceAsHeader ? this.#jwt.aud : undefined,
      }
    }
    enc.setProtectedHeader(this.#protectedHeader)
    if (this.#iv) {
      enc.setInitializationVector(this.#iv)
    }
    if (this.#cek) {
      enc.setContentEncryptionKey(this.#cek)
    }
    if (this.#keyManagementParameters) {
      enc.setKeyManagementParameters(this.#keyManagementParameters)
    }
    return enc.encrypt(key, options)
  }
}
