/**
 * Selective Disclosure for JWTs (SD-JWT) Verifier
 *
 * @module
 */

import type * as types from '../types.d.ts'
import { jwtVerify } from '../jwt/verify.js'
import { calculateSdHash, isPublicAsymmetricJWK } from '../lib/sd.js'
import { secs } from '../lib/jwt_claims_set.js'
import { isObject } from '../lib/type_checks.js'
import { JWTClaimValidationFailed, JWTInvalid } from '../util/errors.js'
import type { SDJWTDisclosure } from './holder.js'
import {
  disclosurePath,
  disclosureValue,
  parseSDJWT,
  verifySDJWTIssuer,
  type SDJWTInput,
  type SDJWTSerialization,
} from './internal.js'
import type { SDJWTIssuerGetKey, SDJWTIssuerKey } from '../types.d.ts'

type SDJWTIssuerKeyLike = SDJWTIssuerKey | SDJWTIssuerGetKey

export type SDJWTHolderVerificationKey = types.CryptoKey | types.KeyObject | types.JWK

/** Resolves confirmation methods other than `cnf.jwk`. */
export interface SDJWTHolderKeyResolver {
  (
    protectedHeader: types.JWTHeaderParameters,
    token: types.FlattenedJWSInput,
    confirmation: Record<string, unknown>,
    sdJwtPayload: types.JWTPayload,
  ): Promise<SDJWTHolderVerificationKey> | SDJWTHolderVerificationKey
}

/** Verifier policy for mandatory RFC 9901 Key Binding. */
export interface SDJWTKeyBindingVerificationOptions {
  /** Expected single-valued Key Binding JWT audience. */
  audience: string
  /**
   * Expected fresh transaction nonce. The application must securely issue and atomically consume
   * nonces; equality and age validation do not by themselves prevent replay.
   */
  nonce: string
  /** Allowed asymmetric JWS signature algorithms. */
  algorithms: string[]
  /** Maximum age of the Key Binding JWT. This is not a substitute for nonce replay protection. */
  maxTokenAge: string | number
  /** Clock skew tolerance used for `iat` validation. */
  clockTolerance?: string | number
  /** Date to use for time validation. Defaults to the current time. */
  currentDate?: Date
  /** Resolver for confirmation methods other than `cnf.jwk`. */
  getKey?: SDJWTHolderKeyResolver
}

/**
 * SD-JWT verification options. Key Binding policy must always be chosen explicitly. Applications
 * must also restrict Issuer signature algorithms, establish that the verification key belongs to
 * the expected Issuer, and require every claim used to determine validity. When `typ` is expected,
 * it must be carried in the integrity-protected header.
 */
export interface SDJWTVerifyOptions extends types.VerifyOptions, types.JWTClaimVerificationOptions {
  /** `false` forbids a KB-JWT; an options object requires and verifies one. */
  keyBinding: false | SDJWTKeyBindingVerificationOptions
}

/** Claims required in a valid RFC 9901 Key Binding JWT. */
export interface SDJWTKeyBindingPayload extends types.JWTPayload {
  iat: number
  aud: string
  nonce: string
  sd_hash: string
}

/** Verified Key Binding JWT metadata. */
export interface SDJWTKeyBindingVerifyResult {
  payload: SDJWTKeyBindingPayload
  protectedHeader: types.JWTHeaderParameters
  key: SDJWTHolderVerificationKey
}

interface SDJWTVerifyResultProperties<PayloadType> {
  /**
   * Processed SD-JWT Payload containing permanently disclosed claims and successfully presented
   * Disclosures, with `_sd` and `_sd_alg` removed.
   */
  payload: PayloadType & types.JWTPayload

  /** Metadata for the Disclosures included in the presentation. */
  disclosures: SDJWTDisclosure[]

  /**
   * Verified Key Binding JWT metadata. Policy-specific verify overloads omit this property when
   * `keyBinding` is `false` and require it when a Key Binding policy object is passed.
   */
  keyBinding?: SDJWTKeyBindingVerifyResult
}

/** Result of verifying a Compact serialized SD-JWT presentation. */
export interface SDJWTVerifyResult<
  PayloadType = types.JWTPayload,
> extends SDJWTVerifyResultProperties<PayloadType> {
  /** Protected header of the successfully verified Issuer signature. */
  protectedHeader: types.JWTHeaderParameters
}

