const { createECDH, createHash, constants: { POINT_CONVERSION_UNCOMPRESSED } } = require('crypto')

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

const computeSecret = ({ crv, d }, { x, y = '' }) => {
  const curve = crvToCurve(crv)
  const exchange = createECDH(curve)

  exchange.setPrivateKey(base64url.decodeToBuffer(d))

  return exchange.computeSecret(pubToBuffer(x, y))
}

const concat = (key, length, value) => {
  const iterations = Math.ceil(length / 256)
  let res

  for (let iter = 1; iter <= iterations; iter++) {
    const buf = Buffer.allocUnsafe(4 + key.length + value.length)
    buf.writeUInt32BE(iter, 0)
    key.copy(buf, 4)
    value.copy(buf, 4 + key.length)
    if (!res) {
      res = createHash('sha256').update(buf).digest()
    } else {
      res = Buffer.concat([res, createHash('sha256').update(buf).digest()])
    }
  }

  return res.slice(0, length)
}

const uint32be = (value, buf = Buffer.allocUnsafe(4)) => {
  buf.writeUInt32BE(value)
  return buf
}

const lengthAndInput = input => Buffer.concat([uint32be(input.length), input])

const concatDerive = (key, pubKey, length, value) => {
  const shared = computeSecret(key, pubKey)
  return concat(shared, length, value)
}

const derive = (alg, keyLen, privKey, pubKey, { apu = Buffer.alloc(0), apv = Buffer.alloc(0) } = {}) => {
  const value = Buffer.concat([
    lengthAndInput(Buffer.from(alg)),
    lengthAndInput(apu),
    lengthAndInput(apv),
    uint32be(keyLen)
  ])

  return concatDerive(privKey, pubKey, keyLen / 8, value)
}

module.exports = derive
