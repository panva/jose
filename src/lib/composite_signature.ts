import type * as types from '../types.d.ts'
import { decode as b64uDecode, encode as b64u } from '../util/base64url.js'
import { concat, encode } from './buffer_utils.js'
import { digest } from './helpers.js'
import type { CompositeParameters, JWSAlgorithm } from './jws_algorithms.js'
import type { KeyDescriptor } from './key_descriptor.js'

type Component = CompositeParameters[0]

type ComponentKeys = [mldsa: types.CryptoKey, traditional: types.CryptoKey]
type CompositeKeyState = [jwk: types.JWK, ...components: ComponentKeys]

const state = new WeakMap<types.CryptoKey, CompositeKeyState>()

const prefix = encode('CompositeAlgorithmSignatures2025')

function assertLength(bytes: Uint8Array, expected: number, label: string) {
  if (bytes.length !== expected) {
    throw new TypeError(`${label} length mismatch`)
  }
}

function split(bytes: Uint8Array, offset: number): [Uint8Array, Uint8Array] {
  return [bytes.subarray(0, offset), bytes.subarray(offset)]
}

function componentJwkParameters(
  component: Component,
): [readonly ('pub' | 'x' | 'y')[], 'priv' | 'd'] {
  const kty = component.kty[0]
  return [kty === 'EC' ? ['x', 'y'] : [kty === 'AKP' ? 'pub' : 'x'], kty === 'AKP' ? 'priv' : 'd']
}

function componentToJwk(
  component: Component,
  publicKey: Uint8Array,
  privateKey?: Uint8Array,
): types.JWK {
  const [publicJwkParameters, privateJwkParameter] = componentJwkParameters(component)
  const jwk: types.JWK = { kty: component.kty[0] }
  if (jwk.kty === 'AKP') {
    jwk.alg = component.alg
  } else {
    jwk.crv = component.crv
  }

  const partLength = publicKey.length / publicJwkParameters.length
  for (let index = 0; index < publicJwkParameters.length; index++) {
    const parameter = publicJwkParameters[index]
    jwk[parameter] = b64u(publicKey.subarray(index * partLength, (index + 1) * partLength))
  }
  if (privateKey) jwk[privateJwkParameter] = b64u(privateKey)
  return jwk
}

function importComponent(
  component: Component,
  publicKey: Uint8Array,
  privateKey: Uint8Array | undefined,
  extractable: boolean,
  usages: KeyUsage[],
) {
  return crypto.subtle.importKey(
    'jwk',
    componentToJwk(component, publicKey, privateKey),
    component.subtle,
    extractable,
    usages,
  )
}

async function importComponents(
  profile: CompositeParameters,
  jwk: types.JWK,
  publicKey: Uint8Array,
  extractable: boolean,
  usages: KeyUsage[],
): Promise<ComponentKeys> {
  const [mldsa, traditional] = profile
  const [mldsaPublicKey, traditionalPublicKey] = split(publicKey, mldsa.raw[0])
  let mldsaPrivateKey: Uint8Array | undefined
  let traditionalPrivateKey: Uint8Array | undefined

  if (jwk.priv) {
    const privateKey = b64uDecode(jwk.priv)
    assertLength(privateKey, mldsa.raw[1] + traditional.raw[1], 'Composite private key')
    ;[mldsaPrivateKey, traditionalPrivateKey] = split(privateKey, mldsa.raw[1])
  }

  return Promise.all([
    importComponent(mldsa, mldsaPublicKey, mldsaPrivateKey, extractable, usages),
    importComponent(traditional, traditionalPublicKey, traditionalPrivateKey, extractable, usages),
  ])
}

export async function compositeJwkToKey(
  entry: KeyDescriptor,
  jwk: types.JWK,
): Promise<types.CryptoKey> {
  const profile = (entry as JWSAlgorithm).composite!()
  const [mldsa, traditional] = profile
  const publicKey = b64uDecode(jwk.pub!)
  assertLength(publicKey, mldsa.raw[0] + traditional.raw[0], 'Composite public key')

  const type = jwk.priv ? 'private' : 'public'
  const usages: KeyUsage[] =
    (jwk.key_ops as KeyUsage[] | undefined) ?? (type === 'private' ? ['sign'] : ['verify'])
  const extractable = jwk.ext ?? type === 'public'
  const components = await importComponents(profile, jwk, publicKey, extractable, usages)

  const key = Object.freeze({
    [Symbol.toStringTag]: 'CryptoKey',
    type,
    extractable,
    algorithm: Object.freeze({ name: entry.alg }),
    usages: Object.freeze([...usages]),
  }) as unknown as types.CryptoKey
  const storedJwk: types.JWK = { kty: 'AKP', alg: entry.alg, pub: b64u(publicKey) }
  if (jwk.priv) storedJwk.priv = jwk.priv
  state.set(key, [storedJwk, ...components])

  return key
}

