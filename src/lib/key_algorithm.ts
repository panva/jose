import { JOSENotSupported } from '../util/errors.js'
import type {
  AlgorithmFactory,
  KeyAlgorithmCapability as PublicKeyAlgorithmCapability,
  KeyAlgorithmName,
} from '../algorithms/types.js'
import { freezeKey, readBrand } from './algorithm_capability.js'
import type { KeyDescriptor } from './key_descriptor.js'

/** The PEM and key generation APIs take "alg" as an argument rather than reading it from a JWK. */
export const algArgument = '"alg" (Algorithm)'

export function unsupportedAlg(source = 'JWK "alg" (Algorithm) Parameter'): never {
  throw new JOSENotSupported(`Invalid or unsupported ${source} value`)
}

export type KeyRecipe<Algorithm extends string = string> = Readonly<
  KeyDescriptor & { readonly alg: Algorithm }
>

export type SigningKeyRecipe<Algorithm extends string = string> = KeyRecipe<Algorithm> & {
  readonly signing: Readonly<{ name: string; hash?: string; saltLength?: number }>
}

export interface KeyAlgorithmCapability<
  Algorithm extends KeyAlgorithmName = KeyAlgorithmName,
> extends PublicKeyAlgorithmCapability<Algorithm> {
  readonly key: KeyRecipe<Algorithm>
}

export type KeyAlgorithmCapabilityMap = Readonly<Record<string, Readonly<KeyAlgorithmCapability>>>

export function loadKeyAlgorithms(
  factories: readonly AlgorithmFactory[],
  operation: 1 | 2 | 4,
): KeyAlgorithmCapabilityMap {
  if (!factories.length) throw new TypeError()

  const capabilities = Object.create(null) as Record<string, Readonly<KeyAlgorithmCapability>>
  for (const factory of factories) {
    let algorithm: string
    let capability: Readonly<KeyAlgorithmCapability>
    let brand: unknown
    try {
      capability = factory() as Readonly<KeyAlgorithmCapability>
      if (typeof capability !== 'object') throw new TypeError()
      const category = capability.category
      algorithm = capability.algorithm
      brand = readBrand(capability)
      if (
        typeof algorithm !== 'string' ||
        !algorithm ||
        category !== 'key' ||
        (brand !== 9 && brand !== 11 && brand !== 13) ||
        capability.key?.alg !== algorithm
      ) {
        throw new TypeError()
      }
    } catch (cause) {
      throw new TypeError('Invalid algorithm factory', { cause })
    }
    if (!(brand & operation)) throw new TypeError()
    if (Object.hasOwn(capabilities, algorithm)) {
      throw new TypeError(`Duplicate "${algorithm}" algorithm capability`)
    }
    capabilities[algorithm] = capability
  }
  return Object.freeze(capabilities)
}

export function resolveKeyAlgorithm(
  capabilities: KeyAlgorithmCapabilityMap,
  alg: unknown,
  source = 'JWK "alg" (Algorithm) Parameter',
): KeyDescriptor {
  const capability = typeof alg === 'string' ? capabilities[alg] : undefined
  return capability?.key ?? unsupportedAlg(source)
}

const signatureUsages: KeyDescriptor['usages'] = [['verify'], ['sign']]
const wrappingUsages: KeyDescriptor['usages'] = [
  ['encrypt', 'wrapKey'],
  ['decrypt', 'unwrapKey'],
]
const deriveUsages: KeyDescriptor['usages'] = [[], ['deriveBits']]
const noUsages: KeyDescriptor['usages'] = [[], []]
const contentOps: KeyDescriptor['ops'] = ['encrypt', 'decrypt']
const wrappingOps: KeyDescriptor['ops'] = ['wrapKey', 'unwrapKey']

function hmac<Algorithm extends string>(alg: Algorithm): SigningKeyRecipe<Algorithm> {
  const subtle = { name: 'HMAC', hash: `SHA-${alg.slice(-3)}` }
  return freezeKey({
    alg,
    kty: ['oct'],
    secret: true,
    subtle,
    signing: subtle,
    usages: signatureUsages,
  })
}

