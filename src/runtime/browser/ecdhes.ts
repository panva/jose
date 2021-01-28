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
import crypto from './webcrypto.js'
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
      Math.ceil(parseInt((<EcKeyAlgorithm>privateKey.algorithm).namedCurve.substr(-3), 10) / 8) <<
        3,
    ),
  )

  return concatKdf(sharedSecret, keyLength, value)
}

export const ephemeralKeyToPublicJWK: EphemeralKeyToPublicJwkFunction = async function ephemeralKeyToPublicJWK(
  key: CryptoKey,
) {
  // eslint-disable-next-line @typescript-eslint/keyword-spacing
  const { crv, kty, x, y } = <EpkJwk>await crypto.subtle.exportKey('jwk', key)
  return { crv, kty, x, y }
}

export const generateEpk: GenerateEpkFunction = async (key: CryptoKey) =>
  (
    await crypto.subtle.generateKey(
      { name: 'ECDH', namedCurve: (<EcKeyAlgorithm>key.algorithm).namedCurve },
      true,
      ['deriveBits'],
    )
  ).privateKey

export const publicJwkToEphemeralKey: PublicJwkToEphemeralKeyFunction = (jwk: EpkJwk) =>
  crypto.subtle.importKey('jwk', jwk, { name: 'ECDH', namedCurve: jwk.crv }, true, [])

const curves = ['P-256', 'P-384', 'P-521']
export const ecdhAllowed: EcdhAllowedFunction = (key: CryptoKey) =>
  curves.includes((<EcKeyAlgorithm>key.algorithm).namedCurve)
