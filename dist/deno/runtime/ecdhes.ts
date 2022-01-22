import { encoder, concat, uint32be, lengthAndInput, concatKdf } from '../lib/buffer_utils.ts'
import crypto, { isCryptoKey } from './webcrypto.ts'
import { checkEncCryptoKey } from '../lib/crypto_key.ts'
import digest from './digest.ts'
import invalidKeyInput from '../lib/invalid_key_input.ts'
import { types } from './is_key_like.ts'

export async function deriveKey(
  publicKey: unknown,
  privateKey: unknown,
  algorithm: string,
  keyLength: number,
  apu: Uint8Array = new Uint8Array(0),
  apv: Uint8Array = new Uint8Array(0),
) {
  if (!isCryptoKey(publicKey)) {
    throw new TypeError(invalidKeyInput(publicKey, ...types))
  }
  checkEncCryptoKey(publicKey, 'ECDH-ES')
  if (!isCryptoKey(privateKey)) {
    throw new TypeError(invalidKeyInput(privateKey, ...types))
  }
  checkEncCryptoKey(privateKey, 'ECDH-ES', 'deriveBits', 'deriveKey')

  const value = concat(
    lengthAndInput(encoder.encode(algorithm)),
    lengthAndInput(apu),
    lengthAndInput(apv),
    uint32be(keyLength),
  )

  if (!privateKey.usages.includes('deriveBits')) {
    throw new TypeError('ECDH-ES private key "usages" must include "deriveBits"')
  }

  const sharedSecret = new Uint8Array(
    await crypto.subtle.deriveBits(
      {
        name: 'ECDH',
        public: publicKey,
      },
      privateKey,
      Math.ceil(parseInt((<EcKeyAlgorithm>privateKey.algorithm).namedCurve.slice(-3), 10) / 8) << 3,
    ),
  )

  return concatKdf(digest, sharedSecret, keyLength, value)
}

export async function generateEpk(key: unknown) {
  if (!isCryptoKey(key)) {
    throw new TypeError(invalidKeyInput(key, ...types))
  }

  return crypto.subtle.generateKey(<EcKeyAlgorithm>key.algorithm, true, ['deriveBits'])
}

export function ecdhAllowed(key: unknown) {
  if (!isCryptoKey(key)) {
    throw new TypeError(invalidKeyInput(key, ...types))
  }
  return ['P-256', 'P-384', 'P-521'].includes((<EcKeyAlgorithm>key.algorithm).namedCurve)
}
