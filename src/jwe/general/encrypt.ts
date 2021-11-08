import { FlattenedEncrypt, unprotected } from '../flattened/encrypt.js'
import { JWEInvalid } from '../../util/errors.js'
import generateCek from '../../lib/cek.js'
import isDisjoint from '../../lib/is_disjoint.js'
import encryptKeyManagement from '../../lib/encrypt_key_management.js'
import { encode as base64url } from '../../runtime/base64url.js'
import validateCrit from '../../lib/validate_crit.js'

import type {
  KeyLike,
  GeneralJWE,
  JWEHeaderParameters,
  CritOption,
  DeflateOption,
} from '../../types.d'

export interface Recipient {
  /**
   * Sets the JWE Per-Recipient Unprotected Header on the Recipient object.
   *
   * @param unprotectedHeader JWE Per-Recipient Unprotected Header.
   */
  setUnprotectedHeader(unprotectedHeader: JWEHeaderParameters): Recipient
}

interface RecipientReference {
  unprotectedHeader?: JWEHeaderParameters
  options?: CritOption
  key: KeyLike | Uint8Array
}

const recipientRef: WeakMap<IndividualRecipient, RecipientReference> = new WeakMap()

class IndividualRecipient implements Recipient {
  setUnprotectedHeader(unprotectedHeader: JWEHeaderParameters) {
    if (this._unprotectedHeader) {
      throw new TypeError('setUnprotectedHeader can only be called once')
    }
    this._unprotectedHeader = unprotectedHeader
    return this
  }

  private set _unprotectedHeader(value: JWEHeaderParameters) {
    recipientRef.get(this)!.unprotectedHeader = value
  }

  private get _unprotectedHeader(): JWEHeaderParameters {
    return recipientRef.get(this)!.unprotectedHeader!
  }
}

/**
 * The GeneralEncrypt class is a utility for creating General JWE objects.
 *
 * @example Usage
 * ```js
 * const encoder = new TextEncoder()
 *
 * const encrypt = new GeneralEncrypt(encoder.encode('It’s a dangerous business, Frodo, going out your door.'))
 *   .setProtectedHeader({ enc: 'A256GCM' })
 *
 * encrypt
 *   .addRecipient(ecPrivateKey)
 *   .setUnprotectedHeader({ alg: 'ECDH-ES+A256KW' })
 *
 * encrypt
 *   .addRecipient(rsaPrivateKey)
 *   .setUnprotectedHeader({ alg: 'RSA-OAEP-384' })
 *
 * const jwe = await encrypt.encrypt()
 * ```
 *
 * @example ESM import
 * ```js
 * import { GeneralEncrypt } from 'jose'
 * ```
 *
 * @example CJS import
 * ```js
 * const { GeneralEncrypt } = require('jose')
 * ```
 *
 * @example Deno import
 * ```js
 * import { GeneralEncrypt } from 'https://deno.land/x/jose@VERSION/index.ts'
 * ```
 */
export class GeneralEncrypt {
  private _plaintext: Uint8Array

  private _recipients: IndividualRecipient[] = []

  private _protectedHeader!: JWEHeaderParameters

  private _unprotectedHeader!: JWEHeaderParameters

  private _aad!: Uint8Array

  /**
   * @param plaintext Binary representation of the plaintext to encrypt.
   */
  constructor(plaintext: Uint8Array) {
    this._plaintext = plaintext
  }

  /**
   * Adds an additional recipient for the General JWE object.
   *
   * @param key Public Key or Secret to encrypt the Content Encryption Key for the recipient with.
   * @param options JWE Encryption options.
   */
  addRecipient(key: KeyLike | Uint8Array, options?: CritOption): Recipient {
    const recipient = new IndividualRecipient()
    recipientRef.set(recipient, { key, options: { crit: options?.crit } })
    this._recipients.push(recipient)
    return recipient
  }

  /**
   * Sets the JWE Protected Header on the GeneralEncrypt object.
   *
   * @param protectedHeader JWE Protected Header object.
   */
  setProtectedHeader(protectedHeader: JWEHeaderParameters): this {
    if (this._protectedHeader) {
      throw new TypeError('setProtectedHeader can only be called once')
    }
    this._protectedHeader = protectedHeader
    return this
  }

  /**
   * Sets the JWE Shared Unprotected Header on the GeneralEncrypt object.
   *
   * @param sharedUnprotectedHeader JWE Shared Unprotected Header object.
   */
  setSharedUnprotectedHeader(sharedUnprotectedHeader: JWEHeaderParameters): this {
    if (this._unprotectedHeader) {
      throw new TypeError('setSharedUnprotectedHeader can only be called once')
    }
    this._unprotectedHeader = sharedUnprotectedHeader
    return this
  }

