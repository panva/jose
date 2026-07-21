/** @ignore */

import type * as types from '../types.d.ts'
import { compactVerify } from '../jws/compact/verify.js'
import { flattenedVerify } from '../jws/flattened/verify.js'
import { generalVerify } from '../jws/general/verify.js'
import { decoder } from '../lib/buffer_utils.js'
import { validateClaimsSetPayload } from '../lib/jwt_claims_set.js'
import {
  decodeSdJwtPayload,
  type DisclosureDetail,
  formatSdJwt,
  getSdAlg,
  hasMultipleConfirmationKeyRepresentations,
  isPublicAsymmetricJWK,
  type ParsedSdJwt,
  parseSdJwt,
  processDisclosures,
} from '../lib/sd.js'
import { isObject } from '../lib/type_checks.js'
import { JWTInvalid } from '../util/errors.js'
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
  return parseSdJwt(
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
  let verified: types.FlattenedVerifyResult & { key?: types.CryptoKey | Uint8Array }

  if (typeof parsed.jws === 'string') {
    verified = await compactVerify(parsed.jws, key as Parameters<typeof compactVerify>[1], options)
  } else if ('signatures' in parsed.jws) {
    verified = await generalVerify(parsed.jws, key as Parameters<typeof generalVerify>[1], options)
  } else {
    verified = await flattenedVerify(
      parsed.jws,
      key as Parameters<typeof flattenedVerify>[1],
      options,
    )
  }

  assertIssuerSignatureAlgorithm(verified.protectedHeader, verified.unprotectedHeader)
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
