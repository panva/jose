import type * as types from '../types.d.ts'
import type {
  JWEAlgorithmSelection,
  JWECompressionAlgorithmName,
  JWECompressionCapability as PublicJWECompressionCapability,
  JWEContentEncryptionAlgorithmName,
  JWEContentEncryptionCapability as PublicJWEContentEncryptionCapability,
  JWEKeyManagementAlgorithmName,
  JWEKeyManagementCapability as PublicJWEKeyManagementCapability,
} from '../algorithms/types.js'
import { loadFactory } from './algorithm_capability.js'
import type { KeyDescriptor } from './key_descriptor.js'
import { JOSENotSupported } from '../util/errors.js'

interface JWEKeyManagementCapabilityBase<
  Algorithm extends JWEKeyManagementAlgorithmName = JWEKeyManagementAlgorithmName,
> extends PublicJWEKeyManagementCapability<Algorithm> {}

export type JWECEKTransportResult = [
  encryptedKey: Uint8Array,
  parameters: types.JWEHeaderParameters | undefined,
]

export type JWECEKTransportMode =
  'key-wrapping' | 'key-encryption' | 'key-agreement-with-key-wrapping'

/** Key Wrapping, Key Encryption, and Key Agreement with Key Wrapping transport a common CEK. */
export interface JWECEKTransportCapability<
  Algorithm extends JWEKeyManagementAlgorithmName = JWEKeyManagementAlgorithmName,
> extends JWEKeyManagementCapabilityBase<Algorithm> {
  readonly mode: JWECEKTransportMode
  readonly key: Readonly<KeyDescriptor>
  readonly encrypt: (
    enc: JWEContentEncryptionCapability,
    key: types.CryptoKey | Uint8Array,
    cek: Uint8Array,
    joseHeader: types.JWEHeaderParameters,
    providedParameters?: types.JWEKeyManagementHeaderParameters,
  ) => Promise<JWECEKTransportResult>
  readonly decrypt: (
    enc: JWEContentEncryptionCapability,
    key: types.CryptoKey | Uint8Array,
    encryptedKey: Uint8Array | undefined,
    joseHeader: types.JWEHeaderParameters,
    maxPBES2Count?: number,
  ) => Promise<types.CryptoKey | Uint8Array>
}

export type JWEDirectKeyAgreementResult = [
  cek: types.CryptoKey | Uint8Array,
  parameters: types.JWEHeaderParameters | undefined,
]

export interface JWEDirectKeyAgreementCapability<
  Algorithm extends JWEKeyManagementAlgorithmName = JWEKeyManagementAlgorithmName,
> extends JWEKeyManagementCapabilityBase<Algorithm> {
  readonly mode: 'direct-key-agreement'
  readonly key: Readonly<KeyDescriptor>
  readonly encrypt: (
    enc: JWEContentEncryptionCapability,
    key: types.CryptoKey | Uint8Array,
    joseHeader: types.JWEHeaderParameters,
    providedParameters?: types.JWEKeyManagementHeaderParameters,
  ) => Promise<JWEDirectKeyAgreementResult>
  readonly decrypt: (
    enc: JWEContentEncryptionCapability,
    key: types.CryptoKey | Uint8Array,
    joseHeader: types.JWEHeaderParameters,
  ) => Promise<types.CryptoKey | Uint8Array>
}

export interface JWEDirectEncryptionCapability<
  Algorithm extends JWEKeyManagementAlgorithmName = JWEKeyManagementAlgorithmName,
> extends JWEKeyManagementCapabilityBase<Algorithm> {
  readonly mode: 'direct-encryption'
}

export type JWEKeyManagementCapability<
  Algorithm extends JWEKeyManagementAlgorithmName = JWEKeyManagementAlgorithmName,
> =
  | JWECEKTransportCapability<Algorithm>
  | JWEDirectKeyAgreementCapability<Algorithm>
  | JWEDirectEncryptionCapability<Algorithm>

export interface JWEIntegratedEncryptionCapability<Algorithm extends string = string> {
  readonly category: 'jwe-key-management'
  readonly algorithm: Algorithm
  readonly mode: 'integrated-encryption'
  readonly key: Readonly<KeyDescriptor>
  readonly encrypt: (
    key: types.CryptoKey | Uint8Array,
    plaintext: Uint8Array,
    aad: Uint8Array,
    protectedHeader: types.JWEHeaderParameters | undefined,
    joseHeader: types.JWEHeaderParameters,
    providedParameters?: types.JWEKeyManagementHeaderParameters,
  ) => Promise<[encryptedKey: Uint8Array | undefined, ciphertext: Uint8Array]>
  readonly decrypt: (
    key: types.CryptoKey | Uint8Array,
    encryptedKey: Uint8Array | undefined,
    ciphertext: Uint8Array,
    aad: Uint8Array,
    protectedHeader: types.JWEHeaderParameters | undefined,
    joseHeader: types.JWEHeaderParameters,
  ) => Promise<Uint8Array>
}

export function integratedEncryption(
  key: Readonly<KeyDescriptor>,
  encrypt: JWEIntegratedEncryptionCapability['encrypt'],
  decrypt: JWEIntegratedEncryptionCapability['decrypt'],
): Omit<JWEIntegratedEncryptionCapability, 'category' | 'algorithm'> {
  return {
    mode: 'integrated-encryption',
    key,
    encrypt,
    decrypt,
  }
}

export type JWEKeyManagementOperation =
  JWEKeyManagementCapability | JWEIntegratedEncryptionCapability

export interface JWEContentEncryptionCapability<
  Algorithm extends JWEContentEncryptionAlgorithmName = JWEContentEncryptionAlgorithmName,
