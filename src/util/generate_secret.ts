import { generateSecret as generate } from '../runtime/generate.js'
import type { KeyLike } from '../types.d'

export interface GenerateSecretOptions {
  /**
   * (Web Cryptography API specific) The value to use as
   * [SubtleCrypto.generateKey()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey)
   * `extractable` argument. Default is false.
   */
  extractable?: boolean
}

/**
 * Generates a symmetric secret key for a given JWA algorithm identifier.
 *
 * Note: Under Web Cryptography API runtime the secret key is generated with
 * `extractable` set to `false` by default.
 *
 * @example ESM import
 * ```js
 * import { generateSecret } from 'jose/util/generate_secret'
 * ```
 *
 * @example CJS import
 * ```js
 * const { generateSecret } = require('jose/util/generate_secret')
 * ```
 *
 * @example Deno import
 * ```js
 * import { generateSecret } from 'https://deno.land/x/jose@VERSION/util/generate_secret.ts'
 * ```
 *
 * @example Usage
 * ```js
 * const secret = await generateSecret('HS256')
 * console.log(secret)
 * ```
 *
 * @param alg JWA Algorithm Identifier to be used with the generated secret.
 * @param options Additional options passed down to the secret generation.
 */
async function generateSecret(alg: string, options?: GenerateSecretOptions): Promise<KeyLike> {
  return generate(alg, options)
}

export { generateSecret }
export default generateSecret
