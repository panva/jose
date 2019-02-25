const { JOSECritNotUnderstood, JWSInvalid } = require('../errors')

const DEFINED = new Set([
  'alg', 'jku', 'jwk', 'kid', 'x5u', 'x5c', 'x5t', 'x5t#S256', 'typ', 'cty',
  'crit', 'enc', 'zip', 'epk', 'apu', 'apv', 'iv', 'tag', 'p2s', 'p2c'
])

module.exports = function validateCrit (Err, protectedHeader, unprotectedHeader, understood) {
  if (protectedHeader && 'crit' in protectedHeader) {
    if (
      !Array.isArray(protectedHeader.crit) ||
      protectedHeader.crit.length === 0 ||
      protectedHeader.crit.some(s => typeof s !== 'string' || !s)
    ) {
      throw new Err('"crit" Header Parameter MUST be an array of non-empty strings when present')
    }
    const whitelisted = new Set(understood)
    const combined = { ...protectedHeader, ...unprotectedHeader }
    protectedHeader.crit.forEach((parameter) => {
      if (DEFINED.has(parameter)) {
        throw new Err(`The critical list contains a non-extension Header Parameter ${parameter}`)
      }
      if (!whitelisted.has(parameter)) {
        throw new JOSECritNotUnderstood(`critical "${parameter}" is not understood`)
      }
      if (parameter === 'b64') {
        if (!('b64' in protectedHeader)) {
          throw new JWSInvalid('"b64" critical parameter must be integrity protected')
        }
        if (typeof protectedHeader.b64 !== 'boolean') {
          throw new JWSInvalid('"b64" critical parameter must be a boolean')
        }
      } else if (!(parameter in combined)) {
        throw new Err(`critical parameter "${parameter}" is missing`)
      }
    })
  }
  if (unprotectedHeader && 'crit' in unprotectedHeader) {
    throw new Err('"crit" Header Parameter MUST be integrity protected when present')
  }
}
