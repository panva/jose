/**
 * Verifying JSON Web Signature (JWS) in Compact Serialization
 *
 * @module
 */

import type * as types from '../../types.d.ts'
import { flattenedVerify } from '../flattened/verify.ts'
import { JWSInvalid } from '../../util/errors.ts'
import { decoder } from '../../lib/buffer_utils.ts'

/**
 * Interface for Compact JWS Verification dynamic key resolution. No token components have been
 * verified at the time of this function call.
 *
 * @see {@link jwks/remote.createRemoteJWKSet createRemoteJWKSet} to verify using a remote JSON Web Key Set.
 */
export interface CompactVerifyGetKey extends types.GenericGetKeyFunction<
  types.CompactJWSHeaderParameters,
  types.FlattenedJWSInput,
  types.CryptoKey | types.KeyObject | types.JWK | Uint8Array
> {}

/**
 * Verifies the signature and format of and afterwards decodes the Compact JWS.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/jws/compact/verify'`.
 *
 * @param jws Compact JWS.
 * @param key Key to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWS Verify options.
 */
export function compactVerify(
  jws: string | Uint8Array,
  key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array,
  options?: types.VerifyOptions,
): Promise<types.CompactVerifyResult>
/**
 * @param jws Compact JWS.
 * @param getKey Function resolving a key to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWS Verify options.
 */
export function compactVerify(
  jws: string | Uint8Array,
  getKey: CompactVerifyGetKey,
  options?: types.VerifyOptions,
): Promise<types.CompactVerifyResult & types.ResolvedKey>
export async function compactVerify(
  jws: string | Uint8Array,
  key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array | CompactVerifyGetKey,
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

  const verified = await flattenedVerify(
    { payload, protected: protectedHeader, signature },
    key as Parameters<typeof flattenedVerify>[1],
    options,
  )

  const result = { payload: verified.payload, protectedHeader: verified.protectedHeader! }

  if (typeof key === 'function') {
    return { ...result, key: verified.key }
  }

  return result
}
