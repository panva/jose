import type {
  EcdhAllowedFunction,
  EcdhESDeriveKeyFunction,
  EphemeralKeyToPublicJwkFunction,
  GenerateEpkFunction,
  PublicJwkToEphemeralKeyFunction,
} from '../interfaces.d'
import {
  encoder,
  concat,
  uint32be,
  lengthAndInput,
  concatKdf as KDF,
} from '../../lib/buffer_utils.js'
import type { EpkJwk } from '../../types.i.d'
import crypto, { ensureSecureContext } from './webcrypto.js'
import digest from './digest.js'

const concatKdf = KDF.bind(undefined, digest.bind(undefined, 'sha256'))

export const deriveKey: EcdhESDeriveKeyFunction = async (
  publicKey: CryptoKey,
  privateKey: CryptoKey,
  algorithm: string,
  keyLength: number,
  apu: Uint8Array = new Uint8Array(),
  apv: Uint8Array = new Uint8Array(),
) => {
  ensureSecureContext()
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
      Math.ceil(parseInt((privateKey.algorithm as EcKeyAlgorithm).namedCurve.substr(-3), 10) / 8) <<
        3,
    ),
  )

  return concatKdf(sharedSecret, keyLength, value)
}

export const ephemeralKeyToPublicJWK: EphemeralKeyToPublicJwkFunction = async function ephemeralKeyToPublicJWK(
  key: CryptoKey,
) {
  ensureSecureContext()
  const { crv, kty, x, y } = (await crypto.subtle.exportKey('jwk', key)) as EpkJwk
  return { crv, kty, x, y }
}

export const generateEpk: GenerateEpkFunction = async (key: CryptoKey) => {
  ensureSecureContext()
  return (
    await crypto.subtle.generateKey(
      { name: 'ECDH', namedCurve: (key.algorithm as EcKeyAlgorithm).namedCurve },
      true,
      ['deriveBits'],
    )
  ).privateKey
}

export const publicJwkToEphemeralKey: PublicJwkToEphemeralKeyFunction = async (jwk: EpkJwk) => {
  ensureSecureContext()
  return crypto.subtle.importKey('jwk', jwk, { name: 'ECDH', namedCurve: jwk.crv }, true, [])
}

const curves = ['P-256', 'P-384', 'P-521']
export const ecdhAllowed: EcdhAllowedFunction = (key: CryptoKey) =>
  curves.includes((key.algorithm as EcKeyAlgorithm).namedCurve)
