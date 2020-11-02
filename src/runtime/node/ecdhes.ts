import type { KeyObject } from 'crypto'
import { diffieHellman, generateKeyPair as generateKeyPairCb, createPublicKey } from 'crypto'
import { promisify } from 'util'

import type {
  EcdhAllowedFunction,
  EcdhESDeriveKeyFunction,
  EphemeralKeyToPublicJwkFunction,
  GenerateEpkFunction,
  PublicJwkToEphemeralKeyFunction,
} from '../interfaces.d'
import * as base64url from './base64url.js'
import getNamedCurve from './get_named_curve.js'
import {
  encoder,
  concat,
  uint32be,
  lengthAndInput,
  concatKdf as KDF,
} from '../../lib/buffer_utils.js'
import type { EpkJwk } from '../../types.i.d'
import digest from './digest.js'
import { JOSENotSupported } from '../../util/errors.js'

const generateKeyPair = promisify(generateKeyPairCb)

const concatKdf = KDF.bind(undefined, digest.bind(undefined, 'sha256'))

export const deriveKey: EcdhESDeriveKeyFunction = async (
  publicKey: KeyObject,
  privateKey: KeyObject,
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

  const sharedSecret = diffieHellman({ privateKey, publicKey })
  return concatKdf(sharedSecret, keyLength, value)
}

export const ephemeralKeyToPublicJWK: EphemeralKeyToPublicJwkFunction = function ephemeralKeyToPublicJWK(
  key: KeyObject,
) {
  switch (key.asymmetricKeyType) {
    case 'x25519':
    case 'x448': {
      const s = key.asymmetricKeyType === 'x25519' ? 32 : 56
      return {
        crv: key.asymmetricKeyType.toUpperCase(),
        kty: 'OKP',
        x: base64url.encode(createPublicKey(key).export({ format: 'der', type: 'spki' }).slice(-s)),
      }
    }
    case 'ec': {
      const crv = getNamedCurve(key)
      // eslint-disable-next-line no-nested-ternary
      const s = crv === 'P-256' ? 64 : crv === 'P-384' ? 96 : 132
      const b = key.export({ format: 'der', type: 'pkcs8' })
      const x = base64url.encode(b.slice(-s, -s >> 1))
      const y = base64url.encode(b.slice(-s >> 1))
      return { crv, kty: 'EC', x, y }
    }
    default:
      throw new JOSENotSupported('unsupported or invalid EPK')
  }
}

export const generateEpk: GenerateEpkFunction = async (key: KeyObject) => {
  switch (key.asymmetricKeyType) {
    case 'x25519':
      return (await generateKeyPair('x25519')).privateKey
    case 'x448': {
      return (await generateKeyPair('x448')).privateKey
    }
    case 'ec': {
      const namedCurve = getNamedCurve(key)
      return (await generateKeyPair('ec', { namedCurve })).privateKey
    }
    default:
      throw new JOSENotSupported('unsupported or invalid EPK')
  }
}

export const publicJwkToEphemeralKey: PublicJwkToEphemeralKeyFunction = async (jwk: EpkJwk) => {
  let pem: Buffer
  switch (jwk.crv) {
    case 'P-256':
      pem = Buffer.concat([
        Buffer.from('3059301306072a8648ce3d020106082a8648ce3d03010703420004', 'hex'),
        base64url.decode(jwk.x!),
        base64url.decode(jwk.y!),
      ])
      break
    case 'P-384':
      pem = Buffer.concat([
        Buffer.from('3076301006072a8648ce3d020106052b8104002203620004', 'hex'),
        base64url.decode(jwk.x!),
        base64url.decode(jwk.y!),
      ])
      break
    case 'P-521':
      pem = Buffer.concat([
        Buffer.from('30819b301006072a8648ce3d020106052b810400230381860004', 'hex'),
        base64url.decode(jwk.x!),
        base64url.decode(jwk.y!),
      ])
      break
    case 'X25519':
      pem = Buffer.concat([
        Buffer.from('302a300506032b656e032100', 'hex'),
        base64url.decode(jwk.x!),
      ])
      break
    case 'X448':
      pem = Buffer.concat([
        Buffer.from('3042300506032b656f033900', 'hex'),
        base64url.decode(jwk.x!),
      ])
      break
    default:
      throw new JOSENotSupported(
        'unsupported or invalid JWK "crv" (Curve or Subtype of Key Pair) Parameter value',
      )
  }

  return createPublicKey({ format: 'der', key: pem, type: 'spki' })
}

const curves = ['P-256', 'P-384', 'P-521', 'X25519', 'X448']
export const ecdhAllowed: EcdhAllowedFunction = (key: KeyObject) =>
  curves.includes(getNamedCurve(key))
