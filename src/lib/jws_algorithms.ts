import { JOSENotSupported } from '../util/errors.js'
import { compositeJwkToKey } from './composite_signature.js'
import { encode } from './buffer_utils.js'
import { table } from './key_descriptor.js'
import type { KeyDescriptor } from './key_descriptor.js'

export type CompositeParameters = readonly [
  traditional: JWSAlgorithm,
  preHashBits: 256 | 512,
  label: Uint8Array,
]

/**
 * Everything the implementation needs to know about one JWS "alg", in one place. Consumers are
 * handed a resolved entry rather than the identifier, so nothing below this module has to enumerate
 * algorithms - which is also what keeps JWE descriptors out of a JWS-only bundle.
 */
export interface JWSAlgorithm extends KeyDescriptor {
  /** WebCrypto parameters for subtle.sign and subtle.verify. */
  signing: { name: string; hash?: string; saltLength?: number }
  /** Traditional component, pre-hash, and domain separation label for a composite algorithm. */
  composite?: () => CompositeParameters
}

type Entry = Omit<JWSAlgorithm, 'alg'>

const sig: [KeyUsage[], KeyUsage[]] = [['verify'], ['sign']]

// RFC 7518, Section 3.2: HMAC with the SHA-2 hash selected by the JWA identifier.
function hmac(bits: number): Entry {
  const subtle = { name: 'HMAC', hash: `SHA-${bits}` }
  return { kty: ['oct'], secret: true, subtle, signing: subtle, usages: sig }
}

// RFC 7518, Sections 3.3/3.5: RSA signature parameters; PSS salt length equals hash length.
function rsa(bits: number, saltLength?: 32 | 48 | 64): Entry {
  const name = saltLength ? 'RSA-PSS' : 'RSASSA-PKCS1-v1_5'
  const subtle = { name, hash: `SHA-${bits}` }
  return {
    kty: ['RSA'],
    subtle,
    signing: saltLength ? { ...subtle, saltLength } : subtle,
    usages: sig,
    minRsaBits: 2048,
  }
}

// RFC 7518, Section 3.4: the identifier selects both curve and SHA-2 hash.
// Web Crypto supplies the fixed-width R || S signature representation required by JWS.
function ecdsa(crv: string, bits: number): Entry {
  return {
    kty: ['EC'],
    crv,
    subtle: { name: 'ECDSA', namedCurve: crv },
    signing: { name: 'ECDSA', hash: `SHA-${bits}` },
    usages: sig,
  }
}

// RFC 8037, Sections 3.1.1-3.1.2; RFC 9864, Section 2.2 for the Ed25519 identifier.
function eddsa(): Entry {
  const subtle = { name: 'Ed25519' }
  return {
    kty: ['OKP'],
    crv: 'Ed25519',
    subtle,
    signing: subtle,
    usages: sig,
  }
}

function akp(name: string): Entry {
  const subtle = { name }
  return {
    kty: ['AKP'],
    subtle,
    signing: subtle,
    usages: sig,
  }
}

// draft-ietf-jose-pq-composite-sigs-06, Sections 5.1 and 5.3: the composite
// identifier selects the traditional component, pre-hash, and ASCII algorithm label.
function composite(traditional: string, preHashBits: 256 | 512): JWSAlgorithm {
  const name = `ML-DSA-44-${traditional}`
  const label = encode(`COMPSIG-MLDSA44-${traditional.replace(/^ES/, 'ECDSA-P')}-SHA${preHashBits}`)
  return {
    ...akp(name),
    alg: name,
    composite: () => [JWS[traditional], preHashBits, label],
    importJWK: compositeJwkToKey,
  }
}

export const JWS: Record<string, JWSAlgorithm> = table({
  HS256: hmac(256),
  HS384: hmac(384),
  HS512: hmac(512),
  RS256: rsa(256),
  RS384: rsa(384),
  RS512: rsa(512),
  PS256: rsa(256, 32),
  PS384: rsa(384, 48),
  PS512: rsa(512, 64),
  ES256: ecdsa('P-256', 256),
  ES384: ecdsa('P-384', 384),
  ES512: ecdsa('P-521', 512),
  EdDSA: eddsa(),
  Ed25519: eddsa(),
  // RFC 9964, Section 5: pure ML-DSA uses an empty context, the Web Crypto default.
  'ML-DSA-44': akp('ML-DSA-44'),
  'ML-DSA-65': akp('ML-DSA-65'),
  'ML-DSA-87': akp('ML-DSA-87'),
})

for (const [traditional, preHashBits] of [
  ['ES256', 256],
  ['Ed25519', 512],
] as const) {
  const entry = composite(traditional, preHashBits)
  JWS[entry.alg] = entry
}

/** Resolves a JWS "alg" to its entry, or throws if this module does not implement it. */
export function jwsAlgorithm(alg: unknown): JWSAlgorithm {
  const entry = typeof alg === 'string' ? JWS[alg] : undefined
  if (!entry) {
    throw new JOSENotSupported(
      `alg ${alg} is not supported either by JOSE or your javascript runtime`,
    )
  }
  return entry
}
