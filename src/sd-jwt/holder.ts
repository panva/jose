/**
 * Selective Disclosure for JWTs (SD-JWT) Holder
 *
 * @module
 */

import type * as types from '../types.d.ts'
import { calculateSdHash, selectDisclosures, type DisclosureDetail } from '../lib/sd.js'
import { isJWK } from '../lib/type_checks.js'
import { SignJWT } from '../jwt/sign.js'
import { JWTInvalid } from '../util/errors.js'
import {
  assertDisclosurePointer,
  disclosurePath,
  disclosureValue,
  formatSDJWT,
  parseSDJWT,
  verifySDJWTIssuer,
  type SDJWTInput,
  type SDJWTSerialization,
} from './internal.js'
import type { SDJWTIssuerGetKey, SDJWTIssuerKey } from '../types.d.ts'

type SDJWTIssuerKeyLike = SDJWTIssuerKey | SDJWTIssuerGetKey

/**
 * Options used when an Issuer-signed SD-JWT is received by a Holder. When `typ` is expected, it
 * must be carried in the integrity-protected header.
 */
export interface SDJWTReceiveOptions
  extends types.VerifyOptions, types.JWTClaimVerificationOptions {}

/** Metadata for a Disclosure available to a Holder or processed by a Verifier. */
export interface SDJWTDisclosure {
  /**
   * Base64url-encoded digest of this Disclosure referenced from the Issuer-signed JWT. This is
   * metadata, not a selector; use {@link path} when choosing a Disclosure.
   */
  digest: string

  /**
   * Object member name for an object-property Disclosure. This is absent for array-element
   * Disclosures and is not unique; use {@link path} to locate or select a Disclosure.
   */
  key?: string

  /**
   * Value at {@link path} after recursively applying the Disclosures processed by the same
   * operation. A disclosed container can include revealed descendants and omit unrevealed ones.
   */
  value: unknown

  /**
   * RFC 6901 JSON Pointer locating this Disclosure's value in the processed payload returned by the
   * same operation. Credential paths can be passed to `credential.present()`. Selecting a nested
   * Disclosure also presents its recursively disclosed parents.
   *
   * Array indices describe the processed payload. They can therefore change in Verifier results
   * when earlier selectively disclosable elements are not presented. For example, presenting only
   * the Disclosure at credential path `/items/1` can produce Verifier metadata at `/items/0`.
   *
   * @example Inspect and select an available Disclosure
   *
   * ```js
   * const street = credential.disclosures.find(({ path }) => path === '/address/street')
   * if (street) {
   *   const presentation = await credential.present([street.path])
   * }
   * ```
   */
  path: string
}

/** Private asymmetric key accepted when signing an RFC 9901 Key Binding JWT. */
export type SDJWTHolderSigningKey = types.CryptoKey | types.KeyObject | types.JWK

/** Builds a Key Binding JWT for an SD-JWT presentation. */
export interface SDJWTKeyBinding<SerializationType extends types.SDJWT = types.SDJWT> {
  /**
   * Sets custom Key Binding JWT Claims. The `aud`, `nonce`, `iat`, and `sd_hash` claims are managed
   * through dedicated builder methods or by the library and must not be included. RFC 9901
   * recommends avoiding additional Key Binding JWT claims unless an application profile or another
   * compelling reason requires them.
   */
  setPayload(payload: types.JWTPayload): this

  /**
   * Sets the Key Binding JWT Protected Header. A digital-signature `alg` is required and `typ` is
   * set to `kb+jwt`.
   */
  setProtectedHeader(protectedHeader: types.JWTHeaderParameters): this

  /** Sets the intended Verifier identifier as the Key Binding JWT `aud` claim. */
  setAudience(audience: string): this

  /**
   * Sets the fresh transaction nonce supplied by the Verifier. The Verifier is responsible for
   * securely issuing and consuming the nonce to prevent replay.
   */
  setNonce(nonce: string): this

  /**
   * Sets the Key Binding JWT `iat` claim. The current time is used when this method is omitted or
   * called without an argument.
   */
  setIssuedAt(input?: number | string | Date): this

  /**
   * Creates a presentation containing the Disclosures selected by `paths` and the configured Key
   * Binding. Omitting `paths` or passing an empty array includes no Disclosures; the Key Binding
   * JWT is still created.
   */
  present(paths?: readonly string[]): Promise<SerializationType>
}

