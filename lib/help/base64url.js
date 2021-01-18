let encode
let encodeBuffer
if (Buffer.isEncoding('base64url')) {
  encode = (input, encoding = 'utf8') => Buffer.from(input, encoding).toString('base64url')
  encodeBuffer = (buf) => buf.toString('base64url')
} else {
  const fromBase64 = (base64) => base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  encode = (input, encoding = 'utf8') => fromBase64(Buffer.from(input, encoding).toString('base64'))
  encodeBuffer = (buf) => fromBase64(buf.toString('base64'))
}

const decodeToBuffer = (input) => {
  return Buffer.from(input, 'base64')
}

const decode = (input, encoding = 'utf8') => {
  return decodeToBuffer(input).toString(encoding)
}

const b64uJSON = {
  encode: (input) => {
    return encode(JSON.stringify(input))
  },
  decode: (input, encoding = 'utf8') => {
    return JSON.parse(decode(input, encoding))
  }
}

b64uJSON.decode.try = (input, encoding = 'utf8') => {
  try {
    return b64uJSON.decode(input, encoding)
  } catch (err) {
    return decode(input, encoding)
  }
}

const bnToBuf = (bn) => {
  let hex = BigInt(bn).toString(16)
  if (hex.length % 2) {
    hex = `0${hex}`
  }

  const len = hex.length / 2
  const u8 = new Uint8Array(len)

  let i = 0
  let j = 0
  while (i < len) {
    u8[i] = parseInt(hex.slice(j, j + 2), 16)
    i += 1
    j += 2
  }

  return u8
}

const encodeBigInt = (bn) => encodeBuffer(Buffer.from(bnToBuf(bn)))

module.exports.decode = decode
module.exports.decodeToBuffer = decodeToBuffer
module.exports.encode = encode
module.exports.encodeBuffer = encodeBuffer
module.exports.JSON = b64uJSON
module.exports.encodeBigInt = encodeBigInt