function rsa<Algorithm extends string>(
  alg: Algorithm,
  name: 'RSA-PSS' | 'RSASSA-PKCS1-v1_5',
  saltLength?: number,
): SigningKeyRecipe<Algorithm> {
  const subtle = { name, hash: `SHA-${alg.slice(-3)}` }
  return freezeKey({
    alg,
    kty: ['RSA'],
    subtle,
    signing: saltLength ? { ...subtle, saltLength } : subtle,
    usages: signatureUsages,
    minRsaBits: 2048,
  })
}

function ecdsa<Algorithm extends string>(alg: Algorithm, crv: string): SigningKeyRecipe<Algorithm> {
  return freezeKey({
    alg,
    kty: ['EC'],
    crv,
    subtle: { name: 'ECDSA', namedCurve: crv },
    signing: { name: 'ECDSA', hash: `SHA-${alg.slice(-3)}` },
    usages: signatureUsages,
  })
}

function eddsa<Algorithm extends string>(alg: Algorithm): SigningKeyRecipe<Algorithm> {
  const subtle = { name: 'Ed25519' }
  return freezeKey({
    alg,
    kty: ['OKP'],
    crv: 'Ed25519',
    subtle,
    signing: subtle,
    usages: signatureUsages,
  })
}

function mldsa<Algorithm extends string>(alg: Algorithm): SigningKeyRecipe<Algorithm> {
  const subtle = { name: alg }
  return freezeKey({ alg, kty: ['AKP'], subtle, signing: subtle, usages: signatureUsages })
}

export const HS256Key: SigningKeyRecipe<'HS256'> = /* @__PURE__ */ hmac('HS256')
export const HS384Key: SigningKeyRecipe<'HS384'> = /* @__PURE__ */ hmac('HS384')
export const HS512Key: SigningKeyRecipe<'HS512'> = /* @__PURE__ */ hmac('HS512')
export const RS256Key: SigningKeyRecipe<'RS256'> = /* @__PURE__ */ rsa('RS256', 'RSASSA-PKCS1-v1_5')
export const RS384Key: SigningKeyRecipe<'RS384'> = /* @__PURE__ */ rsa('RS384', 'RSASSA-PKCS1-v1_5')
export const RS512Key: SigningKeyRecipe<'RS512'> = /* @__PURE__ */ rsa('RS512', 'RSASSA-PKCS1-v1_5')
export const PS256Key: SigningKeyRecipe<'PS256'> = /* @__PURE__ */ rsa('PS256', 'RSA-PSS', 32)
export const PS384Key: SigningKeyRecipe<'PS384'> = /* @__PURE__ */ rsa('PS384', 'RSA-PSS', 48)
export const PS512Key: SigningKeyRecipe<'PS512'> = /* @__PURE__ */ rsa('PS512', 'RSA-PSS', 64)
export const ES256Key: SigningKeyRecipe<'ES256'> = /* @__PURE__ */ ecdsa('ES256', 'P-256')
export const ES384Key: SigningKeyRecipe<'ES384'> = /* @__PURE__ */ ecdsa('ES384', 'P-384')
export const ES512Key: SigningKeyRecipe<'ES512'> = /* @__PURE__ */ ecdsa('ES512', 'P-521')
export const EdDSAKey: SigningKeyRecipe<'EdDSA'> = /* @__PURE__ */ eddsa('EdDSA')
export const Ed25519Key: SigningKeyRecipe<'Ed25519'> = /* @__PURE__ */ eddsa('Ed25519')
export const ML_DSA_44Key: SigningKeyRecipe<'ML-DSA-44'> = /* @__PURE__ */ mldsa('ML-DSA-44')
export const ML_DSA_65Key: SigningKeyRecipe<'ML-DSA-65'> = /* @__PURE__ */ mldsa('ML-DSA-65')
export const ML_DSA_87Key: SigningKeyRecipe<'ML-DSA-87'> = /* @__PURE__ */ mldsa('ML-DSA-87')

