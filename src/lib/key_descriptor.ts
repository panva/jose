/**
 * The parts of an algorithm entry that key handling needs, shared by the JWS and JWE registries.
 * Type-only, so importing it costs nothing at runtime and neither family's data follows it.
 */
export interface KeyDescriptor {
  /** The JWA identifier this entry describes. */
  alg: string
  /** JWK "kty" (Key Type) values this algorithm accepts. */
  kty: readonly string[]
  /** JWK "crv" the identifier implies, where it implies one. */
  crv?: string
  /**
   * Resolves the WebCrypto parameters from the key itself, for algorithms whose curve the
   * identifier does not fix. Defined by the registry so the shared key handling carries no
   * family-specific curve names.
   */
  subtleFor?: (observed: { kty?: string; crv?: string; asymmetricKeyType?: string }) => {
    name: string
    hash?: string
    namedCurve?: string
  }
  /** True for algorithms that take a secret rather than a key pair. */
  symmetric?: boolean
  /** Node KeyObject asymmetricKeyType, where the key is asymmetric. */
  asymmetricKeyType?: string
  /** WebCrypto parameters for importing, generating, and asserting a key's shape. */
  subtle: { name: string; hash?: string; namedCurve?: string; length?: number }
  /** Key usages, by whether the key is public. */
  usages: { public: KeyUsage[]; private: KeyUsage[] }
  /**
   * JWK "key_ops" expected per operation. Absent for JWS, where it is always the operation itself.
   * A JWE entry states it explicitly, and may leave an operation out to mean that no key_ops value
   * is implied - deriving with a recipient's public ECDH key, for one.
   */
  keyOps?: { encrypt?: string; decrypt?: string }
  /** Minimum RSA modulus length in bits. */
  minModulusLength?: number
}

/**
 * Stamps each entry with the identifier it is keyed by, and gives the record a null prototype so a
 * lookup cannot resolve to something inherited from Object.prototype. Writing the identifier once
 * rather than as both the key and a field keeps it out of the bundle twice over.
 */
export function table<T extends KeyDescriptor>(
  entries: Record<string, Omit<T, 'alg'>>,
): Record<string, T> {
  const out: Record<string, T> = { __proto__: null } as unknown as Record<string, T>
  for (const alg of Object.keys(entries)) {
    out[alg] = { ...entries[alg], alg } as T
  }
  return out
}
