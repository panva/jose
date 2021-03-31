import decrypt from '../jwe/compact/decrypt.js'
import type {
  KeyLike,
  DecryptOptions,
  JWTPayload,
  JWTClaimVerificationOptions,
  GetKeyFunction,
  JWEHeaderParameters,
  FlattenedJWE,
  JWTDecryptResult,
} from '../types.d'
import jwtPayload from '../lib/jwt_claims_set.js'
import { JWTClaimValidationFailed } from '../util/errors.js'

/**
 * Combination of JWE Decryption options and JWT Claims Set verification options.
 */
interface JWTDecryptOptions extends DecryptOptions, JWTClaimVerificationOptions {}

/**
 * Interface for JWT Decryption dynamic key resolution.
 * No token components have been verified at the time of this function call.
 */
export interface JWTDecryptGetKey extends GetKeyFunction<JWEHeaderParameters, FlattenedJWE> {}

/**
 * Verifies the JWT format (to be a JWE Compact format), decrypts the ciphertext, validates the JWT Claims Set.
 *
 * @param jwt JSON Web Token value (encoded as JWE).
 * @param key Private Key or Secret, or a function resolving one, to decrypt and verify the JWT with.
 * @param options JWT Decryption and JWT Claims Set validation options.
 *
 * @example ESM import
 * ```js
 * import { jwtDecrypt } from 'jose/jwt/decrypt'
 * ```
 *
 * @example CJS import
 * ```js
 * const { jwtDecrypt } = require('jose/jwt/decrypt')
 * ```
 *
 * @example Usage
 * ```js
 * const jwt = 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..KVcNLqK-3-8ZkYIC.xSwF4VxO0kUMUD2W-cifsNUxnr-swyBq-nADBptyt6y9n79-iNc5b0AALJpRwc0wwDkJw8hNOMjApNUTMsK9b-asToZ3DXFMvwfJ6n1aWefvd7RsoZ2LInWFfVAuttJDzoGB.uuexQoWHwrLMEYRElT8pBQ'
 *
 * const { payload, protectedHeader } = await jwtDecrypt(jwt, secretKey, {
 *   issuer: 'urn:example:issuer',
 *   audience: 'urn:example:audience'
 * })
 *
 * console.log(protectedHeader)
 * console.log(payload)
 * ```
 */
async function jwtDecrypt(
  jwt: string | Uint8Array,
  key: KeyLike | JWTDecryptGetKey,
  options?: JWTDecryptOptions,
): Promise<JWTDecryptResult> {
  const decrypted = await decrypt(jwt, key, options)
  const payload = jwtPayload(decrypted.protectedHeader, decrypted.plaintext, options)

  const { protectedHeader } = decrypted

  if (protectedHeader.iss !== undefined && protectedHeader.iss !== payload.iss) {
    throw new JWTClaimValidationFailed(
      'replicated "iss" claim header parameter mismatch',
      'iss',
      'mismatch',
    )
  }

  if (protectedHeader.sub !== undefined && protectedHeader.sub !== payload.sub) {
    throw new JWTClaimValidationFailed(
      'replicated "sub" claim header parameter mismatch',
      'sub',
      'mismatch',
    )
  }

  if (
    protectedHeader.aud !== undefined &&
    JSON.stringify(protectedHeader.aud) !== JSON.stringify(payload.aud)
  ) {
    throw new JWTClaimValidationFailed(
      'replicated "aud" claim header parameter mismatch',
      'aud',
      'mismatch',
    )
  }

  return { payload, protectedHeader }
}

export { jwtDecrypt }
export default jwtDecrypt
export type { KeyLike, DecryptOptions, JWTPayload, JWTDecryptOptions }
