import { createHash } from 'crypto'
import type { DigestFunction } from '../interfaces.d'

const digest: DigestFunction = (
  algorithm: 'sha256' | 'sha384' | 'sha512',
  data: Uint8Array,
): Uint8Array => createHash(algorithm).update(data).digest()
export default digest
