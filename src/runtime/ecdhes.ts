import { encoder, concat, uint32be, lengthAndInput, concatKdf } from '../lib/buffer_utils.js'
import { checkEncCryptoKey } from '../lib/crypto_key.js'
import type { CryptoKey } from '../types.d.ts'

export async function deriveKey(
  publicKey: CryptoKey,
  privateKey: CryptoKey,
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

export async function generateEpk(key: CryptoKey) {
  return crypto.subtle.generateKey(key.algorithm as EcKeyAlgorithm, true, ['deriveBits'])
}

export function ecdhAllowed(key: CryptoKey) {
  return (
    ['P-256', 'P-384', 'P-521'].includes((key.algorithm as EcKeyAlgorithm).namedCurve) ||
    key.algorithm.name === 'X25519'
  )
}
