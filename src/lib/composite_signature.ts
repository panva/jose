import type * as types from '../types.d.ts'
import { decode as b64uDecode, encode as b64u } from '../util/base64url.js'
import { concat, encode, digest } from './buffer_utils.js'
import * as ecdsa from './composite_ecdsa.js'
import type { CompositeParameters, JWSAlgorithm } from './jws_algorithms.js'
import type { KeyDescriptor } from './key_descriptor.js'

type ComponentKeys = [mldsa: types.CryptoKey, traditional: types.CryptoKey]

const state = new WeakMap<types.CryptoKey, ComponentKeys>()
const mldsa = 'ML-DSA-44'
const mldsaPublicKeyLength = 1312
const mldsaSignatureLength = 2420
const prefix = encode('CompositeAlgorithmSignatures2025')

function assertLength(bytes: Uint8Array, expected: number, label: string) {
  if (bytes.length !== expected) {
    throw new TypeError(`${label} length mismatch`)
  }
}

function createCompositeKey(entry: KeyDescriptor, components: ComponentKeys): types.CryptoKey {
  const { type, extractable, usages } = components[0]
  const key = Object.freeze({
    [Symbol.toStringTag]: 'CryptoKey',
    type,
    extractable,
    algorithm: Object.freeze({ name: entry.alg }),
    usages: Object.freeze([...usages]),
  }) as unknown as types.CryptoKey
  state.set(key, components)
  return key
}

export async function compositeJwkToKey(
  entry: KeyDescriptor,
  jwk: types.JWK,
): Promise<types.CryptoKey> {
  const [traditional] = (entry as JWSAlgorithm).composite!()
  const isEcdsa = traditional.kty[0] === 'EC'
  // draft-ietf-jose-pq-composite-sigs-06, Section 4.1: pub and priv carry
  // SerializePublicKey and SerializePrivateKey outputs, with the ML-DSA component first.
  const publicKeyBytes = b64uDecode(jwk.pub!)
  const privateKeyBytes = jwk.priv ? b64uDecode(jwk.priv) : undefined
  assertLength(publicKeyBytes, mldsaPublicKeyLength + (isEcdsa ? 65 : 32), 'Composite public key')
  if (privateKeyBytes)
    assertLength(privateKeyBytes, 32 + (isEcdsa ? 51 : 32), 'Composite private key')

  const traditionalPublicKey = publicKeyBytes.subarray(mldsaPublicKeyLength)
  // Section 4.2.3: the X9.62 uncompressed point is 0x04 || x || y.
  if (isEcdsa && traditionalPublicKey[0] !== 0x04)
    throw new TypeError('Invalid composite ECDSA public key')
  const mldsaJwk: types.JWK = {
    kty: 'AKP',
    alg: mldsa,
    pub: b64u(publicKeyBytes.subarray(0, mldsaPublicKeyLength)),
  }
  const traditionalJwk: types.JWK = {
    kty: traditional.kty[0],
    crv: traditional.crv,
    x: b64u(isEcdsa ? traditionalPublicKey.subarray(1, 33) : traditionalPublicKey),
  }
  if (isEcdsa) traditionalJwk.y = b64u(traditionalPublicKey.subarray(33))
  if (privateKeyBytes) {
    // Section 4.1: the ML-DSA private component is its 32-octet seed.
    mldsaJwk.priv = b64u(privateKeyBytes.subarray(0, 32))
    const traditionalPrivateKey = privateKeyBytes.subarray(32)
    traditionalJwk.d = b64u(
      isEcdsa ? ecdsa.decodePrivateKey(traditionalPrivateKey) : traditionalPrivateKey,
    )
  }

  const extractable = jwk.ext ?? !privateKeyBytes
  const usages =
    (jwk.key_ops as KeyUsage[] | undefined) ?? (privateKeyBytes ? ['sign'] : ['verify'])
  const components = await Promise.all([
    crypto.subtle.importKey('jwk', mldsaJwk, mldsa, extractable, usages),
    crypto.subtle.importKey('jwk', traditionalJwk, traditional.subtle, extractable, usages),
  ])
  return createCompositeKey(entry, components)
}

export function compositeKeyToJWK(key: unknown): Promise<types.JWK> | undefined {
  const cryptoKey = key as types.CryptoKey
  const components = state.get(cryptoKey)
  if (!components) return undefined
  if (!cryptoKey.extractable) {
    throw new TypeError('non-extractable CryptoKey cannot be exported as a JWK')
  }

  // draft-ietf-jose-pq-composite-sigs-06, Section 4.1: serialize the component
  // keys into the AKP pub and priv byte strings, then base64url-encode them.
  return Promise.all(
    components.map(async (component) => {
      const jwk = (await crypto.subtle.exportKey('jwk', component)) as types.JWK
      const isEcdsa = jwk.kty === 'EC'
      let publicKeyBytes = b64uDecode((jwk.pub ?? jwk.x)!)
      if (isEcdsa) publicKeyBytes = concat(Uint8Array.of(0x04), publicKeyBytes, b64uDecode(jwk.y!))
      const encodedPrivateKey = jwk.priv ?? jwk.d
      let privateKeyBytes = encodedPrivateKey ? b64uDecode(encodedPrivateKey) : undefined
      if (isEcdsa && privateKeyBytes) privateKeyBytes = ecdsa.encodePrivateKey(privateKeyBytes)
      return [publicKeyBytes, privateKeyBytes] as const
    }),
  ).then((serializedComponents) => {
    const jwk: types.JWK = {
      kty: 'AKP',
      alg: cryptoKey.algorithm.name,
      pub: b64u(concat(...serializedComponents.map(([pub]) => pub))),
    }
    if (cryptoKey.type === 'private') {
      jwk.priv = b64u(concat(...serializedComponents.map(([, priv]) => priv!)))
    }
    return jwk
  })
}

