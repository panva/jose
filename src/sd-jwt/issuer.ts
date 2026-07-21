/**
 * Selective Disclosure for JWTs (SD-JWT) Issuer
 *
 * @module
 */

import type * as types from '../types.d.ts'
import { CompactSign } from '../jws/compact/sign.js'
import { FlattenedSign } from '../jws/flattened/sign.js'
import { GeneralSign } from '../jws/general/sign.js'
import { JWTClaimsBuilder } from '../lib/jwt_claims_set.js'
import { assertNotSet } from '../lib/helpers.js'
import { JWSInvalid, JWTInvalid } from '../util/errors.js'
import {
  createDecoyConfiguration,
  issueSDJWTPayload,
  normalizeHashAlgorithm,
  validateDisclosurePaths,
  validateSDJWTPayload,
} from '../lib/sd_jwt_issuer.js'

function hasOwnHeaderParameter(
  header: types.JWSHeaderParameters | undefined,
  parameter: string,
): boolean {
  return header !== undefined && Object.hasOwn(header, parameter)
}

function validateIssuerHeader(header: types.JWSHeaderParameters | undefined): void {
  if (hasOwnHeaderParameter(header, 'disclosures') || hasOwnHeaderParameter(header, 'kb_jwt')) {
    throw new JWSInvalid('"disclosures" and "kb_jwt" are managed by the SD-JWT producer')
  }
}

function rejectUnprotectedType(header: types.JWSHeaderParameters | undefined): void {
  if (hasOwnHeaderParameter(header, 'typ')) {
    throw new JWSInvalid('"typ" must be an integrity-protected header parameter')
  }
}

function rejectUnencodedPayload(...headers: (types.JWSHeaderParameters | undefined)[]): void {
  if (headers.some((header) => header?.b64 === false)) {
    throw new JWTInvalid('JWTs MUST NOT use unencoded payload')
  }
}

/** Private asymmetric key used to sign an Issuer-signed JWT. */
export type SDJWTIssuerSigningKey = types.CryptoKey | types.KeyObject | types.JWK

function assertAsymmetricIssuerKey(key: SDJWTIssuerSigningKey | Uint8Array): void {
  if (
    key instanceof Uint8Array ||
    (key as { type?: unknown }).type === 'secret' ||
    (key as { kty?: unknown }).kty === 'oct'
  ) {
    throw new TypeError('Issuer-signed JWTs must use an asymmetric signing key')
  }
}

function rejectNonSignatureAlgorithm(...headers: (types.JWSHeaderParameters | undefined)[]): void {
  if (
    headers.some(
      (header) =>
        typeof header?.alg === 'string' && (header.alg === 'none' || header.alg.startsWith('HS')),
    )
  ) {
    throw new TypeError('Issuer-signed JWTs must use a digital signature algorithm')
  }
}

function copyHeader(
  header: types.JWSHeaderParameters | undefined,
): types.JWSHeaderParameters | undefined {
  return header === undefined ? undefined : structuredClone(header)
}

abstract class SDJWTProducer implements types.ProduceSDJWT {
  #jwt: JWTClaimsBuilder
  #disclosurePaths: unknown
  #disclosurePathsSet = false
  #hashAlgorithm: types.SDJWTHashAlgorithm = 'sha-256'
  #decoys: ReturnType<typeof createDecoyConfiguration>[] = []
  #decoyPointers = new Set<string>()

  constructor(payload: types.JWTPayload) {
    validateSDJWTPayload(payload)
    this.#jwt = new JWTClaimsBuilder(payload)
  }

  setIssuer(issuer: string): this {
    this.#jwt.iss = issuer
    return this
  }

  setSubject(subject: string): this {
    this.#jwt.sub = subject
    return this
  }

  setAudience(audience: string | string[]): this {
    this.#jwt.aud = audience
    return this
  }

  setJti(jwtId: string): this {
    this.#jwt.jti = jwtId
    return this
  }

