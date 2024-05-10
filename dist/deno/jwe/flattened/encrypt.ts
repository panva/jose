import { encode as base64url } from '../../runtime/base64url.ts'
import encrypt from '../../runtime/encrypt.ts'

import type {
  KeyLike,
  FlattenedJWE,
  JWEHeaderParameters,
  JWEKeyManagementHeaderParameters,
  EncryptOptions,
} from '../../types.d.ts'
import encryptKeyManagement from '../../lib/encrypt_key_management.ts'
import { JOSENotSupported, JWEInvalid } from '../../util/errors.ts'
import isDisjoint from '../../lib/is_disjoint.ts'
import { encoder, decoder, concat } from '../../lib/buffer_utils.ts'
import validateCrit from '../../lib/validate_crit.ts'

/** @private */
export const unprotected = Symbol()

/**
 * The FlattenedEncrypt class is used to build and encrypt Flattened JWE objects.
 *
 */
export class FlattenedEncrypt {
  private _plaintext: Uint8Array

  private _protectedHeader!: JWEHeaderParameters | undefined

  private _sharedUnprotectedHeader!: JWEHeaderParameters | undefined

  private _unprotectedHeader!: JWEHeaderParameters | undefined

  private _aad!: Uint8Array | undefined

  private _cek!: Uint8Array | undefined

  private _iv!: Uint8Array | undefined

  private _keyManagementParameters!: JWEKeyManagementHeaderParameters

  /** @param plaintext Binary representation of the plaintext to encrypt. */
  constructor(plaintext: Uint8Array) {
    if (!(plaintext instanceof Uint8Array)) {
      throw new TypeError('plaintext must be an instance of Uint8Array')
    }
    this._plaintext = plaintext
  }

  /**
   * Sets the JWE Key Management parameters to be used when encrypting. Use of this is method is
   * really only needed for ECDH based algorithms when utilizing the Agreement PartyUInfo or
   * Agreement PartyVInfo parameters. Other parameters will always be randomly generated when needed
   * and missing.
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
   * Sets the JWE Protected Header on the FlattenedEncrypt object.
   *
   * @param protectedHeader JWE Protected Header.
   */
  setProtectedHeader(protectedHeader: JWEHeaderParameters) {
    if (this._protectedHeader) {
      throw new TypeError('setProtectedHeader can only be called once')
    }
    this._protectedHeader = protectedHeader
    return this
  }

  /**
   * Sets the JWE Shared Unprotected Header on the FlattenedEncrypt object.
   *
   * @param sharedUnprotectedHeader JWE Shared Unprotected Header.
   */
  setSharedUnprotectedHeader(sharedUnprotectedHeader: JWEHeaderParameters) {
    if (this._sharedUnprotectedHeader) {
      throw new TypeError('setSharedUnprotectedHeader can only be called once')
    }
    this._sharedUnprotectedHeader = sharedUnprotectedHeader
    return this
  }

  /**
   * Sets the JWE Per-Recipient Unprotected Header on the FlattenedEncrypt object.
   *
   * @param unprotectedHeader JWE Per-Recipient Unprotected Header.
   */
  setUnprotectedHeader(unprotectedHeader: JWEHeaderParameters) {
    if (this._unprotectedHeader) {
      throw new TypeError('setUnprotectedHeader can only be called once')
    }
    this._unprotectedHeader = unprotectedHeader
    return this
  }

