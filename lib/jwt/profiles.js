const { JWTClaimInvalid } = require('../errors')
const secs = require('../help/secs')
const epoch = require('../help/epoch')
const isObject = require('../help/is_object')

const verify = require('./verify')
const {
  isString,
  isRequired,
  isTimestamp,
  isStringOrArrayOfStrings
} = require('./shared_validations')

const isPayloadRequired = isRequired.bind(undefined, JWTClaimInvalid)
const isPayloadString = isString.bind(undefined, JWTClaimInvalid)
const isOptionString = isString.bind(undefined, TypeError)

const defineLazyExportWithWarning = (obj, property, name, definition) => {
  Object.defineProperty(obj, property, {
    enumerable: true,
    configurable: true,
    value (...args) {
      process.emitWarning(
        `The ${name} API implements an IETF draft. Breaking draft implementations are included as minor versions of the jose library, therefore, the ~ semver operator should be used and close attention be payed to library changelog as well as the drafts themselves.`,
        'DraftWarning'
      )
      Object.defineProperty(obj, property, {
        enumerable: true,
        configurable: true,
        value: definition
      })
      return obj[property](...args)
    }
  })
}

const validateCommonOptions = (options, profile) => {
  if (!isObject(options)) {
    throw new TypeError('options must be an object')
  }

  if (!options.issuer) {
    throw new TypeError(`"issuer" option is required to validate ${profile}`)
  }

  if (!options.audience) {
    throw new TypeError(`"audience" option is required to validate ${profile}`)
  }
}

module.exports = {
  IdToken: {
    verify: (token, key, options = {}) => {
      validateCommonOptions(options, 'an ID Token')

      if ('maxAuthAge' in options) {
        isOptionString(options.maxAuthAge, 'options.maxAuthAge')
      }
      if ('nonce' in options) {
        isOptionString(options.nonce, 'options.nonce')
      }

      const unix = epoch(options.now || new Date())
      const result = verify(token, key, { ...options })
      const payload = options.complete ? result.payload : result

      if (Array.isArray(payload.aud) && payload.aud.length > 1) {
        isPayloadRequired(payload.azp, '"azp" claim', 'azp')
      }
      isPayloadRequired(payload.iat, '"iat" claim', 'iat')
      isPayloadRequired(payload.sub, '"sub" claim', 'sub')
      isPayloadRequired(payload.exp, '"exp" claim', 'exp')
      isTimestamp(payload.auth_time, 'auth_time', !!options.maxAuthAge)
      isPayloadString(payload.nonce, '"nonce" claim', 'nonce', !!options.nonce)
      isPayloadString(payload.acr, '"acr" claim', 'acr')
      isStringOrArrayOfStrings(payload.amr, 'amr')

      if (options.nonce && payload.nonce !== options.nonce) {
        throw new JWTClaimInvalid('unexpected "nonce" claim value', 'nonce', 'check_failed')
      }

      const tolerance = options.clockTolerance ? secs(options.clockTolerance) : 0

      if (options.maxAuthAge) {
        const maxAuthAgeSeconds = secs(options.maxAuthAge)
        if (payload.auth_time + maxAuthAgeSeconds < unix - tolerance) {
          throw new JWTClaimInvalid('"auth_time" claim timestamp check failed (too much time has elapsed since the last End-User authentication)', 'auth_time', 'check_failed')
        }
      }

      if (Array.isArray(payload.aud) && payload.aud.length > 1 && payload.azp !== options.audience) {
        throw new JWTClaimInvalid('unexpected "azp" claim value', 'azp', 'check_failed')
      }

      return result
    }
  },
  LogoutToken: {},
  AccessToken: {}
}

defineLazyExportWithWarning(module.exports.LogoutToken, 'verify', 'jose.JWT.LogoutToken.verify', (token, key, options = {}) => {
  validateCommonOptions(options, 'a Logout Token')

  const result = verify(token, key, { ...options })
  const payload = options.complete ? result.payload : result

  isPayloadRequired(payload.iat, '"iat" claim', 'iat')
  isPayloadRequired(payload.jti, '"jti" claim', 'jti')
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

  return result
})

defineLazyExportWithWarning(module.exports.AccessToken, 'verify', 'jose.JWT.AccessToken.verify', (token, key, options = {}) => {
  validateCommonOptions(options, 'a JWT Access Token')

  isOptionString(options.maxAuthAge, 'options.maxAuthAge')

  const unix = epoch(options.now || new Date())
  const typ = 'at+JWT'
  const result = verify(token, key, { ...options, typ })
  const payload = options.complete ? result.payload : result

  isPayloadRequired(payload.iat, '"iat" claim', 'iat')
  isPayloadRequired(payload.exp, '"exp" claim', 'exp')
  isPayloadRequired(payload.sub, '"sub" claim', 'sub')
  isPayloadRequired(payload.jti, '"jti" claim', 'jti')
  isPayloadString(payload.client_id, '"client_id" claim', 'client_id', true)
  isTimestamp(payload.auth_time, 'auth_time', !!options.maxAuthAge)
  isPayloadString(payload.acr, '"acr" claim', 'acr')
  isStringOrArrayOfStrings(payload.amr, 'amr')

  const tolerance = options.clockTolerance ? secs(options.clockTolerance) : 0

  if (options.maxAuthAge) {
    const maxAuthAgeSeconds = secs(options.maxAuthAge)
    if (payload.auth_time + maxAuthAgeSeconds < unix - tolerance) {
      throw new JWTClaimInvalid('"auth_time" claim timestamp check failed (too much time has elapsed since the last End-User authentication)', 'auth_time', 'check_failed')
    }
  }

  return result
})
