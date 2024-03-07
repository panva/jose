import crypto from './webcrypto.ts'
import type { DigestFunction } from './interfaces.d.ts'

const digest: DigestFunction = async (
  algorithm: 'sha256' | 'sha384' | 'sha512',
  data: Uint8Array,
): Promise<Uint8Array> => {
  const subtleDigest = `SHA-${algorithm.slice(-3)}`
  return new Uint8Array(await crypto.subtle.digest(subtleDigest, data))
}
export default digest
