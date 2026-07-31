import { JOSENotSupported } from '../util/errors.js'
import { compositeJwkToKey } from './composite_signature.js'
import { encode } from './buffer_utils.js'
import { table } from './key_descriptor.js'
import type { KeyDescriptor } from './key_descriptor.js'

type RawKeyParameters = readonly [
  publicKeyLength: number,
  privateKeyLength: number,
  signatureLength: number,
]

export type CompositeComponent = JWSAlgorithm & { raw: RawKeyParameters }

export type CompositeParameters = readonly [
  mldsa: CompositeComponent,
  traditional: CompositeComponent,
  hashBits: 256 | 512,
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
  /** Fixed-width values used when this algorithm is a composite component. */
  raw?: RawKeyParameters
  /** Component algorithms and pre-hash used by a composite signature algorithm. */
  composite?: () => CompositeParameters
}

type Entry = Omit<JWSAlgorithm, 'alg'>

const sig: [KeyUsage[], KeyUsage[]] = [['verify'], ['sign']]

function hmac(bits: number): Entry {
  const subtle = { name: 'HMAC', hash: `SHA-${bits}` }
  return { kty: ['oct'], secret: true, subtle, signing: subtle, usages: sig }
}

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

function ecdsa(crv: string, bits: number, raw?: RawKeyParameters): Entry {
  return {
    kty: ['EC'],
    crv,
    subtle: { name: 'ECDSA', namedCurve: crv },
    signing: { name: 'ECDSA', hash: `SHA-${bits}` },
    usages: sig,
    raw,
  }
}

function eddsa(raw?: RawKeyParameters): Entry {
  const subtle = { name: 'Ed25519' }
  return {
    kty: ['OKP'],
    crv: 'Ed25519',
    subtle,
    signing: subtle,
    usages: sig,
    raw,
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

/** ML-DSA names its WebCrypto algorithm and its Node key type after the JWA identifier. */
function mldsa(name: string, publicKeyLength: number, signatureLength: number): Entry {
  return {
    ...akp(name),
    raw: [publicKeyLength, 32, signatureLength],
  }
}

function composite(mldsa: string, traditional: string, hashBits: 256 | 512): JWSAlgorithm {
  const name = `${mldsa}-${traditional}`
  const label = encode(
    `COMPSIG-${mldsa.replaceAll('-', '')}-${traditional.replace(/^ES/, 'ECDSA-P')}-SHA${hashBits}`,
  )
  return {
    ...akp(name),
    alg: name,
    composite: () => [
      JWS[mldsa] as CompositeComponent,
      JWS[traditional] as CompositeComponent,
      hashBits,
      label,
    ],
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
  ES256: ecdsa('P-256', 256, [64, 32, 64]),
  ES384: ecdsa('P-384', 384, [96, 48, 96]),
  ES512: ecdsa('P-521', 512),
  EdDSA: eddsa(),
  Ed25519: eddsa([32, 32, 64]),
  'ML-DSA-44': mldsa('ML-DSA-44', 1312, 2420),
  'ML-DSA-65': mldsa('ML-DSA-65', 1952, 3309),
  'ML-DSA-87': mldsa('ML-DSA-87', 2592, 4627),
})

for (const [mldsa, traditional, hashBits = 512] of [
  ['ML-DSA-44', 'ES256', 256],
  ['ML-DSA-65', 'ES256'],
  ['ML-DSA-87', 'ES384'],
  ['ML-DSA-44', 'Ed25519'],
  ['ML-DSA-65', 'Ed25519'],
] as const) {
  const entry = composite(mldsa, traditional, hashBits)
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
