import type * as types from '../types.d.ts'
import { decode as b64uDecode, encode as b64u } from '../util/base64url.js'
import { concat, encode } from './buffer_utils.js'
import { digest } from './helpers.js'

export type CompositeSignatureAlgorithm =
  | 'ML-DSA-44-ES256'
  | 'ML-DSA-65-ES256'
  | 'ML-DSA-87-ES384'
  | 'ML-DSA-44-Ed25519'
  | 'ML-DSA-65-Ed25519'

interface Profile {
  alg: CompositeSignatureAlgorithm
  mldsa: 'ML-DSA-44' | 'ML-DSA-65' | 'ML-DSA-87'
  traditional: 'ES256' | 'ES384' | 'Ed25519'
  preHash: 'sha256' | 'sha512'
  label: Uint8Array
  mldsaPublicKeyLength: number
  mldsaSignatureLength: number
  traditionalPublicKeyLength: number
  traditionalPrivateKeyLength: number
  traditionalSignatureLength: number
}

interface ComponentKeys {
  mldsa: types.CryptoKey
  traditional: types.CryptoKey
}

export interface CompositeKey extends types.CompositeKey {
  [compositeKey]: true
}

interface CompositeKeyState {
  jwk: types.JWK
  components: ComponentKeys
}

const compositeKey = Symbol('CompositeKey')
const state = new WeakMap<CompositeKey, CompositeKeyState>()

const prefix = encode('CompositeAlgorithmSignatures2025')

const profiles: Record<CompositeSignatureAlgorithm, Profile> = {
  'ML-DSA-44-ES256': {
    alg: 'ML-DSA-44-ES256',
    mldsa: 'ML-DSA-44',
    traditional: 'ES256',
    preHash: 'sha256',
    label: encode('COMPSIG-MLDSA44-ECDSA-P256-SHA256'),
    mldsaPublicKeyLength: 1312,
    mldsaSignatureLength: 2420,
    traditionalPublicKeyLength: 64,
    traditionalPrivateKeyLength: 32,
    traditionalSignatureLength: 64,
  },
  'ML-DSA-65-ES256': {
    alg: 'ML-DSA-65-ES256',
    mldsa: 'ML-DSA-65',
    traditional: 'ES256',
    preHash: 'sha512',
    label: encode('COMPSIG-MLDSA65-ECDSA-P256-SHA512'),
    mldsaPublicKeyLength: 1952,
    mldsaSignatureLength: 3309,
    traditionalPublicKeyLength: 64,
    traditionalPrivateKeyLength: 32,
    traditionalSignatureLength: 64,
  },
  'ML-DSA-87-ES384': {
    alg: 'ML-DSA-87-ES384',
    mldsa: 'ML-DSA-87',
    traditional: 'ES384',
    preHash: 'sha512',
    label: encode('COMPSIG-MLDSA87-ECDSA-P384-SHA512'),
    mldsaPublicKeyLength: 2592,
    mldsaSignatureLength: 4627,
    traditionalPublicKeyLength: 96,
    traditionalPrivateKeyLength: 48,
    traditionalSignatureLength: 96,
  },
  'ML-DSA-44-Ed25519': {
    alg: 'ML-DSA-44-Ed25519',
    mldsa: 'ML-DSA-44',
    traditional: 'Ed25519',
    preHash: 'sha512',
    label: encode('COMPSIG-MLDSA44-Ed25519-SHA512'),
    mldsaPublicKeyLength: 1312,
    mldsaSignatureLength: 2420,
    traditionalPublicKeyLength: 32,
    traditionalPrivateKeyLength: 32,
    traditionalSignatureLength: 64,
  },
  'ML-DSA-65-Ed25519': {
    alg: 'ML-DSA-65-Ed25519',
    mldsa: 'ML-DSA-65',
    traditional: 'Ed25519',
    preHash: 'sha512',
    label: encode('COMPSIG-MLDSA65-Ed25519-SHA512'),
    mldsaPublicKeyLength: 1952,
    mldsaSignatureLength: 3309,
    traditionalPublicKeyLength: 32,
    traditionalPrivateKeyLength: 32,
    traditionalSignatureLength: 64,
  },
}

