import { JOSEError } from '../../util/errors.js'
import { globals } from '../../util/globals';

const { crypto } = globals

export default crypto
export function ensureSecureContext() {
  if (!globals.isSecureContext && !crypto.subtle) {
    throw new JOSEError(
      'Web Cryptography API is available only in Secure Contexts. See: https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts',
    )
  }
}
