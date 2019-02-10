const { timingSafeEqual: TSE } = require('crypto')

const paddedBuffer = (input, length) => {
  if (input.length === length) {
    return input
  }

  const buffer = Buffer.alloc(length)
  input.copy(buffer)
  return buffer
}

const timingSafeEqual = (a, b) => {
  const length = Math.max(a.length, b.length)
  return TSE(paddedBuffer(a, length), paddedBuffer(b, length))
}

module.exports = timingSafeEqual
