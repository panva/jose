/**
 * Signing JSON Web Signature (JWS) in Compact Serialization
 *
 * @module
 */

import type * as types from '../../types.d.ts'
import type {
  CompactSignConstructor,
  CompactSignInstance,
} from '../../composable/jws/compact/sign.js'
import { jwsAlgorithm } from '../../lib/jws_algorithms.js'
import { createCompactSignClass } from '../../lib/jws_serialization.js'

const CompactSignBase: CompactSignConstructor<types.JWSAlgorithm> =
  createCompactSignClass(jwsAlgorithm)

export interface CompactSign extends CompactSignInstance<types.JWSAlgorithm> {}

/**
 * The CompactSign class is used to build and sign Compact JWS strings.
 *
 * This class is exported (as a named export) from the main `'jose'` module entry point as well as
 * from its subpath export `'jose/jws/compact/sign'`.
 *
 * @example
 *
 * ```js
 * const jws = await new jose.CompactSign(
 *   new TextEncoder().encode('It’s a dangerous business, Frodo, going out your door.'),
 * )
 *   .setProtectedHeader({ alg: 'ES256' })
 *   .sign(privateKey)
 *
 * console.log(jws)
 * ```
 */
export class CompactSign extends CompactSignBase {
  declare private compactSignBrand: never

  /**
   * {@link CompactSign} constructor
   *
   * @param payload Binary representation of the payload to sign.
   */
  constructor(payload: Uint8Array) {
    super(payload)
  }
}
