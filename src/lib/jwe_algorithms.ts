import { JOSENotSupported } from '../util/errors.js'
import type * as types from '../types.d.ts'
import { table } from './key_descriptor.js'
import type { KeyDescriptor } from './key_descriptor.js'
import { hpke } from './hpke.js'

export type JWECEKTransportMode =
  'key-wrapping' | 'key-encryption' | 'key-agreement-with-key-wrapping'

export type JWEConventionalMode = JWECEKTransportMode | 'direct-encryption' | 'direct-key-agreement'

/** The five RFC 7516 key-management modes plus Integrated Encryption. */
export type JWEKeyManagementMode = JWEConventionalMode | 'integrated-encryption'

/** Everything the implementation needs to know about one conventional JWE "alg". */
export interface JWEConventionalAlgorithm extends KeyDescriptor {
  mode: JWEConventionalMode
  subtle: KeyDescriptor['subtle'] & {
    name: 'RSA-OAEP' | 'ECDH' | 'AES-KW' | 'AES-GCM' | 'PBKDF2'
  }
}

/** A JWE algorithm that directly encrypts plaintext without a separate content-encryption step. */
export interface JWEIntegratedEncryptionAlgorithm extends KeyDescriptor {
  mode: 'integrated-encryption'
  encrypt: (
    key: types.CryptoKey | Uint8Array,
    plaintext: Uint8Array,
    aad: Uint8Array,
    protectedHeader: types.JWEHeaderParameters | undefined,
    joseHeader: types.JWEHeaderParameters,
    providedParameters?: types.JWEKeyManagementHeaderParameters,
  ) => Promise<[encryptedKey: Uint8Array | undefined, ciphertext: Uint8Array]>
  /**
   * Integrated algorithms own authentication and MUST normalize authentication and key-decryption
   * failures to `JWEDecryptionFailed`.
   */
  decrypt: (
    key: types.CryptoKey | Uint8Array,
    encryptedKey: Uint8Array | undefined,
    ciphertext: Uint8Array,
    aad: Uint8Array,
    protectedHeader: types.JWEHeaderParameters | undefined,
    joseHeader: types.JWEHeaderParameters,
  ) => Promise<Uint8Array>
}

export type JWEAlgorithm = JWEConventionalAlgorithm | JWEIntegratedEncryptionAlgorithm
export type JWECEKTransportAlgorithm = JWEConventionalAlgorithm & {
  mode: JWECEKTransportMode
}

type AlgEntry = Omit<JWEConventionalAlgorithm, 'alg'>
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
    mode: 'key-encryption',
    subtle: { name: 'RSA-OAEP', hash: `SHA-${bits}` },
    usages: wrap,
    ops: ['wrapKey', 'unwrapKey'],
  }
}

function ecdh(mode: 'direct-key-agreement' | 'key-agreement-with-key-wrapping'): AlgEntry {
  return {
    kty: ['EC', 'OKP'],
    mode,
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
    mode: 'key-wrapping',
    secret: true,
    subtle: { name: gcm ? 'AES-GCM' : 'AES-KW', length: bits },
    usages: none,
    ops: gcm ? ['encrypt', 'decrypt'] : ['wrapKey', 'unwrapKey'],
  }
}

function pbes2(): AlgEntry {
  return {
    kty: ['oct'],
    mode: 'key-wrapping',
    secret: true,
    subtle: { name: 'PBKDF2' },
    usages: none,
    ops: ['deriveBits', 'deriveBits'],
  }
}

export const JWE: Record<string, JWEAlgorithm> = table<JWEConventionalAlgorithm>({
  dir: {
    kty: ['oct'],
    mode: 'direct-encryption',
    secret: true,
    subtle: { name: 'AES-GCM' },
    usages: none,
    ops: ['encrypt', 'decrypt'],
  },
  'RSA-OAEP': rsaes(1),
  'RSA-OAEP-256': rsaes(256),
  'RSA-OAEP-384': rsaes(384),
  'RSA-OAEP-512': rsaes(512),
  'ECDH-ES': ecdh('direct-key-agreement'),
  'ECDH-ES+A128KW': ecdh('key-agreement-with-key-wrapping'),
  'ECDH-ES+A192KW': ecdh('key-agreement-with-key-wrapping'),
  'ECDH-ES+A256KW': ecdh('key-agreement-with-key-wrapping'),
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

JWE['HPKE-9'] = hpke('HPKE-9', 'MLKEM768-X25519', [0x647a, 0x0011, 0x0002, 1120])
JWE['HPKE-12'] = hpke('HPKE-12', 'ML-KEM-768', [0x0041, 0x0011, 0x0002, 1088])
JWE['HPKE-13'] = hpke('HPKE-13', 'ML-KEM-1024', [0x0042, 0x0011, 0x0002, 1568])

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

export function isJWECEKTransport(algorithm: JWEAlgorithm): algorithm is JWECEKTransportAlgorithm {
  return (
    algorithm.mode === 'key-wrapping' ||
    algorithm.mode === 'key-encryption' ||
    algorithm.mode === 'key-agreement-with-key-wrapping'
  )
}

export function invalidJWEKeyManagementMode(_mode: never): never {
  throw new TypeError('Invalid JWE key management mode')
}

export function jweEncryption(enc: unknown): JWEEncryption {
  return (
    (typeof enc === 'string' ? ENC[enc] : undefined) ?? unsupported('enc', 'Encryption Algorithm')
  )
}
