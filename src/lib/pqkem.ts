import { kmac256 } from '@noble/hashes/sha3-addons.js'
import type { MlKemInterface } from 'mlkem'
import { createMlKem1024, createMlKem512, createMlKem768 } from 'mlkem'
import type * as types from '../types.d.ts'
import { decode as b64u } from '../util/base64url.js'
import { concat, encode, uint32be } from './buffer_utils.js'

type MlKemAlgorithm = 'ML-KEM-512' | 'ML-KEM-768' | 'ML-KEM-1024'
export type PqKemAlgorithm =
  | MlKemAlgorithm
  | 'ML-KEM-512+A128KW'
  | 'ML-KEM-768+A192KW'
  | 'ML-KEM-1024+A256KW'

interface MlKemParameters {
  publicKeyLength: number
  privateKeyLength: number
  ciphertextLength: number
  create: () => Promise<MlKemInterface>
}

const parameters: Record<MlKemAlgorithm, MlKemParameters> = {
  'ML-KEM-512': {
    publicKeyLength: 800,
    privateKeyLength: 1632,
    ciphertextLength: 768,
    create: createMlKem512,
  },
  'ML-KEM-768': {
    publicKeyLength: 1184,
    privateKeyLength: 2400,
    ciphertextLength: 1088,
    create: createMlKem768,
  },
  'ML-KEM-1024': {
    publicKeyLength: 1568,
    privateKeyLength: 3168,
    ciphertextLength: 1568,
    create: createMlKem1024,
  },
}

const cache = new Map<MlKemAlgorithm, Promise<MlKemInterface>>()

function lengthAndInput(input: Uint8Array) {
  return concat(uint32be(input.length), input)
}

function equal(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false
  let out = 0
  for (let i = 0; i < a.length; i++) out |= a[i] ^ b[i]
  return out === 0
}

function assertAkpJwk(key: unknown): asserts key is types.JWK {
  if (typeof key !== 'object' || key === null || (key as types.JWK).kty !== 'AKP') {
    throw new TypeError('ML-KEM keys must be AKP JSON Web Keys')
  }
}

function assertJwkAlg(jwk: types.JWK, alg: string) {
  const keyAlg = keyAlgorithm(alg)
  if (jwk.alg !== keyAlg && jwk.alg !== alg) {
    throw new TypeError(`Invalid key for this operation, its "alg" must be "${keyAlg}"`)
  }
}

function assertPublicKeyLength(alg: MlKemAlgorithm, key: Uint8Array) {
  const expected = parameters[alg].publicKeyLength
  if (key.length !== expected) {
    throw new TypeError(`Invalid ML-KEM public key length. Expected ${expected} bytes`)
  }
}

function assertPrivateKeyLength(alg: MlKemAlgorithm, key: Uint8Array) {
  const expected = parameters[alg].privateKeyLength
  if (key.length !== expected) {
    throw new TypeError(`Invalid ML-KEM private key length. Expected ${expected} bytes`)
  }
}

export function isPqKemAlgorithm(alg: string): alg is PqKemAlgorithm {
  switch (alg) {
    case 'ML-KEM-512':
    case 'ML-KEM-768':
    case 'ML-KEM-1024':
    case 'ML-KEM-512+A128KW':
    case 'ML-KEM-768+A192KW':
    case 'ML-KEM-1024+A256KW':
      return true
    default:
      return false
  }
}

export function isDirect(alg: string) {
  return alg === 'ML-KEM-512' || alg === 'ML-KEM-768' || alg === 'ML-KEM-1024'
}

export function keyAlgorithm(alg: string): MlKemAlgorithm {
  switch (alg) {
    case 'ML-KEM-512':
    case 'ML-KEM-512+A128KW':
      return 'ML-KEM-512'
    case 'ML-KEM-768':
    case 'ML-KEM-768+A192KW':
      return 'ML-KEM-768'
    case 'ML-KEM-1024':
    case 'ML-KEM-1024+A256KW':
      return 'ML-KEM-1024'
    default:
      throw new TypeError('Invalid or unsupported ML-KEM algorithm')
  }
}

