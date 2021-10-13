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
 * @example Usage
 * ```js
 * const secret = await generateSecret('HS256')
 * console.log(secret)
 * ```
 *
 * @example ESM import
 * ```js
 * import { generateSecret } from 'jose'
 * ```
 *
 * @example CJS import
 * ```js
 * const { generateSecret } = require('jose')
 * ```
 *
 * @example Deno import
 * ```js
 * import { generateSecret } from 'https://deno.land/x/jose@VERSION/index.ts'
 * ```
 *
 * @param alg JWA Algorithm Identifier to be used with the generated secret.
 * @param options Additional options passed down to the secret generation.
 */
async function generateSecret(
  alg: string,
  options?: GenerateSecretOptions,
): Promise<KeyLike | Uint8Array> {
  return generate(alg, options)
}

export { generateSecret }
export default generateSecret
