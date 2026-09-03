/** Composable JWT encryption. @module */

import type { JWEAlgorithmSelection, ValidJWEAlgorithmSelection } from '../../algorithms/types.js'
import { loadJWEAlgorithms } from '../../lib/jwe_algorithm.js'
import { createEncryptJWTClass } from '../../lib/jwt_jwe.js'
import type { ComposedEncryptJWTConstructor, ComposedJWTHeader } from '../jwe/types.js'

export type {
  ComposedEncryptJWT,
  ComposedEncryptJWTConstructor,
  ComposedJWTHeader,
} from '../jwe/types.js'

/**
 * Composes an encrypted JWT producer class from the selected JWE algorithm factories.
 *
 * @example
 *
 * ```js
 * import { dir } from 'jose/algorithms/jwe'
 * import { A256CBC_HS512, A256GCM } from 'jose/algorithms/jwe/enc'
 * import { composeEncryptJWT } from 'jose/composable/jwt/encrypt'
 *
 * const EncryptJWT = composeEncryptJWT(dir, A256GCM, A256CBC_HS512)
 * const secretKey = crypto.getRandomValues(new Uint8Array(32))
 * const jwt = await new EncryptJWT({ sub: 'urn:example:subject' })
 *   .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
 *   .encrypt(secretKey)
 * ```
 */
export function composeEncryptJWT<const Factories extends JWEAlgorithmSelection>(
  ...factories: Factories & ValidJWEAlgorithmSelection<Factories>
): ComposedEncryptJWTConstructor<ComposedJWTHeader<Factories>> {
  return createEncryptJWTClass(
    loadJWEAlgorithms(factories),
  ) as unknown as ComposedEncryptJWTConstructor<ComposedJWTHeader<Factories>>
}