/**
 * A verified Issuer-signed SD-JWT held together with all supplied and successfully processed
 * Disclosures. A Holder cannot determine whether the Issuer supplied every non-decoy Disclosure.
 * Values exposed by a credential are ordinary mutable JavaScript values. Presentation operations
 * use separate internal snapshots and are not affected by mutations to those exposed values.
 */
export interface SDJWTCredential<
  PayloadType = types.JWTPayload,
  SerializationType extends types.SDJWT = types.SDJWT,
> {
  /**
   * Processed SD-JWT Payload containing permanently disclosed claims and every successfully
   * processed Disclosure, with `_sd` and `_sd_alg` removed.
   */
  payload: PayloadType & types.JWTPayload

  /** Protected header of the successfully verified Issuer signature, if present. */
  protectedHeader?: types.JWSHeaderParameters

  /**
   * Unprotected header of the successfully verified Issuer signature, if present. Except for the
   * RFC 9901 transport parameters whose contents are validated separately, its members are not
   * integrity protected and must not drive security decisions.
   */
  unprotectedHeader?: types.JWSHeaderParameters

  /** Metadata for all Disclosures received from the Issuer. */
  disclosures: SDJWTDisclosure[]

  /** Key resolved by a dynamic Issuer key resolver. */
  key?: types.CryptoKey

  /**
   * Creates a presentation without Key Binding. `paths` must contain exact values exposed by this
   * credential's `disclosures`. Omitting `paths` or passing an empty array includes no Disclosures.
   * The credential is reusable and the output preserves its Compact, Flattened JSON, or General
   * JSON serialization. A bare SD-JWT does not integrity protect the selected set of Disclosures
   * and can be forwarded or reduced by an intermediary; use Key Binding when that is not
   * acceptable.
   *
   * Selecting a recursively disclosed child automatically includes its parent Disclosure. Any
   * cleartext siblings inside that parent are revealed with it.
   */
  present(paths?: readonly string[]): Promise<SerializationType>

  /**
   * Adds a Key Binding JWT to a presentation. This returns a fresh child builder and does not
   * mutate the credential. The private key must correspond to the confirmation method in the
   * Issuer-signed SD-JWT (for example, its `cnf.jwk`); the builder does not establish that
   * association, but the Verifier checks it.
   *
   * @example
   *
   * ```js
   * const presentation = await credential
   *   .addKeyBinding(holderPrivateKey)
   *   .setProtectedHeader({ alg: 'ES256' })
   *   .setAudience('https://verifier.example')
   *   .setNonce(nonce)
   *   .setIssuedAt()
   *   .present(['/given_name'])
   * ```
   *
   * @param key Private asymmetric key used to sign the Key Binding JWT.
   * @param options JWS signing options.
   */
  addKeyBinding(
    key: SDJWTHolderSigningKey,
    options?: types.SignOptions,
  ): SDJWTKeyBinding<SerializationType>
}

function assertAsymmetricSigningKey(key: SDJWTHolderSigningKey): void {
  if (key instanceof Uint8Array) {
    throw new TypeError('Key Binding JWTs must use an asymmetric signing key')
  }

  if (isJWK(key) && key.kty === 'oct') {
    throw new TypeError('Key Binding JWTs must use an asymmetric signing key')
  }

  if ((key as { type?: unknown }).type === 'secret') {
    throw new TypeError('Key Binding JWTs must use an asymmetric signing key')
  }
}

function assertKeyBindingProtectedHeader(
  protectedHeader: types.JWTHeaderParameters | undefined,
): asserts protectedHeader is types.JWTHeaderParameters {
  if (!protectedHeader || typeof protectedHeader !== 'object') {
    throw new TypeError('Key Binding protectedHeader is required')
  }

  const { alg, typ } = protectedHeader
  if (typeof alg !== 'string' || !alg || alg === 'none' || alg.startsWith('HS')) {
    throw new TypeError('Key Binding JWTs must use a digital signature algorithm')
  }
  if (typ !== undefined && typ !== 'kb+jwt') {
    throw new TypeError('Key Binding JWT typ must be "kb+jwt"')
  }
}

function cloneDisclosureDetails(details: readonly DisclosureDetail[]): DisclosureDetail[] {
  return structuredClone(details) as DisclosureDetail[]
}

