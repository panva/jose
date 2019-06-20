const b64uRegExp = /^[a-zA-Z0-9_-]*$/

const fromBase64 = (base64) => {
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

const toBase64 = (base64url) => {
  return base64url.replace(/-/g, '+').replace(/_/g, '/')
}

const encode = (input, encoding = 'utf8') => {
  return fromBase64(Buffer.from(input, encoding).toString('base64'))
}

const encodeBuffer = (buf) => {
  return fromBase64(buf.toString('base64'))
}

const decode = (input) => {
  if (!b64uRegExp.test(input)) {
    throw new TypeError('input is not a valid base64url encoded string')
  }
  return Buffer.from(toBase64(input), 'base64').toString('utf8')
}

const decodeToBuffer = (input) => {
  if (!b64uRegExp.test(input)) {
    throw new TypeError('input is not a valid base64url encoded string')
  }
  return Buffer.from(toBase64(input), 'base64')
}

const b64uJSON = {
  encode: (input) => {
    return encode(JSON.stringify(input))
  },
  decode: (input) => {
    return JSON.parse(decode(input))
  }
}

b64uJSON.decode.try = (input) => {
  try {
    return b64uJSON.decode(input)
  } catch (err) {
    return decode(input)
  }
}

const encodeBN = (bn) => encodeBuffer(bn.toBuffer())

module.exports.decode = decode
module.exports.decodeToBuffer = decodeToBuffer
module.exports.encode = encode
module.exports.encodeBuffer = encodeBuffer
module.exports.JSON = b64uJSON
module.exports.encodeBN = encodeBN
