/**
 * Encrypting JSON Web Encryption (JWE) in General JSON Serialization
 *
 * @module
 */

import type * as types from '../../types.d.ts'
import { FlattenedEncrypt } from '../flattened/encrypt.js'
import { assertNotSet } from '../../lib/helpers.js'
import { JWEInvalid } from '../../util/errors.js'
import { generateCek } from '../../lib/content_encryption.js'
import { encryptKeyManagement } from '../../lib/key_management.js'
import { encode as b64u } from '../../util/base64url.js'
import { validateCritDuplicates } from '../../lib/options.js'
import { checkEncryptHeaders, encryptJWE } from '../../lib/jwe_encrypt.js'
import type { CheckedHeaders, EncryptInput } from '../../lib/jwe_encrypt.js'
import { normalizeKey } from '../../lib/normalize_key.js'
import { jweAlgorithm } from '../../lib/jwe_algorithms.js'
import { checkKeyType } from '../../lib/check_key_type.js'

/** Used to build General JWE object's individual recipients. */
export interface Recipient {
  /**
   * Sets the JWE Per-Recipient Unprotected Header on the Recipient object.
   *
   * @param unprotectedHeader JWE Per-Recipient Unprotected Header.
   */
  setUnprotectedHeader(unprotectedHeader: types.JWEHeaderParameters): Recipient

  /**
   * Sets the JWE Key Management parameters to be used when encrypting.
   *
   * (ECDH-ES) Use of this method is needed for ECDH based algorithms to set the "apu" (Agreement
   * PartyUInfo) or "apv" (Agreement PartyVInfo) parameters.
   *
   * @param parameters JWE Key Management parameters.
   */
  setKeyManagementParameters(parameters: types.JWEKeyManagementHeaderParameters): Recipient

  /**
   * A shorthand for calling {@link GeneralEncrypt.addRecipient addRecipient()} on the enclosing
   * {@link GeneralEncrypt} instance.
   *
   * @param key Public Key or Secret to encrypt the Content Encryption Key for the recipient with.
   *   See {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
   * @param options JWE Encryption options.
   */
  addRecipient(key: types.KeyInput, options?: types.CritOption): Recipient

  /**
   * A shorthand for calling {@link GeneralEncrypt.encrypt encrypt()} on the enclosing
   * {@link GeneralEncrypt} instance. Takes no arguments — each recipient's key is supplied to
   * {@link addRecipient}.
   */
  encrypt(): Promise<types.GeneralJWE>

  /** Returns the enclosing {@link GeneralEncrypt} instance */
  done(): GeneralEncrypt
}

class IndividualRecipient implements Recipient {
  #parent: GeneralEncrypt
  unprotectedHeader?: types.JWEHeaderParameters
  keyManagementParameters?: types.JWEKeyManagementHeaderParameters
  key: types.KeyInput
  options: types.CritOption

  constructor(enc: GeneralEncrypt, key: types.KeyInput, options: types.CritOption) {
    this.#parent = enc
    this.key = key
    this.options = options
  }

  setUnprotectedHeader(unprotectedHeader: types.JWEHeaderParameters): this {
    assertNotSet(this.unprotectedHeader, 'setUnprotectedHeader')
    this.unprotectedHeader = unprotectedHeader
    return this
  }

  setKeyManagementParameters(parameters: types.JWEKeyManagementHeaderParameters): this {
    assertNotSet(this.keyManagementParameters, 'setKeyManagementParameters')
    this.keyManagementParameters = parameters
    return this
  }

  addRecipient(...args: Parameters<GeneralEncrypt['addRecipient']>) {
    return this.#parent.addRecipient(...args)
  }

  encrypt(...args: Parameters<GeneralEncrypt['encrypt']>) {
    return this.#parent.encrypt(...args)
  }

  done() {
    return this.#parent
  }
}

/**
 * The GeneralEncrypt class is used to build and encrypt General JWE objects.
 *
 * This class is exported (as a named export) from the main `'jose'` module entry point as well as
 * from its subpath export `'jose/jwe/general/encrypt'`.
 *
 * @example
 *
 * ```js
 * const jwe = await new jose.GeneralEncrypt(
 *   new TextEncoder().encode('It’s a dangerous business, Frodo, going out your door.'),
 * )
 *   .setProtectedHeader({ enc: 'A256GCM' })
 *   .addRecipient(ecPublicKey)
 *   .setUnprotectedHeader({ alg: 'ECDH-ES+A256KW' })
 *   .addRecipient(rsaPublicKey)
 *   .setUnprotectedHeader({ alg: 'RSA-OAEP-384' })
 *   .encrypt()
 *
 * console.log(jwe)
 * ```
 */
export class GeneralEncrypt {
  #plaintext: Uint8Array

  #recipients: IndividualRecipient[] = []

  #protectedHeader!: types.JWEHeaderParameters

  #unprotectedHeader!: types.JWEHeaderParameters

  #aad!: Uint8Array

  /**
   * {@link GeneralEncrypt} constructor
   *
   * @param plaintext Binary representation of the plaintext to encrypt.
   */
  constructor(plaintext: Uint8Array) {
    this.#plaintext = plaintext
  }

  /**
   * Adds an additional recipient for the General JWE object.
   *
   * @param key Public Key or Secret to encrypt the Content Encryption Key for the recipient with.
   *   See {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
   * @param options JWE Encryption options.
   */
  addRecipient(key: types.KeyInput, options?: types.CritOption): Recipient {
    const recipient = new IndividualRecipient(this, key, { crit: options?.crit })
    this.#recipients.push(recipient)
    return recipient
  }