/** Result of verifying a Flattened JWS JSON serialized SD-JWT presentation. */
export interface FlattenedSDJWTVerifyResult<
  PayloadType = types.JWTPayload,
> extends SDJWTVerifyResultProperties<PayloadType> {
  /** Protected header of the successfully verified Issuer signature, if present. */
  protectedHeader?: types.JWSHeaderParameters

  /**
   * Unprotected header of the successfully verified Issuer signature, if present. Except for the
   * RFC 9901 transport parameters whose contents are validated separately, its members are not
   * integrity protected and must not drive security decisions.
   */
  unprotectedHeader?: types.JWSHeaderParameters
}

/** Result of verifying a General JWS JSON serialized SD-JWT presentation. */
export interface GeneralSDJWTVerifyResult<
  PayloadType = types.JWTPayload,
> extends FlattenedSDJWTVerifyResult<PayloadType> {}

function duration(value: string | number, label: string): number {
  const result = typeof value === 'string' ? secs(value) : value
  if (!Number.isFinite(result) || result < 0) {
    throw new TypeError(`${label} must be a non-negative finite time period`)
  }
  return result
}

function assertKeyBindingPolicy(
  policy: unknown,
): asserts policy is false | SDJWTKeyBindingVerificationOptions {
  if (policy === false) {
    return
  }
  if (!isObject<SDJWTKeyBindingVerificationOptions>(policy)) {
    throw new TypeError('keyBinding must be false or a Key Binding verification policy')
  }
  if (typeof policy.audience !== 'string' || !policy.audience) {
    throw new TypeError('Key Binding audience must be a non-empty string')
  }
  if (typeof policy.nonce !== 'string' || !policy.nonce) {
    throw new TypeError('Key Binding nonce must be a non-empty string')
  }
  if (
    !Array.isArray(policy.algorithms) ||
    policy.algorithms.length === 0 ||
    !policy.algorithms.every(
      (algorithm) =>
        typeof algorithm === 'string' &&
        algorithm.length !== 0 &&
        algorithm !== 'none' &&
        !algorithm.startsWith('HS'),
    )
  ) {
    throw new TypeError('Key Binding algorithms must contain digital signature algorithms')
  }
  if (
    (typeof policy.maxTokenAge !== 'string' && typeof policy.maxTokenAge !== 'number') ||
    duration(policy.maxTokenAge, 'Key Binding maxTokenAge') === 0
  ) {
    throw new TypeError('Key Binding maxTokenAge must be a positive number or time period')
  }
  if (
    policy.clockTolerance !== undefined &&
    typeof policy.clockTolerance !== 'string' &&
    typeof policy.clockTolerance !== 'number'
  ) {
    throw new TypeError('Key Binding clockTolerance must be a number or time period')
  }
  if (policy.clockTolerance !== undefined) {
    duration(policy.clockTolerance, 'Key Binding clockTolerance')
  }
  if (
    policy.currentDate !== undefined &&
    (!(policy.currentDate instanceof Date) || Number.isNaN(policy.currentDate.getTime()))
  ) {
    throw new TypeError('Key Binding currentDate must be a valid Date')
  }
  if (policy.getKey !== undefined && typeof policy.getKey !== 'function') {
    throw new TypeError('Key Binding getKey must be a function')
  }
}

function assertHolderVerificationKey(key: unknown): asserts key is SDJWTHolderVerificationKey {
  if (key instanceof Uint8Array) {
    throw new JWTInvalid('Key Binding JWTs must use an asymmetric verification key')
  }

  if (isObject(key) && Object.hasOwn(key, 'kty')) {
    if (!isPublicAsymmetricJWK(key)) {
      throw new JWTInvalid('Holder verification key must be a public asymmetric JWK')
    }
    return
  }

  if (!key || typeof key !== 'object' || (key as { type?: unknown }).type !== 'public') {
    throw new JWTInvalid('Key Binding JWTs must use an asymmetric verification key')
  }
}

