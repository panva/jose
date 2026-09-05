/**
 * Encrypting JSON Web Encryption (JWE) in Flattened JSON Serialization
 *
 * @module
 */

import { assertNotSet, assertUint8Array } from '../../lib/validate.js'
import { createJWE } from '../../lib/jwe_encrypt.js'
import type { EncryptInput } from '../../lib/jwe_encrypt.js'
import type * as types from '../../types.d.ts'

/**
 * Builds and encrypts Flattened JWE objects.
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
  #input: EncryptInput

  /**
   * Creates a Flattened JWE encryptor.
   *
   * @param plaintext Binary representation of the plaintext to encrypt.
   */
  constructor(plaintext: Uint8Array) {
    assertUint8Array(plaintext, 'plaintext')
    this.#input = [plaintext]
  }

  /**
   * Sets key management inputs such as ECDH-ES "apu"/"apv" or PBES2 "p2c". Use this method instead
   * of header setters; the resulting parameters are added to the JOSE header. May only be called
   * once.
   *
   * @param parameters JWE Key Management parameters.
   */
  setKeyManagementParameters(parameters: types.JWEKeyManagementHeaderParameters): this {
    assertNotSet(this.#input[7], 'setKeyManagementParameters')
    this.#input[7] = parameters
    return this
  }

  /**
   * Sets the JWE Protected Header. May only be called once.
   *
   * @param protectedHeader JWE Protected Header.
   */
  setProtectedHeader(protectedHeader: types.JWEHeaderParameters): this {
    assertNotSet(this.#input[1], 'setProtectedHeader')
    this.#input[1] = protectedHeader
    return this
  }

  /**
   * Sets the JWE Shared Unprotected Header. May only be called once.
   *
   * @param sharedUnprotectedHeader JWE Shared Unprotected Header.
   */
  setSharedUnprotectedHeader(sharedUnprotectedHeader: types.JWEHeaderParameters): this {
    assertNotSet(this.#input[3], 'setSharedUnprotectedHeader')
    this.#input[3] = sharedUnprotectedHeader
    return this
  }

  /**
   * Sets the JWE Per-Recipient Unprotected Header. May only be called once.
   *
   * @param unprotectedHeader JWE Per-Recipient Unprotected Header.
   */
  setUnprotectedHeader(unprotectedHeader: types.JWEHeaderParameters): this {
    assertNotSet(this.#input[2], 'setUnprotectedHeader')
    this.#input[2] = unprotectedHeader
    return this
  }

  /**
   * Sets additional data to authenticate without encrypting it.
   *
   * @param aad Additional Authenticated Data.
   */
  setAdditionalAuthenticatedData(aad: Uint8Array): this {
    this.#input[4] = aad
    return this
  }

  /**
   * Sets a content encryption key instead of generating a random one for the JWE "enc" algorithm.
   * May only be called once.
   *
   * @deprecated Use only for testing and vector validation.
   *
   * @param cek JWE Content Encryption Key.
   */
  setContentEncryptionKey(cek: Uint8Array): this {
    assertNotSet(this.#input[5], 'setContentEncryptionKey')
    this.#input[5] = cek
    return this
  }

  /**
   * Sets the content encryption IV instead of generating a random one for the JWE "enc" algorithm.
   * May only be called once.
   *
   * @deprecated Use only for testing and vector validation.
   *
   * @param iv JWE Initialization Vector.
   */
  setInitializationVector(iv: Uint8Array): this {
    assertNotSet(this.#input[6], 'setInitializationVector')
    this.#input[6] = iv
    return this
  }

  /**
   * Encrypts the plaintext as a Flattened JWE.
   *
   * @param key Public key or shared secret. See
   *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
   * @param options JWE Encryption options.
   */
  async encrypt(key: types.KeyInput, options?: types.EncryptOptions): Promise<types.FlattenedJWE> {
    return createJWE([...this.#input], key, options)
  }
}