  setNotBefore(input: number | string | Date): this {
    this.#jwt.nbf = input
    return this
  }

  setExpirationTime(input: number | string | Date): this {
    this.#jwt.exp = input
    return this
  }

  setIssuedAt(input?: number | string | Date): this {
    this.#jwt.iat = input
    return this
  }

  /**
   * Selects final JWT Claims Set values to make selectively disclosable. Each path is an
   * {@link https://www.rfc-editor.org/rfc/rfc6901 RFC 6901 JSON Pointer} evaluated against the
   * Claims Set when it is signed. This method can only be called once.
   *
   * The root pointer (`''`) is not a valid Disclosure path (`'/'` addresses an object member whose
   * name is empty). Use `~0` to escape `~`, `~1` to escape `/`, and canonical zero-based indices
   * for arrays. Missing and duplicate paths are rejected.
   *
   * `iss`, `exp`, `nbf`, `cnf` and its descendants, and the complete `aud` claim cannot be made
   * selectively disclosable. Application profiles must also keep every other claim used to decide
   * credential validity non-selectively disclosable.
   *
   * @example Nested objects, arrays, and escaped member names
   *
   * ```js
   * import { SignSDJWT } from 'jose/sd-jwt'
   *
   * const sdJwt = await new SignSDJWT({
   *   address: { street: 'Main Street' },
   *   nationalities: ['AT', 'NZ'],
   *   'a/b': { '~verified': true },
   * })
   *   .setProtectedHeader({ alg: 'ES256' })
   *   .setDisclosurePaths(['/address/street', '/nationalities/1', '/a~1b/~0verified'])
   *   .sign(issuerPrivateKey)
   * ```
   */
  setDisclosurePaths(paths: readonly string[]): this {
    if (this.#disclosurePathsSet) {
      throw new TypeError('setDisclosurePaths can only be called once')
    }
    this.#disclosurePathsSet = true
    this.#disclosurePaths = Array.isArray(paths) ? paths.slice() : paths
    return this
  }

  /**
   * Selects the hash algorithm used for Disclosure and Decoy Digests. The default is `sha-256`.
   * Choose a hash with collision resistance appropriate for the Issuer signature algorithm.
   */
  setHashAlgorithm(algorithm: types.SDJWTHashAlgorithm): this {
    this.#hashAlgorithm = normalizeHashAlgorithm(algorithm)
    return this
  }

  /**
   * Adds Decoy Digests to the object or array identified by an RFC 6901 JSON Pointer. Decoys can
   * obscure the number of claims or array elements but increase presentation size; their usefulness
   * depends on a consistent application strategy.
   *
   * @example Add a fixed number of Decoy Digests at the root and a random number to an array
   *
   * ```js
   * import { SignSDJWT } from 'jose/sd-jwt'
   *
   * const sdJwt = await new SignSDJWT({
   *   given_name: 'John',
   *   nationalities: ['AT', 'NZ'],
   * })
   *   .setProtectedHeader({ alg: 'ES256' })
   *   .setDisclosurePaths(['/given_name', '/nationalities/1'])
   *   .addDecoys('', 2)
   *   .addDecoys('/nationalities', { min: 1, max: 3 })
   *   .sign(issuerPrivateKey)
   * ```
   */
  addDecoys(container: string, count: types.SDJWTDecoyCount): this {
    const configuration = createDecoyConfiguration(container, count)
    const identity = JSON.stringify(configuration.tokens)
    if (this.#decoyPointers.has(identity)) {
      throw new TypeError(`decoys are already configured for JSON Pointer: ${container}`)
    }
    this.#decoyPointers.add(identity)
    this.#decoys.push(configuration)
    return this
  }

  protected issue(): Promise<
    ReturnType<typeof issueSDJWTPayload> extends Promise<infer T> ? T : never
  > {
    return issueSDJWTPayload(this.#jwt.data(), {
      disclosurePaths: validateDisclosurePaths(
        this.#disclosurePathsSet ? this.#disclosurePaths : [],
      ),
      decoys: this.#decoys,
      hashAlgorithm: this.#hashAlgorithm,
    })
  }
}

