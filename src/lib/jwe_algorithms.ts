import { JOSENotSupported } from '../util/errors.js'
import { table } from './key_descriptor.js'
import type { KeyDescriptor } from './key_descriptor.js'

/** Everything the implementation needs to know about one JWE "alg", in one place. */
export interface JWEAlgorithm extends KeyDescriptor {
  /** AES key wrapping bits embedded in the identifier, for ECDH-ES+A*KW and PBES2. */
  kwBits?: number
  /** PBES2 PRF hash. */
  pbes2Hash?: string
  /** The AES-GCM "enc" an A*GCMKW identifier wraps with. */
  gcmkw?: string
}

type AlgEntry = Omit<JWEAlgorithm, 'alg'>
type EncEntry = Omit<JWEEncryption, 'alg'>

const wrap: { public: KeyUsage[]; private: KeyUsage[] } = {
  public: ['encrypt', 'wrapKey'],
  private: ['decrypt', 'unwrapKey'],
}
/** An ECDH public key carries no usages; the private half derives. deriveKey is not used. */
const derive: { public: KeyUsage[]; private: KeyUsage[] } = { public: [], private: ['deriveBits'] }
const none: { public: KeyUsage[]; private: KeyUsage[] } = { public: [], private: [] }

function rsaes(bits: number): AlgEntry {
  return {
    kty: ['RSA'],
    subtle: { name: 'RSA-OAEP', hash: `SHA-${bits}` },
    usages: wrap,
    minModulusLength: 2048,
    keyOps: { encrypt: 'wrapKey', decrypt: 'unwrapKey' },
  }
}

function ecdh(kwBits?: number): AlgEntry {
  return {
    kty: ['EC', 'OKP'],
    subtle: { name: 'ECDH' },
    subtleFor: ({ kty, crv, asymmetricKeyType }) => {
      if (crv === 'X25519' || asymmetricKeyType === 'x25519') {
        return { name: 'X25519' }
      }
      if (kty === 'OKP') {
        throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')
      }
      return { name: 'ECDH', namedCurve: crv! }
    },
    usages: derive,
    kwBits,
    // Deriving with the recipient's public key implies no key_ops value; only the private half does.
    keyOps: { decrypt: 'deriveBits' },
  }
}

function aeskw(bits: number): AlgEntry {
  return {
    kty: ['oct'],
    symmetric: true,
    subtle: { name: 'AES-KW', length: bits },
    usages: none,
    keyOps: { encrypt: 'wrapKey', decrypt: 'unwrapKey' },
  }
}

function aesgcmkw(bits: number): AlgEntry {
  return {
    kty: ['oct'],
    symmetric: true,
    subtle: { name: 'AES-GCM', length: bits },
    usages: none,
    gcmkw: `A${bits}GCM`,
    keyOps: { encrypt: 'encrypt', decrypt: 'decrypt' },
  }
}

function pbes2(bits: number, kwBits: number): AlgEntry {
  return {
    kty: ['oct'],
    symmetric: true,
    subtle: { name: 'PBKDF2' },
    usages: none,
    pbes2Hash: `SHA-${bits}`,
    kwBits,
    keyOps: { encrypt: 'deriveBits', decrypt: 'deriveBits' },
  }
}

const JWE: Record<string, JWEAlgorithm> = table<JWEAlgorithm>({
  dir: {
    kty: ['oct'],
    symmetric: true,
    subtle: { name: 'AES-GCM' },
    usages: none,
    keyOps: { encrypt: 'encrypt', decrypt: 'decrypt' },
  },
  'RSA-OAEP': rsaes(1),
  'RSA-OAEP-256': rsaes(256),
  'RSA-OAEP-384': rsaes(384),
  'RSA-OAEP-512': rsaes(512),
  'ECDH-ES': ecdh(),
  'ECDH-ES+A128KW': ecdh(128),
  'ECDH-ES+A192KW': ecdh(192),
  'ECDH-ES+A256KW': ecdh(256),
  A128KW: aeskw(128),
  A192KW: aeskw(192),
  A256KW: aeskw(256),
  A128GCMKW: aesgcmkw(128),
  A192GCMKW: aesgcmkw(192),
  A256GCMKW: aesgcmkw(256),
  'PBES2-HS256+A128KW': pbes2(256, 128),
  'PBES2-HS384+A192KW': pbes2(384, 192),
  'PBES2-HS512+A256KW': pbes2(512, 256),
})

/**
 * Content encryption algorithms. These describe a key too: with "alg" of "dir" the Content
 * Encryption Key is the caller's key, and it is the "enc" identifier a JWK "alg" must match.
 */
export interface JWEEncryption extends KeyDescriptor {
  /** Content Encryption Key bit length. */
  cekBits: number
  /** Initialization Vector bit length. */
  ivBits: number
  /** Whether the cipher is AES-CBC with an HMAC tag rather than AES-GCM. */
  cbc: boolean
}

const content: { public: KeyUsage[]; private: KeyUsage[] } = { public: [], private: [] }
const contentOps = { encrypt: 'encrypt', decrypt: 'decrypt' }

function gcm(bits: number): EncEntry {
  return {
    kty: ['oct'],
    symmetric: true,
    subtle: { name: 'AES-GCM', length: bits },
    usages: content,
    keyOps: contentOps,
    cekBits: bits,
    ivBits: 96,
    cbc: false,
  }
}

function cbc(bits: number): EncEntry {
  return {
    kty: ['oct'],
    symmetric: true,
    subtle: { name: 'AES-CBC', length: bits },
    usages: content,
    keyOps: contentOps,
    cekBits: bits,
    ivBits: 128,
    cbc: true,
  }
}

const ENC: Record<string, JWEEncryption> = table<JWEEncryption>({
  A128GCM: gcm(128),
  A192GCM: gcm(192),
  A256GCM: gcm(256),
  'A128CBC-HS256': cbc(256),
  'A192CBC-HS384': cbc(384),
  'A256CBC-HS512': cbc(512),
})

const unsupportedAlgHeader = 'Invalid or unsupported "alg" (JWE Algorithm) header value'

export function jweAlgorithm(alg: string): JWEAlgorithm {
  const entry = JWE[alg]
  if (!entry) {
    throw new JOSENotSupported(unsupportedAlgHeader)
  }
  return entry
}

export function maybeJWEAlgorithm(alg: string): JWEAlgorithm | undefined {
  return JWE[alg]
}

export function jweEncryption(enc: string): JWEEncryption {
  const entry = ENC[enc]
  if (!entry) {
    throw new JOSENotSupported(`Unsupported JWE Algorithm: ${enc}`)
  }
  return entry
}
