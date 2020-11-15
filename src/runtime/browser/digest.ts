import crypto, { ensureSecureContext } from './webcrypto.js'
import type { DigestFunction } from '../interfaces.d'

const digest: DigestFunction = async (
  algorithm: 'sha256' | 'sha384' | 'sha512',
  data: Uint8Array,
): Promise<Uint8Array> => {
  ensureSecureContext()
  const subtleDigest = `SHA-${algorithm.substr(-3)}`
  return new Uint8Array(await crypto.subtle.digest(subtleDigest, data))
}
export default digest
