import { JOSENotSupported } from '../util/errors.js'
import type { KeyDescriptor } from './key_descriptor.js'

/**
 * Everything the implementation needs to know about one JWS "alg", in one place. Consumers are
 * handed a resolved entry rather than the identifier, so nothing below this module has to enumerate
 * algorithms - which is also what keeps JWE descriptors out of a JWS-only bundle.
 */
export interface JWSAlgorithm extends KeyDescriptor {
  /** WebCrypto parameters for subtle.sign and subtle.verify. */
  operation: { name: string; hash?: string; saltLength?: number }
}

const sig: { public: KeyUsage[]; private: KeyUsage[] } = { public: ['verify'], private: ['sign'] }

function hmac(alg: string, bits: number): JWSAlgorithm {
  const subtle = { name: 'HMAC', hash: `SHA-${bits}` }
  return { alg, kty: ['oct'], symmetric: true, subtle, operation: subtle, usages: sig }
}

function rsa(alg: string, name: string, bits: number, saltLength?: number): JWSAlgorithm {
  const subtle = { name, hash: `SHA-${bits}` }
  return {
    alg,
    kty: ['RSA'],
    asymmetricKeyType: 'rsa',
    subtle,
    operation: saltLength ? { ...subtle, saltLength } : subtle,
    usages: sig,
    minModulusLength: 2048,
  }
}

function ecdsa(alg: string, crv: string, bits: number): JWSAlgorithm {
  return {
    alg,
    kty: ['EC'],
    crv,
    asymmetricKeyType: 'ec',
    subtle: { name: 'ECDSA', namedCurve: crv },
    operation: { name: 'ECDSA', hash: `SHA-${bits}` },
    usages: sig,
  }
}

function eddsa(alg: string): JWSAlgorithm {
  const subtle = { name: 'Ed25519' }
  return {
    alg,
    kty: ['OKP'],
    crv: 'Ed25519',
    asymmetricKeyType: 'ed25519',
    subtle,
    operation: subtle,
    usages: sig,
  }
}

function mldsa(alg: string): JWSAlgorithm {
  const subtle = { name: alg }
  return {
    alg,
    kty: ['AKP'],
    asymmetricKeyType: alg.toLowerCase(),
    subtle,
    operation: subtle,
    usages: sig,
  }
}

const JWS: Record<string, JWSAlgorithm> = {
  // @ts-expect-error
  __proto__: null,
  HS256: hmac('HS256', 256),
  HS384: hmac('HS384', 384),
  HS512: hmac('HS512', 512),
  RS256: rsa('RS256', 'RSASSA-PKCS1-v1_5', 256),
  RS384: rsa('RS384', 'RSASSA-PKCS1-v1_5', 384),
  RS512: rsa('RS512', 'RSASSA-PKCS1-v1_5', 512),
  PS256: rsa('PS256', 'RSA-PSS', 256, 32),
  PS384: rsa('PS384', 'RSA-PSS', 384, 48),
  PS512: rsa('PS512', 'RSA-PSS', 512, 64),
  ES256: ecdsa('ES256', 'P-256', 256),
  ES384: ecdsa('ES384', 'P-384', 384),
  ES512: ecdsa('ES512', 'P-521', 512),
  EdDSA: eddsa('EdDSA'),
  Ed25519: eddsa('Ed25519'),
  'ML-DSA-44': mldsa('ML-DSA-44'),
  'ML-DSA-65': mldsa('ML-DSA-65'),
  'ML-DSA-87': mldsa('ML-DSA-87'),
}

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