async function verifyKeyBinding(
  kbJwt: string,
  issuerPayload: types.JWTPayload,
  jws: SDJWTInput,
  disclosures: readonly string[],
  sdAlg: 'sha-256' | 'sha-384' | 'sha-512',
  policy: SDJWTKeyBindingVerificationOptions,
): Promise<SDJWTKeyBindingVerifyResult> {
  const cnf = issuerPayload.cnf
  if (!isObject<Record<string, unknown>>(cnf)) {
    throw new JWTInvalid('SD-JWT is missing a valid cnf claim')
  }
  let holderKey: SDJWTHolderVerificationKey | undefined
  let verificationKey:
    | SDJWTHolderVerificationKey
    | ((
        protectedHeader: types.JWTHeaderParameters,
        token: types.FlattenedJWSInput,
      ) => Promise<SDJWTHolderVerificationKey>)

  if (Object.hasOwn(cnf, 'jwk')) {
    if (!isPublicAsymmetricJWK(cnf.jwk)) {
      throw new JWTInvalid('cnf.jwk must contain a public asymmetric JWK')
    }
    holderKey = cnf.jwk
    verificationKey = holderKey
  } else {
    if (!policy.getKey) {
      throw new JWTInvalid('Unsupported SD-JWT confirmation method')
    }
    const resolverConfirmation = structuredClone(cnf)
    const resolverPayload = structuredClone(issuerPayload)
    verificationKey = async (protectedHeader, token) => {
      const resolved = await policy.getKey!(
        structuredClone(protectedHeader),
        structuredClone(token),
        resolverConfirmation,
        resolverPayload,
      )
      assertHolderVerificationKey(resolved)
      holderKey = resolved
      return resolved
    }
  }

  const verified = await jwtVerify<SDJWTKeyBindingPayload>(kbJwt, verificationKey as never, {
    typ: 'kb+jwt',
    algorithms: policy.algorithms,
    audience: policy.audience,
    maxTokenAge: policy.maxTokenAge,
    clockTolerance: policy.clockTolerance,
    currentDate: policy.currentDate,
    requiredClaims: ['iat', 'aud', 'nonce', 'sd_hash'],
  })
  const payload = verified.payload

  if (verified.protectedHeader.typ !== 'kb+jwt') {
    throw new JWTInvalid('Key Binding JWT typ must be "kb+jwt"')
  }
  if (typeof payload.aud !== 'string') {
    throw new JWTClaimValidationFailed(
      '"aud" claim must be a single string',
      payload,
      'aud',
      'invalid',
    )
  }
  if (typeof payload.nonce !== 'string') {
    throw new JWTClaimValidationFailed(
      '"nonce" claim must be a string',
      payload,
      'nonce',
      'invalid',
    )
  }
  if (payload.nonce !== policy.nonce) {
    throw new JWTClaimValidationFailed(
      'unexpected "nonce" claim value',
      payload,
      'nonce',
      'check_failed',
    )
  }

  const expected = await calculateSdHash(jws, disclosures, sdAlg)
  if (typeof payload.sd_hash !== 'string') {
    throw new JWTClaimValidationFailed(
      '"sd_hash" claim must be a string',
      payload,
      'sd_hash',
      'invalid',
    )
  }
  if (payload.sd_hash !== expected) {
    throw new JWTClaimValidationFailed(
      'unexpected "sd_hash" claim value',
      payload,
      'sd_hash',
      'check_failed',
    )
  }

  return {
    payload: payload as SDJWTKeyBindingPayload,
    protectedHeader: verified.protectedHeader,
    key: holderKey!,
  }
}

interface InternalSDJWTVerifyResult<PayloadType> {
  payload: PayloadType & types.JWTPayload
  protectedHeader?: types.JWSHeaderParameters
  unprotectedHeader?: types.JWSHeaderParameters
  disclosures: SDJWTDisclosure[]
  keyBinding?: SDJWTKeyBindingVerifyResult
  key?: types.CryptoKey
}

