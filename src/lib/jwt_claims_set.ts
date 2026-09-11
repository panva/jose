import type * as types from '../types.d.ts'
import { JWTClaimValidationFailed, JWTExpired, JWTInvalid } from '../util/errors.js'
import { encoder, strictDecoder } from './buffer_utils.js'
import { isObject } from './validate.js'

// RFC 7519, Section 2: NumericDate counts seconds since the Unix epoch, ignoring leap seconds.
const epoch = (date: Date) => Math.floor(date.getTime() / 1000)

const multipliers: Record<string, number> = {
  s: 1,
  m: 60,
  h: 3600,
  d: 86400,
  w: 604800,
  y: 31557600,
}

const REGEX =
  /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i
const checkFailed = 'check_failed'
function invalidDuration(): never {
  throw new TypeError('Invalid time period format')
}

export function secs(str: string): number {
  if (typeof str !== 'string') {
    invalidDuration()
  }

  const matched = REGEX.exec(str)

  if (!matched || (matched[4] && matched[1])) {
    invalidDuration()
  }

  const value = parseFloat(matched[2])
  const durationSeconds = Math.round(value * multipliers[matched[3][0].toLowerCase()])

  if (!Number.isFinite(durationSeconds)) {
    invalidDuration()
  }

  if (matched[1] === '-' || matched[4] === 'ago') {
    return -durationSeconds
  }

  return durationSeconds
}

function validateInput(label: string, input: number) {
  if (!Number.isFinite(input)) {
    throw new TypeError(`Invalid ${label} input`)
  }

  return input
}

function validateStringClaim(claim: 'iss' | 'sub' | 'jti', value: unknown): void {
  if (typeof value !== 'string') {
    throw new TypeError(`"${claim}" claim must be a string`)
  }
}

function validateAudienceClaim(value: unknown): void {
  if (
    typeof value !== 'string' &&
    (!Array.isArray(value) || Array.from(value).some((member) => typeof member !== 'string'))
  ) {
    throw new TypeError('"aud" claim must be a string or an array of strings')
  }
}

function numericDate(value: number | string | Date, label: string) {
  if (typeof value === 'number') return validateInput(label, value)
  if (value instanceof Date) return validateInput(label, epoch(value))
  return epoch(new Date()) + secs(value)
}

// RFC 7515, Section 4.1.9: media types are case-insensitive; application/ may be omitted.
const normalizeTyp = (value: string) => {
  const normalized = value.toLowerCase()
  return value.includes('/') ? normalized : `application/${normalized}`
}

const checkAudiencePresence = (audPayload: unknown, audOption: unknown[]) => {
  if (typeof audPayload === 'string') {
    return audOption.includes(audPayload)
  }

  if (Array.isArray(audPayload)) {
    // RFC 7519, Section 4.1.3: match an intended recipient in the Audience Claim.
    return audOption.some((aud) => audPayload.includes(aud))
  }

  return false
}

function validateNumericDate(
  claimsSet: { [propName: string]: unknown },
  claim: 'iat' | 'nbf' | 'exp',
  required = false,
): number | undefined {
  const value = claimsSet[claim]
  if (value === undefined && !required) return undefined
  if (typeof value !== 'number') {
    throw new JWTClaimValidationFailed(
      `"${claim}" claim must be a number`,
      claimsSet,
      claim,
      'invalid',
    )
  }
  return value
}

function unexpectedClaim(claimsSet: types.JWTPayload, claim: 'iss' | 'sub' | 'aud'): never {
  throw new JWTClaimValidationFailed(
    `unexpected "${claim}" claim value`,
    claimsSet,
    claim,
    checkFailed,
  )
}

