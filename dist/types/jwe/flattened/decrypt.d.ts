import type * as t from '../../types.d.ts';
/** Dynamic key resolver for Flattened JWE decryption. */
export interface FlattenedDecryptGetKey<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array> extends t.GetKeyFunction<t.JWEHeaderParameters | undefined, t.FlattenedJWE, KeyType | t.KeyObject | t.JWK> {
}
/**
 * Decrypts a Flattened JWE.
 *
 * @param key Private Key or Secret to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 */
export declare function flattenedDecrypt(jwe: t.FlattenedJWE, key: t.KeyInput, options?: t.DecryptOptions): Promise<t.FlattenedDecryptResult>;
/**
 * Decrypts a Flattened JWE, resolving the key dynamically. The result additionally carries the
 * {@link t.ResolvedKey.key resolved key}.
 *
 * @param getKey Function resolving Private Key or Secret to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 */
export declare function flattenedDecrypt<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array>(jwe: t.FlattenedJWE, getKey: FlattenedDecryptGetKey<KeyType>, options?: t.DecryptOptions): Promise<t.FlattenedDecryptResult & t.ResolvedKey<KeyType>>;
/**
 * Accepts either form of the `key` argument. Use this overload when forwarding a value that may be
 * either a key or a key resolution function; `key` is present on the result only when a resolution
 * function was used.
 *
 * @param key Private Key or Secret, or a function resolving one, to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 */
export declare function flattenedDecrypt(jwe: t.FlattenedJWE, key: t.KeyInput | FlattenedDecryptGetKey, options?: t.DecryptOptions): Promise<t.FlattenedDecryptResult & Partial<t.ResolvedKey>>;
