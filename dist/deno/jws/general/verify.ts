/**
 * Verifying JSON Web Signature (JWS) in General JSON Serialization
 *
 * @module
 */

import type * as types from '../../types.d.ts'
import { flattenedVerify } from '../flattened/verify.ts'
import { JWSInvalid, JWSSignatureVerificationFailed } from '../../util/errors.ts'
import isObject from '../../lib/is_object.ts'

/**
 * Interface for General JWS Verification dynamic key resolution. No token components have been
 * verified at the time of this function call.
 *
 * @see {@link jwks/remote.createRemoteJWKSet createRemoteJWKSet} to verify using a remote JSON Web Key Set.
 */
export interface GeneralVerifyGetKey
  extends types.GenericGetKeyFunction<
    types.JWSHeaderParameters,
    types.FlattenedJWSInput,
    types.CryptoKey | types.KeyObject | types.JWK | Uint8Array
  > {}

/**
 * Verifies the signature and format of and afterwards decodes the General JWS.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/jws/general/verify'`.
 *
 * @param jws General JWS.
 * @param key Key to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWS Verify options.
 */
export function generalVerify(
  jws: types.GeneralJWSInput,
  key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array,
  options?: types.VerifyOptions,
): Promise<types.GeneralVerifyResult>
/**
 * @param jws General JWS.
 * @param getKey Function resolving a key to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWS Verify options.
 */
export function generalVerify(
  jws: types.GeneralJWSInput,
  getKey: GeneralVerifyGetKey,
  options?: types.VerifyOptions,
): Promise<types.GeneralVerifyResult & types.ResolvedKey>
export async function generalVerify(
  jws: types.GeneralJWSInput,
  key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array | GeneralVerifyGetKey,
  options?: types.VerifyOptions,
) {
  if (!isObject(jws)) {
    throw new JWSInvalid('General JWS must be an object')
  }

  if (!Array.isArray(jws.signatures) || !jws.signatures.every(isObject)) {
    throw new JWSInvalid('JWS Signatures missing or incorrect type')
  }

  for (const signature of jws.signatures) {
    try {
      return await flattenedVerify(
        {
          header: signature.header,
          payload: jws.payload,
          protected: signature.protected,
          signature: signature.signature,
        },
        key as Parameters<typeof flattenedVerify>[1],
        options,
      )
    } catch {
      //
    }
  }
  throw new JWSSignatureVerificationFailed()
}
