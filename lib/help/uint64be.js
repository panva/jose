const MAX_INT32 = Math.pow(2, 32)

module.exports = (value, buf = Buffer.allocUnsafe(8)) => {
  const high = Math.floor(value / MAX_INT32)
  const low = value % MAX_INT32

  buf.writeUInt32BE(high, 0)
  buf.writeUInt32BE(low, 4)
  return buf
}
