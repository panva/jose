import type * as types from '../../types.d.ts';
/**
 * Interface for Flattened JWE Decryption dynamic key resolution. No token components have been
 * verified at the time of this function call.
 */
export interface FlattenedDecryptGetKey<KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array> extends types.GetKeyFunction<types.JWEHeaderParameters | undefined, types.FlattenedJWE, KeyType | types.KeyObject | types.JWK> {
}
/**
 * Decrypts a Flattened JWE.
 *
 * @param jwe Flattened JWE.
 * @param key Private Key or Secret to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWE Decryption options.
 */
export declare function flattenedDecrypt(jwe: types.FlattenedJWE, key: types.KeyInput, options?: types.DecryptOptions): Promise<types.FlattenedDecryptResult>;
/**
 * Decrypts a Flattened JWE, resolving the key dynamically. The result additionally carries the
 * {@link types.ResolvedKey.key resolved key}.
 *
 * @param jwe Flattened JWE.
 * @param getKey Function resolving Private Key or Secret to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWE Decryption options.
 */
export declare function flattenedDecrypt<KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array>(jwe: types.FlattenedJWE, getKey: FlattenedDecryptGetKey<KeyType>, options?: types.DecryptOptions): Promise<types.FlattenedDecryptResult & types.ResolvedKey<KeyType>>;
/**
 * Accepts either form of the `key` argument. Use this overload when forwarding a value that may be
 * either a key or a key resolution function; `key` is present on the result only when a resolution
 * function was used.
 *
 * @param jwe Flattened JWE.
 * @param key Private Key or Secret, or a function resolving one, to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWE Decryption options.
 */
export declare function flattenedDecrypt(jwe: types.FlattenedJWE, key: types.KeyInput | FlattenedDecryptGetKey, options?: types.DecryptOptions): Promise<types.FlattenedDecryptResult & Partial<types.ResolvedKey>>;
