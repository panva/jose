const { createHash } = require('crypto')

const base64url = require('../help/base64url')

module.exports.kid = components => base64url.encodeBuffer(createHash('sha256').update(JSON.stringify(components)).digest())
