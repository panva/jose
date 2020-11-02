import { createHash } from 'crypto'

export default (digest: 'sha256' | 'sha384' | 'sha512', data: Uint8Array): Uint8Array => {
  return createHash(digest).update(data).digest()
}