async function createMessageRepresentative(
  parameters: CompositeParameters,
  signingInput: Uint8Array,
) {
  // draft-ietf-jose-pq-composite-sigs-06, Section 4.1: M' = Prefix || Label || 0x00 || PH(M),
  // where M is the JWS Signing Input. The application context is empty;
  // the underlying ML-DSA context remains the algorithm label.
  const [, preHashBits, label] = parameters
  return concat(prefix, label, Uint8Array.of(0), await digest(`sha${preHashBits}`, signingInput))
}

export async function compositeSign(
  entry: JWSAlgorithm,
  key: types.CryptoKey,
  signingInput: Uint8Array,
): Promise<Uint8Array> {
  const parameters = entry.composite!()
  const [traditional, , label] = parameters
  const messageRepresentative = await createMessageRepresentative(parameters, signingInput)
  const [mldsaKey, traditionalKey] = state.get(key)!
  const mldsaAlgorithm = { name: mldsa, context: label }
  const [mldsaSignature, traditionalSignature] = await Promise.all([
    crypto.subtle.sign(mldsaAlgorithm, mldsaKey, messageRepresentative as Uint8Array<ArrayBuffer>),
    crypto.subtle.sign(
      traditional.signing,
      traditionalKey,
      messageRepresentative as Uint8Array<ArrayBuffer>,
    ),
  ])

  const traditionalSignatureBytes = new Uint8Array(traditionalSignature)
  // Section 4.1: SerializeSignatureValue concatenates the ML-DSA and traditional signatures.
  return concat(
    new Uint8Array(mldsaSignature),
    traditional.kty[0] === 'EC'
      ? ecdsa.encodeSignature(traditionalSignatureBytes)
      : traditionalSignatureBytes,
  )
}

export async function compositeVerify(
  entry: JWSAlgorithm,
  key: types.CryptoKey,
  signature: Uint8Array,
  signingInput: Uint8Array,
): Promise<boolean> {
  const parameters = entry.composite!()
  const [traditional, , label] = parameters
  if (signature.length <= mldsaSignatureLength) return false
  // Section 4.1: DeserializeSignatureValue splits off the fixed-length ML-DSA signature.
  const mldsaSignature = signature.subarray(0, mldsaSignatureLength)
  let traditionalSignature = signature.subarray(mldsaSignatureLength)

  if (traditional.kty[0] === 'EC') {
    traditionalSignature = ecdsa.decodeSignature(traditionalSignature)
  } else {
    assertLength(traditionalSignature, 64, 'Component signature')
  }
  const messageRepresentative = await createMessageRepresentative(parameters, signingInput)
  const [mldsaKey, traditionalKey] = state.get(key)!
  const mldsaAlgorithm = { name: mldsa, context: label }
  const [mldsaVerified, traditionalVerified] = await Promise.all([
    crypto.subtle.verify(
      mldsaAlgorithm,
      mldsaKey,
      mldsaSignature as Uint8Array<ArrayBuffer>,
      messageRepresentative as Uint8Array<ArrayBuffer>,
    ),
    crypto.subtle.verify(
      traditional.signing,
      traditionalKey,
      traditionalSignature as Uint8Array<ArrayBuffer>,
      messageRepresentative as Uint8Array<ArrayBuffer>,
    ),
  ])
  return mldsaVerified && traditionalVerified
}

export async function generateCompositeKeyPair(
  entry: JWSAlgorithm,
  extractable: boolean,
): Promise<{ privateKey: types.CryptoKey; publicKey: types.CryptoKey }> {
  const [traditional] = entry.composite!()
  // Section 6.2: generate both component key pairs together; do not reuse existing keys.
  const [mldsaKeys, traditionalKeys] = (await Promise.all([
    crypto.subtle.generateKey(mldsa, extractable, ['sign', 'verify']),
    crypto.subtle.generateKey(traditional.subtle, extractable, ['sign', 'verify']),
  ])) as [CryptoKeyPair, CryptoKeyPair]
  return {
    privateKey: createCompositeKey(entry, [mldsaKeys.privateKey, traditionalKeys.privateKey]),
    publicKey: createCompositeKey(entry, [mldsaKeys.publicKey, traditionalKeys.publicKey]),
  }
}
