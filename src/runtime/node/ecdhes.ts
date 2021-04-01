import { KeyObject, diffieHellman, generateKeyPair as generateKeyPairCb } from 'crypto'
import { promisify } from 'util'

import type {
  EcdhAllowedFunction,
  EcdhESDeriveKeyFunction,
  GenerateEpkFunction,
} from '../interfaces.d'
import getNamedCurve from './get_named_curve.js'
import { encoder, concat, uint32be, lengthAndInput, concatKdf } from '../../lib/buffer_utils.js'
import digest from './digest.js'
import { JOSENotSupported } from '../../util/errors.js'
import { isCryptoKey, getKeyObject } from './webcrypto.js'

const generateKeyPair = promisify(generateKeyPairCb)

export const deriveKey: EcdhESDeriveKeyFunction = async (
  publicKey: unknown,
  privateKey: unknown,
  algorithm: string,
  keyLength: number,
  apu: Uint8Array = new Uint8Array(0),
  apv: Uint8Array = new Uint8Array(0),
) => {
  const value = concat(
    lengthAndInput(encoder.encode(algorithm)),
    lengthAndInput(apu),
    lengthAndInput(apv),
    uint32be(keyLength),
  )

  if (isCryptoKey(publicKey)) {
    // eslint-disable-next-line no-param-reassign
    publicKey = getKeyObject(publicKey, 'ECDH-ES')
  }
  if (!(publicKey instanceof KeyObject)) {
    throw new TypeError('invalid key input')
  }

  if (isCryptoKey(privateKey)) {
    // eslint-disable-next-line no-param-reassign
    privateKey = getKeyObject(privateKey, 'ECDH-ES', new Set(['deriveBits', 'deriveKey']))
  }
  if (!(privateKey instanceof KeyObject)) {
    throw new TypeError('invalid key input')
  }

  const sharedSecret = diffieHellman({ privateKey, publicKey })
  return concatKdf(digest, sharedSecret, keyLength, value)
}

export const generateEpk: GenerateEpkFunction = async (key: unknown) => {
  if (isCryptoKey(key)) {
    // eslint-disable-next-line no-param-reassign
    key = getKeyObject(key)
  }
  if (!(key instanceof KeyObject)) {
    throw new TypeError('invalid key input')
  }

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

export const ecdhAllowed: EcdhAllowedFunction = (key: unknown) =>
  ['P-256', 'P-384', 'P-521', 'X25519', 'X448'].includes(getNamedCurve(key))
