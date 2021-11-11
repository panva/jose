import { flattenedDecrypt } from '../flattened/decrypt.ts'
import { JWEInvalid } from '../../util/errors.ts'
import { decoder } from '../../lib/buffer_utils.ts'
import type {
  KeyLike,
  DecryptOptions,
  CompactJWEHeaderParameters,
  GetKeyFunction,
  FlattenedJWE,
  CompactDecryptResult,
  ResolvedKey,
} from '../../types.d.ts'

/**
 * Interface for Compact JWE Decryption dynamic key resolution.
 * No token components have been verified at the time of this function call.
 */
export interface CompactDecryptGetKey
  extends GetKeyFunction<CompactJWEHeaderParameters, FlattenedJWE> {}

/**
 * Decrypts a Compact JWE.
 *
 * @param jwe Compact JWE.
 * @param key Private Key or Secret to decrypt the JWE with.
 * @param options JWE Decryption options.
 *
 * @example Usage
 * ```js
 * const jwe = 'eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIn0.nyQ19eq9ogh9wA7fFtnI2oouzy5_8b5DeLkoRMfi2yijgfTs2zEnayCEofz_qhnL-nwszabd9qUeHv0-IwvhhJJS7GUJOU3ikiIe42qcIAFme1A_Fo9CTxw4XTOy-I5qanl8So91u6hwfyN1VxAqVLsSE7_23EC-gfGEg_5znew9PyXXsOIE-K_HH7IQowRrlZ1X_bM_Liu53RzDpLDvRz59mp3S8L56YqpM8FexFGTGpEaoTcEIst375qncYt3-79IVR7gZN1RWsWgjPatfvVbnh74PglQcATSf3UUhaW0OAKn6q7r3PDx6DIKQ35bgHQg5QopuN00eIfLQL2trGw.W3grIVj5HVuAb76X.6PcuDe5D6ttWFYyv0oqqdDXfI2R8wBg1F2Q80UUA_Gv8eEimNWfxIWdLxrjzgQGSvIhxmFKuLM0.a93_Ug3uZHuczj70Zavx8Q'
 *
 * const { plaintext, protectedHeader } = await jose.compactDecrypt(jwe, privateKey)
 *
 * console.log(protectedHeader)
 * console.log(new TextDecoder().decode(plaintext))
 * ```
 */
export async function compactDecrypt(
  jwe: string | Uint8Array,
  key: KeyLike | Uint8Array,
  options?: DecryptOptions,
): Promise<CompactDecryptResult>
/**
 * @param jwe Compact JWE.
 * @param getKey Function resolving Private Key or Secret to decrypt the JWE with.
 * @param options JWE Decryption options.
 */
export async function compactDecrypt(
  jwe: string | Uint8Array,
  getKey: CompactDecryptGetKey,
  options?: DecryptOptions,
): Promise<CompactDecryptResult & ResolvedKey>
export async function compactDecrypt(
  jwe: string | Uint8Array,
  key: KeyLike | Uint8Array | CompactDecryptGetKey,
  options?: DecryptOptions,
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
      ciphertext: <string>(ciphertext || undefined),
      iv: <string>(iv || undefined),
      protected: protectedHeader || undefined,
      tag: <string>(tag || undefined),
      encrypted_key: encryptedKey || undefined,
    },
    <Parameters<typeof flattenedDecrypt>[1]>key,
    options,
  )

  const result = { plaintext: decrypted.plaintext, protectedHeader: decrypted.protectedHeader! }

  if (typeof key === 'function') {
    return { ...result, key: decrypted.key }
  }

  return result
}
