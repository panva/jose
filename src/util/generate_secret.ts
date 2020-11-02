import { generateSecret as generate } from '../runtime/generate.js'
import type { KeyLike } from '../types.d'

/**
 * Generates a symmetric secret key for a given JWA algorithm identifier.
 *
 * @example
 * ```
 * // ESM import
 * import generateSecret from 'jose/util/generate_secret'
 * ```
 *
 * @example
 * ```
 * // CJS import
 * const { default: generateSecret } = require('jose/util/generate_secret')
 * ```
 *
 * @example
 * ```
 * // usage
 * const secret = await generateSecret('HS256')
 * console.log(secret)
 * ```
 *
 * @param alg JWA Algorithm Identifier to be used with the generated secret.
 */
export default async function generateSecret(alg: string): Promise<KeyLike> {
  return generate(alg)
}