> extends PublicJWEContentEncryptionCapability<Algorithm> {
  readonly key: Readonly<KeyDescriptor>
  readonly cekBits: number
  readonly ivBits: number
  readonly tagBits?: number
  readonly encrypt: (
    plaintext: Uint8Array,
    cek: types.CryptoKey | Uint8Array,
    iv: Uint8Array,
    aad: Uint8Array,
  ) => Promise<{ ciphertext: Uint8Array; tag: Uint8Array; iv: Uint8Array }>
  readonly decrypt: (
    cek: types.CryptoKey | Uint8Array,
    ciphertext: Uint8Array,
    iv: Uint8Array,
    tag: Uint8Array,
    aad: Uint8Array,
  ) => Promise<Uint8Array>
}

export interface JWECompressionCapability<
  Algorithm extends JWECompressionAlgorithmName = JWECompressionAlgorithmName,
> extends PublicJWECompressionCapability<Algorithm> {
  readonly compress: (input: Uint8Array) => Promise<Uint8Array>
  readonly decompress: (input: Uint8Array, maxLength: number) => Promise<Uint8Array>
}

export type JWEAlgorithmCapability =
  JWEKeyManagementOperation | JWEContentEncryptionCapability | JWECompressionCapability

export interface JWEAlgorithmSet {
  readonly alg: Readonly<Record<string, Readonly<JWEKeyManagementOperation>>>
  readonly enc: Readonly<Record<string, Readonly<JWEContentEncryptionCapability>>>
  readonly zip: Readonly<Record<string, Readonly<JWECompressionCapability>>>
}

export function loadJWEAlgorithms(factories: JWEAlgorithmSelection): JWEAlgorithmSet {
  if (factories.length === 0) {
    throw new TypeError('At least one algorithm factory must be provided')
  }

  const alg = Object.create(null) as Record<string, Readonly<JWEKeyManagementOperation>>
  const enc = Object.create(null) as Record<string, Readonly<JWEContentEncryptionCapability>>
  const zip = Object.create(null) as Record<string, Readonly<JWECompressionCapability>>
  const identifiers = Object.create(null) as Record<string, true>

  for (const factory of factories) {
    const [capability, category, algorithm, brand] = loadFactory(factory)

    if (category === 'jws' && brand === 0) {
      throw new TypeError('JWS algorithm factories cannot be composed into a JWE operation')
    }
    if (category === 'key' && (brand === 9 || brand === 11 || brand === 13)) {
      throw new TypeError('Key algorithm factories cannot be composed into a JWE operation')
    }
    if (Object.hasOwn(identifiers, algorithm)) {
      throw new TypeError(`Duplicate "${algorithm}" algorithm capability`)
    }
    identifiers[algorithm] = true

    if (category === 'jwe-key-management' && brand === 1) {
      alg[algorithm] = capability as Readonly<JWEKeyManagementOperation>
    } else if (category === 'jwe-content-encryption' && brand === 2) {
      enc[algorithm] = capability as Readonly<JWEContentEncryptionCapability>
    } else if (category === 'jwe-compression' && brand === 3) {
      zip[algorithm] = capability as Readonly<JWECompressionCapability>
    } else {
      throw new TypeError(`Invalid "${algorithm}" algorithm capability`)
    }
  }

  if (Object.keys(alg).length === 0) {
    throw new TypeError('At least one JWE key management algorithm factory must be provided')
  }
  if (
    Object.values(alg).some((capability) => capability.mode !== 'integrated-encryption') &&
    !Object.keys(enc).length
  ) {
    throw new TypeError('At least one JWE content encryption algorithm factory must be provided')
  }

  return Object.freeze({
    alg: Object.freeze(alg),
    enc: Object.freeze(enc),
    zip: Object.freeze(zip),
  })
}

export function resolveJWEKeyManagement(
  algorithms: JWEAlgorithmSet,
  alg: unknown,
): Readonly<JWEKeyManagementOperation> {
  const capability = typeof alg === 'string' ? algorithms.alg[alg] : undefined
  if (!capability) {
    throw new JOSENotSupported('Invalid or unsupported "alg" (JWE Algorithm) header value')
  }
  return capability
}

export function resolveJWEContentEncryption(
  algorithms: JWEAlgorithmSet,
  enc: unknown,
): Readonly<JWEContentEncryptionCapability> {
  const capability = typeof enc === 'string' ? algorithms.enc[enc] : undefined
  if (!capability) {
    throw new JOSENotSupported(
      'Invalid or unsupported "enc" (JWE Encryption Algorithm) header value',
    )
  }
  return capability
}

export function resolveJWECompression(
  algorithms: JWEAlgorithmSet,
  zip: unknown,
): Readonly<JWECompressionCapability> {
  const capability = typeof zip === 'string' ? algorithms.zip[zip] : undefined
  if (!capability) {
    throw new JOSENotSupported(
      'Unsupported JWE "zip" (Compression Algorithm) Header Parameter value.',
    )
  }
  return capability
}

export function checkProducedEncryptedKey(
  encryptedKey: Uint8Array | undefined,
): asserts encryptedKey is Uint8Array {
  if (!(encryptedKey instanceof Uint8Array) || !encryptedKey.byteLength) {
    throw new TypeError('JWE key management algorithm did not produce an Encrypted Key')
  }
}

export function isJWECEKTransport(
  capability: Readonly<JWEKeyManagementOperation>,
): capability is Readonly<JWECEKTransportCapability> {
  return (
    capability.mode === 'key-wrapping' ||
    capability.mode === 'key-encryption' ||
    capability.mode === 'key-agreement-with-key-wrapping'
  )
}

export function invalidJWEKeyManagementMode(_capability: never): never {
  throw new TypeError('Invalid JWE key management mode')
}
