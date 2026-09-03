import type * as types from '../../types.d.ts'
import type {
  JWEAlgorithmSelection,
  JWECompressionAlgorithmOf,
  JWEContentEncryptionAlgorithmOf,
  JWEKeyManagementAlgorithmOf,
} from '../../algorithms/types.js'

/** A JWE header with IntelliSense for the algorithms supplied to a composer. */
export interface ComposedJWEHeader<Factories extends JWEAlgorithmSelection>
  extends types.JWEHeaderParameters {
  alg?: JWEKeyManagementAlgorithmOf<Factories> | (string & {})
  enc?: JWEContentEncryptionAlgorithmOf<Factories> | (string & {})
  zip?: JWECompressionAlgorithmOf<Factories> | (string & {})
}

/** A Compact JWE header with IntelliSense for the algorithms supplied to a composer. */
export interface ComposedCompactJWEHeader<Factories extends JWEAlgorithmSelection>
  extends types.CompactJWEHeaderParameters {
  alg: JWEKeyManagementAlgorithmOf<Factories> | (string & {})
  enc: JWEContentEncryptionAlgorithmOf<Factories> | (string & {})
  zip?: JWECompressionAlgorithmOf<Factories> | (string & {})
}

/** A JWT JWE header with IntelliSense for the algorithms supplied to a composer. */
export type ComposedJWTHeader<Factories extends JWEAlgorithmSelection> =
  ComposedCompactJWEHeader<Factories>

/** JWE decrypt options with IntelliSense for the algorithms supplied to a composer. */
export type ComposedDecryptOptions<Factories extends JWEAlgorithmSelection> = Omit<
  types.DecryptOptions,
  'keyManagementAlgorithms' | 'contentEncryptionAlgorithms'
> & {
  keyManagementAlgorithms?: readonly (JWEKeyManagementAlgorithmOf<Factories> | (string & {}))[]
  contentEncryptionAlgorithms?: readonly (
    JWEContentEncryptionAlgorithmOf<Factories> | (string & {})
  )[]
}

interface KeyManagementConfiguration {
  /**
   * Sets the JWE Key Management parameters to be used when encrypting. Use this method instead of
   * the header setters to configure algorithm inputs such as ECDH-ES "apu" (Agreement PartyUInfo)
   * and "apv" (Agreement PartyVInfo), or PBES2 "p2c" (PBES2 Count). The parameters are added to the
   * appropriate JOSE Header.
   *
   * @param parameters JWE Key Management parameters.
   */
  setKeyManagementParameters(parameters: types.JWEKeyManagementHeaderParameters): this
}

interface ContentEncryptionConfiguration {
  /**
   * Sets a content encryption key to use, by default a random suitable one is generated for the JWE
   * "enc" (Encryption Algorithm) Header Parameter.
   *
   * @deprecated You should not use this method. It is only really intended for test and vector
   *   validation purposes.
   *
   * @param cek JWE Content Encryption Key.
   */
  setContentEncryptionKey(cek: Uint8Array): this

  /**
   * Sets the JWE Initialization Vector to use for content encryption, by default a random suitable
   * one is generated for the JWE "enc" (Encryption Algorithm) Header Parameter.
   *
   * @deprecated You should not use this method. It is only really intended for test and vector
   *   validation purposes.
   *
   * @param iv JWE Initialization Vector.
   */
  setInitializationVector(iv: Uint8Array): this
}

/** A Compact JWE encryptor whose protected header suggests the selected algorithms. */
export interface ComposedCompactEncrypt<Header>
  extends
    KeyManagementConfiguration,
    ContentEncryptionConfiguration,
    types.SetProtectedHeader<Header>,
    types.EncryptWith<string> {}

/** Constructor for a Compact JWE encryptor with the selected header type. */
export interface ComposedCompactEncryptConstructor<Header> extends types.EncryptConstructor<
  ComposedCompactEncrypt<Header>
> {}

/** A Flattened JWE encryptor whose headers suggest the selected algorithms. */
export interface ComposedFlattenedEncrypt<Header extends types.JWEHeaderParameters>
  extends
    KeyManagementConfiguration,
    ContentEncryptionConfiguration,
    types.SetProtectedHeader<Header>,
    types.SetSharedUnprotectedHeader<Header>,
    types.SetUnprotectedHeader<Header>,
    types.SetAdditionalAuthenticatedData,
    types.EncryptWith<types.FlattenedJWE> {}

/** Constructor for a Flattened JWE encryptor with the selected header type. */
export interface ComposedFlattenedEncryptConstructor<
  Header extends types.JWEHeaderParameters,
