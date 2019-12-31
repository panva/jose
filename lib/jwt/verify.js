const isObject = require('../help/is_object')
const epoch = require('../help/epoch')
const secs = require('../help/secs')
const getKey = require('../help/get_key')
const JWS = require('../jws')
const { KeyStore } = require('../jwks')
const { JWTClaimInvalid } = require('../errors')

const { isString, isNotString } = require('./shared_validations')
const decode = require('./decode')

const isPayloadString = isString.bind(undefined, JWTClaimInvalid)
const isOptionString = isString.bind(undefined, TypeError)

const IDTOKEN = 'id_token'
const LOGOUTTOKEN = 'logout_token'
const ATJWT = 'at+JWT'

const isTimestamp = (value, label, required = false) => {
  if (required && value === undefined) {
    throw new JWTClaimInvalid(`"${label}" claim is missing`)
  }

  if (value !== undefined && (typeof value !== 'number' || !Number.isSafeInteger(value))) {
    throw new JWTClaimInvalid(`"${label}" claim must be a unix timestamp`)
  }
}

const isStringOrArrayOfStrings = (value, label, required = false) => {
  if (required && value === undefined) {
    throw new JWTClaimInvalid(`"${label}" claim is missing`)
  }

  if (value !== undefined && (isNotString(value) && isNotArrayOfStrings(value))) {
    throw new JWTClaimInvalid(`"${label}" claim must be a string or array of strings`)
  }
}

const isNotArrayOfStrings = val => !Array.isArray(val) || val.length === 0 || val.some(isNotString)

const validateOptions = (options) => {
  isOptionString(options.profile, 'options.profile')

  if (typeof options.complete !== 'boolean') {
    throw new TypeError('options.complete must be a boolean')
  }

  if (typeof options.ignoreExp !== 'boolean') {
    throw new TypeError('options.ignoreExp must be a boolean')
  }

  if (typeof options.ignoreNbf !== 'boolean') {
    throw new TypeError('options.ignoreNbf must be a boolean')
  }

  if (typeof options.ignoreIat !== 'boolean') {
    throw new TypeError('options.ignoreIat must be a boolean')
  }

  isOptionString(options.maxTokenAge, 'options.maxTokenAge')
  isOptionString(options.subject, 'options.subject')
  isOptionString(options.issuer, 'options.issuer')
  isOptionString(options.maxAuthAge, 'options.maxAuthAge')
  isOptionString(options.jti, 'options.jti')
  isOptionString(options.clockTolerance, 'options.clockTolerance')

  if (options.audience !== undefined && (isNotString(options.audience) && isNotArrayOfStrings(options.audience))) {
    throw new TypeError('options.audience must be a string or an array of strings')
  }

  if (options.algorithms !== undefined && isNotArrayOfStrings(options.algorithms)) {
    throw new TypeError('options.algorithms must be an array of strings')
  }

  isOptionString(options.nonce, 'options.nonce')

  if (!(options.now instanceof Date) || !options.now.getTime()) {
    throw new TypeError('options.now must be a valid Date object')
  }

  if (options.ignoreIat && options.maxTokenAge !== undefined) {
    throw new TypeError('options.ignoreIat and options.maxTokenAge cannot used together')
  }

  if (options.crit !== undefined && isNotArrayOfStrings(options.crit)) {
    throw new TypeError('options.crit must be an array of strings')
  }

  switch (options.profile) {
    case IDTOKEN:
      if (!options.issuer) {
        throw new TypeError('"issuer" option is required to validate an ID Token')
      }

      if (!options.audience) {
        throw new TypeError('"audience" option is required to validate an ID Token')
      }

      break
    case ATJWT:
      if (!options.issuer) {
        throw new TypeError('"issuer" option is required to validate a JWT Access Token')
      }

      if (!options.audience) {
        throw new TypeError('"audience" option is required to validate a JWT Access Token')
      }

      break
    case LOGOUTTOKEN:
      if (!options.issuer) {
        throw new TypeError('"issuer" option is required to validate a Logout Token')
      }

      if (!options.audience) {
        throw new TypeError('"audience" option is required to validate a Logout Token')
      }

      break
    case undefined:
      break
    default:
      throw new TypeError(`unsupported options.profile value "${options.profile}"`)
  }
}

