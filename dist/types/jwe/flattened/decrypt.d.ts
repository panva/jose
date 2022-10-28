import type { FlattenedDecryptResult, KeyLike, FlattenedJWE, JWEHeaderParameters, DecryptOptions, GetKeyFunction, ResolvedKey } from '../../types';
/**
 * Interface for Flattened JWE Decryption dynamic key resolution. No token components have been
 * verified at the time of this function call.
 */
export interface FlattenedDecryptGetKey extends GetKeyFunction<JWEHeaderParameters | undefined, FlattenedJWE> {
}
/**
 * Decrypts a Flattened JWE.
 *
 * @example Usage
 *
 * ```js
 * const jwe = {
 *   ciphertext: '9EzjFISUyoG-ifC2mSihfP0DPC80yeyrxhTzKt1C_VJBkxeBG0MI4Te61Pk45RAGubUvBpU9jm4',
 *   iv: '8Fy7A_IuoX5VXG9s',
 *   tag: 'W76IYV6arGRuDSaSyWrQNg',
 *   encrypted_key:
 *     'Z6eD4UK_yFb5ZoKvKkGAdqywEG_m0e4IYo0x8Vf30LAMJcsc-_zSgIeiF82teZyYi2YYduHKoqImk7MRnoPZOlEs0Q5BNK1OgBmSOhCE8DFyqh9Zh48TCTP6lmBQ52naqoUJFMtHzu-0LwZH26hxos0GP3Dt19O379MJB837TdKKa87skq0zHaVLAquRHOBF77GI54Bc7O49d8aOrSu1VEFGMThlW2caspPRiTSePDMDPq7_WGk50izRhB3Asl9wmP9wEeaTrkJKRnQj5ips1SAZ1hDBsqEQKKukxP1HtdcopHV5_qgwU8Hjm5EwSLMluMQuiE6hwlkXGOujZLVizA',
 *   aad: 'VGhlIEZlbGxvd3NoaXAgb2YgdGhlIFJpbmc',
 *   protected: 'eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIn0',
 * }
 *
 * const { plaintext, protectedHeader, additionalAuthenticatedData } =
 *   await jose.flattenedDecrypt(jwe, privateKey)
 *
 * console.log(protectedHeader)
 * const decoder = new TextDecoder()
 * console.log(decoder.decode(plaintext))
 * console.log(decoder.decode(additionalAuthenticatedData))
 * ```
 *
 * @param jwe Flattened JWE.
 * @param key Private Key or Secret to decrypt the JWE with.
 * @param options JWE Decryption options.
 */
export declare function flattenedDecrypt(jwe: FlattenedJWE, key: KeyLike | Uint8Array, options?: DecryptOptions): Promise<FlattenedDecryptResult>;
/**
 * @param jwe Flattened JWE.
 * @param getKey Function resolving Private Key or Secret to decrypt the JWE with.
 * @param options JWE Decryption options.
 */
export declare function flattenedDecrypt(jwe: FlattenedJWE, getKey: FlattenedDecryptGetKey, options?: DecryptOptions): Promise<FlattenedDecryptResult & ResolvedKey>;
