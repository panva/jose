/**
 * Encrypting JSON Web Encryption (JWE) in Flattened JSON Serialization
 *
 * @module
 */

import { unprotected, assertNotSet } from '../../lib/helpers.js'
import type * as types from '../../types.d.ts'
import { JWEInvalid } from '../../util/errors.js'
import { createJWE } from '../../lib/jwe_encrypt.js'
import { validateCritDuplicates } from '../../lib/options.js'

/**
 * The FlattenedEncrypt class is used to build and encrypt Flattened JWE objects.
 *
 * This class is exported (as a named export) from the main `'jose'` module entry point as well as
 * from its subpath export `'jose/jwe/flattened/encrypt'`.
 *
 * @example
 *
 * ```js
 * const jwe = await new jose.FlattenedEncrypt(
 *   new TextEncoder().encode('It’s a dangerous business, Frodo, going out your door.'),
 * )
 *   .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
 *   .setAdditionalAuthenticatedData(new TextEncoder().encode('The Fellowship of the Ring'))
 *   .encrypt(publicKey)
 *
 * console.log(jwe)
 * ```
 */
export class FlattenedEncrypt {
  #plaintext: Uint8Array

  #protectedHeader!: types.JWEHeaderParameters | undefined

  #sharedUnprotectedHeader!: types.JWEHeaderParameters | undefined

  #unprotectedHeader!: types.JWEHeaderParameters | undefined

  #aad!: Uint8Array | undefined

  #cek!: Uint8Array | undefined

  #iv!: Uint8Array | undefined

  #keyManagementParameters?: types.JWEKeyManagementHeaderParameters

  /**
   * {@link FlattenedEncrypt} constructor
   *
   * @param plaintext Binary representation of the plaintext to encrypt.
   */
  constructor(plaintext: Uint8Array) {
    if (!(plaintext instanceof Uint8Array)) {
      throw new TypeError('plaintext must be an instance of Uint8Array')
    }
    this.#plaintext = plaintext
  }

  /**
   * Sets the JWE Key Management parameters to be used when encrypting.
   *
   * (ECDH-ES) Use of this method is needed for ECDH based algorithms to set the "apu" (Agreement
   * PartyUInfo) or "apv" (Agreement PartyVInfo) parameters.
   *
   * @param parameters JWE Key Management parameters.
   */
  setKeyManagementParameters(parameters: types.JWEKeyManagementHeaderParameters): this {
    assertNotSet(this.#keyManagementParameters, 'setKeyManagementParameters')
    this.#keyManagementParameters = parameters
    return this
  }

  /**
   * Sets the JWE Protected Header on the FlattenedEncrypt object.
   *
   * @param protectedHeader JWE Protected Header.
   */
  setProtectedHeader(protectedHeader: types.JWEHeaderParameters): this {
    assertNotSet(this.#protectedHeader, 'setProtectedHeader')
    this.#protectedHeader = protectedHeader
    return this
  }

  /**
   * Sets the JWE Shared Unprotected Header on the FlattenedEncrypt object.
   *
   * @param sharedUnprotectedHeader JWE Shared Unprotected Header.
   */
  setSharedUnprotectedHeader(sharedUnprotectedHeader: types.JWEHeaderParameters): this {
    assertNotSet(this.#sharedUnprotectedHeader, 'setSharedUnprotectedHeader')
    this.#sharedUnprotectedHeader = sharedUnprotectedHeader
    return this
  }

  /**
   * Sets the JWE Per-Recipient Unprotected Header on the FlattenedEncrypt object.
   *
   * @param unprotectedHeader JWE Per-Recipient Unprotected Header.
   */
  setUnprotectedHeader(unprotectedHeader: types.JWEHeaderParameters): this {
    assertNotSet(this.#unprotectedHeader, 'setUnprotectedHeader')
    this.#unprotectedHeader = unprotectedHeader
    return this
  }

  /**
   * Sets the Additional Authenticated Data on the FlattenedEncrypt object.
   *
   * @param aad Additional Authenticated Data.
   */
  setAdditionalAuthenticatedData(aad: Uint8Array): this {
    this.#aad = aad
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
    assertNotSet(this.#cek, 'setContentEncryptionKey')
    this.#cek = cek
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
    assertNotSet(this.#iv, 'setInitializationVector')
    this.#iv = iv
    return this
  }

  /**
   * Encrypts and resolves the value of the Flattened JWE object.
   *
   * @param key Public Key or Secret to encrypt the JWE with. See
   *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
   * @param options JWE Encryption options.
   */
  async encrypt(key: types.KeyInput, options?: types.EncryptOptions): Promise<types.FlattenedJWE> {
    if (!this.#protectedHeader && !this.#unprotectedHeader && !this.#sharedUnprotectedHeader) {
      throw new JWEInvalid(
        'either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()',
      )
    }

    validateCritDuplicates(JWEInvalid, this.#protectedHeader)

    return createJWE(
      {
        plaintext: this.#plaintext,
        protectedHeader: this.#protectedHeader,
        unprotectedHeader: this.#unprotectedHeader,
        sharedUnprotectedHeader: this.#sharedUnprotectedHeader,
        aad: this.#aad,
        cek: this.#cek,
        iv: this.#iv,
        keyManagementParameters: this.#keyManagementParameters,
        crit: options?.crit,
        unprotectedParameters: options ? unprotected in options : false,
      },
      key,
    )
  }
}
