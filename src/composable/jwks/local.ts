/** Composable verification using a local JSON Web Key Set. @module */

import type * as types from '../../types.d.ts'
import type {
  AlgorithmFactory,
  AlgorithmOf,
  AsymmetricJWSAlgorithmSelection,
  SelectedJWSHeaderParameters,
  UniqueAlgorithmFactories,
} from '../../algorithms/types.js'
import { loadAsymmetricJWSAlgorithmLookup } from '../../lib/jws_algorithm.js'
import { createLocalJWKSetWithLookup } from '../../lib/local_jwks.js'

/** Flattened JWS input with selected `alg` identifiers suggested by editors. */
export type SelectedFlattenedJWSInput<Algorithm extends string> = Omit<
  types.FlattenedJWSInput,
  'header'
> & { header?: SelectedJWSHeaderParameters<Algorithm> }

/** A local JWK Set resolver restricted to the selected JWS algorithms. */
export interface ComposedLocalJWKSet<Algorithm extends string> {
  (
    protectedHeader?: SelectedJWSHeaderParameters<Algorithm>,
    token?: SelectedFlattenedJWSInput<Algorithm>,
  ): Promise<types.CryptoKey>
  jwks: () => types.JSONWebKeySet
}

export type { SelectedJWSHeaderParameters } from '../../algorithms/types.js'

/** A local JWK Set factory restricted to the selected JWS algorithms. */
export interface ComposedCreateLocalJWKSet<Algorithm extends string> {
  (jwks: types.JSONWebKeySet): ComposedLocalJWKSet<Algorithm>
}

/**
 * Composes local JWK Set resolution from one or more asymmetric JWS factories.
 *
 * @example
 *
 * ```js
 * import { Ed25519, ES256 } from 'jose/algorithms/jws'
 * import { composeLocalJWKSet } from 'jose/composable/jwks/local'
 * import { composeJwtVerify } from 'jose/composable/jwt/verify'
 *
 * const jwtVerify = composeJwtVerify(Ed25519, ES256)
 * const createLocalJWKSet = composeLocalJWKSet(Ed25519, ES256)
 * const JWKS = createLocalJWKSet(jwks)
 * const { payload } = await jwtVerify(jwt, JWKS)
 * ```
 */
export function composeLocalJWKSet<const Factories extends AsymmetricJWSAlgorithmSelection>(
  ...factories: Factories & UniqueAlgorithmFactories<Factories>
): ComposedCreateLocalJWKSet<AlgorithmOf<Factories>> {
  const lookup = loadAsymmetricJWSAlgorithmLookup(
    factories as readonly AlgorithmFactory[],
    'a JSON Web Key Set',
  )
  function createLocalJWKSet(jwks: types.JSONWebKeySet) {
    return createLocalJWKSetWithLookup(jwks, lookup)
  }

  return createLocalJWKSet as ComposedCreateLocalJWKSet<AlgorithmOf<Factories>>
}
