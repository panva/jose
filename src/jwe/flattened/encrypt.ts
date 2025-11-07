/**
 * Encrypting JSON Web Encryption (JWE) in Flattened JSON Serialization
 *
 * @module
 */

import { encode as b64u } from '../../util/base64url.js'
import { unprotected } from '../../lib/private_symbols.js'
import { encrypt } from '../../lib/encrypt.js'
import { Seal as hpke, isIntegratedEncryption, info } from '../../lib/hpke.js'
import type * as types from '../../types.d.ts'
import { encryptKeyManagement } from '../../lib/encrypt_key_management.js'
import { JOSENotSupported, JWEInvalid } from '../../util/errors.js'
import { isDisjoint } from '../../lib/is_disjoint.js'
import { concat, encode } from '../../lib/buffer_utils.js'
import { validateCrit } from '../../lib/validate_crit.js'
import { normalizeKey } from '../../lib/normalize_key.js'
import { checkKeyType } from '../../lib/check_key_type.js'
import { assertCryptoKey } from '../../lib/is_key_like.js'

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
 *   .setAdditionalAuthenticatedData(encoder.encode('The Fellowship of the Ring'))
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
   * (HPKE) Use of this method is needed for HPKE algorithms to set the "psk_id" (Pre-Shared Key ID)
   * and "psk" (Pre-Shared Key).
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
   * Sets the JWE Protected Header on the FlattenedEncrypt object.
   *
   * @param protectedHeader JWE Protected Header.
   */
  setProtectedHeader(protectedHeader: types.JWEHeaderParameters): this {
    if (this.#protectedHeader) {
      throw new TypeError('setProtectedHeader can only be called once')
    }
    this.#protectedHeader = protectedHeader
    return this
  }

  /**
   * Sets the JWE Shared Unprotected Header on the FlattenedEncrypt object.
   *
   * @param sharedUnprotectedHeader JWE Shared Unprotected Header.
   */
  setSharedUnprotectedHeader(sharedUnprotectedHeader: types.JWEHeaderParameters): this {
    if (this.#sharedUnprotectedHeader) {
      throw new TypeError('setSharedUnprotectedHeader can only be called once')
    }
    this.#sharedUnprotectedHeader = sharedUnprotectedHeader
    return this
  }

  /**
   * Sets the JWE Per-Recipient Unprotected Header on the FlattenedEncrypt object.
   *
   * @param unprotectedHeader JWE Per-Recipient Unprotected Header.
   */
  setUnprotectedHeader(unprotectedHeader: types.JWEHeaderParameters): this {
    if (this.#unprotectedHeader) {
      throw new TypeError('setUnprotectedHeader can only be called once')
    }
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
   * Encrypts and resolves the value of the Flattened JWE object.
   *
   * @param key Public Key or Secret to encrypt the JWE with. See
   *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
   * @param options JWE Encryption options.
   */
  async encrypt(
    key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array,
    options?: types.EncryptOptions,
  ): Promise<types.FlattenedJWE> {
    if (!this.#protectedHeader && !this.#unprotectedHeader && !this.#sharedUnprotectedHeader) {
      throw new JWEInvalid(
        'either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()',
      )
    }

    if (
      !isDisjoint(this.#protectedHeader, this.#unprotectedHeader, this.#sharedUnprotectedHeader)
    ) {
      throw new JWEInvalid(
        'JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint',
      )
    }

    const joseHeader: types.JWEHeaderParameters = {
      ...this.#protectedHeader,
      ...this.#unprotectedHeader,
      ...this.#sharedUnprotectedHeader,
    }

    validateCrit(JWEInvalid, new Map(), options?.crit, this.#protectedHeader, joseHeader)

    if (joseHeader.zip !== undefined) {
      throw new JOSENotSupported(
        'JWE "zip" (Compression Algorithm) Header Parameter is not supported.',
      )
    }

    const { alg, enc } = joseHeader

    if (typeof alg !== 'string' || !alg) {
      throw new JWEInvalid('JWE "alg" (Algorithm) Header Parameter missing or invalid')
    }

    const hpkeIe = isIntegratedEncryption(alg)

    if (hpkeIe) {
      if (!this.#protectedHeader?.alg) {
        throw new JWEInvalid(
          'JWE "alg" (Algorithm) must be in a protected header when using HPKE Integrated Encryption',
        )
      }

      if (enc) {
        throw new JWEInvalid(
          'JWE "enc" (Encryption Algorithm) Header Parameter must be missing when using HPKE Integrated Encryption',
        )
      }

      if (this.#keyManagementParameters?.psk_id?.byteLength) {
        this.#protectedHeader = {
          ...this.#protectedHeader,
          psk_id: b64u(this.#keyManagementParameters.psk_id),
        }
      }
    } else if (typeof enc !== 'string' || !enc) {
      throw new JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid')
    }

    let encryptedKey: Uint8Array | undefined

    if (this.#cek && (alg === 'dir' || alg === 'ECDH-ES' || hpkeIe)) {
      throw new TypeError(
        `setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${alg}`,
      )
    }

    checkKeyType(alg === 'dir' ? enc! : alg, key, 'encrypt')

    let cek: types.CryptoKey | Uint8Array
    if (!hpkeIe) {
      let parameters: { [propName: string]: unknown } | undefined
      const k = await normalizeKey(key, alg)
      ;({ cek, encryptedKey, parameters } = await encryptKeyManagement(
        alg,
        enc!,
        k,
        this.#cek,
        this.#keyManagementParameters,
      ))

      if (parameters) {
        if (options && unprotected in options) {
          if (!this.#unprotectedHeader) {
            this.setUnprotectedHeader(parameters)
          } else {
            this.#unprotectedHeader = { ...this.#unprotectedHeader, ...parameters }
          }
        } else if (!this.#protectedHeader) {
          this.setProtectedHeader(parameters)
        } else {
          this.#protectedHeader = { ...this.#protectedHeader, ...parameters }
        }
      }
    }

    let additionalData: Uint8Array
    let protectedHeaderS: string
    let protectedHeaderB: Uint8Array
    let aadMember: string | undefined
    if (this.#protectedHeader) {
      protectedHeaderS = b64u(JSON.stringify(this.#protectedHeader))
      protectedHeaderB = encode(protectedHeaderS)
    } else {
      protectedHeaderS = ''
      protectedHeaderB = new Uint8Array()
    }

    if (this.#aad) {
      aadMember = b64u(this.#aad)
      const aadMemberBytes = encode(aadMember)
      additionalData = concat(protectedHeaderB, encode('.'), aadMemberBytes)
    } else {
      additionalData = protectedHeaderB
    }

    let ciphertext: Uint8Array
    let tag: Uint8Array | undefined
    let iv: Uint8Array | undefined

    if (hpkeIe) {
      const k = await normalizeKey(key, alg)
      assertCryptoKey(k)
      const psk = this.#keyManagementParameters?.psk
      const psk_id = this.#keyManagementParameters?.psk_id
      ;({ ct: ciphertext, enc: encryptedKey } = await hpke(
        alg,
        k,
        new Uint8Array(),
        additionalData,
        this.#plaintext,
        psk,
        psk_id,
      ))
    } else {
      ;({ ciphertext, tag, iv } = await encrypt(
        enc!,
        this.#plaintext,
        cek!,
        this.#iv,
        additionalData,
      ))
    }

    const jwe: types.FlattenedJWE = {
      ciphertext: b64u(ciphertext),
    }

    if (iv) {
      jwe.iv = b64u(iv)
    }

    if (tag) {
      jwe.tag = b64u(tag)
    }

    if (encryptedKey) {
      jwe.encrypted_key = b64u(encryptedKey)
    }

    if (aadMember) {
      jwe.aad = aadMember
    }

    if (this.#protectedHeader) {
      jwe.protected = protectedHeaderS
    }

    if (this.#sharedUnprotectedHeader) {
      jwe.unprotected = this.#sharedUnprotectedHeader
    }

    if (this.#unprotectedHeader) {
      jwe.header = this.#unprotectedHeader
    }

    return jwe
  }
}
