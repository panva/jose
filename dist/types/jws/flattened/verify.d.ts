import type * as types from '../../types.d.ts';
/**
 * Interface for Flattened JWS Verification dynamic key resolution. No token components have been
 * verified at the time of this function call.
 */
export interface FlattenedVerifyGetKey<KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array> extends types.GetKeyFunction<types.JWSHeaderParameters, types.FlattenedJWSInput, KeyType | types.KeyObject | types.JWK> {
}
/**
 * Verifies the signature and format of and afterwards decodes the Flattened JWS.
 *
 * @param jws Flattened JWS.
 * @param key Key to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWS Verify options.
 */
export declare function flattenedVerify(jws: types.FlattenedJWSInput, key: types.KeyInput, options?: types.VerifyOptions): Promise<types.FlattenedVerifyResult>;
/**
 * Verifies the signature and format of and afterwards decodes the Flattened JWS, resolving the key
 * dynamically. The result additionally carries the {@link types.ResolvedKey.key resolved key}.
 *
 * @param jws Flattened JWS.
 * @param getKey Function resolving a key to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWS Verify options.
 */
export declare function flattenedVerify<KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array>(jws: types.FlattenedJWSInput, getKey: FlattenedVerifyGetKey<KeyType>, options?: types.VerifyOptions): Promise<types.FlattenedVerifyResult & types.ResolvedKey<KeyType>>;
/**
 * Accepts either form of the `key` argument. Use this overload when forwarding a value that may be
 * either a key or a key resolution function; `key` is present on the result only when a resolution
 * function was used.
 *
 * @param jws Flattened JWS.
 * @param key Key, or function resolving a key, to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWS Verify options.
 */
export declare function flattenedVerify(jws: types.FlattenedJWSInput, key: types.KeyInput | FlattenedVerifyGetKey, options?: types.VerifyOptions): Promise<types.FlattenedVerifyResult & Partial<types.ResolvedKey>>;
