const { createHash } = require('crypto')

const base64url = require('../help/base64url')

const x5t = (hash, cert) => base64url.encodeBuffer(createHash(hash).update(Buffer.from(cert, 'base64')).digest())

module.exports.kid = components => base64url.encodeBuffer(createHash('sha256').update(JSON.stringify(components)).digest())
module.exports.x5t = x5t.bind(undefined, 'sha1')
module.exports['x5t#S256'] = x5t.bind(undefined, 'sha256')
