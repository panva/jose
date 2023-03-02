import type { KeyLike, DecryptOptions, JWEHeaderParameters, GetKeyFunction, FlattenedJWE, GeneralJWE, GeneralDecryptResult, ResolvedKey } from '../../types';
/**
 * Interface for General JWE Decryption dynamic key resolution. No token components have been
 * verified at the time of this function call.
 */
export interface GeneralDecryptGetKey extends GetKeyFunction<JWEHeaderParameters, FlattenedJWE> {
}
/**
 * Decrypts a General JWE.
 *
 * @example Usage
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
 * @param key Private Key or Secret to decrypt the JWE with.
 * @param options JWE Decryption options.
 */
export declare function generalDecrypt(jwe: GeneralJWE, key: KeyLike | Uint8Array, options?: DecryptOptions): Promise<GeneralDecryptResult>;
/**
 * @param jwe General JWE.
 * @param getKey Function resolving Private Key or Secret to decrypt the JWE with.
 * @param options JWE Decryption options.
 */
export declare function generalDecrypt<T extends KeyLike = KeyLike>(jwe: GeneralJWE, getKey: GeneralDecryptGetKey, options?: DecryptOptions): Promise<GeneralDecryptResult & ResolvedKey<T>>;
