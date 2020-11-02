import FlattenedEncrypt from '../flattened/encrypt.js'
import type {
  KeyLike,
  JWEKeyManagementHeaderParameters,
  JWEHeaderParameters,
  EncryptOptions,
} from '../../types.d'

/**
 * The CompactEncrypt class is a utility for creating Compact JWE strings.
 *
 * @example
 * ```
 * // ESM import
 * import CompactEncrypt from 'jose/jwe/compact/encrypt'
 * ```
 *
 * @example
 * ```
 * // CJS import
 * const { default: CompactEncrypt } = require('jose/jwe/compact/encrypt')
 * ```
 *
 * @example
 * ```
 * // usage
 * import parseJwk from 'jose/jwk/parse'
 *
 * const encoder = new TextEncoder()
 *
 * const publicKey = await parseJwk({
 *   e: 'AQAB',
 *   n: 'qpzYkTGRKSUcd12hZaJnYEKVLfdEsqu6HBAxZgRSvzLFj_zTSAEXjbf3fX47MPEHRw8NDcEXPjVOz84t4FTXYF2w2_LGWfp_myjV8pR6oUUncJjS7DhnUmTG5bpuK2HFXRMRJYz_iNR48xRJPMoY84jrnhdIFx8Tqv6w4ZHVyEvcvloPgwG3UjLidP6jmqbTiJtidVLnpQJRuFNFQJiluQXBZ1nOLC7raQshu7L9y0IatVU7vf0BPnmuSkcNNvmQkSta6ODQBPaL5-o5SW8H37vQjPDkrlJpreViNa3jqP5DB5HYUO-DMh4FegRv9gZWLDEvXpSd9A13YXCa9Q8K_w',
 *   kty: 'RSA'
 * }, 'RSA-OAEP-256')
 *
 * const jwe = await new CompactEncrypt(encoder.encode('It’s a dangerous business, Frodo, going out your door.'))
 *   .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
 *   .encrypt(publicKey)
 *
 * console.log(jwe)
 * ```
 */
export default class CompactEncrypt {
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
  setProtectedHeader(protectedHeader: JWEHeaderParameters) {
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
  async encrypt(key: KeyLike, options?: EncryptOptions): Promise<string> {
    const jwe = await this._flattened.encrypt(key, options)

    return [jwe.protected, jwe.encrypted_key, jwe.iv, jwe.ciphertext, jwe.tag].join('.')
  }
}

export type { KeyLike, JWEKeyManagementHeaderParameters, JWEHeaderParameters }
