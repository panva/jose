const isObject = require('../help/is_object')
const epoch = require('../help/epoch')
const secs = require('../help/secs')
const JWS = require('../jws')
const { KeyStore } = require('../jwks')
const { JWTClaimInvalid } = require('../errors')

const { isString, isNotString } = require('./shared_validations')
const decode = require('./decode')

const isPayloadString = isString.bind(undefined, JWTClaimInvalid)
const isOptionString = isString.bind(undefined, TypeError)

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
    case 'id_token':
      if (!options.issuer) {
        throw new TypeError('"issuer" option is required to validate an ID Token')
      }

      if (!options.audience) {
        throw new TypeError('"audience" option is required to validate an ID Token')
      }

      break
    case undefined:
      break
    default:
      throw new TypeError(`unsupported options.profile value "${options.profile}"`)
  }
}

const validatePayloadTypes = (payload, profile) => {
  isTimestamp(payload.iat, 'iat', profile === 'id_token')
  isTimestamp(payload.exp, 'exp', profile === 'id_token')
  isTimestamp(payload.auth_time, 'auth_time')
  isTimestamp(payload.nbf, 'nbf')
  isPayloadString(payload.jti, '"jti" claim')
  isPayloadString(payload.acr, '"acr" claim')
  isPayloadString(payload.nonce, '"nonce" claim')
  isPayloadString(payload.iss, '"iss" claim', profile === 'id_token')
  isPayloadString(payload.sub, '"sub" claim', profile === 'id_token')
  isStringOrArrayOfStrings(payload.aud, 'aud', profile === 'id_token')
  isPayloadString(payload.azp, '"azp" claim', profile === 'id_token' && Array.isArray(payload.aud) && payload.aud.length > 1)
  isStringOrArrayOfStrings(payload.amr, 'amr')
}

const checkAudiencePresence = (audPayload, audOption) => {
  if (typeof audPayload === 'string') {
    return audOption.includes(audPayload)
  }

  audPayload = new Set(audPayload)
  return audOption.some(Set.prototype.has.bind(audPayload))
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
  validatePayloadTypes(decoded.payload, profile)

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

  if (audience && !checkAudiencePresence(decoded.payload.aud, typeof audience === 'string' ? [audience] : audience)) {
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

  if (!ignoreIat && 'iat' in decoded.payload && decoded.payload.iat > unix + tolerance) {
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

  if (profile === 'id_token' && Array.isArray(decoded.payload.aud) && decoded.payload.aud.length > 1 && decoded.payload.azp !== audience) {
    throw new JWTClaimInvalid('azp mismatch')
  }

  if (complete && key instanceof KeyStore) {
    ({ key } = JWS.verify(token, key, { crit, algorithms, complete: true }))
  } else {
    JWS.verify(token, key, { crit, algorithms })
  }

  return complete ? { ...decoded, key } : decoded.payload
}
