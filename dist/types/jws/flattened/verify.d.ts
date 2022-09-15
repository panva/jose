import type { FlattenedVerifyResult, KeyLike, FlattenedJWSInput, JWSHeaderParameters, VerifyOptions, GetKeyFunction, ResolvedKey } from '../../types';
/**
 * Interface for Flattened JWS Verification dynamic key resolution. No token components have been
 * verified at the time of this function call.
 *
 * See
 * [createRemoteJWKSet](../functions/jwks_remote.createRemoteJWKSet.md#function-createremotejwkset)
 * to verify using a remote JSON Web Key Set.
 */
export interface FlattenedVerifyGetKey extends GetKeyFunction<JWSHeaderParameters | undefined, FlattenedJWSInput> {
}
/**
 * Verifies the signature and format of and afterwards decodes the Flattened JWS.
 *
 * @example Usage
 *
 * ```js
 * const decoder = new TextDecoder()
 * const jws = {
 *   signature:
 *     'FVVOXwj6kD3DqdfD9yYqfT2W9jv-Nop4kOehp_DeDGNB5dQNSPRvntBY6xH3uxlCxE8na9d_kyhYOcanpDJ0EA',
 *   payload: 'SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4',
 *   protected: 'eyJhbGciOiJFUzI1NiJ9',
 * }
 *
 * const { payload, protectedHeader } = await jose.flattenedVerify(jws, publicKey)
 *
 * console.log(protectedHeader)
 * console.log(decoder.decode(payload))
 * ```
 *
 * @param jws Flattened JWS.
 * @param key Key to verify the JWS with.
 * @param options JWS Verify options.
 */
export declare function flattenedVerify(jws: FlattenedJWSInput, key: KeyLike | Uint8Array, options?: VerifyOptions): Promise<FlattenedVerifyResult>;
/**
 * @param jws Flattened JWS.
 * @param getKey Function resolving a key to verify the JWS with.
 * @param options JWS Verify options.
 */
export declare function flattenedVerify(jws: FlattenedJWSInput, getKey: FlattenedVerifyGetKey, options?: VerifyOptions): Promise<FlattenedVerifyResult & ResolvedKey>;
