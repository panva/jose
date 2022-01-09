import { CompactEncrypt } from '../jwe/compact/encrypt.ts'
import type {
  EncryptOptions,
  CompactJWEHeaderParameters,
  JWEKeyManagementHeaderParameters,
  KeyLike,
} from '../types.d.ts'
import { encoder } from '../lib/buffer_utils.ts'
import { ProduceJWT } from './produce.ts'

/**
 * The EncryptJWT class is a utility for creating Compact JWE formatted JWT strings.
 *
 * @example Usage
 * ```js
 * const jwt = await new jose.EncryptJWT({ 'urn:example:claim': true })
 *   .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
 *   .setIssuedAt()
 *   .setIssuer('urn:example:issuer')
 *   .setAudience('urn:example:audience')
 *   .setExpirationTime('2h')
 *   .encrypt(secretKey)
 *
 * console.log(jwt)
 * ```
 */
export class EncryptJWT extends ProduceJWT {
  private _cek!: Uint8Array

  private _iv!: Uint8Array

  private _keyManagementParameters!: JWEKeyManagementHeaderParameters

  private _protectedHeader!: CompactJWEHeaderParameters

  private _replicateIssuerAsHeader!: boolean

  private _replicateSubjectAsHeader!: boolean

  private _replicateAudienceAsHeader!: boolean

  /**
   * Sets the JWE Protected Header on the EncryptJWT object.
   *
   * @param protectedHeader JWE Protected Header.
   * Must contain an "alg" (JWE Algorithm) and "enc" (JWE
   * Encryption Algorithm) properties.
   */
  setProtectedHeader(protectedHeader: CompactJWEHeaderParameters) {
    if (this._protectedHeader) {
      throw new TypeError('setProtectedHeader can only be called once')
    }
    this._protectedHeader = protectedHeader
    return this
  }

  /**
   * Sets the JWE Key Management parameters to be used when encrypting.
   * Use of this is method is really only needed for ECDH-ES based algorithms
   * when utilizing the Agreement PartyUInfo or Agreement PartyVInfo parameters.
   * Other parameters will always be randomly generated when needed and missing.
   *
   * @param parameters JWE Key Management parameters.
   */
  setKeyManagementParameters(parameters: JWEKeyManagementHeaderParameters) {
    if (this._keyManagementParameters) {
      throw new TypeError('setKeyManagementParameters can only be called once')
    }
    this._keyManagementParameters = parameters
    return this
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
    if (this._cek) {
      throw new TypeError('setContentEncryptionKey can only be called once')
    }
    this._cek = cek
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
    if (this._iv) {
      throw new TypeError('setInitializationVector can only be called once')
    }
    this._iv = iv
    return this
  }

  /**
   * Replicates the "iss" (Issuer) Claim as a JWE Protected Header Parameter as per
   * [RFC7519#section-5.3](https://tools.ietf.org/html/rfc7519#section-5.3).
   */
  replicateIssuerAsHeader() {
    this._replicateIssuerAsHeader = true
    return this
  }

  /**
   * Replicates the "sub" (Subject) Claim as a JWE Protected Header Parameter as per
   * [RFC7519#section-5.3](https://tools.ietf.org/html/rfc7519#section-5.3).
   */
  replicateSubjectAsHeader() {
    this._replicateSubjectAsHeader = true
    return this
  }

  /**
   * Replicates the "aud" (Audience) Claim as a JWE Protected Header Parameter as per
   * [RFC7519#section-5.3](https://tools.ietf.org/html/rfc7519#section-5.3).
   */
  replicateAudienceAsHeader() {
    this._replicateAudienceAsHeader = true
    return this
  }

  /**
   * Encrypts and returns the JWT.
   *
   * @param key Public Key or Secret to encrypt the JWT with.
   * @param options JWE Encryption options.
   */
  async encrypt(key: KeyLike | Uint8Array, options?: EncryptOptions): Promise<string> {
    const enc = new CompactEncrypt(encoder.encode(JSON.stringify(this._payload)))
    if (this._replicateIssuerAsHeader) {
      this._protectedHeader = { ...this._protectedHeader, iss: this._payload.iss }
    }
    if (this._replicateSubjectAsHeader) {
      this._protectedHeader = { ...this._protectedHeader, sub: this._payload.sub }
    }
    if (this._replicateAudienceAsHeader) {
      this._protectedHeader = { ...this._protectedHeader, aud: this._payload.aud }
    }
    enc.setProtectedHeader(this._protectedHeader)
    if (this._iv) {
      enc.setInitializationVector(this._iv)
    }
    if (this._cek) {
      enc.setContentEncryptionKey(this._cek)
    }
    if (this._keyManagementParameters) {
      enc.setKeyManagementParameters(this._keyManagementParameters)
    }
    return enc.encrypt(key, options)
  }
}
