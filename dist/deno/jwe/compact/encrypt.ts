import { FlattenedEncrypt } from '../flattened/encrypt.ts'
import type {
  KeyLike,
  JWEKeyManagementHeaderParameters,
  CompactJWEHeaderParameters,
  EncryptOptions,
} from '../../types.d.ts'

/**
 * The CompactEncrypt class is a utility for creating Compact JWE strings.
 *
 * @example Usage
 * ```js
 * const jwe = await new jose.CompactEncrypt(
 *   new TextEncoder().encode(
 *     'It’s a dangerous business, Frodo, going out your door.'
 *   )
 * )
 *   .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
 *   .encrypt(publicKey)
 *
 * console.log(jwe)
 * ```
 */
export class CompactEncrypt {
  private _flattened: FlattenedEncrypt

  /**
   * @param plaintext Binary representation of the plaintext to encrypt.
   */
  constructor(plaintext: Uint8Array) {
    this._flattened = new FlattenedEncrypt(plaintext)
  }

  /**
   * Sets a content encryption key to use, by default a random suitable one
   * is generated for the JWE enc" (Encryption Algorithm) Header Parameter.
   * You do not need to invoke this method, it is only really intended for
   * test and vector validation purposes.
   *
   * @param cek JWE Content Encryption Key.
   */
  setContentEncryptionKey(cek: Uint8Array) {
    this._flattened.setContentEncryptionKey(cek)
    return this
  }

  /**
   * Sets the JWE Initialization Vector to use for content encryption, by default
   * a random suitable one is generated for the JWE enc" (Encryption Algorithm)
   * Header Parameter. You do not need to invoke this method, it is only really
   * intended for test and vector validation purposes.
   *
   * @param iv JWE Initialization Vector.
   */
  setInitializationVector(iv: Uint8Array) {
    this._flattened.setInitializationVector(iv)
    return this
  }

  /**
   * Sets the JWE Protected Header on the CompactEncrypt object.
   *
   * @param protectedHeader JWE Protected Header object.
   */
  setProtectedHeader(protectedHeader: CompactJWEHeaderParameters) {
    this._flattened.setProtectedHeader(protectedHeader)
    return this
  }

  /**
   * Sets the JWE Key Management parameters to be used when encrypting the Content
   * Encryption Key. You do not need to invoke this method, it is only really
   * intended for test and vector validation purposes.
   *
   * @param parameters JWE Key Management parameters.
   */
  setKeyManagementParameters(parameters: JWEKeyManagementHeaderParameters) {
    this._flattened.setKeyManagementParameters(parameters)
    return this
  }

  /**
   * Encrypts and resolves the value of the Compact JWE string.
   *
   * @param key Public Key or Secret to encrypt the JWE with.
   * @param options JWE Encryption options.
   */
  async encrypt(key: KeyLike | Uint8Array, options?: EncryptOptions): Promise<string> {
    const jwe = await this._flattened.encrypt(key, options)

    return [jwe.protected, jwe.encrypted_key, jwe.iv, jwe.ciphertext, jwe.tag].join('.')
  }
}
