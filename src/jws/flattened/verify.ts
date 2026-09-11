/**
 * Verifying JSON Web Signature (JWS) in Flattened JSON Serialization
 *
 * @module
 *
 * @see {@link https://www.rfc-editor.org/info/rfc7515/#section-7.2.2 RFC 7515, Section 7.2.2}
 */

import type * as types from '../../types.d.ts'
import { JWSInvalid } from '../../util/errors.js'
import { isObject } from '../../lib/validate.js'
import {
  encodeJsonUnencodedPayload,
  prepareVerify,
  snapshotJws,
  verifySignature,
} from '../../lib/jws_verify.js'

/**
 * Resolves a key for Flattened JWS verification from unverified headers and token data.
 *
 * @typeParam KeyType Type definition of the keys the function resolves. Narrowing it is what lets
 *   {@link types.ResolvedKey.key ResolvedKey.key} be inferred at the call site.
 *
 * @see {@link jwks/remote.createRemoteJWKSet createRemoteJWKSet} to verify using a remote JSON Web Key Set.
 */
export interface FlattenedVerifyGetKey<
  KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array,
> extends types.GetKeyFunction<
  types.JWSHeaderParameters,
  types.FlattenedJWSInput,
  KeyType | types.KeyObject | types.JWK
> {}

/**
 * Validates a flattened JWS JSON Serialization (digital signature or MAC) and decodes its JWS
 * Payload.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/jws/flattened/verify'`.
 *
 * @example
 *
 * ```js
 * const decoder = new TextDecoder()
 * const jws = {
 *   signature:
 *     'FVVOXwj6kD3DqdfD9yYqfT2W9jv-Nop4kOehp_DeDGNB5dQNSPRvntBY6xH3uxlCxE8na9d_kyhYOcanpDJ0EA',
 *   payload: 'SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4',
 *   protected: 'eyJhbGciOiJFUzI1NiJ9',
 * }
 *
 * const { payload, protectedHeader } = await jose.flattenedVerify(jws, publicKey)
 *
 * console.log(protectedHeader)
 * console.log(decoder.decode(payload))
 * ```
 *
 * @param jws Flattened JWS.
 * @param key Public key or shared secret. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWS Verify options.
 */
export function flattenedVerify(
  jws: types.FlattenedJWSInput,
  key: types.KeyInput,
  options?: types.VerifyOptions,
): Promise<types.FlattenedVerifyResult>
/**
 * Validates a flattened JWS JSON Serialization (digital signature or MAC) and decodes its JWS
 * Payload with a dynamically resolved key, included in the result.
 *
 * @param jws Flattened JWS.
 * @param getKey Resolves a public key or shared secret from unverified token data.
 * @param options JWS Verify options.
 */
export function flattenedVerify<
  KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array,
>(
  jws: types.FlattenedJWSInput,
  getKey: FlattenedVerifyGetKey<KeyType>,
  options?: types.VerifyOptions,
): Promise<types.FlattenedVerifyResult & types.ResolvedKey<KeyType>>
/**
 * Validates a flattened JWS JSON Serialization (digital signature or MAC) and decodes its JWS
 * Payload using a key or key resolver. The result includes `key` only when a resolver is used.
 *
 * @param jws Flattened JWS.
 * @param key Public key or shared secret, or a function resolving one.
 * @param options JWS Verify options.
 */
export function flattenedVerify(
  jws: types.FlattenedJWSInput,
  key: types.KeyInput | FlattenedVerifyGetKey,
  options?: types.VerifyOptions,
): Promise<types.FlattenedVerifyResult & Partial<types.ResolvedKey>>
export async function flattenedVerify(
  jws: types.FlattenedJWSInput,
  key: types.KeyInput | FlattenedVerifyGetKey,
  options?: types.VerifyOptions,
) {
  if (!isObject(jws)) {
    throw new JWSInvalid('Flattened JWS must be an object')
  }

  const snapshot = snapshotJws(jws)
  const [result] = await verifySignature(
    snapshot,
    prepareVerify(options),
    key,
    encodeJsonUnencodedPayload,
  )
  return result
}
