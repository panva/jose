import verify from '../jws/compact/verify.js'
import type {
  KeyLike,
  VerifyOptions,
  JWTPayload,
  JWTClaimVerificationOptions,
  JWSHeaderParameters,
  GetKeyFunction,
  FlattenedJWSInput,
  JWTVerifyResult,
} from '../types.d'
import jwtPayload from '../lib/jwt_claims_set.js'
import { JWTInvalid } from '../util/errors.js'

/**
 * Combination of JWS Verification options and JWT Claims Set verification options.
 */
interface JWTVerifyOptions extends VerifyOptions, JWTClaimVerificationOptions {}

/**
 * Interface for JWT Verification dynamic key resolution.
 * No token components have been verified at the time of this function call.
 */
export interface JWTVerifyGetKey extends GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput> {}

/**
 * Verifies the JWT format (to be a JWS Compact format), verifies the JWS signature, validates the JWT Claims Set.
 *
 * @param jwt JSON Web Token value (encoded as JWS).
 * @param key Key, or a function resolving a key, to verify the JWT with.
 * @param options JWT Decryption and JWT Claims Set validation options.
 *
 * @example
 * ```js
 * // ESM import
 * import { jwtVerify } from 'jose/jwt/verify'
 * ```
 *
 * @example
 * ```js
 * // CJS import
 * const { jwtVerify } = require('jose/jwt/verify')
 * ```
 *
 * @example
 * ```js
 * // usage
 * import { parseJwk } from 'jose/jwk/parse'
 *
 * const jwt = 'eyJhbGciOiJFUzI1NiJ9.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZSwiaWF0IjoxNjA0MzE1MDc0LCJpc3MiOiJ1cm46ZXhhbXBsZTppc3N1ZXIiLCJhdWQiOiJ1cm46ZXhhbXBsZTphdWRpZW5jZSJ9.hx1nOfAT5LlXuzu8O-bhjXBGpklWDt2EsHw7-MDn49NrnwvVsstNhEnkW2ddauB7eSikFtUNeumLpFI9CWDBsg'
 * const publicKey = await parseJwk({
 *   alg: 'ES256',
 *   crv: 'P-256',
 *   kty: 'EC',
 *   x: 'ySK38C1jBdLwDsNWKzzBHqKYEE5Cgv-qjWvorUXk9fw',
 *   y: '_LeQBw07cf5t57Iavn4j-BqJsAD1dpoz8gokd3sBsOo'
 * })
 * const { payload, protectedHeader } = await jwtVerify(jwt, publicKey, {
 *   issuer: 'urn:example:issuer',
 *   audience: 'urn:example:audience'
 * })
 *
 * console.log(protectedHeader)
 * console.log(payload)
 * ```
 */
async function jwtVerify(
  jwt: string | Uint8Array,
  key: KeyLike | JWTVerifyGetKey,
  options?: JWTVerifyOptions,
): Promise<JWTVerifyResult> {
  const verified = await verify(jwt, key, options)
  if (verified.protectedHeader.crit?.includes('b64') && verified.protectedHeader.b64 === false) {
    throw new JWTInvalid('JWTs MUST NOT use unencoded payload')
  }
  const payload = jwtPayload(verified.protectedHeader, verified.payload, options)
  return { payload, protectedHeader: verified.protectedHeader }
}

export { jwtVerify }
export default jwtVerify
export type { KeyLike, JWTPayload, JWTVerifyOptions, JWSHeaderParameters, GetKeyFunction }
