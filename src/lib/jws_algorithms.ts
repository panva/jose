import { JOSENotSupported } from '../util/errors.js'
import { table } from './key_descriptor.js'
import type { KeyDescriptor } from './key_descriptor.js'

/**
 * Everything the implementation needs to know about one JWS "alg", in one place. Consumers are
 * handed a resolved entry rather than the identifier, so nothing below this module has to enumerate
 * algorithms - which is also what keeps JWE descriptors out of a JWS-only bundle.
 */
export interface JWSAlgorithm extends KeyDescriptor {
  /** WebCrypto parameters for subtle.sign and subtle.verify. */
  signing: { name: string; hash?: string; saltLength?: number }
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

function ecdsa(crv: string, bits: number): Entry {
  return {
    kty: ['EC'],
    crv,
    subtle: { name: 'ECDSA', namedCurve: crv },
    signing: { name: 'ECDSA', hash: `SHA-${bits}` },
    usages: sig,
  }
}

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

/** ML-DSA names its WebCrypto algorithm and its Node key type after the JWA identifier. */
function mldsa(bits: 44 | 65 | 87): Entry {
  const name = `ML-DSA-${bits}`
  const subtle = { name }
  return {
    kty: ['AKP'],
    subtle,
    signing: subtle,
    usages: sig,
  }
}

const JWS: Record<string, JWSAlgorithm> = table({
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
  'ML-DSA-44': mldsa(44),
  'ML-DSA-65': mldsa(65),
  'ML-DSA-87': mldsa(87),
})

/** Resolves a JWS "alg" to its entry, or throws if this module does not implement it. */
export function jwsAlgorithm(alg: string): JWSAlgorithm {
  const entry = JWS[alg]
  if (!entry) {
    throw new JOSENotSupported(
      `alg ${alg} is not supported either by JOSE or your javascript runtime`,
    )
  }
  return entry
}

/** Resolves a JWS "alg" to its entry, or undefined when it is not a JWS algorithm at all. */
export function maybeJWSAlgorithm(alg: string): JWSAlgorithm | undefined {
  return JWS[alg]
}
