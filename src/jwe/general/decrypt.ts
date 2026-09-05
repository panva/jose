/**
 * Decrypting JSON Web Encryption (JWE) in General JSON Serialization
 *
 * @module
 */

import {
  prepareDecrypt,
  shareJWE,
  decryptJWE,
  checkRecipient,
  snapshotSharedJWE,
  snapshotRecipientJWE,
} from '../../lib/jwe_decrypt.js'
import type { DecryptShared, SharedJWE } from '../../lib/jwe_decrypt.js'
import { JWEDecryptionFailed, JWEInvalid } from '../../util/errors.js'
import { isObject } from '../../lib/validate.js'
import { JWE, isJWECEKTransport } from '../../lib/jwe_algorithms.js'
import type * as types from '../../types.d.ts'

/**
 * Resolves a key for General JWE decryption from unverified headers and token data.
 *
 * @typeParam KeyType Type definition of the keys the function resolves. Narrowing it is what lets
 *   {@link types.ResolvedKey.key ResolvedKey.key} be inferred at the call site.
 */
export interface GeneralDecryptGetKey<
  KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array,
> extends types.GetKeyFunction<
  types.JWEHeaderParameters | undefined,
  types.FlattenedJWE,
  KeyType | types.KeyObject | types.JWK
> {}

/**
 * Decrypts a General JWE.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/jwe/general/decrypt'`.
 *
 * > [!NOTE]\
 * > Returns plaintext and headers from the first recipient that decrypts successfully. Other
 * > recipients may be inspected to enforce serialization rules, but their headers are not included in
 * > the result. Rely only on the returned data.
 *
 * @example
 *
 * ```js
 * const jwe = {
 *   ciphertext: '9EzjFISUyoG-ifC2mSihfP0DPC80yeyrxhTzKt1C_VJBkxeBG0MI4Te61Pk45RAGubUvBpU9jm4',
 *   iv: '8Fy7A_IuoX5VXG9s',
 *   tag: 'W76IYV6arGRuDSaSyWrQNg',
 *   aad: 'VGhlIEZlbGxvd3NoaXAgb2YgdGhlIFJpbmc',
 *   protected: 'eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIn0',
 *   recipients: [
 *     {
 *       encrypted_key:
 *         'Z6eD4UK_yFb5ZoKvKkGAdqywEG_m0e4IYo0x8Vf30LAMJcsc-_zSgIeiF82teZyYi2YYduHKoqImk7MRnoPZOlEs0Q5BNK1OgBmSOhCE8DFyqh9Zh48TCTP6lmBQ52naqoUJFMtHzu-0LwZH26hxos0GP3Dt19O379MJB837TdKKa87skq0zHaVLAquRHOBF77GI54Bc7O49d8aOrSu1VEFGMThlW2caspPRiTSePDMDPq7_WGk50izRhB3Asl9wmP9wEeaTrkJKRnQj5ips1SAZ1hDBsqEQKKukxP1HtdcopHV5_qgwU8Hjm5EwSLMluMQuiE6hwlkXGOujZLVizA',
 *     },
 *   ],
 * }
 *
 * const { plaintext, protectedHeader, additionalAuthenticatedData } =
 *   await jose.generalDecrypt(jwe, privateKey)
 *
 * console.log(protectedHeader)
 * const decoder = new TextDecoder()
 * console.log(decoder.decode(plaintext))
 * console.log(decoder.decode(additionalAuthenticatedData))
 * ```
 *
 * @param jwe General JWE.
 * @param key Private key or shared secret. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWE Decryption options.
 */
export function generalDecrypt(
  jwe: types.GeneralJWE,
  key: types.KeyInput,
  options?: types.DecryptOptions,
): Promise<types.GeneralDecryptResult>
/**
 * Decrypts a General JWE with a dynamically resolved key, included in the result.
 *
 * @param jwe General JWE.
 * @param getKey Resolves a private key or shared secret from unverified token data.
 * @param options JWE Decryption options.
 */
export function generalDecrypt<
  KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array,
>(
  jwe: types.GeneralJWE,
  getKey: GeneralDecryptGetKey<KeyType>,
  options?: types.DecryptOptions,
): Promise<types.GeneralDecryptResult & types.ResolvedKey<KeyType>>
/**
 * Decrypts a General JWE with a key or key resolver. The result includes `key` only when a resolver
 * is used.
 *
 * @param jwe General JWE.
 * @param key Private key or shared secret, or a function resolving one.
 * @param options JWE Decryption options.
 */
export function generalDecrypt(
  jwe: types.GeneralJWE,
  key: types.KeyInput | GeneralDecryptGetKey,
  options?: types.DecryptOptions,
): Promise<types.GeneralDecryptResult & Partial<types.ResolvedKey>>
export async function generalDecrypt(
  jwe: types.GeneralJWE,
  key: types.KeyInput | GeneralDecryptGetKey,
  options?: types.DecryptOptions,
) {
  if (!isObject(jwe)) {
    throw new JWEInvalid('General JWE must be an object')
  }

  const inputRecipients = jwe.recipients
  if (!Array.isArray(inputRecipients)) {
    throw new JWEInvalid('JWE Recipients missing or incorrect type')
  }

  const recipients = Array.from(inputRecipients)
  if (!recipients.every(isObject)) {
    throw new JWEInvalid('JWE Recipients missing or incorrect type')
  }

  if (!recipients.length) {
    throw new JWEInvalid('JWE Recipients has no members')
  }

  let shared: DecryptShared
  let sharedJwe!: types.FlattenedJWE
  let token: SharedJWE
  try {
    shared = prepareDecrypt(options)
    sharedJwe = snapshotSharedJWE(jwe)
    token = shareJWE(sharedJwe)
  } catch {
    // A fault in a shared member is a fault of the token, but reporting it as such would tell a
    // caller which recipient - if any - their key was meant for. Stay indistinguishable.
    throw new JWEDecryptionFailed()
  }

  const recipientSnapshots = recipients.map((recipient) => snapshotRecipientJWE(recipient))
  if (recipients.length > 1) {
    // A recognized direct mode makes the serialization invalid as a whole. Unknown or otherwise
    // invalid algorithms remain recipient-local so a successful recipient can still be returned,
    // as required by General JWE's documented failure-collapsing behavior.
    for (const [, headerAlg] of recipientSnapshots) {
      const alg = token[0]?.alg ?? headerAlg ?? sharedJwe.unprotected?.alg
      const algEntry = typeof alg === 'string' ? JWE[alg] : undefined
      if (algEntry && !isJWECEKTransport(algEntry)) {
        throw new JWEInvalid(`"${alg}" alg may only have a single recipient`)
      }
    }
  }

  for (const [recipient] of recipientSnapshots) {
    if (!recipient) continue
    try {
      const flattened: types.FlattenedJWE = { ...sharedJwe, ...recipient }
      checkRecipient(flattened)
      return await decryptJWE(flattened, shared, key, token)
    } catch {
      //
    }
  }
  throw new JWEDecryptionFailed()
}
