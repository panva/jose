import type {
  JWTPayload,
  JWTClaimVerificationOptions,
  JWEHeaderParameters,
  JWSHeaderParameters,
} from '../types.d'
import { JWTClaimValidationFailed, JWTExpired, JWTInvalid } from '../util/errors.js'
import { decoder } from './buffer_utils.js'
import epoch from './epoch.js'
import secs from './secs.js'

const normalizeTyp = (value: string) => value.toLowerCase().replace(/^application\//, '')

const checkAudiencePresence = (audPayload: any, audOption: string[]) => {
  if (typeof audPayload === 'string') {
    return audOption.includes(audPayload)
  }

  // Each principal intended to process the JWT MUST
  // identify itself with a value in the audience claim
  return audOption.some(Set.prototype.has.bind(new Set(audPayload)))
}

export default (
  protectedHeader: JWEHeaderParameters | JWSHeaderParameters,
  encodedPayload: Uint8Array,
  options: JWTClaimVerificationOptions = {},
) => {
  const { typ } = options
  if (
    typ &&
    (typeof protectedHeader!.typ !== 'string' ||
      normalizeTyp(protectedHeader!.typ) !== normalizeTyp(typ))
  ) {
    throw new JWTClaimValidationFailed('unexpected "typ" JWT header value', 'typ', 'check_failed')
  }

  let payload!: JWTPayload
  try {
    payload = JSON.parse(decoder.decode(encodedPayload))
  } catch {
    //
  }

  if (typeof payload !== 'object' || !payload || Array.isArray(payload)) {
    throw new JWTInvalid('JWT Claims Set must be a top-level JSON object')
  }

  const { issuer } = options
  if (issuer && !(typeof issuer === 'string' ? [issuer] : issuer).includes(payload.iss!)) {
    throw new JWTClaimValidationFailed('unexpected "iss" claim value', 'iss', 'check_failed')
  }

  const { subject } = options
  if (subject && payload.sub !== subject) {
    throw new JWTClaimValidationFailed('unexpected "sub" claim value', 'sub', 'check_failed')
  }

  const { audience } = options
  if (
    audience &&
    !checkAudiencePresence(payload.aud, typeof audience === 'string' ? [audience] : audience)
  ) {
    throw new JWTClaimValidationFailed('unexpected "aud" claim value', 'aud', 'check_failed')
  }

  let tolerance: number
  switch (typeof options.clockTolerance) {
    case 'string':
      tolerance = secs(options.clockTolerance)
      break
    case 'number':
      tolerance = options.clockTolerance
      break
    case 'undefined':
      tolerance = 0
      break
    default:
      throw new TypeError('invalid clockTolerance option type')
  }

  const { currentDate } = options
  const now = epoch(currentDate || new Date())

  if (payload.iat !== undefined || options.maxTokenAge) {
    if (typeof payload.iat !== 'number') {
      throw new JWTClaimValidationFailed('"iat" claim must be a number', 'iat', 'invalid')
    }
    if (payload.exp === undefined && payload.iat > now + tolerance) {
      throw new JWTClaimValidationFailed(
        '"iat" claim timestamp check failed (it should be in the past)',
        'iat',
        'check_failed',
      )
    }
  }

  if (payload.nbf !== undefined) {
    if (typeof payload.nbf !== 'number') {
      throw new JWTClaimValidationFailed('"nbf" claim must be a number', 'nbf', 'invalid')
    }
    if (payload.nbf > now + tolerance) {
      throw new JWTClaimValidationFailed(
        '"nbf" claim timestamp check failed',
        'nbf',
        'check_failed',
      )
    }
  }

  if (payload.exp !== undefined) {
    if (typeof payload.exp !== 'number') {
      throw new JWTClaimValidationFailed('"exp" claim must be a number', 'exp', 'invalid')
    }
    if (payload.exp <= now - tolerance) {
      throw new JWTExpired('"exp" claim timestamp check failed', 'exp', 'check_failed')
    }
  }

  if (options.maxTokenAge) {
    const age = now - payload.iat!
    const max =
      typeof options.maxTokenAge === 'number' ? options.maxTokenAge : secs(options.maxTokenAge)

    if (age - tolerance > max) {
      throw new JWTExpired(
        '"iat" claim timestamp check failed (too far in the past)',
        'iat',
        'check_failed',
      )
    }

    if (age < 0 - tolerance) {
      throw new JWTClaimValidationFailed(
        '"iat" claim timestamp check failed (it should be in the past)',
        'iat',
        'check_failed',
      )
    }
  }

  return payload
}
