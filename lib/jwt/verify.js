const isObject = require('../help/is_object')
const epoch = require('../help/epoch')
const secs = require('../help/secs')
const JWS = require('../jws')
const { KeyStore } = require('../jwks')
const { JWTClaimInvalid } = require('../errors')

const { isStringOptional, isNotString } = require('./shared_validations')
const decode = require('./decode')

const isPayloadStringOptional = isStringOptional.bind(undefined, JWTClaimInvalid)
const isOptionStringOptional = isStringOptional.bind(undefined, TypeError)

const isTimestampOptional = (value, label) => {
  if (value !== undefined && (typeof value !== 'number' || !Number.isSafeInteger(value))) {
    throw new JWTClaimInvalid(`"${label}" claim must be a unix timestamp`)
  }
}

const isStringOrArrayOfStringsOptional = (value, label) => {
  if (value !== undefined && (isNotString(value) && isNotArrayOfStrings(value))) {
    throw new JWTClaimInvalid(`"${label}" claim must be a string or array of strings`)
  }
}

const isNotArrayOfStrings = val => !Array.isArray(val) || val.length === 0 || val.some(isNotString)

const validateOptions = (options) => {
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

  isOptionStringOptional(options.maxTokenAge, 'options.maxTokenAge')
  isOptionStringOptional(options.subject, 'options.subject')
  isOptionStringOptional(options.issuer, 'options.issuer')
  isOptionStringOptional(options.maxAuthAge, 'options.maxAuthAge')
  isOptionStringOptional(options.jti, 'options.jti')
  isOptionStringOptional(options.clockTolerance, 'options.clockTolerance')

  if (options.audience !== undefined && (isNotString(options.audience) && isNotArrayOfStrings(options.audience))) {
    throw new TypeError('options.audience must be a string or an array of strings')
  }

  if (options.algorithms !== undefined && isNotArrayOfStrings(options.algorithms)) {
    throw new TypeError('options.algorithms must be an array of strings')
  }

  isOptionStringOptional(options.nonce, 'options.nonce')

  if (!(options.now instanceof Date) || !options.now.getTime()) {
    throw new TypeError('options.now must be a valid Date object')
  }

  if (options.ignoreIat && options.maxTokenAge !== undefined) {
    throw new TypeError('options.ignoreIat and options.maxTokenAge cannot used together')
  }

  if (options.crit !== undefined && isNotArrayOfStrings(options.crit)) {
    throw new TypeError('options.crit must be an array of strings')
  }
}

const validatePayloadTypes = (payload) => {
  isTimestampOptional(payload.iat, 'iat')
  isTimestampOptional(payload.exp, 'exp')
  isTimestampOptional(payload.auth_time, 'auth_time')
  isTimestampOptional(payload.nbf, 'nbf')
  isPayloadStringOptional(payload.jti, '"jti" claim')
  isPayloadStringOptional(payload.acr, '"acr" claim')
  isPayloadStringOptional(payload.nonce, '"nonce" claim')
  isPayloadStringOptional(payload.iss, '"iss" claim')
  isPayloadStringOptional(payload.sub, '"sub" claim')
  isPayloadStringOptional(payload.azp, '"azp" claim')
  isStringOrArrayOfStringsOptional(payload.aud, 'aud')
  isStringOrArrayOfStringsOptional(payload.amr, 'amr')
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
    ignoreIat = false, ignoreNbf = false, issuer, jti, maxAuthAge, maxTokenAge, nonce, now = new Date(), subject
  } = options

  validateOptions({
    algorithms, audience, clockTolerance, complete, crit, ignoreExp, ignoreIat, ignoreNbf, issuer, jti, maxAuthAge, maxTokenAge, nonce, now, subject
  })

  const unix = epoch(now)

  const decoded = decode(token, { complete: true })
  validatePayloadTypes(decoded.payload)

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

  if (complete && key instanceof KeyStore) {
    ({ key } = JWS.verify(token, key, { crit, algorithms, complete: true }))
  } else {
    JWS.verify(token, key, { crit, algorithms })
  }

  return complete ? { ...decoded, key } : decoded.payload
}
