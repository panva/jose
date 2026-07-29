import { JOSENotSupported } from '../util/errors.js'
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

const wrap: { public: KeyUsage[]; private: KeyUsage[] } = {
  public: ['encrypt', 'wrapKey'],
  private: ['decrypt', 'unwrapKey'],
}
const derive: { public: KeyUsage[]; private: KeyUsage[] } = { public: [], private: ['deriveBits'] }
const none: { public: KeyUsage[]; private: KeyUsage[] } = { public: [], private: [] }

function rsaes(alg: string, bits: number): JWEAlgorithm {
  return {
    alg,
    kty: ['RSA'],
    asymmetricKeyType: 'rsa',
    subtle: { name: 'RSA-OAEP', hash: `SHA-${bits}` },
    usages: wrap,
    minModulusLength: 2048,
    keyOps: { encrypt: 'wrapKey', decrypt: 'unwrapKey' },
  }
}

function ecdh(alg: string, kwBits?: number): JWEAlgorithm {
  return {
    alg,
    kty: ['EC', 'OKP'],
    subtle: { name: 'ECDH' },
    subtleFor: ({ kty, crv, asymmetricKeyType }) => {
      if (kty === 'OKP' || asymmetricKeyType === 'x25519') {
        if (kty === 'OKP' && crv !== 'X25519') {
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')
        }
        return { name: 'X25519' }
      }
      return { name: 'ECDH', namedCurve: crv! }
    },
    usages: derive,
    kwBits,
    keyOps: { encrypt: 'deriveBits', decrypt: 'deriveBits' },
  }
}

function aeskw(alg: string, bits: number): JWEAlgorithm {
  return {
    alg,
    kty: ['oct'],
    symmetric: true,
    subtle: { name: 'AES-KW', length: bits },
    usages: none,
    keyOps: { encrypt: 'wrapKey', decrypt: 'unwrapKey' },
  }
}

function aesgcmkw(alg: string, bits: number): JWEAlgorithm {
  return {
    alg,
    kty: ['oct'],
    symmetric: true,
    subtle: { name: 'AES-GCM', length: bits },
    usages: none,
    gcmkw: `A${bits}GCM`,
    keyOps: { encrypt: 'encrypt', decrypt: 'decrypt' },
  }
}

function pbes2(alg: string, bits: number, kwBits: number): JWEAlgorithm {
  return {
    alg,
    kty: ['oct'],
    symmetric: true,
    subtle: { name: 'PBKDF2' },
    usages: none,
    pbes2Hash: `SHA-${bits}`,
    kwBits,
    keyOps: { encrypt: 'deriveBits', decrypt: 'deriveBits' },
  }
}

const JWE: Record<string, JWEAlgorithm> = {
  // @ts-expect-error
  __proto__: null,
  dir: {
    alg: 'dir',
    kty: ['oct'],
    symmetric: true,
    subtle: { name: 'AES-GCM' },
    usages: none,
    keyOps: { encrypt: 'encrypt', decrypt: 'decrypt' },
  },
  'RSA-OAEP': rsaes('RSA-OAEP', 1),
  'RSA-OAEP-256': rsaes('RSA-OAEP-256', 256),
  'RSA-OAEP-384': rsaes('RSA-OAEP-384', 384),
  'RSA-OAEP-512': rsaes('RSA-OAEP-512', 512),
  'ECDH-ES': ecdh('ECDH-ES'),
  'ECDH-ES+A128KW': ecdh('ECDH-ES+A128KW', 128),
  'ECDH-ES+A192KW': ecdh('ECDH-ES+A192KW', 192),
  'ECDH-ES+A256KW': ecdh('ECDH-ES+A256KW', 256),
  A128KW: aeskw('A128KW', 128),
  A192KW: aeskw('A192KW', 192),
  A256KW: aeskw('A256KW', 256),
  A128GCMKW: aesgcmkw('A128GCMKW', 128),
  A192GCMKW: aesgcmkw('A192GCMKW', 192),
  A256GCMKW: aesgcmkw('A256GCMKW', 256),
  'PBES2-HS256+A128KW': pbes2('PBES2-HS256+A128KW', 256, 128),
  'PBES2-HS384+A192KW': pbes2('PBES2-HS384+A192KW', 384, 192),
  'PBES2-HS512+A256KW': pbes2('PBES2-HS512+A256KW', 512, 256),
}

/** Content encryption algorithms. */
export interface JWEEncryption {
  enc: string
  /** Content Encryption Key bit length. */
  cekBits: number
  /** Initialization Vector bit length. */
  ivBits: number
  /** Whether the cipher is AES-CBC with an HMAC tag rather than AES-GCM. */
  cbc: boolean
}

function gcm(enc: string, bits: number): JWEEncryption {
  return { enc, cekBits: bits, ivBits: 96, cbc: false }
}

function cbc(enc: string, bits: number): JWEEncryption {
  return { enc, cekBits: bits, ivBits: 128, cbc: true }
}

const ENC: Record<string, JWEEncryption> = {
  // @ts-expect-error
  __proto__: null,
  A128GCM: gcm('A128GCM', 128),
  A192GCM: gcm('A192GCM', 192),
  A256GCM: gcm('A256GCM', 256),
  'A128CBC-HS256': cbc('A128CBC-HS256', 256),
  'A192CBC-HS384': cbc('A192CBC-HS384', 384),
  'A256CBC-HS512': cbc('A256CBC-HS512', 512),
}

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
