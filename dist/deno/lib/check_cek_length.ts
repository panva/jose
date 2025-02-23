import { JWEInvalid } from '../util/errors.ts'

export default (cek: Uint8Array, expected: number) => {
  const actual = cek.byteLength << 3
  if (actual !== expected) {
    throw new JWEInvalid(
      `Invalid Content Encryption Key length. Expected ${expected} bits, got ${actual} bits`,
    )
  }
}