export function isCompositeSignatureAlgorithm(alg: unknown): alg is CompositeSignatureAlgorithm {
  return typeof alg === 'string' && alg in profiles
}

export function isCompositeKey(key: unknown): key is CompositeKey {
  return typeof key === 'object' && key !== null && compositeKey in key
}

function getState(key: CompositeKey): CompositeKeyState {
  const result = state.get(key)
  if (!result) {
    throw new TypeError('invalid CompositeKey')
  }
  return result
}

export function checkCompositeKey(key: CompositeKey, alg: string, usage: KeyUsage) {
  if (key.algorithm.name !== alg) {
    throw new TypeError(
      `CryptoKey does not support this operation, its algorithm.name must be ${alg}`,
    )
  }

  if (usage && !key.usages.includes(usage)) {
    throw new TypeError(
      `CryptoKey does not support this operation, its usages must include ${usage}.`,
    )
  }
}

function getProfile(alg: string): Profile {
  if (!isCompositeSignatureAlgorithm(alg)) {
    throw new Error('unreachable')
  }
  return profiles[alg]
}

function assertLength(bytes: Uint8Array, expected: number, label: string) {
  if (bytes.byteLength !== expected) {
    throw new TypeError(`${label} length mismatch`)
  }
}

function split(bytes: Uint8Array, offset: number): [Uint8Array, Uint8Array] {
  return [bytes.subarray(0, offset), bytes.subarray(offset)]
}

function rawEcToJwk(profile: Profile, publicKey: Uint8Array, privateKey?: Uint8Array): types.JWK {
  const coordinateLength = profile.traditionalPublicKeyLength >> 1
  const [x, y] = split(publicKey, coordinateLength)
  const jwk: types.JWK = {
    kty: 'EC',
    crv: profile.traditional === 'ES256' ? 'P-256' : 'P-384',
    x: b64u(x),
    y: b64u(y),
  }
  if (privateKey) {
    jwk.d = b64u(privateKey)
  }
  return jwk
}

function rawEd25519ToJwk(publicKey: Uint8Array, privateKey?: Uint8Array): types.JWK {
  const jwk: types.JWK = {
    kty: 'OKP',
    crv: 'Ed25519',
    x: b64u(publicKey),
  }
  if (privateKey) {
    jwk.d = b64u(privateKey)
  }
  return jwk
}

function rawTraditionalToJwk(
  profile: Profile,
  publicKey: Uint8Array,
  privateKey?: Uint8Array,
): types.JWK {
  if (profile.traditional === 'Ed25519') {
    return rawEd25519ToJwk(publicKey, privateKey)
  }
  return rawEcToJwk(profile, publicKey, privateKey)
}

function mldsaToJwk(profile: Profile, publicKey: Uint8Array, privateKey?: Uint8Array): types.JWK {
  const jwk: types.JWK = {
    kty: 'AKP',
    alg: profile.mldsa,
    pub: b64u(publicKey),
  }
  if (privateKey) {
    jwk.priv = b64u(privateKey)
  }
  return jwk
}

function traditionalKeyAlgorithm(profile: Profile): Algorithm | EcKeyAlgorithm {
  switch (profile.traditional) {
    case 'ES256':
      return { name: 'ECDSA', namedCurve: 'P-256' }
    case 'ES384':
      return { name: 'ECDSA', namedCurve: 'P-384' }
    case 'Ed25519':
      return { name: 'Ed25519' }
  }
}

function traditionalSignatureAlgorithm(profile: Profile): Algorithm | EcdsaParams {
  switch (profile.traditional) {
    case 'ES256':
      return { name: 'ECDSA', hash: 'SHA-256' }
    case 'ES384':
      return { name: 'ECDSA', hash: 'SHA-384' }
    case 'Ed25519':
      return { name: 'Ed25519' }
  }
}