/**
 * Builds and signs Compact JWS serialized SD-JWTs.
 *
 * This class is exported from the `'jose/sd-jwt'` subpath.
 *
 * @example
 *
 * ```js
 * import { SignSDJWT } from 'jose/sd-jwt'
 *
 * // Issuer
 * const sdJwt = await new SignSDJWT({
 *   given_name: 'John',
 *   cnf: { jwk: holderPublicJwk },
 * })
 *   .setProtectedHeader({ alg: 'ES256', typ: 'example+sd-jwt' })
 *   .setIssuedAt()
 *   .setIssuer('https://issuer.example')
 *   .setDisclosurePaths(['/given_name'])
 *   .addDecoys('', 3)
 *   .sign(issuerPrivateKey)
 * ```
 */
export class SignSDJWT extends SDJWTProducer {
  #protectedHeader!: types.JWTHeaderParameters

  /**
   * {@link SignSDJWT} constructor.
   *
   * @param payload The JWT Claims Set object. Defaults to an empty object.
   */
  constructor(payload: types.JWTPayload = {}) {
    super(payload)
  }

  /** Sets the JWS Protected Header. */
  setProtectedHeader(protectedHeader: types.JWTHeaderParameters): this {
    validateIssuerHeader(protectedHeader)
    this.#protectedHeader = protectedHeader
    return this
  }

  /**
   * Signs and returns an RFC 9901 Compact serialized SD-JWT.
   *
   * @param key Issuer private asymmetric key.
   */
  async sign(key: SDJWTIssuerSigningKey, options?: types.SignOptions): Promise<string> {
    const protectedHeader = copyHeader(this.#protectedHeader) as
      types.JWTHeaderParameters | undefined
    validateIssuerHeader(protectedHeader)
    rejectUnencodedPayload(protectedHeader)
    assertAsymmetricIssuerKey(key)
    rejectNonSignatureAlgorithm(protectedHeader)

    const { payload, disclosures } = await this.issue()
    const signer = new CompactSign(payload)
    signer.setProtectedHeader(protectedHeader!)
    const jws = await signer.sign(key, options)
    return [jws, ...disclosures, ''].join('~')
  }
}

/**
 * Builds and signs Flattened JWS JSON serialized SD-JWTs.
 *
 * This class is exported from the `'jose/sd-jwt'` subpath.
 *
 * @example
 *
 * ```js
 * import { FlattenedSignSDJWT, flattenedSdJwtReceive, flattenedSdJwtVerify } from 'jose/sd-jwt'
 *
 * const issued = await new FlattenedSignSDJWT({
 *   given_name: 'John',
 *   family_name: 'Doe',
 * })
 *   .setProtectedHeader({ alg: 'ES256', kid: 'issuer-key-id' })
 *   .setDisclosurePaths(['/given_name', '/family_name'])
 *   .sign(issuerPrivateKey)
 *
 * const credential = await flattenedSdJwtReceive(issued, issuerPublicKey)
 * const presentation = await credential.present(['/given_name'])
 * const { payload } = await flattenedSdJwtVerify(presentation, issuerPublicKey, {
 *   keyBinding: false,
 * })
 * ```
 */
export class FlattenedSignSDJWT extends SDJWTProducer {
  #protectedHeader!: types.JWSHeaderParameters
  #unprotectedHeader!: types.JWSHeaderParameters

  /**
   * {@link FlattenedSignSDJWT} constructor.
   *
   * @param payload The JWT Claims Set object. Defaults to an empty object.
   */
  constructor(payload: types.JWTPayload = {}) {
    super(payload)
  }

