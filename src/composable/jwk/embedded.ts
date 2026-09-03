/** Composable verification using a JWK embedded in a JWS Header. @module */

import type * as types from '../../types.d.ts'
import type {
  AlgorithmFactory,
  AlgorithmOf,
  AsymmetricJWSAlgorithmSelection,
  UniqueAlgorithmFactories,
} from '../../algorithms/types.js'
import type { SelectedFlattenedJWSInput, SelectedJWSHeaderParameters } from '../jwks/local.js'
import { JOSENotSupported } from '../../util/errors.js'
import { embeddedJWKWithResolver } from '../../lib/embedded_jwk.js'
import { loadAsymmetricJWSAlgorithmLookup } from '../../lib/jws_algorithm.js'

/** An Embedded JWK resolver restricted to the selected JWS algorithms. */
export interface ComposedEmbeddedJWK<Algorithm extends string> {
  (
    protectedHeader?: SelectedJWSHeaderParameters<Algorithm>,
    token?: SelectedFlattenedJWSInput<Algorithm>,
  ): Promise<types.CryptoKey>
}

export type { SelectedFlattenedJWSInput, SelectedJWSHeaderParameters } from '../jwks/local.js'

/**
 * Composes an Embedded JWK resolver from one or more asymmetric JWS factories.
 *
 * @example
 *
 * ```js
 * import { Ed25519, ES256 } from 'jose/algorithms/jws'
 * import { composeEmbeddedJWK } from 'jose/composable/jwk/embedded'
 * import { composeJwtVerify } from 'jose/composable/jwt/verify'
 *
 * const jwtVerify = composeJwtVerify(Ed25519, ES256)
 * const EmbeddedJWK = composeEmbeddedJWK(Ed25519, ES256)
 * const { payload } = await jwtVerify(jwt, EmbeddedJWK)
 * ```
 */
export function composeEmbeddedJWK<const Factories extends AsymmetricJWSAlgorithmSelection>(
  ...factories: Factories & UniqueAlgorithmFactories<Factories>
): ComposedEmbeddedJWK<AlgorithmOf<Factories>> {
  const lookup = loadAsymmetricJWSAlgorithmLookup(
    factories as readonly AlgorithmFactory[],
    'an Embedded JWK',
  )
  const resolve = (alg: unknown) => {
    const algorithm = typeof alg === 'string' ? lookup(alg) : undefined
    if (!algorithm) {
      throw new JOSENotSupported(
        `alg ${alg} is not supported either by JOSE or your javascript runtime`,
      )
    }
    return algorithm
  }

  function EmbeddedJWK(
    protectedHeader?: SelectedJWSHeaderParameters<AlgorithmOf<Factories>>,
    token?: SelectedFlattenedJWSInput<AlgorithmOf<Factories>>,
  ) {
    return embeddedJWKWithResolver(resolve, protectedHeader, token)
  }

  return EmbeddedJWK as ComposedEmbeddedJWK<AlgorithmOf<Factories>>
}