async function importComponents(
  profile: Profile,
  jwk: types.JWK,
  publicKey: Uint8Array,
  extractable: boolean,
  usages: KeyUsage[],
): Promise<ComponentKeys> {
  const [mldsaPublicKey, traditionalPublicKey] = split(publicKey, profile.mldsaPublicKeyLength)
  let mldsaPrivateKey: Uint8Array | undefined
  let traditionalPrivateKey: Uint8Array | undefined

  if (jwk.priv) {
    const privateKey = b64uDecode(jwk.priv)
    assertLength(privateKey, 32 + profile.traditionalPrivateKeyLength, 'Composite private key')
    ;[mldsaPrivateKey, traditionalPrivateKey] = split(privateKey, 32)
  }

  return {
    mldsa: await crypto.subtle.importKey(
      'jwk',
      mldsaToJwk(profile, mldsaPublicKey, mldsaPrivateKey),
      { name: profile.mldsa },
      extractable,
      usages,
    ),
    traditional: await crypto.subtle.importKey(
      'jwk',
      rawTraditionalToJwk(profile, traditionalPublicKey, traditionalPrivateKey),
      traditionalKeyAlgorithm(profile),
      extractable,
      usages,
    ),
  }
}

export async function compositeJwkToKey(jwk: types.JWK): Promise<CompositeKey> {
  const alg = jwk.alg
  const profile = getProfile(alg!)
  const publicKey = b64uDecode(jwk.pub!)
  assertLength(
    publicKey,
    profile.mldsaPublicKeyLength + profile.traditionalPublicKeyLength,
    'Composite public key',
  )

  const type = jwk.priv ? 'private' : 'public'
  const usages: KeyUsage[] =
    (jwk.key_ops as KeyUsage[] | undefined) ?? (type === 'private' ? ['sign'] : ['verify'])
  const extractable = jwk.ext ?? type === 'public'
  const components = await importComponents(profile, jwk, publicKey, extractable, usages)

  const key = {} as CompositeKey
  Object.defineProperties(key, {
    [compositeKey]: { value: true },
    [Symbol.toStringTag]: { value: 'CompositeKey' },
    type: { value: type, enumerable: true },
    extractable: { value: extractable, enumerable: true },
    algorithm: { value: Object.freeze({ name: profile.alg }), enumerable: true },
    usages: { value: Object.freeze([...usages]), enumerable: true },
  })
  state.set(key, {
    jwk: { ...jwk, alg: profile.alg, kty: 'AKP', pub: b64u(publicKey) },
    components,
  })

  return key
}

export function compositeKeyToJWK(key: CompositeKey): types.JWK {
  if (!key.extractable) {
    throw new TypeError('non-extractable CryptoKey cannot be exported as a JWK')
  }

  const { ext, key_ops, use, ...jwk } = getState(key).jwk

  return jwk
}

async function representative(profile: Profile, data: Uint8Array) {
  const preHash = await digest(profile.preHash, data)
  // TODO: Resolve draft-02 mismatch between the JOSE base64url Encode(M') text and
  // Appendix A vectors, which sign these raw combiner bytes.
  return concat(prefix, profile.label, Uint8Array.of(0x00), preHash)
}

function mldsaAlgorithm(profile: Profile): Algorithm & { context: Uint8Array } {
  return { name: profile.mldsa, context: profile.label }
}

export async function compositeSign(
  alg: string,
  key: CompositeKey,
  data: Uint8Array,
): Promise<Uint8Array> {
  const profile = getProfile(alg)
  const toBeSigned = await representative(profile, data)
  const components = getState(key).components
  const [mldsaSignature, traditionalSignature] = await Promise.all([
    crypto.subtle.sign(
      mldsaAlgorithm(profile),
      components.mldsa,
      toBeSigned as Uint8Array<ArrayBuffer>,
    ),
    crypto.subtle.sign(
      traditionalSignatureAlgorithm(profile),
      components.traditional,
      toBeSigned as Uint8Array<ArrayBuffer>,
    ),
  ])

  return concat(new Uint8Array(mldsaSignature), new Uint8Array(traditionalSignature))
}