  /**
   * Sets the JWE Protected Header on the GeneralEncrypt object.
   *
   * @param protectedHeader JWE Protected Header object.
   */
  setProtectedHeader(protectedHeader: types.JWEHeaderParameters): this {
    assertNotSet(this.#protectedHeader, 'setProtectedHeader')
    this.#protectedHeader = protectedHeader
    return this
  }

  /**
   * Sets the JWE Shared Unprotected Header on the GeneralEncrypt object.
   *
   * @param sharedUnprotectedHeader JWE Shared Unprotected Header object.
   */
  setSharedUnprotectedHeader(sharedUnprotectedHeader: types.JWEHeaderParameters): this {
    assertNotSet(this.#unprotectedHeader, 'setSharedUnprotectedHeader')
    this.#unprotectedHeader = sharedUnprotectedHeader
    return this
  }

  /**
   * Sets the Additional Authenticated Data on the GeneralEncrypt object.
   *
   * @param aad Additional Authenticated Data.
   */
  setAdditionalAuthenticatedData(aad: Uint8Array): this {
    this.#aad = aad
    return this
  }

  /** Encrypts and resolves the value of the General JWE object. */
  async encrypt(): Promise<types.GeneralJWE> {
    if (!this.#recipients.length) {
      throw new JWEInvalid('at least one recipient must be added')
    }

    if (!(this.#plaintext instanceof Uint8Array)) {
      throw new TypeError('plaintext must be an instance of Uint8Array')
    }

    if (this.#recipients.length === 1) {
      const [recipient] = this.#recipients

      const flattened = await new FlattenedEncrypt(this.#plaintext)
        .setAdditionalAuthenticatedData(this.#aad)
        .setProtectedHeader(this.#protectedHeader)
        .setSharedUnprotectedHeader(this.#unprotectedHeader)
        .setUnprotectedHeader(recipient.unprotectedHeader!)
        .setKeyManagementParameters(recipient.keyManagementParameters!)
        .encrypt(recipient.key, { ...recipient.options })

      const jwe: types.GeneralJWE = {
        ciphertext: flattened.ciphertext,
        iv: flattened.iv,
        recipients: [{}],
        tag: flattened.tag,
      }

      if (flattened.aad) jwe.aad = flattened.aad
      if (flattened.protected) jwe.protected = flattened.protected
      if (flattened.unprotected) jwe.unprotected = flattened.unprotected
      if (flattened.encrypted_key) jwe.recipients[0].encrypted_key = flattened.encrypted_key
      if (flattened.header) jwe.recipients[0].header = flattened.header

      return jwe
    }

    validateCritDuplicates(JWEInvalid, this.#protectedHeader)

    let enc!: string
    const inputs: EncryptInput[] = []
    const checked: CheckedHeaders[] = []
    for (let i = 0; i < this.#recipients.length; i++) {
      const recipient = this.#recipients[i]

      const input: EncryptInput = {
        plaintext: this.#plaintext,
        protectedHeader: this.#protectedHeader,
        unprotectedHeader: recipient.unprotectedHeader,
        sharedUnprotectedHeader: this.#unprotectedHeader,
        aad: this.#aad,
        keyManagementParameters: recipient.keyManagementParameters,
        crit: recipient.options.crit,
        unprotectedParameters: true,
      }
      const headers = checkEncryptHeaders(input)
      inputs.push(input)
      checked.push(headers)

      if (headers.alg === 'dir' || headers.alg === 'ECDH-ES') {
        throw new JWEInvalid('"dir" and "ECDH-ES" alg may only be used with a single recipient')
      }

      if (!enc) {
        enc = headers.enc
      } else if (enc !== headers.enc) {
        throw new JWEInvalid(
          'JWE "enc" (Encryption Algorithm) Header Parameter must be the same for all recipients',
        )
      }
    }

    const cek = generateCek(checked[0].encEntry)

    const jwe: types.GeneralJWE = {
      ciphertext: '',
      recipients: [],
    }

    for (let i = 0; i < this.#recipients.length; i++) {
      const recipient = this.#recipients[i]
      const target: Record<string, string | types.JWEHeaderParameters> = {}
      jwe.recipients.push(target)

      if (i === 0) {
        const flattened = await encryptJWE({ ...inputs[0], cek }, checked[0], recipient.key)

        jwe.ciphertext = flattened.ciphertext
        jwe.iv = flattened.iv
        jwe.tag = flattened.tag

        if (flattened.aad) jwe.aad = flattened.aad
        if (flattened.protected) jwe.protected = flattened.protected
        if (flattened.unprotected) jwe.unprotected = flattened.unprotected

        target.encrypted_key = flattened.encrypted_key!
        if (flattened.header) target.header = flattened.header

        continue
      }

      const { alg } = checked[i]

      checkKeyType(alg, recipient.key, 'encrypt')

      const k = await normalizeKey(recipient.key, jweAlgorithm(alg))
      const { encryptedKey, parameters } = await encryptKeyManagement(
        alg,
        checked[i].encEntry,
        k,
        cek,
        recipient.keyManagementParameters,
      )
      target.encrypted_key = b64u(encryptedKey!)
      if (recipient.unprotectedHeader || parameters)
        target.header = { ...recipient.unprotectedHeader, ...parameters }
    }

    return jwe as types.GeneralJWE
  }
}
