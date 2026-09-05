/**
 * Encrypting JSON Web Encryption (JWE) in General JSON Serialization
 *
 * @module
 */

import type * as types from '../../types.d.ts'
import { assertNotSet, assertUint8Array } from '../../lib/validate.js'
import { JWEInvalid } from '../../util/errors.js'
import { generateCek } from '../../lib/content_encryption.js'
import { encode as b64u } from '../../util/base64url.js'
import { checkDisjoint, checkEncryptHeaders, encryptJWE } from '../../lib/jwe_encrypt.js'
import { encryptKeyManagement } from '../../lib/key_management.js'
import type { CheckedHeaders, EncryptInput } from '../../lib/jwe_encrypt.js'
import { isJWECEKTransport, jweAlgorithm } from '../../lib/jwe_algorithms.js'
import type { JWECEKTransportAlgorithm } from '../../lib/jwe_algorithms.js'

/** Configures an individual recipient in a General JWE. */
export interface Recipient {
  /**
   * Sets the JWE Per-Recipient Unprotected Header. May only be called once.
   *
   * @param unprotectedHeader JWE Per-Recipient Unprotected Header.
   */
  setUnprotectedHeader(unprotectedHeader: types.JWEHeaderParameters): Recipient

  /**
   * Sets key management inputs such as ECDH-ES "apu"/"apv" or PBES2 "p2c". Use this method instead
   * of header setters; the resulting parameters are added to the JOSE header. May only be called
   * once.
   *
   * @param parameters JWE Key Management parameters.
   */
  setKeyManagementParameters(parameters: types.JWEKeyManagementHeaderParameters): Recipient

  /**
   * Adds another recipient to the enclosing {@link GeneralEncrypt} and returns its configuration.
   *
   * @param key Public key or shared secret. See
   *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
   * @param options JWE Encryption options.
   */
  addRecipient(key: types.KeyInput, options?: types.CritOption): Recipient

  /**
   * Encrypts for all recipients on the enclosing {@link GeneralEncrypt}, using their configured
   * keys.
   */
  encrypt(): Promise<types.GeneralJWE>

  /** Returns the enclosing {@link GeneralEncrypt} instance. */
  done(): GeneralEncrypt
}

type RecipientState = [
  unprotectedHeader: types.JWEHeaderParameters | undefined,
  keyManagementParameters: types.JWEKeyManagementHeaderParameters | undefined,
  key: types.KeyInput,
  crit: types.CritOption['crit'],
]

class IndividualRecipient implements Recipient {
  #parent: GeneralEncrypt
  state: RecipientState

  constructor(enc: GeneralEncrypt, key: types.KeyInput, crit: types.CritOption['crit']) {
    this.#parent = enc
    this.state = [undefined, undefined, key, crit]
  }

  setUnprotectedHeader(unprotectedHeader: types.JWEHeaderParameters): this {
    assertNotSet(this.state[0], 'setUnprotectedHeader')
    this.state[0] = unprotectedHeader
    return this
  }