export async function compositeVerify(
  alg: string,
  key: CompositeKey,
  signature: Uint8Array,
  data: Uint8Array,
): Promise<boolean> {
  const profile = getProfile(alg)
  if (signature.byteLength !== profile.mldsaSignatureLength + profile.traditionalSignatureLength) {
    return false
  }

  const [mldsaSignature, traditionalSignature] = split(signature, profile.mldsaSignatureLength)
  const toBeSigned = await representative(profile, data)
  const components = getState(key).components

  try {
    const [mldsa, traditional] = await Promise.all([
      crypto.subtle.verify(
        mldsaAlgorithm(profile),
        components.mldsa,
        mldsaSignature as Uint8Array<ArrayBuffer>,
        toBeSigned as Uint8Array<ArrayBuffer>,
      ),
      crypto.subtle.verify(
        traditionalSignatureAlgorithm(profile),
        components.traditional,
        traditionalSignature as Uint8Array<ArrayBuffer>,
        toBeSigned as Uint8Array<ArrayBuffer>,
      ),
    ])

    return mldsa && traditional
  } catch {
    return false
  }
}

async function exportComponentJwk(key: types.CryptoKey): Promise<types.JWK> {
  return crypto.subtle.exportKey('jwk', key) as Promise<types.JWK>
}

function decodeRequired(value: string | undefined): Uint8Array {
  if (typeof value !== 'string' || !value) {
    throw new TypeError('generated key is missing required JWK parameters')
  }
  return b64uDecode(value)
}

export async function generateCompositeKeyPair(
  alg: string,
  extractable: boolean,
): Promise<{ privateKey: CompositeKey; publicKey: CompositeKey }> {
  const profile = getProfile(alg)
  const [mldsa, traditional] = (await Promise.all([
    crypto.subtle.generateKey({ name: profile.mldsa }, true, ['sign', 'verify']),
    crypto.subtle.generateKey(traditionalKeyAlgorithm(profile), true, ['sign', 'verify']),
  ])) as [CryptoKeyPair, CryptoKeyPair]

  const [mldsaPublicJwk, mldsaPrivateJwk, traditionalPublicJwk, traditionalPrivateJwk] =
    await Promise.all([
      exportComponentJwk(mldsa.publicKey),
      exportComponentJwk(mldsa.privateKey),
      exportComponentJwk(traditional.publicKey),
      exportComponentJwk(traditional.privateKey),
    ])

  const mldsaPublicKey = decodeRequired(mldsaPublicJwk.pub)
  const mldsaPrivateKey = decodeRequired(mldsaPrivateJwk.priv)

  let traditionalPublicKey: Uint8Array
  let traditionalPrivateKey: Uint8Array
  if (profile.traditional === 'Ed25519') {
    traditionalPublicKey = decodeRequired(traditionalPublicJwk.x)
    traditionalPrivateKey = decodeRequired(traditionalPrivateJwk.d)
  } else {
    traditionalPublicKey = concat(
      decodeRequired(traditionalPublicJwk.x),
      decodeRequired(traditionalPublicJwk.y),
    )
    traditionalPrivateKey = decodeRequired(traditionalPrivateJwk.d)
  }

  const publicJwk: types.JWK = {
    kty: 'AKP',
    alg: profile.alg,
    pub: b64u(concat(mldsaPublicKey, traditionalPublicKey)),
    ext: true,
    key_ops: ['verify'],
  }
  const privateJwk: types.JWK = {
    ...publicJwk,
    priv: b64u(concat(mldsaPrivateKey, traditionalPrivateKey)),
    ext: extractable,
    key_ops: ['sign'],
  }

  const [publicKey, privateKey] = await Promise.all([
    compositeJwkToKey(publicJwk),
    compositeJwkToKey(privateJwk),
  ])

  return { publicKey, privateKey }
}
