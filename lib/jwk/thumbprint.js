const { createHash } = require('crypto')

const base64url = require('../help/base64url')

module.exports.kid = (key) => {
  let json

  switch (key.kty) {
    case 'RSA':
      json = JSON.stringify({ e: key.e, kty: 'RSA', n: key.n })
      break
    case 'EC':
      json = JSON.stringify({ crv: key.crv, kty: 'EC', x: key.x, y: key.y })
      break
    case 'oct':
      json = JSON.stringify({ k: key.k, kty: 'oct' })
      break
  }

  return base64url.encode(createHash('sha256').update(json).digest())
}
