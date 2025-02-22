import type * as types from '../types.d.ts';
export interface GenerateSecretOptions {
    /** The value to use as {@link !SubtleCrypto.generateKey} `extractable` argument. Default is false. */
    extractable?: boolean;
}
/**
 * Generates a symmetric secret key for a given JWA algorithm identifier.
 *
 * Note: The secret key is generated with `extractable` set to `false` by default.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/generate/secret'`.
 *
 * @param alg JWA Algorithm Identifier to be used with the generated secret. See
 *   {@link https://github.com/panva/jose/issues/210 Algorithm Key Requirements}.
 * @param options Additional options passed down to the secret generation.
 */
export declare function generateSecret(alg: string, options?: GenerateSecretOptions): Promise<types.CryptoKey | Uint8Array>;
