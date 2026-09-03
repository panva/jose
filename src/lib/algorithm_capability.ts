import type { AlgorithmCapability, AlgorithmFactory } from '../algorithms/types.js'

interface CapabilityKey {
  readonly kty: readonly string[]
  readonly subtle: object
  readonly signing?: object
  readonly usages: readonly [readonly KeyUsage[], readonly KeyUsage[]]
  readonly ops?: readonly (string | undefined)[]
}

export const algorithmCapabilityMarker: symbol = Symbol.for('panva.jose.algorithmCapability.v1')

/** Deep-freezes a built-in key recipe. */
export function freezeKey<Key extends CapabilityKey>(key: Key): Readonly<Key> {
  for (const value of [key.kty, key.subtle, key.signing, ...key.usages, key.usages, key.ops]) {
    Object.freeze(value)
  }
  return Object.freeze(key)
}

/** Creates a callable that always returns the same frozen, branded capability. */
export function createAlgorithmFactory<Capability extends AlgorithmCapability>(
  capability: Capability,
  brand: number,
): AlgorithmFactory<Capability> {
  Object.defineProperty(capability, algorithmCapabilityMarker, { value: brand })
  Object.freeze(capability)
  return () => capability
}

/** Reads the brand from an immutable capability with a non-enumerable marker. */
export function readBrand(capability: object): unknown {
  const descriptor = Object.getOwnPropertyDescriptor(capability, algorithmCapabilityMarker)
  return descriptor?.enumerable === false && Object.isFrozen(capability)
    ? descriptor.value
    : undefined
}

/** Invokes and snapshots one frozen, branded built-in capability. */
export function loadFactory(
  factory: AlgorithmFactory,
): readonly [Readonly<AlgorithmCapability>, string, string, number] {
  let algorithm: string | undefined
  try {
    const capability = factory()
    if (typeof capability !== 'object') throw new TypeError()
    const category = capability.category
    const identifier = capability.algorithm
    if (typeof category !== 'string' || typeof identifier !== 'string' || !identifier) {
      throw new TypeError()
    }
    algorithm = identifier
    const descriptor = Object.getOwnPropertyDescriptor(capability, algorithmCapabilityMarker)
    const brand = descriptor?.value
    if (
      descriptor?.enumerable !== false ||
      typeof brand !== 'number' ||
      !Object.isFrozen(capability)
    ) {
      throw new TypeError()
    }
    return [capability, category, algorithm, brand]
  } catch (cause) {
    throw new TypeError(
      algorithm === undefined
        ? 'Invalid algorithm factory'
        : `Invalid "${algorithm}" algorithm capability`,
      { cause },
    )
  }
}

/** Indexes already-frozen capabilities authored by this package in an immutable lookup. */
export function trustedAlgorithmMap<Capability extends { readonly algorithm: string }>(
  capabilities: readonly Capability[],
): Readonly<Record<string, Readonly<Capability>>> {
  const algorithms = Object.create(null) as Record<string, Readonly<Capability>>
  for (const capability of capabilities) algorithms[capability.algorithm] = capability
  return Object.freeze(algorithms)
}
