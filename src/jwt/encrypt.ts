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

/** @param payload Initial JWT Claims Set. Defaults to an empty object. */
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
   * Sets the JWE Protected Header. May only be called once.
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
   * Sets JWE Key Management parameters, such as ECDH-ES "apu" and "apv" or PBES2 "p2c", and adds
   * them to the appropriate JOSE Header. Use this instead of the header setters for algorithm
   * inputs. May only be called once.
   *
   * @param parameters JWE Key Management parameters.
   */
  setKeyManagementParameters(parameters: types.JWEKeyManagementHeaderParameters): this {
    assertNotSet(this.#input[7], 'setKeyManagementParameters')
    this.#input[7] = parameters
    return this
  }

  /**
   * Sets the content encryption key. By default, a suitable random key is generated for the JWE
   * "enc" (Encryption Algorithm). May only be called once.
   *
   * @deprecated For testing and vector validation only; allow random generation in production.
   *
   * @param cek JWE Content Encryption Key.
   */
  setContentEncryptionKey(cek: Uint8Array): this {
    assertNotSet(this.#input[5], 'setContentEncryptionKey')
    this.#input[5] = cek
    return this
  }

  /**
   * Sets the Initialization Vector for content encryption. By default, a suitable random IV is
   * generated for the JWE "enc" (Encryption Algorithm). May only be called once.
   *
   * @deprecated For testing and vector validation only; allow random generation in production.
   *
   * @param iv JWE Initialization Vector.
   */
  setInitializationVector(iv: Uint8Array): this {
    assertNotSet(this.#input[6], 'setInitializationVector')
    this.#input[6] = iv
    return this
  }

  /**
   * Replicates the "iss" (Issuer) Claim in the JWE Protected Header, exposing it without
   * decryption.
   *
   * @see {@link https://www.rfc-editor.org/info/rfc7519/#section-5.3 RFC7519#section-5.3}
   */
  replicateIssuerAsHeader(): this {
    this.#replicateIssuerAsHeader = true
    return this
  }

  /**
   * Replicates the "sub" (Subject) Claim in the JWE Protected Header, exposing it without
   * decryption.
   *
   * @see {@link https://www.rfc-editor.org/info/rfc7519/#section-5.3 RFC7519#section-5.3}
   */
  replicateSubjectAsHeader(): this {
    this.#replicateSubjectAsHeader = true
    return this
  }

  /**
   * Replicates the "aud" (Audience) Claim in the JWE Protected Header, exposing it without
   * decryption.
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
   * @param key Public key or shared secret to encrypt the JWT with. See
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