type VerifiedCredential<PayloadType> = Awaited<ReturnType<typeof verifySDJWTIssuer<PayloadType>>>

interface KeyBindingConfiguration {
  key: SDJWTHolderSigningKey
  options?: types.SignOptions
  payload: types.JWTPayload
  protectedHeader?: types.JWTHeaderParameters
  audience?: string
  nonce?: string
  issuedAt?: number | string | Date
  issuedAtSet: boolean
}

type KeyBindingPresenter<SerializationType extends types.SDJWT> = (
  paths: readonly string[] | undefined,
  configuration: KeyBindingConfiguration,
) => Promise<SerializationType>

class SDJWTKeyBindingBuilder<
  SerializationType extends types.SDJWT,
> implements SDJWTKeyBinding<SerializationType> {
  #presenter: KeyBindingPresenter<SerializationType>
  #configuration: KeyBindingConfiguration

  constructor(
    presenter: KeyBindingPresenter<SerializationType>,
    key: SDJWTHolderSigningKey,
    options?: types.SignOptions,
  ) {
    this.#presenter = presenter
    this.#configuration = {
      key,
      options: options === undefined ? undefined : structuredClone(options),
      payload: {},
      issuedAtSet: false,
    }
  }

  setPayload(payload: types.JWTPayload): this {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new TypeError('Key Binding JWT Claims Set must be an object')
    }
    for (const claim of ['aud', 'nonce', 'iat', 'sd_hash']) {
      if (Object.hasOwn(payload, claim)) {
        throw new TypeError(`Key Binding JWT ${claim} is managed by the builder`)
      }
    }
    this.#configuration.payload = structuredClone(payload)
    return this
  }

  setProtectedHeader(protectedHeader: types.JWTHeaderParameters): this {
    this.#configuration.protectedHeader = structuredClone(protectedHeader)
    return this
  }

  setAudience(audience: string): this {
    if (typeof audience !== 'string' || !audience) {
      throw new TypeError('Key Binding audience must be a non-empty string')
    }
    this.#configuration.audience = audience
    return this
  }

  setNonce(nonce: string): this {
    if (typeof nonce !== 'string' || !nonce) {
      throw new TypeError('Key Binding nonce must be a non-empty string')
    }
    this.#configuration.nonce = nonce
    return this
  }

  setIssuedAt(input?: number | string | Date): this {
    this.#configuration.issuedAt = input instanceof Date ? new Date(input) : input
    this.#configuration.issuedAtSet = true
    return this
  }

  present(paths?: readonly string[]): Promise<SerializationType> {
    const configuration: KeyBindingConfiguration = {
      ...this.#configuration,
      key: this.#configuration.key,
      options:
        this.#configuration.options === undefined
          ? undefined
          : structuredClone(this.#configuration.options),
      payload: structuredClone(this.#configuration.payload),
      protectedHeader:
        this.#configuration.protectedHeader === undefined
          ? undefined
          : structuredClone(this.#configuration.protectedHeader),
      issuedAt:
        this.#configuration.issuedAt instanceof Date
          ? new Date(this.#configuration.issuedAt)
          : this.#configuration.issuedAt,
    }
    return this.#presenter(paths, configuration)
  }
}

class SDJWTCredentialImplementation<PayloadType, SerializationType extends types.SDJWT> {
  payload: PayloadType & types.JWTPayload
  declare protectedHeader?: types.JWSHeaderParameters
  declare unprotectedHeader?: types.JWSHeaderParameters
  disclosures: SDJWTDisclosure[]
  declare key?: types.CryptoKey

  #jws: SDJWTInput
  #details: DisclosureDetail[]
  #sdAlg: 'sha-256' | 'sha-384' | 'sha-512'

  constructor(verified: VerifiedCredential<PayloadType>) {
    this.payload = structuredClone(verified.payload)
    if (verified.protectedHeader !== undefined) {
      this.protectedHeader = structuredClone(verified.protectedHeader)
    }
    if (verified.unprotectedHeader !== undefined) {
      this.unprotectedHeader = structuredClone(verified.unprotectedHeader)
    }
    if (verified.key !== undefined) {
      this.key = verified.key
    }
    this.#jws = structuredClone(verified.parsed.jws)
    this.#details = cloneDisclosureDetails(verified.disclosureDetails)
    this.#sdAlg = verified.sdAlg
    this.disclosures = this.#details.map((detail) => ({
      digest: detail.digest,
      key: detail.key,
      value: structuredClone(disclosureValue(verified.payload as types.JWTPayload, detail)),
      path: disclosurePath(detail),
    }))
  }

  present(paths?: readonly string[]): Promise<SerializationType> {
    return this.#present(paths)
  }

  addKeyBinding(
    key: SDJWTHolderSigningKey,
    options?: types.SignOptions,
  ): SDJWTKeyBinding<SerializationType> {
    return new SDJWTKeyBindingBuilder(
      (paths, configuration) => this.#present(paths, configuration),
      key,
      options,
    )
  }

  async #present(
    inputPaths: readonly string[] | undefined,
    keyBinding?: KeyBindingConfiguration,
  ): Promise<SerializationType> {
    const paths = inputPaths === undefined ? [] : inputPaths
    if (!Array.isArray(paths)) {
      throw new TypeError('Disclosure paths must be an array of JSON Pointers')
    }

    const requested = new Set<string>()
    const available = new Set(this.#details.map(disclosurePath))
    for (const path of paths) {
      assertDisclosurePointer(path)
      if (requested.has(path)) {
        throw new TypeError(`Duplicate Disclosure path: ${path}`)
      }
      if (!available.has(path)) {
        throw new TypeError(`No Disclosure is available at path: ${path}`)
      }
      requested.add(path)
    }

    const selected = selectDisclosures(this.#details, (detail) =>
      requested.has(disclosurePath(detail)),
    )
    if (keyBinding === undefined) {
      return formatSDJWT(this.#jws, selected) as SerializationType
    }

    assertAsymmetricSigningKey(keyBinding.key)
    assertKeyBindingProtectedHeader(keyBinding.protectedHeader)

    const payload = structuredClone(keyBinding.payload)
    const audience = keyBinding.audience
    const nonce = keyBinding.nonce
    if (typeof audience !== 'string' || !audience) {
      throw new TypeError('Key Binding audience must be a non-empty string')
    }
    if (typeof nonce !== 'string' || !nonce) {
      throw new TypeError('Key Binding nonce must be a non-empty string')
    }

    const sdHash = await calculateSdHash(this.#jws, selected, this.#sdAlg)
    const signer = new SignJWT({
      ...payload,
      aud: audience,
      nonce,
      sd_hash: sdHash,
    }).setProtectedHeader({ ...keyBinding.protectedHeader, typ: 'kb+jwt' })

    if (keyBinding.issuedAtSet) {
      signer.setIssuedAt(keyBinding.issuedAt)
    } else {
      signer.setIssuedAt()
    }

    const kbJwt = await signer.sign(keyBinding.key, keyBinding.options)
    return formatSDJWT(this.#jws, selected, kbJwt) as SerializationType
  }
}

async function receiveSDJWT<PayloadType, SerializationType extends types.SDJWT>(
  sdJwt: SDJWTInput | Uint8Array,
  key: SDJWTIssuerKeyLike,
  options: SDJWTReceiveOptions,
  expectedSerialization: SDJWTSerialization,
): Promise<SDJWTCredential<PayloadType, SerializationType>> {
  const parsed = parseSDJWT(sdJwt)
  if (parsed.serialization !== expectedSerialization) {
    throw new JWTInvalid(`SD-JWT must use ${expectedSerialization} serialization`)
  }
  if (parsed.kbJwt !== undefined) {
    throw new JWTInvalid('Unexpected Key Binding JWT in SD-JWT received by Holder')
  }

  const verified = await verifySDJWTIssuer<PayloadType>(parsed, key, options)
  return new SDJWTCredentialImplementation<PayloadType, SerializationType>(
    verified,
  ) as SDJWTCredential<PayloadType, SerializationType>
}

/**
 * Verifies and processes a Compact serialized Issuer-provided SD-JWT for a Holder. The returned
 * credential always contains its `protectedHeader`. An SD-JWT+KB is rejected because the Holder,
 * not the Issuer, creates Key Binding JWTs.
 *
 * @example
 *
 * ```js
 * import { sdJwtReceive } from 'jose/sd-jwt'
 *
 * const credential = await sdJwtReceive(sdJwt, issuerPublicKey, {
 *   issuer: 'https://issuer.example',
 * })
 *
 * console.log(credential.payload)
 * console.log(credential.disclosures.map(({ path }) => path))
 *
 * const presentation = await credential.present(['/given_name'])
 * ```
 */
export function sdJwtReceive<PayloadType = types.JWTPayload>(
  sdJwt: string | Uint8Array,
  key: SDJWTIssuerKey,
  options?: SDJWTReceiveOptions,
): Promise<
  Omit<SDJWTCredential<PayloadType, string>, 'protectedHeader' | 'unprotectedHeader'> & {
    protectedHeader: types.JWTHeaderParameters
  }
>
export function sdJwtReceive<PayloadType = types.JWTPayload>(
  sdJwt: string | Uint8Array,
  getKey: SDJWTIssuerGetKey,
  options?: SDJWTReceiveOptions,
): Promise<
  Omit<SDJWTCredential<PayloadType, string>, 'protectedHeader' | 'unprotectedHeader'> & {
    protectedHeader: types.JWTHeaderParameters
  } & types.ResolvedKey
>
export function sdJwtReceive<PayloadType = types.JWTPayload>(
  sdJwt: string | Uint8Array,
  key: SDJWTIssuerKeyLike,
  options: SDJWTReceiveOptions = {},
): Promise<SDJWTCredential<PayloadType, string>> {
  return receiveSDJWT(sdJwt, key, options, 'compact')
}

/**
 * Verifies and processes a Flattened JWS JSON serialized Issuer-provided SD-JWT for a Holder.
 *
 * @example
 *
 * ```js
 * import { flattenedSdJwtReceive } from 'jose/sd-jwt'
 *
 * const credential = await flattenedSdJwtReceive(issued, issuerPublicKey)
 * const available = credential.disclosures.map(({ path }) => path)
 * const presentation = await credential.present(['/address/street'])
 * ```
 */
export function flattenedSdJwtReceive<PayloadType = types.JWTPayload>(
  sdJwt: types.FlattenedJWS,
  key: SDJWTIssuerKey,
  options?: SDJWTReceiveOptions,
): Promise<SDJWTCredential<PayloadType, types.FlattenedSDJWT>>
export function flattenedSdJwtReceive<PayloadType = types.JWTPayload>(
  sdJwt: types.FlattenedJWS,
  getKey: SDJWTIssuerGetKey,
  options?: SDJWTReceiveOptions,
): Promise<SDJWTCredential<PayloadType, types.FlattenedSDJWT> & types.ResolvedKey>
export function flattenedSdJwtReceive<PayloadType = types.JWTPayload>(
  sdJwt: types.FlattenedJWS,
  key: SDJWTIssuerKeyLike,
  options: SDJWTReceiveOptions = {},
): Promise<SDJWTCredential<PayloadType, types.FlattenedSDJWT>> {
  return receiveSDJWT(sdJwt, key, options, 'flattened')
}

/**
 * Verifies and processes a General JWS JSON serialized Issuer-provided SD-JWT for a Holder.
 *
 * @example
 *
 * ```js
 * import { generalSdJwtReceive } from 'jose/sd-jwt'
 *
 * const credential = await generalSdJwtReceive(issued, issuerPublicKey)
 * const presentation = await credential
 *   .addKeyBinding(holderPrivateKey)
 *   .setProtectedHeader({ alg: 'ES256' })
 *   .setAudience(audience)
 *   .setNonce(nonce)
 *   .setIssuedAt()
 *   .present(['/given_name'])
 * ```
 */
export function generalSdJwtReceive<PayloadType = types.JWTPayload>(
  sdJwt: types.GeneralJWS,
  key: SDJWTIssuerKey,
  options?: SDJWTReceiveOptions,
): Promise<SDJWTCredential<PayloadType, types.GeneralSDJWT>>
export function generalSdJwtReceive<PayloadType = types.JWTPayload>(
  sdJwt: types.GeneralJWS,
  getKey: SDJWTIssuerGetKey,
  options?: SDJWTReceiveOptions,
): Promise<SDJWTCredential<PayloadType, types.GeneralSDJWT> & types.ResolvedKey>
export function generalSdJwtReceive<PayloadType = types.JWTPayload>(
  sdJwt: types.GeneralJWS,
  key: SDJWTIssuerKeyLike,
  options: SDJWTReceiveOptions = {},
): Promise<SDJWTCredential<PayloadType, types.GeneralSDJWT>> {
  return receiveSDJWT(sdJwt, key, options, 'general')
}
