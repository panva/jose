/**
 * JSON Web Token (JWT) Encryption (JWT is in JWE format)
 *
 * @module
 */

import type * as types from '../types.d.ts'
import { compactJWE, createJWE } from '../lib/jwe_encrypt.js'
import type { EncryptInput } from '../lib/jwe_encrypt.js'
import { JWTClaimsBuilder, jwtClaim, jwtData } from '../lib/jwt_claims_set.js'
import { assertNotSet } from '../lib/validate.js'

/**
 * EncryptJWT constructor
 *
 * @param payload The JWT Claims Set object. Defaults to an empty object.
 */
const EncryptJWT_base: new (payload?: types.JWTPayload) => types.ProduceJWT = JWTClaimsBuilder

/**
 * Builds and encrypts Compact JWE-formatted JSON Web Tokens.
 *
 * This class is exported (as a named export) from the main `'jose'` module entry point as well as
 * from its subpath export `'jose/jwt/encrypt'`.
 *
 * @example
 *
 * ```js
 * const secret = jose.base64url.decode('zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lvI')
 * const jwt = await new jose.EncryptJWT({ 'urn:example:claim': true })
 *   .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
 *   .setIssuedAt()
 *   .setIssuer('urn:example:issuer')
 *   .setAudience('urn:example:audience')
 *   .setExpirationTime('2h')
 *   .encrypt(secret)
 *
 * console.log(jwt)
 * ```
 */
export class EncryptJWT extends EncryptJWT_base {
  #input: EncryptInput = [undefined!]

  #replicateIssuerAsHeader!: boolean

  #replicateSubjectAsHeader!: boolean

  #replicateAudienceAsHeader!: boolean

  /**
   * Sets the JWE Protected Header on the EncryptJWT object.
   *
   * @param protectedHeader JWE Protected Header. Must contain an "alg" (JWE Algorithm) and "enc"
   *   (JWE Encryption Algorithm) properties.
   */
  setProtectedHeader(protectedHeader: types.CompactJWEHeaderParameters): this {
    assertNotSet(this.#input[1], 'setProtectedHeader')
    this.#input[1] = protectedHeader
    return this
  }

  /**
   * Sets the JWE Key Management parameters to be used when encrypting. Use this method instead of
   * the header setters to configure algorithm inputs such as ECDH-ES "apu" (Agreement PartyUInfo)
   * and "apv" (Agreement PartyVInfo), or PBES2 "p2c" (PBES2 Count). The parameters are added to the
   * appropriate JOSE Header.
   *
   * @param parameters JWE Key Management parameters.
   */
  setKeyManagementParameters(parameters: types.JWEKeyManagementHeaderParameters): this {
    assertNotSet(this.#input[7], 'setKeyManagementParameters')
    this.#input[7] = parameters
    return this
  }

  /**
   * Sets a content encryption key to use, by default a random suitable one is generated for the JWE
   * "enc" (Encryption Algorithm) Header Parameter.
   *
   * @deprecated You should not use this method. It is only really intended for test and vector
   *   validation purposes.
   *
   * @param cek JWE Content Encryption Key.
   */
  setContentEncryptionKey(cek: Uint8Array): this {
    assertNotSet(this.#input[5], 'setContentEncryptionKey')
    this.#input[5] = cek
    return this
  }

  /**
   * Sets the JWE Initialization Vector to use for content encryption, by default a random suitable
   * one is generated for the JWE "enc" (Encryption Algorithm) Header Parameter.
   *
   * @deprecated You should not use this method. It is only really intended for test and vector
   *   validation purposes.
   *
   * @param iv JWE Initialization Vector.
   */
  setInitializationVector(iv: Uint8Array): this {
    assertNotSet(this.#input[6], 'setInitializationVector')
    this.#input[6] = iv
    return this
  }

  /**
   * Replicates the "iss" (Issuer) Claim as a JWE Protected Header Parameter.
   *
   * @see {@link https://www.rfc-editor.org/info/rfc7519/#section-5.3 RFC7519#section-5.3}
   */
  replicateIssuerAsHeader(): this {
    this.#replicateIssuerAsHeader = true
    return this
  }

  /**
   * Replicates the "sub" (Subject) Claim as a JWE Protected Header Parameter.
   *
   * @see {@link https://www.rfc-editor.org/info/rfc7519/#section-5.3 RFC7519#section-5.3}
   */
  replicateSubjectAsHeader(): this {
    this.#replicateSubjectAsHeader = true
    return this
  }

  /**
   * Replicates the "aud" (Audience) Claim as a JWE Protected Header Parameter.
   *
   * @see {@link https://www.rfc-editor.org/info/rfc7519/#section-5.3 RFC7519#section-5.3}
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
  async encrypt(key: types.KeyInput, options?: types.EncryptOptions): Promise<string> {
    const plaintext = jwtData(this)
    if (
      this.#input[1] &&
      (this.#replicateIssuerAsHeader ||
        this.#replicateSubjectAsHeader ||
        this.#replicateAudienceAsHeader)
    ) {
      this.#input[1] = {
        ...this.#input[1],
        iss: this.#replicateIssuerAsHeader ? jwtClaim(this, 'iss') : undefined,
        sub: this.#replicateSubjectAsHeader ? jwtClaim(this, 'sub') : undefined,
        aud: this.#replicateAudienceAsHeader ? jwtClaim(this, 'aud') : undefined,
      }
    }

    const input: EncryptInput = [...this.#input]
    input[0] = plaintext
    return compactJWE(await createJWE(input, key, options))
  }
}