async function verifySDJWT<PayloadType>(
  sdJwt: SDJWTInput | Uint8Array,
  key: SDJWTIssuerKeyLike,
  options: SDJWTVerifyOptions,
  expectedSerialization: SDJWTSerialization,
): Promise<InternalSDJWTVerifyResult<PayloadType>> {
  if (!options || !Object.hasOwn(options, 'keyBinding')) {
    throw new TypeError('An explicit keyBinding verification policy is required')
  }
  assertKeyBindingPolicy(options.keyBinding)

  const parsed = parseSDJWT(sdJwt)
  if (parsed.serialization !== expectedSerialization) {
    throw new JWTInvalid(`SD-JWT must use ${expectedSerialization} serialization`)
  }

  const policy =
    options.keyBinding === false
      ? false
      : {
          ...options.keyBinding,
          algorithms: options.keyBinding.algorithms.slice(),
          currentDate: options.keyBinding.currentDate
            ? new Date(options.keyBinding.currentDate)
            : undefined,
        }
  if (policy === false && parsed.kbJwt !== undefined) {
    throw new JWTInvalid('Unexpected Key Binding JWT')
  }
  if (policy !== false && parsed.kbJwt === undefined) {
    throw new JWTInvalid('Key Binding JWT is required')
  }

  const requiredClaims = [...(options.requiredClaims || [])]
  if (policy !== false && !requiredClaims.includes('cnf')) {
    requiredClaims.push('cnf')
  }
  const verified = await verifySDJWTIssuer<PayloadType>(parsed, key, {
    ...options,
    requiredClaims,
  })

  const result: InternalSDJWTVerifyResult<PayloadType> = {
    payload: verified.payload,
    disclosures: verified.disclosureDetails.map((detail) => ({
      digest: detail.digest,
      key: detail.key,
      value: structuredClone(disclosureValue(verified.payload as types.JWTPayload, detail)),
      path: disclosurePath(detail),
    })),
  }

  if (verified.protectedHeader !== undefined) {
    result.protectedHeader = verified.protectedHeader
  }
  if (verified.unprotectedHeader !== undefined) {
    result.unprotectedHeader = verified.unprotectedHeader
  }
  if (verified.key !== undefined) {
    result.key = verified.key
  }
  if (policy !== false) {
    result.keyBinding = await verifyKeyBinding(
      parsed.kbJwt!,
      verified.payload,
      parsed.jws,
      parsed.disclosures,
      verified.sdAlg,
      policy,
    )
  }

  return result
}

/**
 * Verifies a Compact serialized SD-JWT presentation. Its `protectedHeader` result is always
 * present. Passing `keyBinding: false` rejects a KB-JWT and returns no `keyBinding` property;
 * passing a policy object requires and validates a KB-JWT and returns a required `keyBinding`
 * property. These policy-specific result shapes are reflected by the TypeScript overloads.
 *
 * This function is exported from the `'jose/sd-jwt'` subpath.
 *
 * @example
 *
 * ```js
 * import { sdJwtVerify } from 'jose/sd-jwt'
 *
 * // Require and verify Key Binding
 * const { payload, keyBinding } = await sdJwtVerify(presentation, issuerPublicKey, {
 *   issuer: 'https://issuer.example',
 *   algorithms: ['ES256'],
 *   keyBinding: {
 *     audience: 'https://verifier.example',
 *     nonce,
 *     algorithms: ['ES256'],
 *     maxTokenAge: '5 minutes',
 *   },
 * })
 * ```
 *
 * @example
 *
 * ```js
 * import { sdJwtVerify } from 'jose/sd-jwt'
 *
 * // Forbid Key Binding
 * const { payload } = await sdJwtVerify(presentation, issuerPublicKey, {
 *   issuer: 'https://issuer.example',
 *   algorithms: ['ES256'],
 *   keyBinding: false,
 * })
 * ```
 */
export function sdJwtVerify<PayloadType = types.JWTPayload>(
  sdJwt: string | Uint8Array,
  key: SDJWTIssuerKey,
  options: Omit<SDJWTVerifyOptions, 'keyBinding'> & { keyBinding: false },
): Promise<Omit<SDJWTVerifyResult<PayloadType>, 'keyBinding'>>
export function sdJwtVerify<PayloadType = types.JWTPayload>(
  sdJwt: string | Uint8Array,
  key: SDJWTIssuerKey,
  options: Omit<SDJWTVerifyOptions, 'keyBinding'> & {
    keyBinding: SDJWTKeyBindingVerificationOptions
  },
): Promise<
  Omit<SDJWTVerifyResult<PayloadType>, 'keyBinding'> & {
    keyBinding: SDJWTKeyBindingVerifyResult
  }
