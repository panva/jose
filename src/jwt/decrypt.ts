import { compactDecrypt } from '../jwe/compact/decrypt.js'
import type {
  JWTPayload,
  CryptoKey,
  DecryptOptions,
  JWTClaimVerificationOptions,
  GetKeyFunction,
  CompactJWEHeaderParameters,
  FlattenedJWE,
  JWTDecryptResult,
  ResolvedKey,
  KeyObject,
  JWK,
} from '../types.d.ts'
import jwtPayload from '../lib/jwt_claims_set.js'
import { JWTClaimValidationFailed } from '../util/errors.js'

/** Combination of JWE Decryption options and JWT Claims Set verification options. */
export interface JWTDecryptOptions extends DecryptOptions, JWTClaimVerificationOptions {}

/**
 * Interface for JWT Decryption dynamic key resolution. No token components have been verified at
 * the time of this function call.
 */
export interface JWTDecryptGetKey
  extends GetKeyFunction<CompactJWEHeaderParameters, FlattenedJWE> {}

/**
 * Verifies the JWT format (to be a JWE Compact format), decrypts the ciphertext, validates the JWT
 * Claims Set.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/jwt/decrypt'`.
 *
 * @example
 *
 * ```js
 * const secret = jose.base64url.decode('zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lvI')
 * const jwt =
 *   'eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..MB66qstZBPxAXKdsjet_lA.WHbtJTl4taHp7otOHLq3hBvv0yNPsPEKHYInmCPdDDeyV1kU-f-tGEiU4FxlSqkqAT2hVs8_wMNiQFAzPU1PUgIqWCPsBrPP3TtxYsrtwagpn4SvCsUsx0Mhw9ZhliAO8CLmCBQkqr_T9AcYsz5uZw.7nX9m7BGUu_u1p1qFHzyIg'
 *
 * const { payload, protectedHeader } = await jose.jwtDecrypt(jwt, secret, {
 *   issuer: 'urn:example:issuer',
 *   audience: 'urn:example:audience',
 * })
 *
 * console.log(protectedHeader)
 * console.log(payload)
 * ```
 *
 * @param jwt JSON Web Token value (encoded as JWE).
 * @param key Private Key or Secret to decrypt and verify the JWT with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWT Decryption and JWT Claims Set validation options.
 */
export async function jwtDecrypt<PayloadType = JWTPayload>(
  jwt: string | Uint8Array,
  key: CryptoKey | KeyObject | JWK | Uint8Array,
  options?: JWTDecryptOptions,
): Promise<JWTDecryptResult<PayloadType>>
/**
 * @param jwt JSON Web Token value (encoded as JWE).
 * @param getKey Function resolving Private Key or Secret to decrypt and verify the JWT with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWT Decryption and JWT Claims Set validation options.
 */
export async function jwtDecrypt<PayloadType = JWTPayload>(
  jwt: string | Uint8Array,
  getKey: JWTDecryptGetKey,
  options?: JWTDecryptOptions,
): Promise<JWTDecryptResult<PayloadType> & ResolvedKey>
export async function jwtDecrypt(
  jwt: string | Uint8Array,
  key: CryptoKey | KeyObject | JWK | Uint8Array | JWTDecryptGetKey,
  options?: JWTDecryptOptions,
) {
  const decrypted = await compactDecrypt(jwt, key as Parameters<typeof compactDecrypt>[1], options)
  const payload = jwtPayload(decrypted.protectedHeader, decrypted.plaintext, options)

  const { protectedHeader } = decrypted

  if (protectedHeader.iss !== undefined && protectedHeader.iss !== payload.iss) {
    throw new JWTClaimValidationFailed(
      'replicated "iss" claim header parameter mismatch',
      payload,
      'iss',
      'mismatch',
    )
  }

  if (protectedHeader.sub !== undefined && protectedHeader.sub !== payload.sub) {
    throw new JWTClaimValidationFailed(
      'replicated "sub" claim header parameter mismatch',
      payload,
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
      payload,
      'aud',
      'mismatch',
    )
  }

  const result = { payload, protectedHeader }

  if (typeof key === 'function') {
    return { ...result, key: decrypted.key }
  }

  return result
}
