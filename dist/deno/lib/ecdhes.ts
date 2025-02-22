import type * as types from '../types.d.ts'
import { encoder, concat, uint32be } from './buffer_utils.ts'
import { checkEncCryptoKey } from './crypto_key.ts'
import digest from './digest.ts'

function lengthAndInput(input: Uint8Array) {
  return concat(uint32be(input.length), input)
}

async function concatKdf(secret: Uint8Array, bits: number, value: Uint8Array) {
  const iterations = Math.ceil((bits >> 3) / 32)
  const res = new Uint8Array(iterations * 32)
  for (let iter = 0; iter < iterations; iter++) {
    const buf = new Uint8Array(4 + secret.length + value.length)
    buf.set(uint32be(iter + 1))
    buf.set(secret, 4)
    buf.set(value, 4 + secret.length)
    res.set(await digest('sha256', buf), iter * 32)
  }
  return res.slice(0, bits >> 3)
}

export async function deriveKey(
  publicKey: types.CryptoKey,
  privateKey: types.CryptoKey,
  algorithm: string,
  keyLength: number,
  apu: Uint8Array = new Uint8Array(0),
  apv: Uint8Array = new Uint8Array(0),
) {
  checkEncCryptoKey(publicKey, 'ECDH')
  checkEncCryptoKey(privateKey, 'ECDH', 'deriveBits')

  const value = concat(
    lengthAndInput(encoder.encode(algorithm)),
    lengthAndInput(apu),
    lengthAndInput(apv),
    uint32be(keyLength),
  )

  let length: number
  if (publicKey.algorithm.name === 'X25519') {
    length = 256
  } else {
    length =
      Math.ceil(parseInt((publicKey.algorithm as EcKeyAlgorithm).namedCurve.slice(-3), 10) / 8) << 3
  }

  const sharedSecret = new Uint8Array(
    await crypto.subtle.deriveBits(
      {
        name: publicKey.algorithm.name,
        public: publicKey,
      },
      privateKey,
      length,
    ),
  )

  return concatKdf(sharedSecret, keyLength, value)
}

export function allowed(key: types.CryptoKey) {
  switch ((key.algorithm as EcKeyAlgorithm).namedCurve) {
    case 'P-256':
    case 'P-384':
    case 'P-521':
      return true
    default:
      return key.algorithm.name === 'X25519'
  }
}
