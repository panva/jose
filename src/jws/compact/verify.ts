/**
 * Verifying JSON Web Signature (JWS) in Compact Serialization
 *
 * @module
 */

import type * as types from '../../types.d.ts'
import { flattenedVerify } from '../flattened/verify.js'
import type { FlattenedVerifyGetKey } from '../flattened/verify.js'
import { JWSInvalid } from '../../util/errors.js'
import { decoder } from '../../lib/buffer_utils.js'

/**
 * Interface for Compact JWS Verification dynamic key resolution. No token components have been
 * verified at the time of this function call.
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
  if (jws instanceof Uint8Array) {
    jws = decoder.decode(jws)
  }

  if (typeof jws !== 'string') {
    throw new JWSInvalid('Compact JWS must be a string or Uint8Array')
  }
  const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split('.')

  if (length !== 3) {
    throw new JWSInvalid('Invalid Compact JWS')
  }

  // A CompactVerifyGetKey declares a narrower Protected Header than a FlattenedVerifyGetKey does,
  // so it is not assignable to one. Delegating is nevertheless sound: flattenedVerify rejects a JWS
  // whose Protected Header has no "alg" before it ever calls the resolver.
  const verified = await flattenedVerify(
    { payload, protected: protectedHeader, signature },
    key as types.KeyInput | FlattenedVerifyGetKey,
    options,
  )

  const result = { payload: verified.payload, protectedHeader: verified.protectedHeader! }

  if (typeof key === 'function') {
    return { ...result, key: verified.key }
  }

  return result
}
