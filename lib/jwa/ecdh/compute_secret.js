const { createECDH, constants: { POINT_CONVERSION_UNCOMPRESSED } } = require('crypto')

const base64url = require('../../help/base64url')
const { name: secp256k1 } = require('../../jwk/key/secp256k1_crv')

const crvToCurve = (crv) => {
  switch (crv) {
    case 'P-256':
      return 'prime256v1'
    case 'P-384':
      return 'secp384r1'
    case 'P-521':
      return 'secp521r1'
    case 'secp256k1':
    case 'X448':
    case 'X25519':
      return crv
    case secp256k1:
      return 'secp256k1'
  }
}

const UNCOMPRESSED = Buffer.alloc(1, POINT_CONVERSION_UNCOMPRESSED)
const pubToBuffer = (x, y) => Buffer.concat([UNCOMPRESSED, base64url.decodeToBuffer(x), base64url.decodeToBuffer(y)])

module.exports = ({ crv, d }, { x, y = '' }) => {
  const curve = crvToCurve(crv)
  const exchange = createECDH(curve)

  exchange.setPrivateKey(base64url.decodeToBuffer(d))

  return exchange.computeSecret(pubToBuffer(x, y))
}