  /**
   * Sets the Additional Authenticated Data on the GeneralEncrypt object.
   *
   * @param aad Additional Authenticated Data.
   */
  setAdditionalAuthenticatedData(aad: Uint8Array) {
    this._aad = aad
    return this
  }

  /**
   * Encrypts and resolves the value of the General JWE object.
   *
   * @param options JWE Encryption options.
   */
  async encrypt(options?: DeflateOption): Promise<GeneralJWE> {
    if (!this._recipients.length) {
      throw new JWEInvalid('at least one recipient must be added')
    }

    options = { deflateRaw: options?.deflateRaw }

    if (this._recipients.length === 1) {
      const {
        unprotectedHeader,
        options: recipientOpts,
        key,
      } = recipientRef.get(this._recipients[0])!

      const flattened = await new FlattenedEncrypt(this._plaintext)
        .setAdditionalAuthenticatedData(this._aad)
        .setProtectedHeader(this._protectedHeader)
        .setSharedUnprotectedHeader(this._unprotectedHeader)
        .setUnprotectedHeader(unprotectedHeader!)
        .encrypt(key, { ...recipientOpts, ...options })

      let jwe: GeneralJWE = {
        ciphertext: flattened.ciphertext,
        iv: flattened.iv,
        recipients: [{}],
        tag: flattened.tag,
      }

      if (flattened.aad) jwe.aad = flattened.aad
      if (flattened.protected) jwe.protected = flattened.protected
      if (flattened.unprotected) jwe.unprotected = flattened.unprotected
      if (flattened.encrypted_key) jwe.recipients![0].encrypted_key = flattened.encrypted_key
      if (flattened.header) jwe.recipients![0].header = flattened.header

      return jwe
    }

    let enc!: string
    for (let i = 0; i < this._recipients.length; i++) {
      const recipient = this._recipients[i]
      const { unprotectedHeader, options: recipientOpts } = recipientRef.get(recipient)!
      if (!isDisjoint(this._protectedHeader, this._unprotectedHeader, unprotectedHeader)) {
        throw new JWEInvalid(
          'JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint',
        )
      }

      const joseHeader = {
        ...this._protectedHeader,
        ...this._unprotectedHeader,
        ...unprotectedHeader,
      }

      const { alg } = joseHeader

      if (typeof alg !== 'string' || !alg) {
        throw new JWEInvalid('JWE "alg" (Algorithm) Header Parameter missing or invalid')
      }

      if (alg === 'dir' || alg === 'ECDH-ES') {
        throw new JWEInvalid('"dir" and "ECDH-ES" alg may only be used with a single recipient')
      }

      if (typeof joseHeader.enc !== 'string' || !joseHeader.enc) {
        throw new JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid')
      }

      if (!enc) {
        enc = joseHeader.enc
      } else if (enc !== joseHeader.enc) {
        throw new JWEInvalid(
          'JWE "enc" (Encryption Algorithm) Header Parameter must be the same for all recipients',
        )
      }

      validateCrit(JWEInvalid, new Map(), recipientOpts?.crit, this._protectedHeader, joseHeader)

      if (joseHeader.zip !== undefined) {
        if (!this._protectedHeader || !this._protectedHeader.zip) {
          throw new JWEInvalid(
            'JWE "zip" (Compression Algorithm) Header MUST be integrity protected',
          )
        }
      }
    }

    const cek = generateCek(enc)

    let jwe: GeneralJWE = {
      ciphertext: '',
      iv: '',
      recipients: [],
      tag: '',
    }
    for (let i = 0; i < this._recipients.length; i++) {
      const recipient = this._recipients[i]
      const target: Record<string, string | JWEHeaderParameters> = {}
      jwe.recipients!.push(target)
      const { unprotectedHeader, options: recipientOpts, key } = recipientRef.get(recipient)!

      if (i === 0) {
        const flattened = await new FlattenedEncrypt(this._plaintext)
          .setAdditionalAuthenticatedData(this._aad)
          .setContentEncryptionKey(cek)
          .setProtectedHeader(this._protectedHeader)
          .setSharedUnprotectedHeader(this._unprotectedHeader)
          .setUnprotectedHeader(unprotectedHeader!)
          // @ts-expect-error
          .encrypt(key, { ...recipientOpts, ...options, [unprotected]: true })

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

      const { encryptedKey, parameters } = await encryptKeyManagement(
        unprotectedHeader?.alg! || this._protectedHeader?.alg! || this._unprotectedHeader?.alg!,
        enc,
        key,
        cek,
      )
      target.encrypted_key = base64url(encryptedKey!)
      if (unprotectedHeader || parameters) target.header = { ...unprotectedHeader, ...parameters }
    }

    return <GeneralJWE>jwe
  }
}
