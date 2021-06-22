import decrypt from '../flattened/decrypt.js'
import { JWEDecryptionFailed, JWEInvalid } from '../../util/errors.js'
import type {
  KeyLike,
  DecryptOptions,
  JWEHeaderParameters,
  GetKeyFunction,
  FlattenedJWE,
  GeneralJWE,
  GeneralDecryptResult,
} from '../../types.d'
import isObject from '../../lib/is_object.js'

/**
 * Interface for General JWE Decryption dynamic key resolution.
 * No token components have been verified at the time of this function call.
 */
export interface GeneralDecryptGetKey extends GetKeyFunction<JWEHeaderParameters, FlattenedJWE> {}

/**
 * Decrypts a General JWE.
 *
 * @param jwe General JWE.
 * @param key Private Key or Secret, or a function resolving one, to decrypt the JWE with.
 * @param options JWE Decryption options.
 *
 * @example ESM import
 * ```js
 * import { generalDecrypt } from 'jose/jwe/general/decrypt'
 * ```
 *
 * @example CJS import
 * ```js
 * const { generalDecrypt } = require('jose/jwe/general/decrypt')
 * ```
 *
 * @example Usage
 * ```js
 * const decoder = new TextDecoder()
 * const jwe = {
 *   ciphertext: '9EzjFISUyoG-ifC2mSihfP0DPC80yeyrxhTzKt1C_VJBkxeBG0MI4Te61Pk45RAGubUvBpU9jm4',
 *   iv: '8Fy7A_IuoX5VXG9s',
 *   tag: 'W76IYV6arGRuDSaSyWrQNg',
 *   aad: 'VGhlIEZlbGxvd3NoaXAgb2YgdGhlIFJpbmc',
 *   protected: 'eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIn0',
 *   recipients: [
 *     {
 *       encrypted_key: 'Z6eD4UK_yFb5ZoKvKkGAdqywEG_m0e4IYo0x8Vf30LAMJcsc-_zSgIeiF82teZyYi2YYduHKoqImk7MRnoPZOlEs0Q5BNK1OgBmSOhCE8DFyqh9Zh48TCTP6lmBQ52naqoUJFMtHzu-0LwZH26hxos0GP3Dt19O379MJB837TdKKa87skq0zHaVLAquRHOBF77GI54Bc7O49d8aOrSu1VEFGMThlW2caspPRiTSePDMDPq7_WGk50izRhB3Asl9wmP9wEeaTrkJKRnQj5ips1SAZ1hDBsqEQKKukxP1HtdcopHV5_qgwU8Hjm5EwSLMluMQuiE6hwlkXGOujZLVizA'
 *     }
 *   ]
 * }
 *
 * const {
 *   plaintext,
 *   protectedHeader,
 *   additionalAuthenticatedData
 * } = await generalDecrypt(jwe, privateKey)
 *
 * console.log(protectedHeader)
 * console.log(decoder.decode(plaintext))
 * console.log(decoder.decode(additionalAuthenticatedData))
 * ```
 */
async function generalDecrypt(
  jwe: GeneralJWE,
  key: KeyLike | GeneralDecryptGetKey,
  options?: DecryptOptions,
): Promise<GeneralDecryptResult> {
  if (!isObject(jwe)) {
    throw new JWEInvalid('General JWE must be an object')
  }

  if (!Array.isArray(jwe.recipients) || !jwe.recipients.every(isObject)) {
    throw new JWEInvalid('JWE Recipients missing or incorrect type')
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const recipient of jwe.recipients) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await decrypt(
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
        <Parameters<typeof decrypt>[1]>key,
        options,
      )
    } catch {
      //
    }
  }
  throw new JWEDecryptionFailed()
}

export { generalDecrypt }
export default generalDecrypt
export type { KeyLike, GeneralJWE, DecryptOptions, GeneralDecryptResult }
