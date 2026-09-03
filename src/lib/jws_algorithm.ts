import type {
  AlgorithmFactory,
  JWSAlgorithmCapability as PublicJWSAlgorithmCapability,
  JWSAlgorithmName,
  JWSAlgorithmSelection,
} from '../algorithms/types.js'
import { loadFactory } from './algorithm_capability.js'
import { JOSENotSupported } from '../util/errors.js'
import type { KeyDescriptor } from './key_descriptor.js'

export type { JWSAlgorithmSelection } from '../algorithms/types.js'

/** Backwards-compatible internal name for a resolved JWS descriptor. */
export interface JWSAlgorithm extends Omit<KeyDescriptor, 'resolve'> {
  /** WebCrypto parameters for subtle.sign and subtle.verify. */
  readonly signing: { name: string; hash?: string; saltLength?: number }
}

/** Private implementation record carried by a built-in JWS factory. */
export interface JWSAlgorithmCapability<
  Algorithm extends JWSAlgorithmName = JWSAlgorithmName,
> extends PublicJWSAlgorithmCapability<Algorithm> {
  readonly key: Readonly<JWSAlgorithm>
}

export type JWSAlgorithmFactory<Algorithm extends JWSAlgorithmName = JWSAlgorithmName> =
  AlgorithmFactory<JWSAlgorithmCapability<Algorithm>>

export type JWSAlgorithmCapabilityMap = Readonly<Record<string, Readonly<JWSAlgorithmCapability>>>

export type JWSAlgorithmLookup = (algorithm: string) => Readonly<JWSAlgorithm> | undefined

/** Resolves a selected JWS identifier to its read-only key and signing descriptor. */
export type JWSAlgorithmResolver = (algorithm: unknown) => Readonly<JWSAlgorithm>

/** Loads the private records carried by selected built-in JWS factories. */
export function loadJWSAlgorithmCapabilities(
  factories: JWSAlgorithmSelection,
): JWSAlgorithmCapabilityMap {
  if (factories.length === 0) {
    throw new TypeError('At least one algorithm factory must be provided')
  }

  const algorithms = Object.create(null) as Record<string, Readonly<JWSAlgorithmCapability>>
  for (const factory of factories) {
    const [capability, category, algorithm, brand] = loadFactory(factory)

    if (category !== 'jws' || brand !== 0) {
      throw new TypeError('Expected only "jws" algorithm factories')
    }
    if (Object.hasOwn(algorithms, algorithm)) {
      throw new TypeError(`Duplicate "${algorithm}" algorithm capability`)
    }
    algorithms[algorithm] = capability as Readonly<JWSAlgorithmCapability>
  }
  return Object.freeze(algorithms)
}

/** Creates a resolver for an already validated set of JWS capabilities. */
export function createJWSAlgorithmResolver(
  algorithms: JWSAlgorithmCapabilityMap,
): JWSAlgorithmResolver {
  return (algorithm: unknown) => {
    const capability = typeof algorithm === 'string' ? algorithms[algorithm] : undefined
    if (!capability) {
      throw new JOSENotSupported(
        `alg ${algorithm} is not supported either by JOSE or your javascript runtime`,
      )
    }
    return capability.key
  }
}

/** Creates the JWS resolver captured by a composed producer or consumer. */
export function loadJWSAlgorithms(factories: JWSAlgorithmSelection): JWSAlgorithmResolver {
  return createJWSAlgorithmResolver(loadJWSAlgorithmCapabilities(factories))
}

export function loadAsymmetricJWSAlgorithmLookup(
  factories: readonly AlgorithmFactory[],
  target: 'an Embedded JWK' | 'a JSON Web Key Set',
): JWSAlgorithmLookup {
  const capabilities = loadJWSAlgorithmCapabilities(factories as JWSAlgorithmSelection)
  for (const algorithm in capabilities) {
    if (capabilities[algorithm].key.secret) {
      throw new TypeError(`The "${algorithm}" algorithm cannot resolve ${target}`)
    }
  }
  return (algorithm) => capabilities[algorithm]?.key
}
