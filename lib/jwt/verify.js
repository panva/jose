const isObject = require('../help/is_object')
const epoch = require('../help/epoch')
const secs = require('../help/secs')
const getKey = require('../help/get_key')
const { bare: verify } = require('../jws/verify')
const { JWTClaimInvalid, JWTExpired } = require('../errors')

const {
  isString,
  isNotString,
  isNotArrayOfStrings,
  isTimestamp,
  isStringOrArrayOfStrings
} = require('./shared_validations')
const decode = require('./decode')

const isPayloadString = isString.bind(undefined, JWTClaimInvalid)
const isOptionString = isString.bind(undefined, TypeError)

const normalizeTyp = (value) => value.toLowerCase().replace(/^application\//, '')

const validateOptions = ({
  algorithms, audience, clockTolerance, complete = false, crit, ignoreExp = false,
  ignoreIat = false, ignoreNbf = false, issuer, jti, maxTokenAge, now = new Date(),
  subject, typ
}) => {
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
  isOptionString(jti, 'options.jti')
  isOptionString(clockTolerance, 'options.clockTolerance')
  isOptionString(typ, 'options.typ')

  if (issuer !== undefined && (isNotString(issuer) && isNotArrayOfStrings(issuer))) {
    throw new TypeError('options.issuer must be a string or an array of strings')
  }

  if (audience !== undefined && (isNotString(audience) && isNotArrayOfStrings(audience))) {
    throw new TypeError('options.audience must be a string or an array of strings')
  }

  if (algorithms !== undefined && isNotArrayOfStrings(algorithms)) {
    throw new TypeError('options.algorithms must be an array of strings')
  }

  if (!(now instanceof Date) || !now.getTime()) {
    throw new TypeError('options.now must be a valid Date object')
  }

  if (ignoreIat && maxTokenAge !== undefined) {
    throw new TypeError('options.ignoreIat and options.maxTokenAge cannot used together')
  }

  if (crit !== undefined && isNotArrayOfStrings(crit)) {
    throw new TypeError('options.crit must be an array of strings')
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
    maxTokenAge,
    now,
    subject,
    typ
  }
}

const validateTypes = ({ header, payload }, options) => {
  isPayloadString(header.alg, '"alg" header parameter', 'alg', true)

  isTimestamp(payload.iat, 'iat', !!options.maxTokenAge)
  isTimestamp(payload.exp, 'exp')
  isTimestamp(payload.nbf, 'nbf')
  isPayloadString(payload.jti, '"jti" claim', 'jti', !!options.jti)
  isStringOrArrayOfStrings(payload.iss, 'iss', !!options.issuer)
  isPayloadString(payload.sub, '"sub" claim', 'sub', !!options.subject)
  isStringOrArrayOfStrings(payload.aud, 'aud', !!options.audience)
  isPayloadString(header.typ, '"typ" header parameter', 'typ', !!options.typ)
}

const checkAudiencePresence = (audPayload, audOption) => {
  if (typeof audPayload === 'string') {
    return audOption.includes(audPayload)
  }

  // Each principal intended to process the JWT MUST
  // identify itself with a value in the audience claim
  audPayload = new Set(audPayload)
  return audOption.some(Set.prototype.has.bind(audPayload))
}

module.exports = (token, key, options = {}) => {
  if (!isObject(options)) {
    throw new TypeError('options must be an object')
  }

  const {
    algorithms, audience, clockTolerance, complete, crit, ignoreExp, ignoreIat, ignoreNbf, issuer,
    jti, maxTokenAge, now, subject, typ
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
  validateTypes(decoded, options)

  if (issuer && (typeof decoded.payload.iss !== 'string' || !(typeof issuer === 'string' ? [issuer] : issuer).includes(decoded.payload.iss))) {
    throw new JWTClaimInvalid('unexpected "iss" claim value', 'iss', 'check_failed')
  }

  if (subject && decoded.payload.sub !== subject) {
    throw new JWTClaimInvalid('unexpected "sub" claim value', 'sub', 'check_failed')
  }

  if (jti && decoded.payload.jti !== jti) {
    throw new JWTClaimInvalid('unexpected "jti" claim value', 'jti', 'check_failed')
  }

  if (audience && !checkAudiencePresence(decoded.payload.aud, typeof audience === 'string' ? [audience] : audience)) {
    throw new JWTClaimInvalid('unexpected "aud" claim value', 'aud', 'check_failed')
  }

  if (typ && normalizeTyp(decoded.header.typ) !== normalizeTyp(typ)) {
    throw new JWTClaimInvalid('unexpected "typ" JWT header value', 'typ', 'check_failed')
  }

  const tolerance = clockTolerance ? secs(clockTolerance) : 0

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

  return complete ? decoded : decoded.payload
}