function resolveEcdh({
  kty,
  crv,
  asymmetricKeyType,
}: {
  kty?: string
  crv?: string
  asymmetricKeyType?: string
}): { name: string; namedCurve?: string } {
  if (crv === 'X25519' || asymmetricKeyType === 'x25519') return { name: 'X25519' }
  if (kty === 'OKP') {
    throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')
  }
  return { name: 'ECDH', namedCurve: crv! }
}

function ecdh<Algorithm extends string>(alg: Algorithm): KeyRecipe<Algorithm> {
  return freezeKey({
    alg,
    kty: ['EC', 'OKP'],
    subtle: { name: 'ECDH' },
    resolve: resolveEcdh,
    usages: deriveUsages,
    ops: [undefined, 'deriveBits'],
  })
}

function rsaOaep<Algorithm extends string>(alg: Algorithm): KeyRecipe<Algorithm> {
  return freezeKey({
    alg,
    kty: ['RSA'],
    subtle: { name: 'RSA-OAEP', hash: `SHA-${alg.slice(9) || 1}` },
    usages: wrappingUsages,
    ops: wrappingOps,
  })
}

function symmetric<Algorithm extends string>(
  alg: Algorithm,
  name: string,
  ops: KeyDescriptor['ops'],
  length?: number,
): KeyRecipe<Algorithm> {
  return freezeKey({
    alg,
    kty: ['oct'],
    secret: true,
    subtle: length === undefined ? { name } : { name, length },
    usages: noUsages,
    ops,
  })
}

function pbes2<Algorithm extends string>(alg: Algorithm): KeyRecipe<Algorithm> {
  return symmetric(alg, 'PBKDF2', ['deriveBits', 'deriveBits'])
}

export const ECDH_ESKey: KeyRecipe<'ECDH-ES'> = /* @__PURE__ */ ecdh('ECDH-ES')
export const ECDH_ES_A128KWKey: KeyRecipe<'ECDH-ES+A128KW'> = /* @__PURE__ */ ecdh('ECDH-ES+A128KW')
export const ECDH_ES_A192KWKey: KeyRecipe<'ECDH-ES+A192KW'> = /* @__PURE__ */ ecdh('ECDH-ES+A192KW')
export const ECDH_ES_A256KWKey: KeyRecipe<'ECDH-ES+A256KW'> = /* @__PURE__ */ ecdh('ECDH-ES+A256KW')
export const RSA_OAEPKey: KeyRecipe<'RSA-OAEP'> = /* @__PURE__ */ rsaOaep('RSA-OAEP')
export const RSA_OAEP_256Key: KeyRecipe<'RSA-OAEP-256'> = /* @__PURE__ */ rsaOaep('RSA-OAEP-256')
export const RSA_OAEP_384Key: KeyRecipe<'RSA-OAEP-384'> = /* @__PURE__ */ rsaOaep('RSA-OAEP-384')
export const RSA_OAEP_512Key: KeyRecipe<'RSA-OAEP-512'> = /* @__PURE__ */ rsaOaep('RSA-OAEP-512')
export const dirKey: KeyRecipe<'dir'> = /* @__PURE__ */ symmetric('dir', 'AES-GCM', contentOps)
export const A128KWKey: KeyRecipe<'A128KW'> = /* @__PURE__ */ symmetric(
  'A128KW',
  'AES-KW',
  wrappingOps,
  128,
)
export const A192KWKey: KeyRecipe<'A192KW'> = /* @__PURE__ */ symmetric(
  'A192KW',
  'AES-KW',
  wrappingOps,
  192,
)
export const A256KWKey: KeyRecipe<'A256KW'> = /* @__PURE__ */ symmetric(
  'A256KW',
  'AES-KW',
  wrappingOps,
  256,
)
export const A128GCMKWKey: KeyRecipe<'A128GCMKW'> = /* @__PURE__ */ symmetric(
  'A128GCMKW',
  'AES-GCM',
  contentOps,
  128,
)
export const A192GCMKWKey: KeyRecipe<'A192GCMKW'> = /* @__PURE__ */ symmetric(
  'A192GCMKW',
  'AES-GCM',
  contentOps,
  192,
)
export const A256GCMKWKey: KeyRecipe<'A256GCMKW'> = /* @__PURE__ */ symmetric(
  'A256GCMKW',
  'AES-GCM',
  contentOps,
  256,
)

