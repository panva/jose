const isObject = require('../help/is_object')
const secs = require('../help/secs')
const epoch = require('../help/epoch')
const getKey = require('../help/get_key')
const JWE = require('../jwe')

const isString = require('./shared_validations').isString.bind(undefined, TypeError)
const isTimestamp = require('./shared_validations').isTimestamp.bind(undefined, TypeError)

const validateAttributes = (attributes) => {

  isString(attributes.id, 'attributes.id')
  isString(attributes.type, 'attributes.type')
  
  if (attributes.body !== undefined && !isObject(attributes.body)) {
    throw new TypeError('attributes.body must be an object')
  }

  isString(attributes.to, 'attributes.to')
  isString(attributes.from, 'attributes.from')
  isString(attributes.thread_id, 'attributes.thread_id')

  isTimestamp(attributes.created_time, 'attributes.created_time')
  isTimestamp(attributes.expires_time, 'attributes.expires_time')

  isString(attributes.reply_url, 'attributes.reply_url')
  isString(attributes.reply_to, 'attributes.reply_to')
  
}

const validateOptions = (options) => {
  //TODO: Validate Options
  //serialization: compact|json //compact only works with single recipient
  isString(options.serialization, 'options.serialization')
  if (options.serialization !== undefined && !(['compact', 'general'].includes(options.serialization))) {
    throw new TypeError('options.serialization must be compact or general')
  }
  options.serialization = options.serialization ? options.serialization : 'general'
}

module.exports = (attributes, recipients, senderkey = null, options = {}) => {
  if (!isObject(attributes)) {
      throw new TypeError('attributes must be an object')
  }
  if (!isObject(options)) {
      throw new TypeError('options must be an object')
  }
        
  validateAttributes(attributes)

  validateOptions(options)

  attributes_string = JSON.stringify(attributes)
  protectedheader = {
    'type': 'JWM',
    //'enc': 'A256GCM',
    //'alg' : 'ECDH-ES+A256KW'
  }
  if(options.enc !== undefined){
    protectedheader.enc = options.enc
  }
  if(options.alg !== undefined){
    protectedheader.alg = options.alg
  }

  encrypt = new JWE.Encrypt(attributes_string, protectedheader)

  if (!Array.isArray(recipients)) {
    throw new TypeError('recipients must be an array')
  }
  if (!recipients.length) {
    throw new TypeError('recipients array requires at least one recipient')
  }

  //TODO: Validate Recipients (pass through validation to JWE)
  recipients.forEach((r) => {
    encrypt.recipient(r.key, r.header)
  })
  


  encrypted_jwm = encrypt.encrypt(options.serialization)

  return encrypted_jwm;

  /*return JWS.sign(JSON.stringify(payload), key, {
    ...header,
    alg: algorithm || header.alg,
    kid: includeKid ? key.kid : header.kid
  })*/
}