export function keyWrapLength(alg: string) {
  switch (alg) {
    case 'ML-KEM-512+A128KW':
      return 128
    case 'ML-KEM-768+A192KW':
      return 192
    case 'ML-KEM-1024+A256KW':
      return 256
    default:
      throw new TypeError('Invalid or unsupported ML-KEM key wrapping algorithm')
  }
}

async function getKem(alg: MlKemAlgorithm) {
  let kem = cache.get(alg)
  if (!kem) {
    kem = parameters[alg].create()
    cache.set(alg, kem)
  }
  return kem
}

export function publicKey(jwk: types.JWK, alg: string) {
  assertAkpJwk(jwk)
  assertJwkAlg(jwk, alg)
  if (typeof jwk.pub !== 'string' || !jwk.pub) {
    throw new TypeError('ML-KEM public JWK must include a non-empty "pub" parameter')
  }

  const keyAlg = keyAlgorithm(alg)
  const key = b64u(jwk.pub)
  assertPublicKeyLength(keyAlg, key)
  return key
}

export async function privateKey(jwk: types.JWK, alg: string) {
  assertAkpJwk(jwk)
  assertJwkAlg(jwk, alg)
  if (typeof jwk.priv !== 'string' || !jwk.priv) {
    throw new TypeError('ML-KEM private JWK must include a non-empty "priv" parameter')
  }

  const keyAlg = keyAlgorithm(alg)
  const raw = b64u(jwk.priv)
  const kem = await getKem(keyAlg)

  let sk: Uint8Array
  if (raw.length === parameters[keyAlg].privateKeyLength) {
    sk = raw
  } else if (raw.length === 64) {
    ;[, sk] = kem.deriveKeyPair(raw)
  } else {
    throw new TypeError('ML-KEM private JWK "priv" must be 64 or expanded-key bytes')
  }

  assertPrivateKeyLength(keyAlg, sk)

  if (typeof jwk.pub === 'string' && jwk.pub) {
    const expected = b64u(jwk.pub)
    assertPublicKeyLength(keyAlg, expected)
    const actual = sk.subarray(
      parameters[keyAlg].privateKeyLength - parameters[keyAlg].publicKeyLength - 64,
      parameters[keyAlg].privateKeyLength - 64,
    )
    if (!equal(actual, expected)) {
      throw new TypeError('ML-KEM private JWK "priv" does not match "pub"')
    }
  }

  return sk
}

export async function encapsulate(alg: string, jwk: types.JWK, seed?: Uint8Array) {
  const keyAlg = keyAlgorithm(alg)
  const kem = await getKem(keyAlg)
  const [ciphertext, sharedSecret] = kem.encap(publicKey(jwk, alg), seed)
  return { ciphertext, sharedSecret }
}

export async function decapsulate(alg: string, jwk: types.JWK, ciphertext: Uint8Array) {
  const keyAlg = keyAlgorithm(alg)
  const params = parameters[keyAlg]
  if (ciphertext.length !== params.ciphertextLength) {
    throw new TypeError(
      `Invalid ML-KEM ciphertext length. Expected ${params.ciphertextLength} bytes`,
    )
  }

  const kem = await getKem(keyAlg)
  return kem.decap(ciphertext, await privateKey(jwk, alg))
}

export function deriveKey(
  sharedSecret: Uint8Array,
  algorithmID: string,
  keyLength: number,
  suppPrivInfo: Uint8Array = new Uint8Array(),
) {
  const context = concat(lengthAndInput(encode(algorithmID)), uint32be(keyLength), suppPrivInfo)
  return kmac256(sharedSecret, context, {
    dkLen: keyLength >> 3,
    personalization: new Uint8Array(),
  })
}
