/** Composable verification using a remote JSON Web Key Set. @module */

import type {
  AlgorithmFactory,
  AlgorithmOf,
  AsymmetricJWSAlgorithmSelection,
  UniqueAlgorithmFactories,
} from '../../algorithms/types.js'
import type { RemoteJWKSetOptions } from '../../jwks/remote.js'
import type { ComposedLocalJWKSet } from './local.js'
import { loadAsymmetricJWSAlgorithmLookup } from '../../lib/jws_algorithm.js'
import { createLocalJWKSetWithLookup } from '../../lib/local_jwks.js'
import { createRemoteJWKSetWithFactory } from '../../lib/remote_jwks.js'

/** A remote JWK Set factory restricted to the selected JWS algorithms. */
export interface ComposedCreateRemoteJWKSet<Algorithm extends string> {
  (url: URL, options?: RemoteJWKSetOptions): ComposedRemoteJWKSet<Algorithm>
}

/** A remote JWK Set resolver restricted to the selected JWS algorithms. */
export interface ComposedRemoteJWKSet<Algorithm extends string> {
  (
    protectedHeader?: Parameters<ComposedLocalJWKSet<Algorithm>>[0],
    token?: Parameters<ComposedLocalJWKSet<Algorithm>>[1],
  ): ReturnType<ComposedLocalJWKSet<Algorithm>>
  readonly coolingDown: boolean
  readonly fresh: boolean
  readonly reloading: boolean
  reload: () => Promise<void>
  jwks: () => ReturnType<ComposedLocalJWKSet<Algorithm>['jwks']> | undefined
}

/**
 * Composes remote JWK Set resolution from one or more asymmetric JWS factories.
 *
 * @example
 *
 * ```js
 * import { Ed25519, ES256 } from 'jose/algorithms/jws'
 * import { composeRemoteJWKSet } from 'jose/composable/jwks/remote'
 * import { composeJwtVerify } from 'jose/composable/jwt/verify'
 *
 * const jwtVerify = composeJwtVerify(Ed25519, ES256)
 * const createRemoteJWKSet = composeRemoteJWKSet(Ed25519, ES256)
 * const JWKS = createRemoteJWKSet(new URL('https://example.com/.well-known/jwks.json'))
 * const { payload } = await jwtVerify(jwt, JWKS)
 * ```
 */
export function composeRemoteJWKSet<const Factories extends AsymmetricJWSAlgorithmSelection>(
  ...factories: Factories & UniqueAlgorithmFactories<Factories>
): ComposedCreateRemoteJWKSet<AlgorithmOf<Factories>> {
  const lookup = loadAsymmetricJWSAlgorithmLookup(
    factories as readonly AlgorithmFactory[],
    'a JSON Web Key Set',
  )
  const createLocal = (jwks: Parameters<typeof createLocalJWKSetWithLookup>[0]) =>
    createLocalJWKSetWithLookup(jwks, lookup)
  function createRemoteJWKSet(url: URL, options?: RemoteJWKSetOptions) {
    return createRemoteJWKSetWithFactory(url, options, createLocal)
  }

  return createRemoteJWKSet as ComposedCreateRemoteJWKSet<AlgorithmOf<Factories>>
}
