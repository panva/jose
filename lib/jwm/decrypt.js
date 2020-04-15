const isObject = require('../help/is_object')
const secs = require('../help/secs')
const epoch = require('../help/epoch')
const getKey = require('../help/get_key')
const JWE = require('../jwe')

const isString = require('./shared_validations').isString.bind(undefined, TypeError)
const isTimestamp = require('./shared_validations').isTimestamp.bind(undefined, TypeError)

const validateOptions = (options) => {
  //TODO: Validate Options
  //serialization: compact|json //compact only works with single recipient
  isString(options.serialization, 'options.serialization')
  if (options.serialization !== undefined && !(['compact', 'general'].includes(options.serialization))) {
    throw new TypeError('options.serialization must be compact or general')
  }
  options.serialization = options.serialization ? options.serialization : 'general'
}

module.exports = (jwm, key, options = {}) => {

  if (!isObject(options)) {
      throw new TypeError('options must be an object')
  }

  // key may also be keystore.

  decrypted = JWE.decrypt(jwm, key, { complete: true })

  decrypted.jwm =  JSON.parse(decrypted.cleartext)

  // this interface needs some thought. Right now, just unpacking the jwm
  //  and returning it along with the rest of the JWE info.  

  return decrypted;

}
