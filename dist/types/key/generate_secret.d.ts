import type * as t from '../types.d.ts';
/** Algorithms supported by {@link generateSecret}, subject to runtime support. */
export type GenerateSecretAlgorithm = 'HS256' | 'HS384' | 'HS512' | 'A128CBC-HS256' | 'A192CBC-HS384' | 'A256CBC-HS512' | 'A128KW' | 'A192KW' | 'A256KW' | 'A128GCMKW' | 'A192GCMKW' | 'A256GCMKW' | 'A128GCM' | 'A192GCM' | 'A256GCM' | (string & {});
/**
 * Maps a JWA algorithm identifier to the value returned by {@link generateSecret}. AES-CBC-HMAC
 * algorithms return {@link !Uint8Array}; other supported algorithms return
 * {@link t.CryptoKey CryptoKey}. When the algorithm is not statically known, the result is their
 * union.
 */
export type GeneratedSecret<Alg extends string> = Alg extends 'A128CBC-HS256' | 'A192CBC-HS384' | 'A256CBC-HS512' ? Uint8Array : string extends Alg ? t.CryptoKey | Uint8Array : t.CryptoKey;
/** Secret generation options. */
export interface GenerateSecretOptions {
    /**
     * Whether the generated CryptoKey is extractable. Defaults to false; has no effect for
     * A128CBC-HS256, A192CBC-HS384, and A256CBC-HS512, which return raw bytes.
     */
    extractable?: boolean;
}
/**
 * Generates a symmetric secret key for a given JWA algorithm identifier.
 *
 * > Note: The secret key is generated with `extractable` set to `false` by default.
 *
 * > Note: A128CBC-HS256, A192CBC-HS384, and A256CBC-HS512 return {@link !Uint8Array} because these secrets
 * > have no CryptoKey representation.
 *
 * @param alg JWA Algorithm Identifier to be used with the generated secret. See
 *   {@link https://github.com/panva/jose/issues/210 Algorithm Key Requirements}.
 */
export declare function generateSecret<Alg extends GenerateSecretAlgorithm>(alg: Alg, options?: GenerateSecretOptions): Promise<GeneratedSecret<Alg>>;