  setKeyManagementParameters(parameters: types.JWEKeyManagementHeaderParameters): this {
    assertNotSet(this.state[1], 'setKeyManagementParameters')
    this.state[1] = parameters
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
 * Builds and encrypts General JWE objects.
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
   * Creates a General JWE encryptor.
   *
   * @param plaintext Binary representation of the plaintext to encrypt.
   */
  constructor(plaintext: Uint8Array) {
    this.#plaintext = plaintext
  }

  /**
   * Adds a recipient and returns its configuration.
   *
   * @param key Public key or shared secret. See
   *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
   * @param options JWE Encryption options.
   */
  addRecipient(key: types.KeyInput, options?: types.CritOption): Recipient {
    const recipient = new IndividualRecipient(this, key, options?.crit)
    this.#recipients.push(recipient)
    return recipient
  }

  /**
   * Sets the JWE Protected Header. May only be called once.
   *
   * @param protectedHeader JWE Protected Header object.
   */
  setProtectedHeader(protectedHeader: types.JWEHeaderParameters): this {
    assertNotSet(this.#protectedHeader, 'setProtectedHeader')
    this.#protectedHeader = protectedHeader
    return this
  }

  /**
   * Sets the JWE Shared Unprotected Header. May only be called once.
   *
   * @param sharedUnprotectedHeader JWE Shared Unprotected Header object.
   */
  setSharedUnprotectedHeader(sharedUnprotectedHeader: types.JWEHeaderParameters): this {
    assertNotSet(this.#unprotectedHeader, 'setSharedUnprotectedHeader')
    this.#unprotectedHeader = sharedUnprotectedHeader
    return this
  }

  /**
   * Sets additional data to authenticate without encrypting it.
   *
   * @param aad Additional Authenticated Data.
   */
  setAdditionalAuthenticatedData(aad: Uint8Array): this {
    this.#aad = aad
    return this
  }

  /** Encrypts the plaintext as a General JWE. */
  async encrypt(): Promise<types.GeneralJWE> {
    if (!this.#recipients.length) {
      throw new JWEInvalid('at least one recipient must be added')
    }

    assertUint8Array(this.#plaintext, 'plaintext')

    const multiple = this.#recipients.length > 1
    let enc: string | undefined
    let protectedHeader = this.#protectedHeader
    let sharedUnprotectedHeader = this.#unprotectedHeader
    const recipients: [input: EncryptInput, headers: CheckedHeaders, key: types.KeyInput][] = []
    for (const recipient of this.#recipients) {
      const [unprotectedHeader, keyManagementParameters, key, crit] = recipient.state

      const input: EncryptInput = [
        this.#plaintext,
        protectedHeader,
        unprotectedHeader,
        sharedUnprotectedHeader,
        this.#aad,
        undefined,
        undefined,
        keyManagementParameters,
        crit,
        multiple,
      ]
      const headers = checkEncryptHeaders(input)
      if (!recipients.length) {
        protectedHeader = input[1]!
        sharedUnprotectedHeader = input[3]!
      }
      recipients.push([input, headers, key])

      const [{ alg, enc: recipientEnc }, , algEntry] = headers
      if (multiple && algEntry && !isJWECEKTransport(algEntry)) {
        throw new JWEInvalid(`"${alg}" alg may only have a single recipient`)
      }

      if (!enc) {
        enc = recipientEnc
      } else if (enc !== recipientEnc) {
        throw new JWEInvalid(
          'JWE "enc" (Encryption Algorithm) Header Parameter must be the same for all recipients',
        )
      }
    }

    for (const [, headers] of recipients) {
      headers[2] ??= jweAlgorithm(headers[0].alg)
    }
    const [firstInput, firstHeaders, firstKey] = recipients[0]
    const cek = multiple ? generateCek(firstHeaders[1]!) : undefined
    firstInput[5] = cek
    const { encrypted_key, header, ...shared } = await encryptJWE(
      firstInput,
      firstHeaders,
      firstKey,
    )

    const jwe: types.GeneralJWE = {
      ...shared,
      recipients: [{}],
    }
    if (encrypted_key) jwe.recipients[0].encrypted_key = encrypted_key
    if (header) jwe.recipients[0].header = header

    for (let i = 1; i < recipients.length; i++) {
      const [input, [joseHeader, encEntry, algEntry], key] = recipients[i]
      const unprotectedHeader = input[2]

      const [, encryptedKey, parameters] = await encryptKeyManagement(
        algEntry as JWECEKTransportAlgorithm,
        encEntry!,
        key,
        joseHeader,
        cek,
        input[7],
      )
      const target: types.GeneralJWE['recipients'][number] = {
        encrypted_key: b64u(encryptedKey!),
      }
      if (unprotectedHeader || parameters) {
        const header: types.JWEHeaderParameters = { ...unprotectedHeader, ...parameters }
        // The generated Key Management Parameters join the JWE Per-Recipient Unprotected Header
        // only after the headers were checked, so a name they collide with in another header would
        // otherwise reach the result.
        if (parameters) checkDisjoint(input[1], header, input[3])
        target.header = header
      }
      jwe.recipients.push(target)
    }

    return jwe
  }
}
