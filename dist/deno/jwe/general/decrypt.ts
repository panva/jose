import { flattenedDecrypt } from '../flattened/decrypt.ts'
import { JWEDecryptionFailed, JWEInvalid } from '../../util/errors.ts'
import type {
  KeyLike,
  DecryptOptions,
  JWEHeaderParameters,
  GetKeyFunction,
  FlattenedJWE,
  GeneralJWE,
  GeneralDecryptResult,
  ResolvedKey,
} from '../../types.d.ts'
import isObject from '../../lib/is_object.ts'

/**
 * Interface for General JWE Decryption dynamic key resolution. No token components have been
 * verified at the time of this function call.
 */
export interface GeneralDecryptGetKey extends GetKeyFunction<JWEHeaderParameters, FlattenedJWE> {}

/**
 * Decrypts a General JWE.
 *
 * @param jwe General JWE.
 * @param key Private Key or Secret to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWE Decryption options.
 */
export function generalDecrypt(
  jwe: GeneralJWE,
  key: KeyLike | Uint8Array,
  options?: DecryptOptions,
): Promise<GeneralDecryptResult>
/**
 * @param jwe General JWE.
 * @param getKey Function resolving Private Key or Secret to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWE Decryption options.
 */
export function generalDecrypt<KeyLikeType extends KeyLike = KeyLike>(
  jwe: GeneralJWE,
  getKey: GeneralDecryptGetKey,
  options?: DecryptOptions,
): Promise<GeneralDecryptResult & ResolvedKey<KeyLikeType>>
export async function generalDecrypt(
  jwe: GeneralJWE,
  key: KeyLike | Uint8Array | GeneralDecryptGetKey,
  options?: DecryptOptions,
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
        <Parameters<typeof flattenedDecrypt>[1]>key,
        options,
      )
    } catch {
      //
    }
  }
  throw new JWEDecryptionFailed()
}
