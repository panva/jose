const fromBase64 = base64 => base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

const toBase64 = base64url => base64url.replace(/-/g, '+').replace(/_/g, '/')

const encode = (input, encoding = 'utf8') => {
  if (Buffer.isBuffer(input)) {
    return fromBase64(input.toString('base64'))
  }

  return fromBase64(Buffer.from(input, encoding).toString('base64'))
}

const decode = (input, encoding = 'utf8') => {
  const buf = Buffer.from(toBase64(input), 'base64')
  return encoding ? buf.toString(encoding) : buf
}

const decodeToBuffer = input => Buffer.from(toBase64(input), 'base64')

const b64uJSON = {
  encode: input => encode(JSON.stringify(input)),
  decode: input => JSON.parse(decode(input))
}

b64uJSON.decode.try = (input) => {
  try {
    return b64uJSON.decode(input)
  } catch (err) {
    return decode(input)
  }
}

module.exports.decodeToBuffer = decodeToBuffer
module.exports.decode = decode
module.exports.encode = encode
module.exports.JSON = b64uJSON
