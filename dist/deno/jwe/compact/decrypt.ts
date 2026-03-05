/**
 * Decrypting JSON Web Encryption (JWE) in Compact Serialization
 *
 * @module
 */

import { flattenedDecrypt } from '../flattened/decrypt.ts'
import { JWEInvalid } from '../../util/errors.ts'
import { decoder } from '../../lib/buffer_utils.ts'
import type * as types from '../../types.d.ts'

/**
 * Interface for Compact JWE Decryption dynamic key resolution. No token components have been
 * verified at the time of this function call.
 */
export interface CompactDecryptGetKey extends types.GetKeyFunction<
  types.CompactJWEHeaderParameters,
  types.FlattenedJWE
> {}

/**
 * Decrypts a Compact JWE.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/jwe/compact/decrypt'`.
 *
 * @param jwe Compact JWE.
 * @param key Private Key or Secret to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWE Decryption options.
 */
export async function compactDecrypt(
  jwe: string | Uint8Array,
  key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array,
  options?: types.DecryptOptions,
): Promise<types.CompactDecryptResult>
/**
 * @param jwe Compact JWE.
 * @param getKey Function resolving Private Key or Secret to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWE Decryption options.
 */
export async function compactDecrypt(
  jwe: string | Uint8Array,
  getKey: CompactDecryptGetKey,
  options?: types.DecryptOptions,
): Promise<types.CompactDecryptResult & types.ResolvedKey>
export async function compactDecrypt(
  jwe: string | Uint8Array,
  key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array | CompactDecryptGetKey,
  options?: types.DecryptOptions,
) {
  if (jwe instanceof Uint8Array) {
    jwe = decoder.decode(jwe)
  }

  if (typeof jwe !== 'string') {
    throw new JWEInvalid('Compact JWE must be a string or Uint8Array')
  }
  const {
    0: protectedHeader,
    1: encryptedKey,
    2: iv,
    3: ciphertext,
    4: tag,
    length,
  } = jwe.split('.')

  if (length !== 5) {
    throw new JWEInvalid('Invalid Compact JWE')
  }

  const decrypted = await flattenedDecrypt(
    {
      ciphertext,
      iv: iv || undefined,
      protected: protectedHeader,
      tag: tag || undefined,
      encrypted_key: encryptedKey || undefined,
    },
    key as Parameters<typeof flattenedDecrypt>[1],
    options,
  )

  const result = { plaintext: decrypted.plaintext, protectedHeader: decrypted.protectedHeader! }

  if (typeof key === 'function') {
    return { ...result, key: decrypted.key }
  }

  return result
}
