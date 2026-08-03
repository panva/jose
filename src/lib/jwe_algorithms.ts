import { JOSENotSupported } from '../util/errors.js'
import { table } from './key_descriptor.js'
import type { KeyDescriptor } from './key_descriptor.js'

/**
 * The RFC 9180 suite an HPKE identifier stands for. The KDF and AEAD are the same for every
 * registered suite, but they are what the suite_id is built from, so they are stated rather than
 * assumed.
 */
export type HPKESuite = [kemId: number, kdfId: number, aeadId: number, nEnc: number]

type HPKEKem = 'MLKEM768-P256' | 'MLKEM768-X25519' | 'MLKEM1024-P384' | 'ML-KEM-768' | 'ML-KEM-1024'

/** Everything the implementation needs to know about one JWE "alg", in one place. */
export interface JWEAlgorithm extends KeyDescriptor {
  subtle: KeyDescriptor['subtle'] & {
    name: 'RSA-OAEP' | 'ECDH' | HPKEKem | 'AES-KW' | 'AES-GCM' | 'PBKDF2'
  }
  /** Present when the algorithm performs key management and content encryption as one operation. */
  hpke?: HPKESuite
}

type AlgEntry = Omit<JWEAlgorithm, 'alg'>
type EncEntry = Omit<JWEEncryption, 'alg'>

const wrap: [KeyUsage[], KeyUsage[]] = [
  ['encrypt', 'wrapKey'],
  ['decrypt', 'unwrapKey'],
]
/** An ECDH public key carries no usages; the private half derives. deriveKey is not used. */
const derive: [KeyUsage[], KeyUsage[]] = [[], ['deriveBits']]
const encapsulate: [KeyUsage[], KeyUsage[]] = [
  ['encapsulateBits' as KeyUsage],
  ['decapsulateBits' as KeyUsage],
]
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

function hpkeKem(name: HPKEKem, suite: HPKESuite): AlgEntry {
  return {
    kty: ['AKP'],
    subtle: { name },
    jwkAlg: name,
    usages: encapsulate,
    ops: ['encapsulateBits', 'decapsulateBits'],
    hpke: suite,
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
  'HPKE-8': hpkeKem('MLKEM768-P256', [0x0050, 0x0011, 0x0002, 1153]),
  'HPKE-9': hpkeKem('MLKEM768-X25519', [0x647a, 0x0011, 0x0002, 1120]),
  'HPKE-10': hpkeKem('MLKEM1024-P384', [0x0051, 0x0011, 0x0002, 1665]),
  'HPKE-12': hpkeKem('ML-KEM-768', [0x0041, 0x0011, 0x0002, 1088]),
  'HPKE-13': hpkeKem('ML-KEM-1024', [0x0042, 0x0011, 0x0002, 1568]),
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

function unsupported(parameter: string, name: string): never {
  throw new JOSENotSupported(`Invalid or unsupported "${parameter}" (JWE ${name}) header value`)
}

export function jweAlgorithm(alg: unknown): JWEAlgorithm {
  return (typeof alg === 'string' ? JWE[alg] : undefined) ?? unsupported('alg', 'Algorithm')
}

export function jweEncryption(enc: unknown): JWEEncryption {
  return (
    (typeof enc === 'string' ? ENC[enc] : undefined) ?? unsupported('enc', 'Encryption Algorithm')
  )
}