>
export function sdJwtVerify<PayloadType = types.JWTPayload>(
  sdJwt: string | Uint8Array,
  key: SDJWTIssuerKey,
  options: SDJWTVerifyOptions,
): Promise<SDJWTVerifyResult<PayloadType>>
export function sdJwtVerify<PayloadType = types.JWTPayload>(
  sdJwt: string | Uint8Array,
  getKey: SDJWTIssuerGetKey,
  options: Omit<SDJWTVerifyOptions, 'keyBinding'> & { keyBinding: false },
): Promise<Omit<SDJWTVerifyResult<PayloadType>, 'keyBinding'> & types.ResolvedKey>
export function sdJwtVerify<PayloadType = types.JWTPayload>(
  sdJwt: string | Uint8Array,
  getKey: SDJWTIssuerGetKey,
  options: Omit<SDJWTVerifyOptions, 'keyBinding'> & {
    keyBinding: SDJWTKeyBindingVerificationOptions
  },
): Promise<
  Omit<SDJWTVerifyResult<PayloadType>, 'keyBinding'> & {
    keyBinding: SDJWTKeyBindingVerifyResult
  } & types.ResolvedKey
>
export function sdJwtVerify<PayloadType = types.JWTPayload>(
  sdJwt: string | Uint8Array,
  getKey: SDJWTIssuerGetKey,
  options: SDJWTVerifyOptions,
): Promise<SDJWTVerifyResult<PayloadType> & types.ResolvedKey>
export function sdJwtVerify<PayloadType = types.JWTPayload>(
  sdJwt: string | Uint8Array,
  key: SDJWTIssuerKeyLike,
  options: SDJWTVerifyOptions,
): Promise<SDJWTVerifyResult<PayloadType>> {
  return verifySDJWT(sdJwt, key, options, 'compact') as Promise<SDJWTVerifyResult<PayloadType>>
}

/**
 * Verifies a Flattened JWS JSON serialized SD-JWT presentation. Passing `keyBinding: false` rejects
 * a KB-JWT and returns no `keyBinding` property; passing a policy object requires and validates a
 * KB-JWT and returns a required `keyBinding` property. These policy-specific result shapes are
 * reflected by the TypeScript overloads.
 *
 * @example
 *
 * ```js
 * import { flattenedSdJwtVerify } from 'jose/sd-jwt'
 *
 * const { payload, protectedHeader, unprotectedHeader } = await flattenedSdJwtVerify(
 *   presentation,
 *   issuerPublicKey,
 *   {
 *     issuer: 'https://issuer.example',
 *     algorithms: ['ES256'],
 *     keyBinding: false,
 *   },
 * )
 * ```
 */
export function flattenedSdJwtVerify<PayloadType = types.JWTPayload>(
  sdJwt: types.FlattenedJWS,
  key: SDJWTIssuerKey,
  options: Omit<SDJWTVerifyOptions, 'keyBinding'> & { keyBinding: false },
): Promise<Omit<FlattenedSDJWTVerifyResult<PayloadType>, 'keyBinding'>>
export function flattenedSdJwtVerify<PayloadType = types.JWTPayload>(
  sdJwt: types.FlattenedJWS,
  key: SDJWTIssuerKey,
  options: Omit<SDJWTVerifyOptions, 'keyBinding'> & {
    keyBinding: SDJWTKeyBindingVerificationOptions
  },
): Promise<
  Omit<FlattenedSDJWTVerifyResult<PayloadType>, 'keyBinding'> & {
    keyBinding: SDJWTKeyBindingVerifyResult
  }
>
export function flattenedSdJwtVerify<PayloadType = types.JWTPayload>(
  sdJwt: types.FlattenedJWS,
  key: SDJWTIssuerKey,
  options: SDJWTVerifyOptions,
): Promise<FlattenedSDJWTVerifyResult<PayloadType>>
export function flattenedSdJwtVerify<PayloadType = types.JWTPayload>(
  sdJwt: types.FlattenedJWS,
  getKey: SDJWTIssuerGetKey,
  options: Omit<SDJWTVerifyOptions, 'keyBinding'> & { keyBinding: false },
): Promise<Omit<FlattenedSDJWTVerifyResult<PayloadType>, 'keyBinding'> & types.ResolvedKey>
export function flattenedSdJwtVerify<PayloadType = types.JWTPayload>(
  sdJwt: types.FlattenedJWS,
  getKey: SDJWTIssuerGetKey,
  options: Omit<SDJWTVerifyOptions, 'keyBinding'> & {
    keyBinding: SDJWTKeyBindingVerificationOptions
  },
): Promise<
  Omit<FlattenedSDJWTVerifyResult<PayloadType>, 'keyBinding'> & {
    keyBinding: SDJWTKeyBindingVerifyResult
  } & types.ResolvedKey