  /**
   * Sets the Additional Authenticated Data on the FlattenedEncrypt object.
   *
   * @param aad Additional Authenticated Data.
   */
  setAdditionalAuthenticatedData(aad: Uint8Array) {
    this._aad = aad
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
  setContentEncryptionKey(cek: Uint8Array) {
    if (this._cek) {
      throw new TypeError('setContentEncryptionKey can only be called once')
    }
    this._cek = cek
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
  setInitializationVector(iv: Uint8Array) {
    if (this._iv) {
      throw new TypeError('setInitializationVector can only be called once')
    }
    this._iv = iv
    return this
  }

  /**
   * Encrypts and resolves the value of the Flattened JWE object.
   *
   * @param key Public Key or Secret to encrypt the JWE with. See
   *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
   * @param options JWE Encryption options.
   */
  async encrypt(key: KeyLike | Uint8Array, options?: EncryptOptions): Promise<FlattenedJWE> {
    if (!this._protectedHeader && !this._unprotectedHeader && !this._sharedUnprotectedHeader) {
      throw new JWEInvalid(
        'either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()',
      )
    }

    if (
      !isDisjoint(this._protectedHeader, this._unprotectedHeader, this._sharedUnprotectedHeader)
    ) {
      throw new JWEInvalid(
        'JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint',
      )
    }

    const joseHeader: JWEHeaderParameters = {
      ...this._protectedHeader,
      ...this._unprotectedHeader,
      ...this._sharedUnprotectedHeader,
    }

    validateCrit(JWEInvalid, new Map(), options?.crit, this._protectedHeader, joseHeader)

    if (joseHeader.zip !== undefined) {
      throw new JOSENotSupported(
        'JWE "zip" (Compression Algorithm) Header Parameter is not supported.',
      )
    }

    const { alg, enc } = joseHeader

    if (typeof alg !== 'string' || !alg) {
      throw new JWEInvalid('JWE "alg" (Algorithm) Header Parameter missing or invalid')
    }

    if (typeof enc !== 'string' || !enc) {
      throw new JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid')
    }

    let encryptedKey: Uint8Array | undefined

    if (this._cek && (alg === 'dir' || alg === 'ECDH-ES')) {
      throw new TypeError(
        `setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${alg}`,
      )
    }

    let cek: KeyLike | Uint8Array
    {
      let parameters: { [propName: string]: unknown } | undefined
      ;({ cek, encryptedKey, parameters } = await encryptKeyManagement(
        alg,
        enc,
        key,
        this._cek,
        this._keyManagementParameters,
      ))

      if (parameters) {
        if (options && unprotected in options) {
          if (!this._unprotectedHeader) {
            this.setUnprotectedHeader(parameters)
          } else {
            this._unprotectedHeader = { ...this._unprotectedHeader, ...parameters }
          }
        } else if (!this._protectedHeader) {
          this.setProtectedHeader(parameters)
        } else {
          this._protectedHeader = { ...this._protectedHeader, ...parameters }
        }
      }
    }

    let additionalData: Uint8Array
    let protectedHeader: Uint8Array
    let aadMember: string | undefined
    if (this._protectedHeader) {
      protectedHeader = encoder.encode(base64url(JSON.stringify(this._protectedHeader)))
    } else {
      protectedHeader = encoder.encode('')
    }

    if (this._aad) {
      aadMember = base64url(this._aad)
      additionalData = concat(protectedHeader, encoder.encode('.'), encoder.encode(aadMember))
    } else {
      additionalData = protectedHeader
    }

    const { ciphertext, tag, iv } = await encrypt(
      enc,
      this._plaintext,
      cek,
      this._iv,
      additionalData,
    )

    const jwe: FlattenedJWE = {
      ciphertext: base64url(ciphertext),
    }

    if (iv) {
      jwe.iv = base64url(iv)
    }

    if (tag) {
      jwe.tag = base64url(tag)
    }

    if (encryptedKey) {
      jwe.encrypted_key = base64url(encryptedKey)
    }

    if (aadMember) {
      jwe.aad = aadMember
    }

    if (this._protectedHeader) {
      jwe.protected = decoder.decode(protectedHeader)
    }

    if (this._sharedUnprotectedHeader) {
      jwe.unprotected = this._sharedUnprotectedHeader
    }

    if (this._unprotectedHeader) {
      jwe.header = this._unprotectedHeader
    }

    return jwe
  }
}
