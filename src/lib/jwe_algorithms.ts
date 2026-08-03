import { JOSENotSupported } from '../util/errors.js'
import { table } from './key_descriptor.js'
import type { KeyDescriptor } from './key_descriptor.js'

/** Everything the implementation needs to know about one JWE "alg", in one place. */
export interface JWEAlgorithm extends KeyDescriptor {
  subtle: KeyDescriptor['subtle'] & {
    name: 'RSA-OAEP' | 'ECDH' | 'AES-KW' | 'AES-GCM' | 'PBKDF2'
  }
}

type AlgEntry = Omit<JWEAlgorithm, 'alg'>
type EncEntry = Omit<JWEEncryption, 'alg'>

const wrap: [KeyUsage[], KeyUsage[]] = [
  ['encrypt', 'wrapKey'],
  ['decrypt', 'unwrapKey'],
]
/** An ECDH public key carries no usages; the private half derives. deriveKey is not used. */
const derive: [KeyUsage[], KeyUsage[]] = [[], ['deriveBits']]
const none: [KeyUsage[], KeyUsage[]] = [[], []]

function rsaes(bits: number): AlgEntry {
  return {
    kty: ['RSA'],
    subtle: { name: 'RSA-OAEP', hash: `SHA-${bits}` },
    usages: wrap,
    ops: ['wrapKey', 'unwrapKey'],
  }
}

function ecdh(): AlgEntry {
  return {
    kty: ['EC', 'OKP'],
    subtle: { name: 'ECDH' },
    resolve: ({ kty, crv, asymmetricKeyType }) => {
      if (crv === 'X25519' || asymmetricKeyType === 'x25519') {
        return { name: 'X25519' }
      }
      if (kty === 'OKP') {
        throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')
      }
      return { name: 'ECDH', namedCurve: crv! }
    },
    usages: derive,
    // Deriving with the recipient's public key implies no key_ops value; only the private half does.
    ops: [undefined, 'deriveBits'],
  }
}

function aeskw(bits: number, gcm = false): AlgEntry {
  return {
    kty: ['oct'],
    secret: true,
    subtle: { name: gcm ? 'AES-GCM' : 'AES-KW', length: bits },
    usages: none,
    ops: gcm ? ['encrypt', 'decrypt'] : ['wrapKey', 'unwrapKey'],
  }
}

function pbes2(): AlgEntry {
  return {
    kty: ['oct'],
    secret: true,
    subtle: { name: 'PBKDF2' },
    usages: none,
    ops: ['deriveBits', 'deriveBits'],
  }
}

export const JWE: Record<string, JWEAlgorithm> = table<JWEAlgorithm>({
  dir: {
    kty: ['oct'],
    secret: true,
    subtle: { name: 'AES-GCM' },
    usages: none,
    ops: ['encrypt', 'decrypt'],
  },
  'RSA-OAEP': rsaes(1),
  'RSA-OAEP-256': rsaes(256),
  'RSA-OAEP-384': rsaes(384),
  'RSA-OAEP-512': rsaes(512),
  'ECDH-ES': ecdh(),
  'ECDH-ES+A128KW': ecdh(),
  'ECDH-ES+A192KW': ecdh(),
  'ECDH-ES+A256KW': ecdh(),
  A128KW: aeskw(128),
  A192KW: aeskw(192),
  A256KW: aeskw(256),
  A128GCMKW: aeskw(128, true),
  A192GCMKW: aeskw(192, true),
  A256GCMKW: aeskw(256, true),
  'PBES2-HS256+A128KW': pbes2(),
  'PBES2-HS384+A192KW': pbes2(),
  'PBES2-HS512+A256KW': pbes2(),
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

const contentOps: [string, string] = ['encrypt', 'decrypt']

function contentEncryption(bits: number, cbc = false): EncEntry {
  return {
    kty: ['oct'],
    secret: true,
    subtle: { name: cbc ? 'AES-CBC' : 'AES-GCM', length: bits },
    usages: none,
    ops: contentOps,
    cekBits: bits,
    ivBits: cbc ? 128 : 96,
    cbc,
  }
}

const ENC: Record<string, JWEEncryption> = table<JWEEncryption>({
  A128GCM: contentEncryption(128),
  A192GCM: contentEncryption(192),
  A256GCM: contentEncryption(256),
  'A128CBC-HS256': contentEncryption(256, true),
  'A192CBC-HS384': contentEncryption(384, true),
  'A256CBC-HS512': contentEncryption(512, true),
})

const unsupportedAlg = 'Invalid or unsupported "alg" (JWE Algorithm) header value'

export function jweAlgorithm(alg: unknown): JWEAlgorithm {
  const entry = typeof alg === 'string' ? JWE[alg] : undefined
  if (!entry) {
    throw new JOSENotSupported(unsupportedAlg)
  }
  return entry
}

export function jweEncryption(enc: unknown): JWEEncryption {
  const entry = typeof enc === 'string' ? ENC[enc] : undefined
  if (!entry) {
    throw new JOSENotSupported(`Unsupported JWE Algorithm: ${enc}`)
  }
  return entry
}
