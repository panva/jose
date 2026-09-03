/** Composable symmetric secret generation. @module */

import type {
  AlgorithmFactory,
  AlgorithmOf,
  SecretAlgorithmSelection,
  UniqueAlgorithmFactories,
} from '../../../algorithms/types.js'
import type { GeneratedSecret, GenerateSecretOptions } from '../../../key/generate_secret.js'
import { loadKeyAlgorithms, unsupportedAlg } from '../../../lib/key_algorithm.js'

/** A secret generator restricted to the selected symmetric algorithms. */
export interface ComposedGenerateSecret<Algorithm extends string> {
  <Selected extends Algorithm>(
    alg: Selected,
    options?: GenerateSecretOptions,
  ): Promise<GeneratedSecret<Selected>>
}

/**
 * Composes symmetric secret generation from one or more algorithm factories.
 *
 * @example
 *
 * ```js
 * import { A256CBC_HS512, A256GCM } from 'jose/algorithms/key'
 * import { composeGenerateSecret } from 'jose/composable/key/generate/secret'
 *
 * const generateSecret = composeGenerateSecret(A256GCM, A256CBC_HS512)
 * const gcmKey = await generateSecret('A256GCM')
 * const cbcHmacKey = await generateSecret('A256CBC-HS512')
 * ```
 */
export function composeGenerateSecret<const Factories extends SecretAlgorithmSelection>(
  ...factories: Factories & UniqueAlgorithmFactories<Factories>
): ComposedGenerateSecret<AlgorithmOf<Factories>> {
  const capabilities = loadKeyAlgorithms(factories as readonly AlgorithmFactory[], 4)

  async function generateSecret<Selected extends AlgorithmOf<Factories>>(
    alg: Selected,
    options?: GenerateSecretOptions,
  ) {
    const extractable = options?.extractable
    if (extractable !== undefined && typeof extractable !== 'boolean') {
      throw new TypeError('"extractable" option must be a boolean')
    }
    const entry = capabilities[alg]?.key
    if (!entry) unsupportedAlg('"alg" (Algorithm)')
    const subtle = entry.subtle
    if (subtle.name === 'AES-CBC') {
      return crypto.getRandomValues(new Uint8Array(subtle.length! >> 3))
    }
    return crypto.subtle.generateKey(
      subtle.name === 'HMAC'
        ? ({ ...subtle, length: +alg.slice(-3) } as HmacKeyGenParams)
        : (subtle as AesKeyGenParams),
      extractable ?? false,
      (entry.ops ?? ['sign', 'verify']) as unknown as KeyUsage[],
    )
  }

  return generateSecret as ComposedGenerateSecret<AlgorithmOf<Factories>>
}
