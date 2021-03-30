import type {
  EcdhAllowedFunction,
  EcdhESDeriveKeyFunction,
  EphemeralKeyToPublicJwkFunction,
  GenerateEpkFunction,
  PublicJwkToEphemeralKeyFunction,
} from '../interfaces.d'
import { encoder, concat, uint32be, lengthAndInput, concatKdf } from '../../lib/buffer_utils.js'
import type { EpkJwk } from '../../types.i.d'
import crypto, { isCryptoKey } from './webcrypto.js'
import digest from './digest.js'

export const deriveKey: EcdhESDeriveKeyFunction = async (
  publicKey: unknown,
  privateKey: unknown,
  algorithm: string,
  keyLength: number,
  apu: Uint8Array = new Uint8Array(0),
  apv: Uint8Array = new Uint8Array(0),
) => {
  if (!isCryptoKey(publicKey)) {
    throw new TypeError('invalid key input')
  }
  if (!isCryptoKey(privateKey)) {
    throw new TypeError('invalid key input')
  }

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

  return concatKdf(digest, sharedSecret, keyLength, value)
}

export const ephemeralKeyToPublicJWK: EphemeralKeyToPublicJwkFunction = async function ephemeralKeyToPublicJWK(
  key: unknown,
) {
  if (!isCryptoKey(key)) {
    throw new TypeError('invalid key input')
  }
  // eslint-disable-next-line @typescript-eslint/keyword-spacing
  const { crv, kty, x, y } = <EpkJwk>await crypto.subtle.exportKey('jwk', key)
  return { crv, kty, x, y }
}

export const generateEpk: GenerateEpkFunction = async (key: unknown) => {
  if (!isCryptoKey(key)) {
    throw new TypeError('invalid key input')
  }

  return (
    await crypto.subtle.generateKey(
      { name: 'ECDH', namedCurve: (<EcKeyAlgorithm>key.algorithm).namedCurve },
      true,
      ['deriveBits'],
    )
  ).privateKey
}

export const publicJwkToEphemeralKey: PublicJwkToEphemeralKeyFunction = (jwk: EpkJwk) =>
  crypto.subtle.importKey('jwk', jwk, { name: 'ECDH', namedCurve: jwk.crv }, true, [])

const curves = ['P-256', 'P-384', 'P-521']
export const ecdhAllowed: EcdhAllowedFunction = (key: unknown) => {
  if (!isCryptoKey(key)) {
    throw new TypeError('invalid key input')
  }
  return curves.includes((<EcKeyAlgorithm>key.algorithm).namedCurve)
}