  /** Sets the JWS Protected Header. */
  setProtectedHeader(protectedHeader: types.JWSHeaderParameters): this {
    assertNotSet(this.#protectedHeader, 'setProtectedHeader')
    validateIssuerHeader(protectedHeader)
    this.#protectedHeader = protectedHeader
    return this
  }

  /**
   * Sets the JWS Unprotected Header. Its members are not integrity protected and must not drive
   * security decisions. `typ` is rejected here and must be set in the protected header.
   */
  setUnprotectedHeader(unprotectedHeader: types.JWSHeaderParameters): this {
    assertNotSet(this.#unprotectedHeader, 'setUnprotectedHeader')
    validateIssuerHeader(unprotectedHeader)
    rejectUnprotectedType(unprotectedHeader)
    this.#unprotectedHeader = unprotectedHeader
    return this
  }

  /**
   * Signs and returns an RFC 9901 Flattened JWS JSON serialized SD-JWT.
   *
   * @param key Issuer private asymmetric key.
   */
  async sign(
    key: SDJWTIssuerSigningKey,
    options?: types.SignOptions,
  ): Promise<types.FlattenedSDJWT> {
    const protectedHeader = copyHeader(this.#protectedHeader)
    const unprotectedHeader = copyHeader(this.#unprotectedHeader)
    validateIssuerHeader(protectedHeader)
    validateIssuerHeader(unprotectedHeader)
    rejectUnprotectedType(unprotectedHeader)
    rejectUnencodedPayload(protectedHeader, unprotectedHeader)
    assertAsymmetricIssuerKey(key)
    rejectNonSignatureAlgorithm(protectedHeader, unprotectedHeader)

    const { payload, disclosures } = await this.issue()
    const signer = new FlattenedSign(payload)
    if (protectedHeader !== undefined) {
      signer.setProtectedHeader(protectedHeader)
    }
    signer.setUnprotectedHeader({
      ...unprotectedHeader,
      disclosures: disclosures.slice(),
    })
    return signer.sign(key, options) as Promise<types.FlattenedSDJWT>
  }
}

/** Used to build individual signatures on a {@link GeneralSignSDJWT}. */
export interface SDJWTSignature {
  /** Sets the JWS Protected Header on this signature. */
  setProtectedHeader(protectedHeader: types.JWSHeaderParameters): SDJWTSignature

  /**
   * Sets the JWS Unprotected Header on this signature. Its members are not integrity protected and
   * must not drive security decisions. `typ` is rejected here and must be set in the protected
   * header.
   */
  setUnprotectedHeader(unprotectedHeader: types.JWSHeaderParameters): SDJWTSignature

  /** Adds another signature to the enclosing {@link GeneralSignSDJWT}. */
  addSignature(...args: Parameters<GeneralSignSDJWT['addSignature']>): SDJWTSignature

  /** Signs using the enclosing {@link GeneralSignSDJWT}. */
  sign(): Promise<types.GeneralSDJWT>

  /** Returns the enclosing {@link GeneralSignSDJWT}. */
  done(): GeneralSignSDJWT
}

class IndividualSDJWTSignature implements SDJWTSignature {
  #parent: GeneralSignSDJWT

  protectedHeader?: types.JWSHeaderParameters
  unprotectedHeader?: types.JWSHeaderParameters
  options?: types.SignOptions
  key: SDJWTIssuerSigningKey

  constructor(parent: GeneralSignSDJWT, key: SDJWTIssuerSigningKey, options?: types.SignOptions) {
    this.#parent = parent
    this.key = key
    this.options = options
  }

  setProtectedHeader(protectedHeader: types.JWSHeaderParameters): this {
    assertNotSet(this.protectedHeader, 'setProtectedHeader')
    validateIssuerHeader(protectedHeader)
    this.protectedHeader = protectedHeader
    return this
  }

  setUnprotectedHeader(unprotectedHeader: types.JWSHeaderParameters): this {
    assertNotSet(this.unprotectedHeader, 'setUnprotectedHeader')
    validateIssuerHeader(unprotectedHeader)
    rejectUnprotectedType(unprotectedHeader)
    this.unprotectedHeader = unprotectedHeader
    return this
  }

  addSignature(...args: Parameters<GeneralSignSDJWT['addSignature']>): SDJWTSignature {
    return this.#parent.addSignature(...args)
  }

  sign(): Promise<types.GeneralSDJWT> {
    return this.#parent.sign()
  }

  done(): GeneralSignSDJWT {
    return this.#parent
  }
}

/**
 * Builds and signs General JWS JSON serialized SD-JWTs.
 *
 * This class is exported from the `'jose/sd-jwt'` subpath.
 *
 * General verification returns the headers of the first successfully verified signature. The RFC
 * 9901 Disclosure and Key Binding transport parameters are always carried by the first signature's
 * unprotected header.
 *
 * @example
 *
 * ```js
 * import { GeneralSignSDJWT, generalSdJwtReceive, generalSdJwtVerify } from 'jose/sd-jwt'
 *
 * const issued = await new GeneralSignSDJWT({ given_name: 'John' })
 *   .setDisclosurePaths(['/given_name'])
 *   .addSignature(firstIssuerPrivateKey)
 *   .setProtectedHeader({ alg: 'ES256', kid: 'first' })
 *   .addSignature(secondIssuerPrivateKey)
 *   .setProtectedHeader({ alg: 'ES256', kid: 'second' })
 *   .sign()
 *
 * const credential = await generalSdJwtReceive(issued, secondIssuerPublicKey)
 * const presentation = await credential.present(['/given_name'])
 * const { payload, protectedHeader } = await generalSdJwtVerify(
 *   presentation,
 *   secondIssuerPublicKey,
 *   { keyBinding: false },
 * )
 * ```
 */
export class GeneralSignSDJWT extends SDJWTProducer {
  #signatures: IndividualSDJWTSignature[] = []

  /**
   * {@link GeneralSignSDJWT} constructor.
   *
   * @param payload The JWT Claims Set object. Defaults to an empty object.
   */
  constructor(payload: types.JWTPayload = {}) {
    super(payload)
  }

  /** Adds an additional signature to the General JWS JSON serialized SD-JWT. */
  addSignature(key: SDJWTIssuerSigningKey, options?: types.SignOptions): SDJWTSignature {
    const signature = new IndividualSDJWTSignature(this, key, options)
    this.#signatures.push(signature)
    return signature
  }

  /** Signs and returns an RFC 9901 General JWS JSON serialized SD-JWT. */
  async sign(): Promise<types.GeneralSDJWT> {
    if (this.#signatures.length === 0) {
      throw new JWSInvalid('at least one signature must be added')
    }
    const configurations = this.#signatures.map((signature) => ({
      key: signature.key,
      options: signature.options,
      protectedHeader: copyHeader(signature.protectedHeader),
      unprotectedHeader: copyHeader(signature.unprotectedHeader),
    }))
    for (const signature of configurations) {
      validateIssuerHeader(signature.protectedHeader)
      validateIssuerHeader(signature.unprotectedHeader)
      rejectUnprotectedType(signature.unprotectedHeader)
      rejectUnencodedPayload(signature.protectedHeader, signature.unprotectedHeader)
      assertAsymmetricIssuerKey(signature.key)
      rejectNonSignatureAlgorithm(signature.protectedHeader, signature.unprotectedHeader)
    }

    const { payload, disclosures } = await this.issue()
    const signer = new GeneralSign(payload)

    for (let index = 0; index < configurations.length; index++) {
      const configuration = configurations[index]
      const signature = signer.addSignature(configuration.key, configuration.options)
      if (configuration.protectedHeader !== undefined) {
        signature.setProtectedHeader(configuration.protectedHeader)
      }

      if (index === 0) {
        signature.setUnprotectedHeader({
          ...configuration.unprotectedHeader,
          disclosures: disclosures.slice(),
        })
      } else if (configuration.unprotectedHeader !== undefined) {
        signature.setUnprotectedHeader(configuration.unprotectedHeader)
      }
    }

    return signer.sign() as Promise<types.GeneralSDJWT>
  }
}
