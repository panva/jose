/**
 * The parts of an algorithm entry that key handling needs, shared by the JWS and JWE registries.
 * This is deliberately internal; public algorithm factories expose opaque selection metadata, not a
 * third-party algorithm implementation ABI.
 */
export interface KeyDescriptor {
  /** The JWA identifier this entry describes. */
  readonly alg: string
  /** JWK "kty" (Key Type) values this algorithm accepts. */
  readonly kty: readonly string[]
  /** JWK "crv" the identifier implies, where it implies one. */
  readonly crv?: string
  /** Resolves WebCrypto parameters for algorithms whose curve is determined by the key. */
  readonly resolve?: (observed: { kty?: string; crv?: string; asymmetricKeyType?: string }) => {
    name: string
    hash?: string
    namedCurve?: string
  }
  /** True for algorithms that take a secret rather than a key pair. */
  readonly secret?: boolean
  /** WebCrypto parameters for importing, generating, and asserting a key's shape. */
  readonly subtle: { name: string; hash?: string; namedCurve?: string; length?: number }
  /** Key usages, ordered as public then private. */
  readonly usages: readonly [publicKey: readonly KeyUsage[], privateKey: readonly KeyUsage[]]
  /** JWK "key_ops" expected for the encrypt/sign and decrypt/verify sides respectively. */
  readonly ops?: readonly [encrypt: string | undefined, decrypt: string | undefined]
  /** Minimum RSA modulus length in bits. */
  readonly minRsaBits?: number
}