export function compositeKeyToJWK(key: unknown): types.JWK | undefined {
  if (typeof key !== 'object' || key === null) return undefined
  const cryptoKey = key as types.CryptoKey
  const result = state.get(cryptoKey)
  if (!result) return undefined

  if (!cryptoKey.extractable) {
    throw new TypeError('non-extractable CryptoKey cannot be exported as a JWK')
  }

  return { ...result[0] }
}

async function representative(profile: CompositeParameters, data: Uint8Array) {
  const preHash = await digest(`sha${profile[2]}`, data)
  // TODO: Resolve draft-02 mismatch between the JOSE base64url Encode(M') text and
  // Appendix A vectors, which sign these raw combiner bytes.
  return concat(prefix, profile[3], Uint8Array.of(0), preHash)
}

export async function compositeSign(
  entry: JWSAlgorithm,
  key: types.CryptoKey,
  data: Uint8Array,
): Promise<Uint8Array> {
  const profile = entry.composite!()
  const traditional = profile[1]
  const toBeSigned = await representative(profile, data)
  const [, mldsaKey, traditionalKey] = state.get(key)!
  const [mldsaSignature, traditionalSignature] = await Promise.all([
    crypto.subtle.sign(
      { ...profile[0].signing, context: profile[3] } as Algorithm & { context: Uint8Array },
      mldsaKey,
      toBeSigned as Uint8Array<ArrayBuffer>,
    ),
    crypto.subtle.sign(
      traditional.signing,
      traditionalKey,
      toBeSigned as Uint8Array<ArrayBuffer>,
    ),
  ])

  return concat(new Uint8Array(mldsaSignature), new Uint8Array(traditionalSignature))
}

export async function compositeVerify(
  entry: JWSAlgorithm,
  key: types.CryptoKey,
  signature: Uint8Array,
  data: Uint8Array,
): Promise<boolean> {
  const profile = entry.composite!()
  const [mldsa, traditional] = profile
  if (signature.length !== mldsa.raw[2] + traditional.raw[2]) {
    return false
  }

  const [mldsaSignature, traditionalSignature] = split(signature, mldsa.raw[2])
  const toBeSigned = await representative(profile, data)
  const [, mldsaKey, traditionalKey] = state.get(key)!

  try {
    const [mldsaVerified, traditionalVerified] = await Promise.all([
      crypto.subtle.verify(
        { ...profile[0].signing, context: profile[3] } as Algorithm & { context: Uint8Array },
        mldsaKey,
        mldsaSignature as Uint8Array<ArrayBuffer>,
        toBeSigned as Uint8Array<ArrayBuffer>,
      ),
      crypto.subtle.verify(
        traditional.signing,
        traditionalKey,
        traditionalSignature as Uint8Array<ArrayBuffer>,
        toBeSigned as Uint8Array<ArrayBuffer>,
      ),
    ])

    return mldsaVerified && traditionalVerified
  } catch {
    return false
  }
}

async function generateComponent(component: Component): Promise<[Uint8Array, Uint8Array]> {
  const { privateKey } = (await crypto.subtle.generateKey(component.subtle, true, [
    ...component.usages[1],
    ...component.usages[0],
  ])) as CryptoKeyPair
  const jwk = (await crypto.subtle.exportKey('jwk', privateKey)) as types.JWK
  const [publicJwkParameters, privateJwkParameter] = componentJwkParameters(component)

  return [
    concat(...publicJwkParameters.map((parameter) => b64uDecode(jwk[parameter]!))),
    b64uDecode(jwk[privateJwkParameter]!),
  ]
}

export async function generateCompositeKeyPair(
  entry: JWSAlgorithm,
  extractable: boolean,
): Promise<{ privateKey: types.CryptoKey; publicKey: types.CryptoKey }> {
  const profile = entry.composite!()
  const [mldsa, traditional] = profile
  const [[mldsaPublicKey, mldsaPrivateKey], [traditionalPublicKey, traditionalPrivateKey]] =
    await Promise.all([generateComponent(mldsa), generateComponent(traditional)])

  const publicJwk: types.JWK = {
    kty: 'AKP',
    alg: entry.alg,
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
    compositeJwkToKey(entry, publicJwk),
    compositeJwkToKey(entry, privateJwk),
  ])

  return { publicKey, privateKey }
}
