import type { KeyLike } from '../types';
export interface GenerateSecretOptions {
    /**
     * (Web Cryptography API specific) The value to use as
     * [SubtleCrypto.generateKey()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey)
     * `extractable` argument. Default is false.
     */
    extractable?: boolean;
}
/**
 * Generates a symmetric secret key for a given JWA algorithm identifier.
 *
 * Note: Under Web Cryptography API runtime the secret key is generated with `extractable` set to
 * `false` by default.
 *
 * @example Usage
 *
 * ```js
 * const secret = await jose.generateSecret('HS256')
 * console.log(secret)
 * ```
 *
 * @param alg JWA Algorithm Identifier to be used with the generated secret.
 * @param options Additional options passed down to the secret generation.
 */
export declare function generateSecret(alg: string, options?: GenerateSecretOptions): Promise<KeyLike | Uint8Array>;
