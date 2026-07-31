import { concat } from './buffer_utils.js'

const scalarLength = 32

function encodeInteger(integer: Uint8Array): Uint8Array {
  let offset = 0
  while (offset < integer.length - 1 && integer[offset] === 0) offset++
  const value = integer.subarray(offset)
  const padding = value[0] & 0x80 ? 1 : 0
  const header = new Uint8Array(2 + padding)
  header.set([0x02, value.length + padding])
  return concat(header, value)
}

// draft-ietf-jose-pq-composite-sigs-06, Section 4.2.1: encode fixed-width R || S as Ecdsa-Sig-Value.
export function encodeSignature(fixedWidthSignature: Uint8Array): Uint8Array {
  if (fixedWidthSignature.length !== 2 * scalarLength) {
    throw new TypeError('Invalid ECDSA signature length')
  }
  const r = encodeInteger(fixedWidthSignature.subarray(0, scalarLength))
  const s = encodeInteger(fixedWidthSignature.subarray(scalarLength))
  return concat(Uint8Array.of(0x30, r.length + s.length), r, s)
}

// draft-ietf-jose-pq-composite-sigs-06, Section 4.2.1: require DER and restore fixed-width R || S.
export function decodeSignature(derSignature: Uint8Array): Uint8Array {
  const invalid = () => new TypeError('Invalid ECDSA signature encoding')
  if (
    derSignature.length < 8 ||
    derSignature.length > 2 * scalarLength + 8 ||
    derSignature[0] !== 0x30 ||
    derSignature[1] !== derSignature.length - 2
  ) {
    throw invalid()
  }

  const fixedWidthSignature = new Uint8Array(2 * scalarLength)
  let offset = 2
  for (const start of [0, scalarLength]) {
    if (derSignature[offset++] !== 0x02) throw invalid()
    let length = derSignature[offset++]
    if (
      !length ||
      length > scalarLength + 1 ||
      offset + length > derSignature.length ||
      derSignature[offset] & 0x80
    ) {
      throw invalid()
    }
    if (length > 1 && derSignature[offset] === 0) {
      if (derSignature[offset + 1] < 0x80) throw invalid()
      offset++
      length--
    }
    if (length > scalarLength) throw invalid()
    fixedWidthSignature.set(
      derSignature.subarray(offset, offset + length),
      start + scalarLength - length,
    )
    offset += length
  }
  if (offset !== derSignature.length) throw invalid()
  return fixedWidthSignature
}

// draft-ietf-jose-pq-composite-sigs-06, Section 4.2.2: P-256 ECPrivateKey has parameters, no publicKey.
const privateKeyPrefix = Uint8Array.of(0x30, 0x31, 0x02, 0x01, 0x01, 0x04, scalarLength)
const privateKeySuffix = Uint8Array.of(0xa0, 0x0a, 0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07) // prettier-ignore

export function encodePrivateKey(privateScalar: Uint8Array): Uint8Array {
  if (privateScalar.length !== scalarLength) {
    throw new TypeError('Invalid ECDSA private key length')
  }
  return concat(privateKeyPrefix, privateScalar, privateKeySuffix)
}

export function decodePrivateKey(ecPrivateKey: Uint8Array): Uint8Array {
  if (
    ecPrivateKey.length !== privateKeyPrefix.length + scalarLength + privateKeySuffix.length ||
    privateKeyPrefix.some((byte, index) => ecPrivateKey[index] !== byte) ||
    privateKeySuffix.some(
      (byte, index) => ecPrivateKey[privateKeyPrefix.length + scalarLength + index] !== byte,
    )
  ) {
    throw new TypeError('Invalid ECDSA private key encoding')
  }
  return ecPrivateKey.subarray(privateKeyPrefix.length, privateKeyPrefix.length + scalarLength)
}
