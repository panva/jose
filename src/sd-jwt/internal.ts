/** @ignore */

import type * as types from '../types.d.ts'
import { decoder } from '../lib/buffer_utils.js'
import { validateClaimsSetPayload } from '../lib/jwt_claims_set.js'
import { prepareVerify, verifyCompact, verifyResult, verifySignature } from '../lib/jws_verify.js'
import type { VerifyGetKey, VerifyShared } from '../lib/jws_verify.js'
import {
  decodeSdJwtPayload,
  type DisclosureDetail,
  formatSdJwt,
  getSdAlg,
  hasMultipleConfirmationKeyRepresentations,
  isPublicAsymmetricJWK,
  type ParsedSdJwt,
  parseSdJwtForVerification,
  processDisclosures,
} from '../lib/sd.js'
import { isObject } from '../lib/type_checks.js'
import { JWSInvalid, JWSSignatureVerificationFailed, JWTInvalid } from '../util/errors.js'
import type { SDJWTIssuerGetKey, SDJWTIssuerKey } from '../types.d.ts'

/** @ignore */
export type SDJWTInput = string | types.FlattenedJWS | types.GeneralJWS

/** @ignore */
export type SDJWTSerialization = 'compact' | 'flattened' | 'general'

type SDJWTIssuerKeyLike = SDJWTIssuerKey | SDJWTIssuerGetKey

type ParsedSDJWT = ParsedSdJwt<SDJWTInput>

interface VerifiedSDJWTIssuer {
  parsed: ParsedSDJWT
  payload: types.JWTPayload
  protectedHeader?: types.JWSHeaderParameters
  unprotectedHeader?: types.JWSHeaderParameters
  disclosureDetails: DisclosureDetail[]
  serialization: SDJWTSerialization
  sdAlg: 'sha-256' | 'sha-384' | 'sha-512'
  key?: types.CryptoKey
}

function hasUnencodedPayload(...headers: (types.JWSHeaderParameters | undefined)[]): boolean {
  return headers.some((header) => header?.b64 === false)
}

function assertIssuerSignatureAlgorithm(
  protectedHeader: types.JWSHeaderParameters | undefined,
  unprotectedHeader: types.JWSHeaderParameters | undefined,
): void {
  const alg = protectedHeader?.alg ?? unprotectedHeader?.alg
  if (typeof alg !== 'string' || !alg || alg === 'none' || alg.startsWith('HS')) {
    throw new JWTInvalid('Issuer-signed JWTs must use a digital signature algorithm')
  }
}

function assertNoProtectedTransport(protectedHeader: types.JWSHeaderParameters | undefined): void {
  if (
    protectedHeader &&
    (Object.hasOwn(protectedHeader, 'disclosures') || Object.hasOwn(protectedHeader, 'kb_jwt'))
  ) {
    const error = new JWTInvalid('SD-JWT transport parameters must be unprotected')
    protectedTransportErrors.add(error)
    throw error
  }
}

const protectedTransportErrors = new WeakSet<JWTInvalid>()

function prepareIssuerVerificationKey(key: SDJWTIssuerKeyLike): VerifyGetKey {
  return async (protectedHeader, token) => {
    assertNoProtectedTransport(protectedHeader)
    return typeof key === 'function' ? key(protectedHeader, token) : key
  }
}

async function verifyIssuerSignature(
  jws: SDJWTInput,
  key: SDJWTIssuerKeyLike,
  options: types.VerifyOptions,
): Promise<types.FlattenedVerifyResult & Partial<types.ResolvedKey>> {
  const verificationKey = prepareIssuerVerificationKey(key)

  if (typeof jws === 'string') {
    const verified = await verifyCompact(jws, prepareVerify(options), verificationKey)
    const result: types.CompactVerifyResult = {
      payload: verified[0],
      protectedHeader: verified[1] as types.CompactJWSHeaderParameters,
    }
    return typeof key === 'function' ? { ...result, key: verified[3] } : result
  }

  if (!('signatures' in jws)) {
    if (jws.protected === undefined && jws.header === undefined) {
      throw new JWSInvalid('Flattened JWS must have either of the "protected" or "header" members')
    }
    if (jws.protected !== undefined && typeof jws.protected !== 'string') {
      throw new JWSInvalid('JWS Protected Header incorrect type')
    }
    if (jws.payload === undefined) {
      throw new JWSInvalid('JWS Payload missing')
    }
    if (typeof jws.signature !== 'string') {
      throw new JWSInvalid('JWS Signature missing or incorrect type')
    }

    const result = verifyResult(
      jws,
      await verifySignature(jws, prepareVerify(options), verificationKey),
    )
    if (typeof key !== 'function') delete result.key
    return result
  }

  const { payload, signatures } = jws
  let shared: VerifyShared
  try {
    if (payload === undefined) throw new Error()
    shared = prepareVerify(options)
  } catch {
    throw new JWSSignatureVerificationFailed()
  }

  for (const signature of signatures) {
    try {
      const { protected: encodedProtected, header, signature: encodedSignature } = signature
      if (encodedProtected === undefined && header === undefined) throw new Error()
      if (encodedProtected !== undefined && typeof encodedProtected !== 'string') throw new Error()
      if (typeof encodedSignature !== 'string') throw new Error()

      const result = verifyResult(
        signature,
        await verifySignature(
          { header, payload, protected: encodedProtected, signature: encodedSignature },
          shared,
          verificationKey,
        ),
      )
      if (typeof key !== 'function') delete result.key
      return result
    } catch (cause) {
      if (cause instanceof JWTInvalid && protectedTransportErrors.has(cause)) {
        throw cause
      }
      // Try the next signature.
    }
  }
  throw new JWSSignatureVerificationFailed()
}

