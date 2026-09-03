/**
 * Encrypting JSON Web Encryption (JWE) in General JSON Serialization
 *
 * @module
 */

import type * as types from '../../types.d.ts'
import type {
  ComposedGeneralEncrypt,
  ComposedGeneralEncryptConstructor,
  ComposedGeneralEncryptRecipient,
} from '../../composable/jwe/types.js'
import { allJWEAlgorithms } from '../../lib/jwe_algorithms.js'
import { createGeneralEncryptClass } from '../../lib/jwe_serialization.js'

/** Used to build General JWE object's individual recipients. */
export interface Recipient extends Omit<
  ComposedGeneralEncryptRecipient<types.JWEHeaderParameters>,
  'setUnprotectedHeader' | 'setKeyManagementParameters' | 'addRecipient' | 'done'
> {
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

  /** Returns the enclosing {@link GeneralEncrypt} instance */
  done(): GeneralEncrypt
}

export interface GeneralEncrypt extends ComposedGeneralEncrypt<types.JWEHeaderParameters> {
  /**
   * Adds an additional recipient for the General JWE object.
   *
   * @param key Public Key or Secret to encrypt the Content Encryption Key for the recipient with.
   *   See {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
   * @param options JWE Encryption options.
   */
  addRecipient(key: types.KeyInput, options?: types.CritOption): Recipient
}

const GeneralEncryptBase: ComposedGeneralEncryptConstructor<types.JWEHeaderParameters> =
  createGeneralEncryptClass(allJWEAlgorithms)

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
export class GeneralEncrypt extends GeneralEncryptBase {
  declare private generalEncryptBrand: never

  /**
   * {@link GeneralEncrypt} constructor
   *
   * @param plaintext Binary representation of the plaintext to encrypt.
   */
  constructor(plaintext: Uint8Array) {
    super(plaintext)
  }
}
