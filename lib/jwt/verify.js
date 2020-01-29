const isObject = require('../help/is_object')
const epoch = require('../help/epoch')
const secs = require('../help/secs')
const getKey = require('../help/get_key')
const { bare: verify } = require('../jws/verify')
const { JWTClaimInvalid, JWTExpired } = require('../errors')

const { isString, isNotString } = require('./shared_validations')
const decode = require('./decode')

const isPayloadString = isString.bind(undefined, JWTClaimInvalid)
const isOptionString = isString.bind(undefined, TypeError)

const IDTOKEN = 'id_token'
const LOGOUTTOKEN = 'logout_token'
const ATJWT = 'at+JWT'

const isTimestamp = (value, label, required = false) => {
  if (required && value === undefined) {
    throw new JWTClaimInvalid(`"${label}" claim is missing`, label, 'missing')
  }

  if (value !== undefined && (typeof value !== 'number' || !Number.isSafeInteger(value))) {
    throw new JWTClaimInvalid(`"${label}" claim must be a unix timestamp`, label, 'invalid')
  }
}

const isStringOrArrayOfStrings = (value, label, required = false) => {
  if (required && value === undefined) {
    throw new JWTClaimInvalid(`"${label}" claim is missing`, label, 'missing')
  }

  if (value !== undefined && (isNotString(value) && isNotArrayOfStrings(value))) {
    throw new JWTClaimInvalid(`"${label}" claim must be a string or array of strings`, label, 'invalid')
  }
}

const isNotArrayOfStrings = val => !Array.isArray(val) || val.length === 0 || val.some(isNotString)

const validateOptions = ({
  algorithms, audience, clockTolerance, complete = false, crit, ignoreExp = false,
  ignoreIat = false, ignoreNbf = false, issuer, jti, maxAuthAge, maxTokenAge, nonce, now = new Date(),
  profile, subject
}) => {
  isOptionString(profile, 'options.profile')

  if (typeof complete !== 'boolean') {
    throw new TypeError('options.complete must be a boolean')
  }

  if (typeof ignoreExp !== 'boolean') {
    throw new TypeError('options.ignoreExp must be a boolean')
  }

  if (typeof ignoreNbf !== 'boolean') {
    throw new TypeError('options.ignoreNbf must be a boolean')
  }

  if (typeof ignoreIat !== 'boolean') {
    throw new TypeError('options.ignoreIat must be a boolean')
  }

  isOptionString(maxTokenAge, 'options.maxTokenAge')
  isOptionString(subject, 'options.subject')
  isOptionString(issuer, 'options.issuer')
  isOptionString(maxAuthAge, 'options.maxAuthAge')
  isOptionString(jti, 'options.jti')
  isOptionString(clockTolerance, 'options.clockTolerance')

  if (audience !== undefined && (isNotString(audience) && isNotArrayOfStrings(audience))) {
    throw new TypeError('options.audience must be a string or an array of strings')
  }

  if (algorithms !== undefined && isNotArrayOfStrings(algorithms)) {
    throw new TypeError('options.algorithms must be an array of strings')
  }

  isOptionString(nonce, 'options.nonce')

  if (!(now instanceof Date) || !now.getTime()) {
    throw new TypeError('options.now must be a valid Date object')
  }

  if (ignoreIat && maxTokenAge !== undefined) {
    throw new TypeError('options.ignoreIat and options.maxTokenAge cannot used together')
  }

  if (crit !== undefined && isNotArrayOfStrings(crit)) {
    throw new TypeError('options.crit must be an array of strings')
  }

  switch (profile) {
    case IDTOKEN:
      if (!issuer) {
        throw new TypeError('"issuer" option is required to validate an ID Token')
      }

      if (!audience) {
        throw new TypeError('"audience" option is required to validate an ID Token')
      }

      break
    case ATJWT:
      if (!issuer) {
        throw new TypeError('"issuer" option is required to validate a JWT Access Token')
      }

      if (!audience) {
        throw new TypeError('"audience" option is required to validate a JWT Access Token')
      }

      break
    case LOGOUTTOKEN:
      if (!issuer) {
        throw new TypeError('"issuer" option is required to validate a Logout Token')
      }

      if (!audience) {
        throw new TypeError('"audience" option is required to validate a Logout Token')
      }

      break
    case undefined:
      break
    default:
      throw new TypeError(`unsupported options.profile value "${profile}"`)
  }

  return {
    algorithms,
    audience,
    clockTolerance,
    complete,
    crit,
    ignoreExp,
    ignoreIat,
    ignoreNbf,
    issuer,
    jti,
    maxAuthAge,
    maxTokenAge,
    nonce,
    now,
    profile,
    subject
  }
}