export function validateClaimsSet(
  protectedHeader: types.JWEHeaderParameters | types.JWSHeaderParameters,
  claimsSetBytes: Uint8Array,
  options: types.JWTClaimVerificationOptions = {},
) {
  // RFC 7519, Section 7.2, step 10: decode UTF-8 and parse the JWT Claims Set.
  let claimsSet!: { [propName: string]: unknown }
  try {
    claimsSet = JSON.parse(strictDecoder.decode(claimsSetBytes))
  } catch {
    //
  }

  if (!isObject(claimsSet)) {
    throw new JWTInvalid('JWT Claims Set must be a top-level JSON object')
  }

  const { typ } = options
  if (
    typ !== undefined &&
    (typeof protectedHeader!.typ !== 'string' ||
      normalizeTyp(protectedHeader!.typ) !== normalizeTyp(typ))
  ) {
    throw new JWTClaimValidationFailed(
      'unexpected "typ" JWT header value',
      claimsSet,
      'typ',
      checkFailed,
    )
  }

  const { requiredClaims = [], issuer, subject, audience, maxTokenAge } = options

  // Required claims are application policy (RFC 7519, Section 4); options opt into it.
  const presenceCheck = [...requiredClaims]

  if (maxTokenAge !== undefined) presenceCheck.push('iat')
  if (audience !== undefined) presenceCheck.push('aud')
  if (subject !== undefined) presenceCheck.push('sub')
  if (issuer !== undefined) presenceCheck.push('iss')

  for (const claim of new Set(presenceCheck.reverse())) {
    if (!Object.hasOwn(claimsSet, claim)) {
      throw new JWTClaimValidationFailed(
        `missing required "${claim}" claim`,
        claimsSet,
        claim,
        'missing',
      )
    }
  }

  // RFC 7519, Sections 4.1.1-4.1.2: issuer and subject values are case-sensitive.
  // Requiring a particular value is the application’s configured policy.
  if (
    issuer !== undefined &&
    !((Array.isArray(issuer) ? issuer : [issuer]) as unknown[]).includes(claimsSet.iss!)
  ) {
    unexpectedClaim(claimsSet, 'iss')
  }

  if (subject !== undefined && claimsSet.sub !== subject) {
    unexpectedClaim(claimsSet, 'sub')
  }

  if (
    audience !== undefined &&
    !checkAudiencePresence(claimsSet.aud, typeof audience === 'string' ? [audience] : audience)
  ) {
    unexpectedClaim(claimsSet, 'aud')
  }

  const { clockTolerance } = options
  let tolerance = 0
  if (typeof clockTolerance === 'string') {
    tolerance = secs(clockTolerance)
  } else if (clockTolerance !== undefined) {
    if (typeof clockTolerance !== 'number') {
      throw new TypeError('Invalid clockTolerance option type')
    }
    tolerance = clockTolerance
  }

  validateInput('clockTolerance option', tolerance)

  const { currentDate } = options
  const now = validateInput(
    'currentDate option',
    epoch(currentDate === undefined ? new Date() : currentDate),
  )

  const iat = validateNumericDate(claimsSet, 'iat', maxTokenAge !== undefined)

  // RFC 7519, Section 4.1.5: allow processing at or after nbf, with clock-skew leeway.
  const nbf = validateNumericDate(claimsSet, 'nbf')
  if (nbf !== undefined) {
    if (nbf > now + tolerance) {
      throw new JWTClaimValidationFailed(
        '"nbf" claim timestamp check failed',
        claimsSet,
        'nbf',
        checkFailed,
      )
    }
  }

  // RFC 7519, Section 4.1.4: reject at or after exp, with clock-skew leeway.
  const exp = validateNumericDate(claimsSet, 'exp')
  if (exp !== undefined) {
    if (exp <= now - tolerance) {
      throw new JWTExpired('"exp" claim timestamp check failed', claimsSet, 'exp', checkFailed)
    }
  }

  // RFC 7519, Section 4.1.6 defines iat; maxTokenAge and future-iat checks are library policy.
  if (maxTokenAge !== undefined) {
    const age = now - iat!
    const max = validateInput(
      'maxTokenAge option',
      typeof maxTokenAge === 'number' ? maxTokenAge : secs(maxTokenAge),
    )

    if (age - tolerance > max) {
      throw new JWTExpired(
        '"iat" claim timestamp check failed (too far in the past)',
        claimsSet,
        'iat',
        checkFailed,
      )
    }

    if (age < -tolerance) {
      throw new JWTClaimValidationFailed(
        '"iat" claim timestamp check failed (it should be in the past)',
        claimsSet,
        'iat',
        checkFailed,
      )
    }
  }

  return claimsSet as types.JWTPayload
}

let producerClaimsSets: WeakMap<object, types.JWTPayload>

function producerClaimsSet(producer: object): types.JWTPayload {
  return producerClaimsSets.get(producer)!
}

export function jwtClaimsSetBytes(producer: object): Uint8Array {
  const claimsSet = producerClaimsSet(producer)
  for (const claim of ['iat', 'nbf', 'exp'] as const) {
    const value = claimsSet[claim]
    if (typeof value === 'number' && !Number.isFinite(value)) {
      throw new TypeError(`"${claim}" claim must be a finite number`)
    }
  }

  // RFC 7519, Section 7.1, steps 2 and 4: UTF-8 Claims Set for JWS Payload / JWE plaintext.
  return encoder.encode(JSON.stringify(claimsSet))
}

export function jwtClaim(producer: object, claim: 'iss' | 'sub' | 'aud'): unknown {
  return producerClaimsSet(producer)[claim]
}

export class JWTClaimsBuilder {
  constructor(claimsSet: types.JWTPayload = {}) {
    if (!isObject(claimsSet)) {
      throw new TypeError('JWT Claims Set MUST be an object')
    }
    ;(producerClaimsSets ||= new WeakMap()).set(this, structuredClone(claimsSet))
  }

  setIssuer(value: string): this {
    validateStringClaim('iss', value)
    producerClaimsSet(this).iss = value
    return this
  }

  setSubject(value: string): this {
    validateStringClaim('sub', value)
    producerClaimsSet(this).sub = value
    return this
  }

  setAudience(value: string | string[]): this {
    validateAudienceClaim(value)
    producerClaimsSet(this).aud = value
    return this
  }

  setJti(value: string): this {
    validateStringClaim('jti', value)
    producerClaimsSet(this).jti = value
    return this
  }

  setNotBefore(value: number | string | Date): this {
    producerClaimsSet(this).nbf = numericDate(value, 'setNotBefore')
    return this
  }

  setExpirationTime(value: number | string | Date): this {
    producerClaimsSet(this).exp = numericDate(value, 'setExpirationTime')
    return this
  }

  setIssuedAt(value?: number | string | Date): this {
    const claimsSet = producerClaimsSet(this)
    if (value === undefined) {
      claimsSet.iat = epoch(new Date())
    } else if (typeof value === 'string') {
      claimsSet.iat = validateInput('setIssuedAt', epoch(new Date()) + secs(value))
    } else {
      claimsSet.iat = numericDate(value, 'setIssuedAt')
    }
    return this
  }
}