function validateConfirmationClaim(payload: types.JWTPayload): void {
  if (!Object.hasOwn(payload, 'cnf')) {
    return
  }
  if (!isObject<Record<string, unknown>>(payload.cnf)) {
    throw new JWTInvalid('SD-JWT cnf claim must be a JSON object')
  }
  if (hasMultipleConfirmationKeyRepresentations(payload.cnf)) {
    throw new JWTInvalid('SD-JWT cnf claim must represent only one proof-of-possession key')
  }
  if (Object.hasOwn(payload.cnf, 'jwk') && !isPublicAsymmetricJWK(payload.cnf.jwk)) {
    throw new JWTInvalid('SD-JWT cnf.jwk must be a public asymmetric JWK')
  }
}

/** @ignore */
export function parseSDJWT(input: SDJWTInput | Uint8Array): ParsedSDJWT {
  return parseSdJwtForVerification(
    input instanceof Uint8Array ? decoder.decode(input) : (input as never),
  ) as ParsedSDJWT
}

/**
 * Verifies the issuer signature, processes Disclosures, and only then validates the resulting JWT
 * Claims Set, as required by RFC 9901 Section 7.1.
 *
 * @ignore
 */
export async function verifySDJWTIssuer<PayloadType = types.JWTPayload>(
  parsed: ParsedSDJWT,
  key: SDJWTIssuerKeyLike,
  options: types.VerifyOptions & types.JWTClaimVerificationOptions = {},
): Promise<VerifiedSDJWTIssuer & { payload: PayloadType & types.JWTPayload }> {
  const verified = await verifyIssuerSignature(parsed.jws, key, options)

  assertIssuerSignatureAlgorithm(verified.protectedHeader, verified.unprotectedHeader)
  assertNoProtectedTransport(verified.protectedHeader)
  if (hasUnencodedPayload(verified.protectedHeader, verified.unprotectedHeader)) {
    throw new JWTInvalid('JWTs MUST NOT use unencoded payload')
  }

  const issuerPayload = decodeSdJwtPayload(verified.payload)
  const sdAlg = getSdAlg(issuerPayload._sd_alg)
  const processed = await processDisclosures(
    issuerPayload,
    parsed.disclosures,
    issuerPayload._sd_alg,
  )
  validateConfirmationClaim(processed.payload)
  const protectedHeader = verified.protectedHeader
  const payload = validateClaimsSetPayload(
    protectedHeader ?? {},
    processed.payload,
    options,
  ) as PayloadType & types.JWTPayload

  return {
    parsed,
    payload,
    protectedHeader,
    unprotectedHeader: verified.unprotectedHeader,
    disclosureDetails: processed.disclosureDetails,
    serialization: parsed.serialization,
    sdAlg,
    key: verified.key as types.CryptoKey | undefined,
  }
}

/** @ignore */
export function formatSDJWT<T extends SDJWTInput>(
  jws: T,
  disclosures: readonly string[],
  kbJwt?: string,
): T {
  return formatSdJwt(jws as never, disclosures, kbJwt) as T
}

/** @ignore */
export function disclosurePath(detail: DisclosureDetail): string {
  return detail.pointer
}

/** @ignore */
export function disclosureValue(
  payload: Record<string, unknown>,
  detail: DisclosureDetail,
): unknown {
  let value: unknown = payload
  for (const component of detail.path) {
    if (typeof value !== 'object' || value === null || !Object.hasOwn(value, component)) {
      throw new JWTInvalid('Disclosure path does not resolve in the processed payload')
    }
    value = (value as Record<string | number, unknown>)[component]
  }
  return value
}

/** @ignore */
export function assertDisclosurePointer(pointer: unknown): asserts pointer is string {
  if (typeof pointer !== 'string' || pointer === '' || pointer[0] !== '/') {
    throw new TypeError('Disclosure paths must be non-empty JSON Pointers')
  }

  for (let index = 0; index < pointer.length; index++) {
    if (pointer[index] === '~') {
      const escaped = pointer[++index]
      if (escaped !== '0' && escaped !== '1') {
        throw new TypeError(`Invalid JSON Pointer: ${pointer}`)
      }
    }
  }
}
