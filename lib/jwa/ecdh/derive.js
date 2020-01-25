const { createHash } = require('crypto')
const ecdhComputeSecret = require('./compute_secret')

const concat = (key, length, value) => {
  const iterations = Math.ceil(length / 32)
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

module.exports = (alg, keyLen, privKey, pubKey, { apu = Buffer.alloc(0), apv = Buffer.alloc(0) } = {}, computeSecret = ecdhComputeSecret) => {
  const value = Buffer.concat([
    lengthAndInput(Buffer.from(alg)),
    lengthAndInput(apu),
    lengthAndInput(apv),
    uint32be(keyLen)
  ])

  const sharedSecret = computeSecret(privKey, pubKey)
  return concat(sharedSecret, keyLen / 8, value)
}