>
export function flattenedSdJwtVerify<PayloadType = types.JWTPayload>(
  sdJwt: types.FlattenedJWS,
  getKey: SDJWTIssuerGetKey,
  options: SDJWTVerifyOptions,
): Promise<FlattenedSDJWTVerifyResult<PayloadType> & types.ResolvedKey>
export function flattenedSdJwtVerify<PayloadType = types.JWTPayload>(
  sdJwt: types.FlattenedJWS,
  key: SDJWTIssuerKeyLike,
  options: SDJWTVerifyOptions,
): Promise<FlattenedSDJWTVerifyResult<PayloadType>> {
  return verifySDJWT(sdJwt, key, options, 'flattened')
}

/**
 * Verifies a General JWS JSON serialized SD-JWT presentation. Passing `keyBinding: false` rejects a
 * KB-JWT and returns no `keyBinding` property; passing a policy object requires and validates a
 * KB-JWT and returns a required `keyBinding` property. These policy-specific result shapes are
 * reflected by the TypeScript overloads. The returned headers belong to the first signature that
 * verifies successfully.
 *
 * @example
 *
 * ```js
 * import { generalSdJwtVerify } from 'jose/sd-jwt'
 *
 * const { payload, keyBinding } = await generalSdJwtVerify(presentation, issuerPublicKey, {
 *   algorithms: ['ES256'],
 *   keyBinding: {
 *     audience,
 *     nonce,
 *     algorithms: ['ES256'],
 *     maxTokenAge: '5 minutes',
 *   },
 * })
 * ```
 */
export function generalSdJwtVerify<PayloadType = types.JWTPayload>(
  sdJwt: types.GeneralJWS,
  key: SDJWTIssuerKey,
  options: Omit<SDJWTVerifyOptions, 'keyBinding'> & { keyBinding: false },
): Promise<Omit<GeneralSDJWTVerifyResult<PayloadType>, 'keyBinding'>>
export function generalSdJwtVerify<PayloadType = types.JWTPayload>(
  sdJwt: types.GeneralJWS,
  key: SDJWTIssuerKey,
  options: Omit<SDJWTVerifyOptions, 'keyBinding'> & {
    keyBinding: SDJWTKeyBindingVerificationOptions
  },
): Promise<
  Omit<GeneralSDJWTVerifyResult<PayloadType>, 'keyBinding'> & {
    keyBinding: SDJWTKeyBindingVerifyResult
  }
>
export function generalSdJwtVerify<PayloadType = types.JWTPayload>(
  sdJwt: types.GeneralJWS,
  key: SDJWTIssuerKey,
  options: SDJWTVerifyOptions,
): Promise<GeneralSDJWTVerifyResult<PayloadType>>
export function generalSdJwtVerify<PayloadType = types.JWTPayload>(
  sdJwt: types.GeneralJWS,
  getKey: SDJWTIssuerGetKey,
  options: Omit<SDJWTVerifyOptions, 'keyBinding'> & { keyBinding: false },
): Promise<Omit<GeneralSDJWTVerifyResult<PayloadType>, 'keyBinding'> & types.ResolvedKey>
export function generalSdJwtVerify<PayloadType = types.JWTPayload>(
  sdJwt: types.GeneralJWS,
  getKey: SDJWTIssuerGetKey,
  options: Omit<SDJWTVerifyOptions, 'keyBinding'> & {
    keyBinding: SDJWTKeyBindingVerificationOptions
  },
): Promise<
  Omit<GeneralSDJWTVerifyResult<PayloadType>, 'keyBinding'> & {
    keyBinding: SDJWTKeyBindingVerifyResult
  } & types.ResolvedKey
>
export function generalSdJwtVerify<PayloadType = types.JWTPayload>(
  sdJwt: types.GeneralJWS,
  getKey: SDJWTIssuerGetKey,
  options: SDJWTVerifyOptions,
): Promise<GeneralSDJWTVerifyResult<PayloadType> & types.ResolvedKey>
export function generalSdJwtVerify<PayloadType = types.JWTPayload>(
  sdJwt: types.GeneralJWS,
  key: SDJWTIssuerKeyLike,
  options: SDJWTVerifyOptions,
): Promise<GeneralSDJWTVerifyResult<PayloadType>> {
  return verifySDJWT(sdJwt, key, options, 'general')
}
