const { createHash } = require('crypto')

const base64url = require('../help/base64url')

const xt5 = (hash, cert) => base64url.encodeBuffer(createHash(hash).update(Buffer.from(cert, 'base64')).digest())

module.exports.kid = components => base64url.encodeBuffer(createHash('sha256').update(JSON.stringify(components)).digest())
module.exports.x5t = xt5.bind(undefined, 'sha1')
module.exports['x5t#S256'] = xt5.bind(undefined, 'sha256')