const validateTypes = ({ header, payload }, profile, options) => {
  isPayloadString(header.alg, '"alg" header parameter', 'alg', true)

  isTimestamp(payload.iat, 'iat', profile === IDTOKEN || profile === LOGOUTTOKEN || !!options.maxTokenAge)
  isTimestamp(payload.exp, 'exp', profile === IDTOKEN || profile === ATJWT)
  isTimestamp(payload.auth_time, 'auth_time', !!options.maxAuthAge)
  isTimestamp(payload.nbf, 'nbf')
  isPayloadString(payload.jti, '"jti" claim', 'jti', profile === LOGOUTTOKEN || !!options.jti)
  isPayloadString(payload.acr, '"acr" claim', 'acr')
  isPayloadString(payload.nonce, '"nonce" claim', 'nonce', !!options.nonce)
  isPayloadString(payload.iss, '"iss" claim', 'iss', profile === IDTOKEN || profile === ATJWT || profile === LOGOUTTOKEN || !!options.issuer)
  isPayloadString(payload.sub, '"sub" claim', 'sub', profile === IDTOKEN || profile === ATJWT || !!options.subject)
  isStringOrArrayOfStrings(payload.aud, 'aud', profile === IDTOKEN || profile === ATJWT || profile === LOGOUTTOKEN || !!options.audience)
  isPayloadString(payload.azp, '"azp" claim', 'azp', profile === IDTOKEN && Array.isArray(payload.aud) && payload.aud.length > 1)
  isStringOrArrayOfStrings(payload.amr, 'amr')

  if (profile === ATJWT) {
    isPayloadString(payload.client_id, '"client_id" claim', 'client_id', true)
    isPayloadString(header.typ, '"typ" header parameter', 'typ', true)
  }

  if (profile === LOGOUTTOKEN) {
    isPayloadString(payload.sid, '"sid" claim', 'sid')

    if (!('sid' in payload) && !('sub' in payload)) {
      throw new JWTClaimInvalid('either "sid" or "sub" (or both) claims must be present')
    }

    if ('nonce' in payload) {
      throw new JWTClaimInvalid('"nonce" claim is prohibited', 'nonce', 'prohibited')
    }

    if (!('events' in payload)) {
      throw new JWTClaimInvalid('"events" claim is missing', 'events', 'missing')
    }

    if (!isObject(payload.events)) {
      throw new JWTClaimInvalid('"events" claim must be an object', 'events', 'invalid')
    }

    if (!('http://schemas.openid.net/event/backchannel-logout' in payload.events)) {
      throw new JWTClaimInvalid('"http://schemas.openid.net/event/backchannel-logout" member is missing in the "events" claim', 'events', 'invalid')
    }

    if (!isObject(payload.events['http://schemas.openid.net/event/backchannel-logout'])) {
      throw new JWTClaimInvalid('"http://schemas.openid.net/event/backchannel-logout" member in the "events" claim must be an object', 'events', 'invalid')
    }
  }
}

const checkAudiencePresence = (audPayload, audOption, profile) => {
  if (typeof audPayload === 'string') {
    return audOption.includes(audPayload)
  }

  if (profile === ATJWT) {
    // reject if it contains additional audiences that are not known aliases of the resource
    // indicator of the current resource server
    audOption = new Set(audOption)
    return audPayload.every(Set.prototype.has.bind(audOption))
  } else {
    // Each principal intended to process the JWT MUST
    // identify itself with a value in the audience claim
    audPayload = new Set(audPayload)
    return audOption.some(Set.prototype.has.bind(audPayload))
  }
}

