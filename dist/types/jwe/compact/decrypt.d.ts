import type * as t from '../../types.d.ts';
/** Dynamic key resolver for Compact JWE decryption. */
export interface CompactDecryptGetKey<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array> extends t.GetKeyFunction<t.CompactJWEHeaderParameters, t.FlattenedJWE, KeyType | t.KeyObject | t.JWK> {
}
/**
 * Decrypts a Compact JWE.
 *
 * @param key Private Key or Secret to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 */
export declare function compactDecrypt(jwe: string | Uint8Array, key: t.KeyInput, options?: t.DecryptOptions): Promise<t.CompactDecryptResult>;
/**
 * Decrypts a Compact JWE, resolving the key dynamically. The result additionally carries the
 * {@link t.ResolvedKey.key resolved key}.
 *
 * @param getKey Function resolving Private Key or Secret to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 */
export declare function compactDecrypt<KeyType extends t.CryptoKey | Uint8Array = t.CryptoKey | Uint8Array>(jwe: string | Uint8Array, getKey: CompactDecryptGetKey<KeyType>, options?: t.DecryptOptions): Promise<t.CompactDecryptResult & t.ResolvedKey<KeyType>>;
/**
 * Accepts either form of the `key` argument. Use this overload when forwarding a value that may be
 * either a key or a key resolution function; `key` is present on the result only when a resolution
 * function was used.
 *
 * @param key Private Key or Secret, or a function resolving one, to decrypt the JWE with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 */
export declare function compactDecrypt(jwe: string | Uint8Array, key: t.KeyInput | CompactDecryptGetKey, options?: t.DecryptOptions): Promise<t.CompactDecryptResult & Partial<t.ResolvedKey>>;
