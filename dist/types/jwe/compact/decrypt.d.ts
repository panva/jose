import type * as types from '../../types.d.ts';
/**
 * Interface for Compact JWE Decryption dynamic key resolution. No token components have been
 * verified at the time of this function call.
 */
export interface CompactDecryptGetKey<KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array> extends types.GetKeyFunction<types.CompactJWEHeaderParameters, types.FlattenedJWE, KeyType | types.KeyObject | types.JWK> {
}
/**
 * Decrypts a Compact JWE.
 *
 * @param jwe Compact JWE.
 * @param key Private Key or Secret to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWE Decryption options.
 */
export declare function compactDecrypt(jwe: string | Uint8Array, key: types.KeyInput, options?: types.DecryptOptions): Promise<types.CompactDecryptResult>;
/**
 * Decrypts a Compact JWE, resolving the key dynamically. The result additionally carries the
 * {@link types.ResolvedKey.key resolved key}.
 *
 * @param jwe Compact JWE.
 * @param getKey Function resolving Private Key or Secret to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWE Decryption options.
 */
export declare function compactDecrypt<KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array>(jwe: string | Uint8Array, getKey: CompactDecryptGetKey<KeyType>, options?: types.DecryptOptions): Promise<types.CompactDecryptResult & types.ResolvedKey<KeyType>>;
/**
 * Accepts either form of the `key` argument. Use this overload when forwarding a value that may be
 * either a key or a key resolution function; `key` is present on the result only when a resolution
 * function was used.
 *
 * @param jwe Compact JWE.
 * @param key Private Key or Secret, or a function resolving one, to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWE Decryption options.
 */
export declare function compactDecrypt(jwe: string | Uint8Array, key: types.KeyInput | CompactDecryptGetKey, options?: types.DecryptOptions): Promise<types.CompactDecryptResult & Partial<types.ResolvedKey>>;
