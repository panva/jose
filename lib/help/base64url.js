const fromBase64 = (base64) => {
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

const encode = (input, encoding = 'utf8') => {
  return fromBase64(Buffer.from(input, encoding).toString('base64'))
}

const encodeBuffer = (buf) => {
  return fromBase64(buf.toString('base64'))
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

const encodeBN = (bn) => encodeBuffer(bn.toBuffer())

module.exports.decode = decode
module.exports.decodeToBuffer = decodeToBuffer
module.exports.encode = encode
module.exports.encodeBuffer = encodeBuffer
module.exports.JSON = b64uJSON
module.exports.encodeBN = encodeBN
