/**
 * Encrypting JSON Web Encryption (JWE) in Compact Serialization
 *
 * @module
 */

import type * as types from '../../types.d.ts'
import { assertNotSet } from '../../lib/helpers.js'
import { assertUint8Array } from '../../lib/type_checks.js'
import { createJWE } from '../../lib/jwe_encrypt.js'

/**
 * Builds and encrypts Compact JWE strings.
 *
 * This class is exported (as a named export) from the main `'jose'` module entry point as well as
 * from its subpath export `'jose/jwe/compact/encrypt'`.
 *
 * @example
 *
 * ```js
 * const jwe = await new jose.CompactEncrypt(
 *   new TextEncoder().encode('It’s a dangerous business, Frodo, going out your door.'),
 * )
 *   .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
 *   .encrypt(publicKey)
 *
 * console.log(jwe)
 * ```
 */
export class CompactEncrypt {
  #plaintext: Uint8Array

  #protectedHeader!: types.CompactJWEHeaderParameters

  #cek!: Uint8Array

  #iv!: Uint8Array

  #keyManagementParameters!: types.JWEKeyManagementHeaderParameters

  /**
   * {@link CompactEncrypt} constructor
   *
   * @param plaintext Binary representation of the plaintext to encrypt.
   */
  constructor(plaintext: Uint8Array) {
    assertUint8Array(plaintext, 'plaintext')
    this.#plaintext = plaintext
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
   * Sets the JWE Protected Header on the CompactEncrypt object.
   *
   * @param protectedHeader JWE Protected Header object.
   */
  setProtectedHeader(protectedHeader: types.CompactJWEHeaderParameters): this {
    assertNotSet(this.#protectedHeader, 'setProtectedHeader')
    this.#protectedHeader = protectedHeader
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
    assertNotSet(this.#keyManagementParameters, 'setKeyManagementParameters')
    this.#keyManagementParameters = parameters
    return this
  }

  /**
   * Encrypts and resolves the value of the Compact JWE string.
   *
   * @param key Public Key or Secret to encrypt the JWE with. See
   *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
   * @param options JWE Encryption options.
   */
  async encrypt(key: types.KeyInput, options?: types.EncryptOptions): Promise<string> {
    const jwe = await createJWE(
      [
        this.#plaintext,
        this.#protectedHeader,
        undefined,
        undefined,
        undefined,
        this.#cek,
        this.#iv,
        this.#keyManagementParameters,
        undefined,
        false,
      ],
      key,
      options,
    )

    return [jwe.protected, jwe.encrypted_key, jwe.iv, jwe.ciphertext, jwe.tag].join('.')
  }
}
