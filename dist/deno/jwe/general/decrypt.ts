/**
 * Decrypting JSON Web Encryption (JWE) in General JSON Serialization
 *
 * @module
 */

import { flattenedDecrypt } from '../flattened/decrypt.ts'
import { JWEDecryptionFailed, JWEInvalid } from '../../util/errors.ts'
import type * as types from '../../types.d.ts'
import isObject from '../../lib/is_object.ts'

/**
 * Interface for General JWE Decryption dynamic key resolution. No token components have been
 * verified at the time of this function call.
 */
export interface GeneralDecryptGetKey
  extends types.GetKeyFunction<types.JWEHeaderParameters, types.FlattenedJWE> {}

/**
 * Decrypts a General JWE.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/jwe/general/decrypt'`.
 *
 * @param jwe General JWE.
 * @param key Private Key or Secret to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWE Decryption options.
 */
export function generalDecrypt(
  jwe: types.GeneralJWE,
  key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array,
  options?: types.DecryptOptions,
): Promise<types.GeneralDecryptResult>
/**
 * @param jwe General JWE.
 * @param getKey Function resolving Private Key or Secret to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWE Decryption options.
 */
export function generalDecrypt(
  jwe: types.GeneralJWE,
  getKey: GeneralDecryptGetKey,
  options?: types.DecryptOptions,
): Promise<types.GeneralDecryptResult & types.ResolvedKey>
export async function generalDecrypt(
  jwe: types.GeneralJWE,
  key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array | GeneralDecryptGetKey,
  options?: types.DecryptOptions,
) {
  if (!isObject(jwe)) {
    throw new JWEInvalid('General JWE must be an object')
  }

  if (!Array.isArray(jwe.recipients) || !jwe.recipients.every(isObject)) {
    throw new JWEInvalid('JWE Recipients missing or incorrect type')
  }

  if (!jwe.recipients.length) {
    throw new JWEInvalid('JWE Recipients has no members')
  }

  for (const recipient of jwe.recipients) {
    try {
      return await flattenedDecrypt(
        {
          aad: jwe.aad,
          ciphertext: jwe.ciphertext,
          encrypted_key: recipient.encrypted_key,
          header: recipient.header,
          iv: jwe.iv,
          protected: jwe.protected,
          tag: jwe.tag,
          unprotected: jwe.unprotected,
        },
        key as Parameters<typeof flattenedDecrypt>[1],
        options,
      )
    } catch {
      //
    }
  }
  throw new JWEDecryptionFailed()
}