export const PBES2_HS256_A128KWKey: KeyRecipe<'PBES2-HS256+A128KW'> =
  /* @__PURE__ */ pbes2('PBES2-HS256+A128KW')
export const PBES2_HS384_A192KWKey: KeyRecipe<'PBES2-HS384+A192KW'> =
  /* @__PURE__ */ pbes2('PBES2-HS384+A192KW')
export const PBES2_HS512_A256KWKey: KeyRecipe<'PBES2-HS512+A256KW'> =
  /* @__PURE__ */ pbes2('PBES2-HS512+A256KW')
export const A128GCMKey: KeyRecipe<'A128GCM'> = /* @__PURE__ */ symmetric(
  'A128GCM',
  'AES-GCM',
  contentOps,
  128,
)
export const A192GCMKey: KeyRecipe<'A192GCM'> = /* @__PURE__ */ symmetric(
  'A192GCM',
  'AES-GCM',
  contentOps,
  192,
)
export const A256GCMKey: KeyRecipe<'A256GCM'> = /* @__PURE__ */ symmetric(
  'A256GCM',
  'AES-GCM',
  contentOps,
  256,
)
export const A128CBC_HS256Key: KeyRecipe<'A128CBC-HS256'> = /* @__PURE__ */ symmetric(
  'A128CBC-HS256',
  'AES-CBC',
  contentOps,
  256,
)
export const A192CBC_HS384Key: KeyRecipe<'A192CBC-HS384'> = /* @__PURE__ */ symmetric(
  'A192CBC-HS384',
  'AES-CBC',
  contentOps,
  384,
)
export const A256CBC_HS512Key: KeyRecipe<'A256CBC-HS512'> = /* @__PURE__ */ symmetric(
  'A256CBC-HS512',
  'AES-CBC',
  contentOps,
  512,
)

function keyTable(entries: readonly KeyRecipe[]): Readonly<Record<string, KeyRecipe>> {
  const result = Object.create(null) as Record<string, KeyRecipe>
  for (const entry of entries) result[entry.alg] = entry
  return Object.freeze(result)
}

const algorithms: Readonly<Record<string, KeyRecipe>> = /* @__PURE__ */ keyTable([
  HS256Key,
  HS384Key,
  HS512Key,
  RS256Key,
  RS384Key,
  RS512Key,
  PS256Key,
  PS384Key,
  PS512Key,
  ES256Key,
  ES384Key,
  ES512Key,
  EdDSAKey,
  Ed25519Key,
  ML_DSA_44Key,
  ML_DSA_65Key,
  ML_DSA_87Key,
  dirKey,
  RSA_OAEPKey,
  RSA_OAEP_256Key,
  RSA_OAEP_384Key,
  RSA_OAEP_512Key,
  ECDH_ESKey,
  ECDH_ES_A128KWKey,
  ECDH_ES_A192KWKey,
  ECDH_ES_A256KWKey,
  A128KWKey,
  A192KWKey,
  A256KWKey,
  A128GCMKWKey,
  A192GCMKWKey,
  A256GCMKWKey,
  PBES2_HS256_A128KWKey,
  PBES2_HS384_A192KWKey,
  PBES2_HS512_A256KWKey,
  A128GCMKey,
  A192GCMKey,
  A256GCMKey,
  A128CBC_HS256Key,
  A192CBC_HS384Key,
  A256CBC_HS512Key,
])

/** Resolves an identifier used by key import and generation against all built-in key recipes. */
export function keyAlgorithm(alg: unknown, source?: string): KeyDescriptor {
  return (typeof alg === 'string' ? algorithms[alg] : undefined) ?? unsupportedAlg(source)
}