> extends types.EncryptConstructor<ComposedFlattenedEncrypt<Header>> {}

/** Used to build a General JWE object's individual recipients. */
export interface ComposedGeneralEncryptRecipient<Header extends types.JWEHeaderParameters>
  extends KeyManagementConfiguration, types.SetUnprotectedHeader<Header> {
  /**
   * A shorthand for calling {@link ComposedGeneralEncrypt.addRecipient addRecipient()} on the
   * enclosing GeneralEncrypt instance.
   *
   * @param key Public Key or Secret to encrypt the Content Encryption Key for the recipient with.
   *   See {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
   * @param options JWE Encryption options.
   */
  addRecipient(
    key: types.KeyInput,
    options?: types.CritOption,
  ): ComposedGeneralEncryptRecipient<Header>

  /**
   * A shorthand for calling `encrypt()` on the enclosing `GeneralEncrypt` instance. Takes no
   * arguments — each recipient's key is supplied to `addRecipient()`.
   */
  encrypt(): Promise<types.GeneralJWE>

  /** Returns the enclosing GeneralEncrypt instance. */
  done(): ComposedGeneralEncrypt<Header>
}

/** A General JWE encryptor whose headers suggest the selected algorithms. */
export interface ComposedGeneralEncrypt<Header extends types.JWEHeaderParameters>
  extends
    types.SetProtectedHeader<Header>,
    types.SetSharedUnprotectedHeader<Header>,
    types.SetAdditionalAuthenticatedData {
  /**
   * Adds an additional recipient for the General JWE object.
   *
   * @param key Public Key or Secret to encrypt the Content Encryption Key for the recipient with.
   *   See {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
   * @param options JWE Encryption options.
   */
  addRecipient(
    key: types.KeyInput,
    options?: types.CritOption,
  ): ComposedGeneralEncryptRecipient<Header>

  /** Encrypts and resolves the value of the General JWE object. */
  encrypt(): Promise<types.GeneralJWE>
}

/** Constructor for a General JWE encryptor with the selected header type. */
export interface ComposedGeneralEncryptConstructor<
  Header extends types.JWEHeaderParameters,
> extends types.EncryptConstructor<ComposedGeneralEncrypt<Header>> {}

/** A Compact JWE decryption result with header suggestions from the selected algorithms. */
export type ComposedCompactDecryptResult<Factories extends JWEAlgorithmSelection> = Omit<
  types.CompactDecryptResult,
  'protectedHeader'
> & { protectedHeader: ComposedCompactJWEHeader<Factories> }

/** A Flattened JWE decryption result with header suggestions from the selected algorithms. */
export type ComposedFlattenedDecryptResult<Factories extends JWEAlgorithmSelection> = Omit<
  types.FlattenedDecryptResult,
  'protectedHeader' | 'sharedUnprotectedHeader' | 'unprotectedHeader'
> & {
  protectedHeader?: ComposedJWEHeader<Factories>
  sharedUnprotectedHeader?: ComposedJWEHeader<Factories>
  unprotectedHeader?: ComposedJWEHeader<Factories>
}

/** A General JWE decryption result with header suggestions from the selected algorithms. */
export type ComposedGeneralDecryptResult<Factories extends JWEAlgorithmSelection> =
  ComposedFlattenedDecryptResult<Factories>

/** An encrypted JWT producer whose protected header suggests the selected algorithms. */
export interface ComposedEncryptJWT<Header>
  extends
    types.ProduceJWT,
    KeyManagementConfiguration,
    ContentEncryptionConfiguration,
    types.SetProtectedHeader<Header>,
    types.EncryptWith<string> {
  /**
   * Replicates the "iss" (Issuer) Claim as a JWE Protected Header Parameter.
   *
   * @see {@link https://www.rfc-editor.org/info/rfc7519/#section-5.3 RFC7519#section-5.3}
   */
  replicateIssuerAsHeader(): this

  /**
   * Replicates the "sub" (Subject) Claim as a JWE Protected Header Parameter.
   *
   * @see {@link https://www.rfc-editor.org/info/rfc7519/#section-5.3 RFC7519#section-5.3}
   */
  replicateSubjectAsHeader(): this

  /**
   * Replicates the "aud" (Audience) Claim as a JWE Protected Header Parameter.
   *
   * @see {@link https://www.rfc-editor.org/info/rfc7519/#section-5.3 RFC7519#section-5.3}
   */
  replicateAudienceAsHeader(): this
}

/** Constructor for an encrypted JWT producer with the selected header type. */
export interface ComposedEncryptJWTConstructor<Header> extends types.JWTConstructor<
  ComposedEncryptJWT<Header>
> {}
