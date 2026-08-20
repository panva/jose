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
import { checkDisjoint, checkEncryptHeaders, encryptJWE } from '../../lib/jwe_encrypt.js'
import type { CheckedHeaders, EncryptInput } from '../../lib/jwe_encrypt.js'
import { prepareKey } from '../../lib/key.js'
import { jweAlgorithm } from '../../lib/jwe_algorithms.js'

/** Used to build General JWE object's individual recipients. */
export interface Recipient {
  /**
   * Sets the JWE Per-Recipient Unprotected Header on the Recipient object.
   *
   * @param unprotectedHeader JWE Per-Recipient Unprotected Header.
   */
  setUnprotectedHeader(unprotectedHeader: types.JWEHeaderParameters): Recipient

  /**
   * Sets the JWE Key Management parameters to be used when encrypting. Use this method instead of
   * the header setters to configure algorithm inputs such as ECDH-ES "apu" (Agreement PartyUInfo)
   * and "apv" (Agreement PartyVInfo), or PBES2 "p2c" (PBES2 Count). The parameters are added to the
   * appropriate JOSE Header.
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

function copyOptionalMembers(
  flattened: types.FlattenedJWE,
  jwe: types.GeneralJWE,
  recipient: types.GeneralJWE['recipients'][number],
) {
  const { aad, protected: protectedHeader, unprotected, header } = flattened
  if (aad) jwe.aad = aad
  if (protectedHeader) jwe.protected = protectedHeader
  if (unprotected) jwe.unprotected = unprotected
  if (header) recipient.header = header
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
    const recipient = new IndividualRecipient(this, key, options?.crit)
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
      const [unprotectedHeader, keyManagementParameters, key, crit] = recipient.state

      const flattened = await new FlattenedEncrypt(this.#plaintext)
        .setAdditionalAuthenticatedData(this.#aad)
        .setProtectedHeader(this.#protectedHeader)
        .setSharedUnprotectedHeader(this.#unprotectedHeader)
        .setUnprotectedHeader(unprotectedHeader!)
        .setKeyManagementParameters(keyManagementParameters!)
        .encrypt(key, { crit })

      const jwe: types.GeneralJWE = {
        ciphertext: flattened.ciphertext,
        iv: flattened.iv,
        recipients: [{}],
        tag: flattened.tag,
      }

      if (flattened.encrypted_key) jwe.recipients[0].encrypted_key = flattened.encrypted_key
      copyOptionalMembers(flattened, jwe, jwe.recipients[0])

      return jwe
    }

    let enc!: string
    let protectedHeader = this.#protectedHeader
    let sharedUnprotectedHeader = this.#unprotectedHeader
    const inputs: EncryptInput[] = []
    const checked: CheckedHeaders[] = []
    for (let i = 0; i < this.#recipients.length; i++) {
      const recipient = this.#recipients[i]
      const [unprotectedHeader, keyManagementParameters, , crit] = recipient.state

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
        true,
      ]
      const headers = checkEncryptHeaders(input)
      inputs.push(input)
      checked.push(headers)

      if (i === 0) {
        protectedHeader = input[1]!
        sharedUnprotectedHeader = input[3]!
      }

      if (headers[1] === 'dir' || headers[1] === 'ECDH-ES') {
        throw new JWEInvalid(`"${headers[1]}" alg may only have a single recipient`)
      }

      if (!enc) {
        enc = headers[2]
      } else if (enc !== headers[2]) {
        throw new JWEInvalid(
          'JWE "enc" (Encryption Algorithm) Header Parameter must be the same for all recipients',
        )
      }
    }

    const cek = generateCek(checked[0][3])

    const jwe: types.GeneralJWE = {
      ciphertext: '',
      recipients: [],
    }

    for (let i = 0; i < this.#recipients.length; i++) {
      const recipient = this.#recipients[i]
      const [, keyManagementParameters, key] = recipient.state
      const target: Record<string, string | types.JWEHeaderParameters> = {}
      jwe.recipients.push(target)

      if (i === 0) {
        inputs[0][5] = cek
        const flattened = await encryptJWE(inputs[0], checked[0], key)

        jwe.ciphertext = flattened.ciphertext
        jwe.iv = flattened.iv
        jwe.tag = flattened.tag

        target.encrypted_key = flattened.encrypted_key!
        copyOptionalMembers(flattened, jwe, target)

        continue
      }

      const [, alg, , encEntry] = checked[i]
      const unprotectedHeader = inputs[i][2]

      const k = await prepareKey(jweAlgorithm(alg), key, 'encrypt')
      const [, encryptedKey, parameters] = await encryptKeyManagement(
        alg,
        encEntry,
        k,
        cek,
        keyManagementParameters,
      )
      target.encrypted_key = b64u(encryptedKey!)
      if (unprotectedHeader || parameters) {
        const header: types.JWEHeaderParameters = { ...unprotectedHeader, ...parameters }
        // The generated Key Management Parameters join the JWE Per-Recipient Unprotected Header
        // only after the headers were checked, so a name they collide with in another header would
        // otherwise reach the result.
        if (parameters) checkDisjoint(inputs[i][1], header, inputs[i][3])
        target.header = header
      }
    }

    return jwe as types.GeneralJWE
  }
}
