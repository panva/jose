import { JOSEError } from '../../util/errors.js'
import globalThis from './global.js'

export default globalThis.crypto
export function ensureSecureContext() {
  if (!globalThis.isSecureContext && !globalThis.crypto.subtle) {
    throw new JOSEError(
      'Web Cryptography API is available only in Secure Contexts. See: https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts',
    )
  }
}
