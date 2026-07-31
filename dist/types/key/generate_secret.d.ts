import type * as types from '../types.d.ts';
/**
 * JWA Algorithm Identifiers that {@link generateSecret} is able to generate a secret for, subject to
 * runtime support.
 */
export type GenerateSecretAlgorithm = 'HS256' | 'HS384' | 'HS512' | 'A128CBC-HS256' | 'A192CBC-HS384' | 'A256CBC-HS512' | 'A128KW' | 'A192KW' | 'A256KW' | 'A128GCMKW' | 'A192GCMKW' | 'A256GCMKW' | 'A128GCM' | 'A192GCM' | 'A256GCM' | (string & {});
/**
 * Resolves what {@link generateSecret} returns for a given JWA Algorithm Identifier. The
 * AES_CBC_HMAC_SHA2 content encryption algorithms have no {@link !CryptoKey} representation, so they
 * yield a {@link !Uint8Array}; every other supported identifier yields a
 * {@link types.CryptoKey CryptoKey}. When the identifier is not statically known this resolves to
 * their union.
 */
export type GeneratedSecret<Alg extends string> = Alg extends 'A128CBC-HS256' | 'A192CBC-HS384' | 'A256CBC-HS512' ? Uint8Array : string extends Alg ? types.CryptoKey | Uint8Array : types.CryptoKey;
/** Secret generation function options. */
export interface GenerateSecretOptions {
    /**
     * The value to use as {@link !SubtleCrypto.generateKey} `extractable` argument. Default is false.
     *
     * > Note: Because A128CBC-HS256, A192CBC-HS384, and A256CBC-HS512 secrets cannot be represented as
     * > {@link !CryptoKey} this option has no effect for them.
     */
    extractable?: boolean;
}
/**
 * Generates a symmetric secret key for a given JWA algorithm identifier.
 *
 * > Note: The secret key is generated with `extractable` set to `false` by default.
 *
 * > Note: Because A128CBC-HS256, A192CBC-HS384, and A256CBC-HS512 secrets cannot be represented as
 * > {@link !CryptoKey} this method yields a {@link !Uint8Array} for them instead.
 *
 * @param alg JWA Algorithm Identifier to be used with the generated secret. See
 *   {@link https://github.com/panva/jose/issues/210 Algorithm Key Requirements}.
 * @param options Additional options passed down to the secret generation.
 */
export declare function generateSecret<Alg extends GenerateSecretAlgorithm>(alg: Alg, options?: GenerateSecretOptions): Promise<GeneratedSecret<Alg>>;
