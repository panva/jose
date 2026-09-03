/**
 * Signing JSON Web Signature (JWS) in Flattened JSON Serialization
 *
 * @module
 */

import type * as types from '../../types.d.ts'
import type {
  FlattenedSignConstructor,
  FlattenedSignInstance,
} from '../../composable/jws/flattened/sign.js'
import { jwsAlgorithm } from '../../lib/jws_algorithms.js'
import { createFlattenedSignClass } from '../../lib/jws_serialization.js'

const FlattenedSignBase: FlattenedSignConstructor<types.JWSAlgorithm> =
  createFlattenedSignClass(jwsAlgorithm)

export interface FlattenedSign extends FlattenedSignInstance<types.JWSAlgorithm> {}

/**
 * The FlattenedSign class is used to build and sign Flattened JWS objects.
 *
 * This class is exported (as a named export) from the main `'jose'` module entry point as well as
 * from its subpath export `'jose/jws/flattened/sign'`.
 *
 * @example
 *
 * ```js
 * const jws = await new jose.FlattenedSign(
 *   new TextEncoder().encode('It’s a dangerous business, Frodo, going out your door.'),
 * )
 *   .setProtectedHeader({ alg: 'ES256' })
 *   .sign(privateKey)
 *
 * console.log(jws)
 * ```
 */
export class FlattenedSign extends FlattenedSignBase {
  declare private flattenedSignBrand: never

  /**
   * {@link FlattenedSign} constructor
   *
   * @param payload Binary representation of the payload to sign.
   */
  constructor(payload: Uint8Array) {
    super(payload)
  }
}
