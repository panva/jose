import { JOSEError } from '../../util/errors.js'

const { crypto } = window

export default crypto
export function ensureSecureContext() {
  if (!window.isSecureContext && !crypto.subtle) {
    throw new JOSEError(
      'Web Cryptography API is available only in Secure Contexts. See: https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts',
    )
  }
}
