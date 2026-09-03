/** Composable asymmetric key generation. @module */

import type {
  AlgorithmFactory,
  AlgorithmOf,
  KeyPairAlgorithmSelection,
  UniqueAlgorithmFactories,
} from '../../../algorithms/types.js'
import type {
  GenerateKeyPairOptions,
  GenerateKeyPairResult,
} from '../../../key/generate_key_pair.js'
import { loadKeyAlgorithms, resolveKeyAlgorithm } from '../../../lib/key_algorithm.js'
import { generateKeyPairWithResolver } from '../../../lib/key_generation.js'

/** A key-pair generator restricted to the selected asymmetric algorithms. */
export interface ComposedGenerateKeyPair<Algorithm extends string> {
  (alg: Algorithm, options?: GenerateKeyPairOptions): Promise<GenerateKeyPairResult>
}

/**
 * Composes asymmetric key-pair generation from one or more algorithm factories.
 *
 * @example
 *
 * ```js
 * import { Ed25519, ES256 } from 'jose/algorithms/key'
 * import { composeGenerateKeyPair } from 'jose/composable/key/generate/keypair'
 *
 * const generateKeyPair = composeGenerateKeyPair(Ed25519, ES256)
 * const { publicKey, privateKey } = await generateKeyPair('Ed25519')
 * ```
 */
export function composeGenerateKeyPair<const Factories extends KeyPairAlgorithmSelection>(
  ...factories: Factories & UniqueAlgorithmFactories<Factories>
): ComposedGenerateKeyPair<AlgorithmOf<Factories>> {
  const capabilities = loadKeyAlgorithms(factories as readonly AlgorithmFactory[], 2)

  function generateKeyPair(alg: string, options?: GenerateKeyPairOptions) {
    return generateKeyPairWithResolver(
      alg,
      (selected, source) => resolveKeyAlgorithm(capabilities, selected, source),
      options,
    )
  }

  return generateKeyPair
}