const validateTypes = ({ header, payload }, profile) => {
  isPayloadString(header.alg, '"alg" header parameter', true)

  isTimestamp(payload.iat, 'iat', profile === IDTOKEN || profile === LOGOUTTOKEN)
  isTimestamp(payload.exp, 'exp', profile === IDTOKEN || profile === ATJWT)
  isTimestamp(payload.auth_time, 'auth_time')
  isTimestamp(payload.nbf, 'nbf')
  isPayloadString(payload.jti, '"jti" claim', profile === LOGOUTTOKEN)
  isPayloadString(payload.acr, '"acr" claim')
  isPayloadString(payload.nonce, '"nonce" claim')
  isPayloadString(payload.iss, '"iss" claim', profile === IDTOKEN || profile === ATJWT || profile === LOGOUTTOKEN)
  isPayloadString(payload.sub, '"sub" claim', profile === IDTOKEN || profile === ATJWT)
  isStringOrArrayOfStrings(payload.aud, 'aud', profile === IDTOKEN || profile === ATJWT || profile === LOGOUTTOKEN)
  isPayloadString(payload.azp, '"azp" claim', profile === IDTOKEN && Array.isArray(payload.aud) && payload.aud.length > 1)
  isStringOrArrayOfStrings(payload.amr, 'amr')

  if (profile === ATJWT) {
    isPayloadString(payload.client_id, '"client_id" claim', true)
    isPayloadString(header.typ, '"typ" header parameter', true)
  }

  if (profile === LOGOUTTOKEN) {
    isPayloadString(payload.sid, '"sid" claim')

    if (!('sid' in payload) && !('sub' in payload)) {
      throw new JWTClaimInvalid('either "sid" or "sub" (or both) claims must be present')
    }

    if ('nonce' in payload) {
      throw new JWTClaimInvalid('"nonce" claim is prohibited')
    }

    if (!('events' in payload)) {
      throw new JWTClaimInvalid('"events" claim is missing')
    }

    if (!isObject(payload.events)) {
      throw new JWTClaimInvalid('"events" claim must be an object')
    }

    if (!('http://schemas.openid.net/event/backchannel-logout' in payload.events)) {
      throw new JWTClaimInvalid('"http://schemas.openid.net/event/backchannel-logout" member is missing in the "events" claim')
    }

    if (!isObject(payload.events['http://schemas.openid.net/event/backchannel-logout'])) {
      throw new JWTClaimInvalid('"http://schemas.openid.net/event/backchannel-logout" member in the "events" claim must be an object')
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
    algorithms, audience, clockTolerance, complete = false, crit, ignoreExp = false,
    ignoreIat = false, ignoreNbf = false, issuer, jti, maxAuthAge, maxTokenAge, nonce, now = new Date(),
    subject, profile
  } = options

  validateOptions({
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
  })

  const unix = epoch(now)

  const decoded = decode(token, { complete: true })
  validateTypes(decoded, profile)

  if (issuer && decoded.payload.iss !== issuer) {
    throw new JWTClaimInvalid('issuer mismatch')
  }

  if (nonce && decoded.payload.nonce !== nonce) {
    throw new JWTClaimInvalid('nonce mismatch')
  }

  if (subject && decoded.payload.sub !== subject) {
    throw new JWTClaimInvalid('subject mismatch')
  }

  if (jti && decoded.payload.jti !== jti) {
    throw new JWTClaimInvalid('jti mismatch')
  }

  if (audience && !checkAudiencePresence(decoded.payload.aud, typeof audience === 'string' ? [audience] : audience, profile)) {
    throw new JWTClaimInvalid('audience mismatch')
  }

  const tolerance = clockTolerance ? secs(clockTolerance) : 0

  if (maxAuthAge) {
    if (!('auth_time' in decoded.payload)) {
      throw new JWTClaimInvalid('missing auth_time')
    }

    const maxAuthAgeSeconds = secs(maxAuthAge)
    if (decoded.payload.auth_time + maxAuthAgeSeconds < unix - tolerance) {
      throw new JWTClaimInvalid('too much time has elapsed since the last End-User authentication')
    }
  }

  if (!ignoreIat && !('exp' in decoded.payload) && 'iat' in decoded.payload && decoded.payload.iat > unix + tolerance) {
    throw new JWTClaimInvalid('token issued in the future')
  }

  if (!ignoreNbf && 'nbf' in decoded.payload && decoded.payload.nbf > unix + tolerance) {
    throw new JWTClaimInvalid('token is not active yet')
  }

  if (!ignoreExp && 'exp' in decoded.payload && decoded.payload.exp <= unix - tolerance) {
    throw new JWTClaimInvalid('token is expired')
  }

  if (maxTokenAge) {
    if (!('iat' in decoded.payload)) {
      throw new JWTClaimInvalid('missing iat claim')
    }

    if (decoded.payload.iat + secs(maxTokenAge) < unix + tolerance) {
      throw new JWTClaimInvalid('maxTokenAge exceeded')
    }
  }

  if (profile === IDTOKEN && Array.isArray(decoded.payload.aud) && decoded.payload.aud.length > 1 && decoded.payload.azp !== audience) {
    throw new JWTClaimInvalid('azp mismatch')
  }

  if (profile === ATJWT && decoded.header.typ !== ATJWT) {
    throw new JWTClaimInvalid('invalid JWT typ header value for the used validation profile')
  }

  key = getKey(key, true)

  if (complete && key instanceof KeyStore) {
    ({ key } = JWS.verify(token, key, { crit, algorithms, complete: true }))
  } else {
    JWS.verify(token, key, { crit, algorithms })
  }

  return complete ? { ...decoded, key } : decoded.payload
}
