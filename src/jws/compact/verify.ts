/**
 * Verifying JSON Web Signature (JWS) in Compact Serialization
 *
 * @module
 */

import type * as types from '../../types.d.ts'
import { createCompactVerifyFunction } from '../../lib/jws_serialization.js'
import { jwsAlgorithm } from '../../lib/jws_algorithms.js'

const verify = createCompactVerifyFunction(jwsAlgorithm)

/**
 * Interface for Compact JWS Verification dynamic key resolution. No token components have been
 * verified at the time of this function call.
 *
 * @typeParam KeyType Type definition of the keys the function resolves. Narrowing it is what lets
 *   {@link types.ResolvedKey.key ResolvedKey.key} be inferred at the call site.
 *
 * @see {@link jwks/remote.createRemoteJWKSet createRemoteJWKSet} to verify using a remote JSON Web Key Set.
 */
export interface CompactVerifyGetKey<
  KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array,
> extends types.GetKeyFunction<
  types.CompactJWSHeaderParameters,
  types.FlattenedJWSInput,
  KeyType | types.KeyObject | types.JWK
> {}

/**
 * Verifies the signature and format of and afterwards decodes the Compact JWS.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/jws/compact/verify'`.
 *
 * @example
 *
 * ```js
 * const jws =
 *   'eyJhbGciOiJFUzI1NiJ9.SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4.kkAs_gPPxWMI3rHuVlxHaTPfDWDoqdI8jSvuSmqV-8IHIWXg9mcAeC9ggV-45ZHRbiRJ3obUIFo1rHphPA5URg'
 *
 * const { payload, protectedHeader } = await jose.compactVerify(jws, publicKey)
 *
 * console.log(protectedHeader)
 * console.log(new TextDecoder().decode(payload))
 * ```
 *
 * @param jws Compact JWS.
 * @param key Key to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWS Verify options.
 */
export function compactVerify(
  jws: string | Uint8Array,
  key: types.KeyInput,
  options?: types.VerifyOptions,
): Promise<types.CompactVerifyResult>
/**
 * Verifies the signature and format of and afterwards decodes the Compact JWS, resolving the key
 * dynamically. The result additionally carries the {@link types.ResolvedKey.key resolved key}.
 *
 * @param jws Compact JWS.
 * @param getKey Function resolving a key to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWS Verify options.
 */
export function compactVerify<
  KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array,
>(
  jws: string | Uint8Array,
  getKey: CompactVerifyGetKey<KeyType>,
  options?: types.VerifyOptions,
): Promise<types.CompactVerifyResult & types.ResolvedKey<KeyType>>
/**
 * Accepts either form of the `key` argument. Use this overload when forwarding a value that may be
 * either a key or a key resolution function; `key` is present on the result only when a resolution
 * function was used.
 *
 * @param jws Compact JWS.
 * @param key Key, or function resolving a key, to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWS Verify options.
 */
export function compactVerify(
  jws: string | Uint8Array,
  key: types.KeyInput | CompactVerifyGetKey,
  options?: types.VerifyOptions,
): Promise<types.CompactVerifyResult & Partial<types.ResolvedKey>>
export async function compactVerify(
  jws: string | Uint8Array,
  key: types.KeyInput | CompactVerifyGetKey,
  options?: types.VerifyOptions,
) {
  return verify(jws, key, options)
}