module.exports = (token, key, options = {}) => {
  if (!isObject(options)) {
    throw new TypeError('options must be an object')
  }

  const {
    algorithms, audience, clockTolerance, complete, crit, ignoreExp, ignoreIat, ignoreNbf, issuer,
    jti, maxAuthAge, maxTokenAge, nonce, now, profile, subject
  } = options = validateOptions(options)

  const decoded = decode(token, { complete: true })
  key = getKey(key, true)

  if (complete) {
    ({ key } = verify(true, 'preparsed', { decoded, token }, key, { crit, algorithms, complete: true }))
    decoded.key = key
  } else {
    verify(true, 'preparsed', { decoded, token }, key, { crit, algorithms })
  }

  const unix = epoch(now)
  validateTypes(decoded, profile, options)

  if (issuer && decoded.payload.iss !== issuer) {
    throw new JWTClaimInvalid('unexpected "iss" claim value', 'iss', 'check_failed')
  }

  if (nonce && decoded.payload.nonce !== nonce) {
    throw new JWTClaimInvalid('unexpected "nonce" claim value', 'nonce', 'check_failed')
  }

  if (subject && decoded.payload.sub !== subject) {
    throw new JWTClaimInvalid('unexpected "sub" claim value', 'sub', 'check_failed')
  }

  if (jti && decoded.payload.jti !== jti) {
    throw new JWTClaimInvalid('unexpected "jti" claim value', 'jti', 'check_failed')
  }

  if (audience && !checkAudiencePresence(decoded.payload.aud, typeof audience === 'string' ? [audience] : audience, profile)) {
    throw new JWTClaimInvalid('unexpected "aud" claim value', 'aud', 'check_failed')
  }

  const tolerance = clockTolerance ? secs(clockTolerance) : 0

  if (maxAuthAge) {
    const maxAuthAgeSeconds = secs(maxAuthAge)
    if (decoded.payload.auth_time + maxAuthAgeSeconds < unix - tolerance) {
      throw new JWTClaimInvalid('"auth_time" claim timestamp check failed (too much time has elapsed since the last End-User authentication)', 'auth_time', 'check_failed')
    }
  }

  if (!ignoreIat && !('exp' in decoded.payload) && 'iat' in decoded.payload && decoded.payload.iat > unix + tolerance) {
    throw new JWTClaimInvalid('"iat" claim timestamp check failed (it should be in the past)', 'iat', 'check_failed')
  }

  if (!ignoreNbf && 'nbf' in decoded.payload && decoded.payload.nbf > unix + tolerance) {
    throw new JWTClaimInvalid('"nbf" claim timestamp check failed', 'nbf', 'check_failed')
  }

  if (!ignoreExp && 'exp' in decoded.payload && decoded.payload.exp <= unix - tolerance) {
    throw new JWTExpired('"exp" claim timestamp check failed', 'exp', 'check_failed')
  }

  if (maxTokenAge) {
    const age = unix - decoded.payload.iat
    const max = secs(maxTokenAge)

    if (age - tolerance > max) {
      throw new JWTExpired('"iat" claim timestamp check failed (too far in the past)', 'iat', 'check_failed')
    }

    if (age < 0 - tolerance) {
      throw new JWTClaimInvalid('"iat" claim timestamp check failed (it should be in the past)', 'iat', 'check_failed')
    }
  }

  if (profile === IDTOKEN && Array.isArray(decoded.payload.aud) && decoded.payload.aud.length > 1 && decoded.payload.azp !== audience) {
    throw new JWTClaimInvalid('unexpected "azp" claim value', 'azp', 'check_failed')
  }

  if (profile === ATJWT && decoded.header.typ !== ATJWT) {
    throw new JWTClaimInvalid('invalid JWT typ header value for the used validation profile', 'typ', 'check_failed')
  }

  return complete ? decoded : decoded.payload
}
