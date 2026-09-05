/**
 * JSON Web Token (JWT) Decryption (JWT is in JWE format)
 *
 * @module
 */

import type * as types from '../types.d.ts'
import { prepareDecrypt, decryptCompact } from '../lib/jwe_decrypt.js'
import type { DecryptGetKey } from '../lib/jwe_decrypt.js'
import { validateClaimsSet } from '../lib/jwt_claims_set.js'
import { JWTClaimValidationFailed } from '../util/errors.js'

/** JWE decryption and JWT Claims Set validation options. */
export interface JWTDecryptOptions
  extends types.DecryptOptions, types.JWTClaimVerificationOptions {}

/**
 * Resolves a JWT decryption key. No token components have been authenticated when this function is
 * called.
 *
 * @typeParam KeyType Type definition of the keys the function resolves. Narrowing it is what lets
 *   {@link types.ResolvedKey.key ResolvedKey.key} be inferred at the call site.
 */
export interface JWTDecryptGetKey<
  KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array,
> extends types.GetKeyFunction<
  types.CompactJWEHeaderParameters,
  types.FlattenedJWE,
  KeyType | types.KeyObject | types.JWK
> {}

/**
 * Decrypts a Compact JWE-formatted JWT and validates its Claims Set.
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
 * @param key Private key or shared secret to decrypt and verify the JWT with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWT Decryption and JWT Claims Set validation options.
 */
export function jwtDecrypt<PayloadType = types.JWTPayload>(
  jwt: string | Uint8Array,
  key: types.KeyInput,
  options?: JWTDecryptOptions,
): Promise<types.JWTDecryptResult<PayloadType>>
/**
 * Decrypts a JWT and validates its claims, returning the dynamically
 * {@link types.ResolvedKey.key resolved key}.
 *
 * @param jwt JSON Web Token value (encoded as JWE).
 * @param getKey Function resolving a private key or shared secret to decrypt and verify the JWT
 *   with. See {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWT Decryption and JWT Claims Set validation options.
 */
export function jwtDecrypt<
  PayloadType = types.JWTPayload,
  KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array,
>(
  jwt: string | Uint8Array,
  getKey: JWTDecryptGetKey<KeyType>,
  options?: JWTDecryptOptions,
): Promise<types.JWTDecryptResult<PayloadType> & types.ResolvedKey<KeyType>>
/**
 * Accepts a key or key resolver. Use this overload when forwarding either form; the result includes
 * `key` only when a resolver was used.
 *
 * @param jwt JSON Web Token value (encoded as JWE).
 * @param key Private key or shared secret, or a function resolving one, to decrypt and verify the
 *   JWT with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWT Decryption and JWT Claims Set validation options.
 */
export function jwtDecrypt<PayloadType = types.JWTPayload>(
  jwt: string | Uint8Array,
  key: types.KeyInput | JWTDecryptGetKey,
  options?: JWTDecryptOptions,
): Promise<types.JWTDecryptResult<PayloadType> & Partial<types.ResolvedKey>>
export async function jwtDecrypt(
  jwt: string | Uint8Array,
  key: types.KeyInput | JWTDecryptGetKey,
  options?: JWTDecryptOptions,
) {
  const { plaintext, ...result } = await decryptCompact(
    jwt,
    prepareDecrypt(options),
    key as types.KeyInput | DecryptGetKey,
  )
  const { protectedHeader } = result
  const payload = validateClaimsSet(protectedHeader, plaintext, options)

  for (const claim of ['iss', 'sub', 'aud'] as const) {
    if (
      protectedHeader[claim] !== undefined &&
      (claim === 'aud'
        ? JSON.stringify(protectedHeader.aud) !== JSON.stringify(payload.aud)
        : protectedHeader[claim] !== payload[claim])
    ) {
      throw new JWTClaimValidationFailed(
        `replicated "${claim}" claim header parameter mismatch`,
        payload,
        claim,
        'mismatch',
      )
    }
  }

  return { payload, ...result }
}
