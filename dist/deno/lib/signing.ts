import type * as types from '../types.d.ts'
import { JOSENotSupported } from '../util/errors.ts'
import { checkSigCryptoKey } from './crypto_key.ts'
import { invalidKeyInput } from './invalid_key_input.ts'

export function checkKeyLength(alg: string, key: types.CryptoKey) {
  if (alg.startsWith('RS') || alg.startsWith('PS')) {
    const { modulusLength } = key.algorithm as RsaKeyAlgorithm
    if (typeof modulusLength !== 'number' || modulusLength < 2048) {
      throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`)
    }
  }
}

function subtleAlgorithm(alg: string, algorithm: KeyAlgorithm | EcKeyAlgorithm) {
  const hash = `SHA-${alg.slice(-3)}`
  switch (alg) {
    case 'HS256':
    case 'HS384':
    case 'HS512':
      return { hash, name: 'HMAC' }
    case 'PS256':
    case 'PS384':
    case 'PS512':
      return { hash, name: 'RSA-PSS', saltLength: parseInt(alg.slice(-3), 10) >> 3 }
    case 'RS256':
    case 'RS384':
    case 'RS512':
      return { hash, name: 'RSASSA-PKCS1-v1_5' }
    case 'ES256':
    case 'ES384':
    case 'ES512':
      return { hash, name: 'ECDSA', namedCurve: (algorithm as EcKeyAlgorithm).namedCurve }
    case 'Ed25519': // Fall through
    case 'EdDSA':
      return { name: 'Ed25519' }
    case 'ML-DSA-44':
    case 'ML-DSA-65':
    case 'ML-DSA-87':
      return { name: alg }
    default:
      throw new JOSENotSupported(
        `alg ${alg} is not supported either by JOSE or your javascript runtime`,
      )
  }
}

async function getSigKey(alg: string, key: types.CryptoKey | Uint8Array, usage: KeyUsage) {
  if (key instanceof Uint8Array) {
    if (!alg.startsWith('HS')) {
      throw new TypeError(invalidKeyInput(key, 'CryptoKey', 'KeyObject', 'JSON Web Key'))
    }
    return crypto.subtle.importKey(
      'raw',
      key as Uint8Array<ArrayBuffer>,
      { hash: `SHA-${alg.slice(-3)}`, name: 'HMAC' },
      false,
      [usage],
    )
  }

  checkSigCryptoKey(key, alg, usage)
  return key
}

export async function sign(alg: string, key: types.CryptoKey | Uint8Array, data: Uint8Array) {
  const cryptoKey = await getSigKey(alg, key, 'sign')
  checkKeyLength(alg, cryptoKey)
  const signature = await crypto.subtle.sign(
    subtleAlgorithm(alg, cryptoKey.algorithm),
    cryptoKey,
    data as Uint8Array<ArrayBuffer>,
  )
  return new Uint8Array(signature)
}

export async function verify(
  alg: string,
  key: types.CryptoKey | Uint8Array,
  signature: Uint8Array,
  data: Uint8Array,
) {
  const cryptoKey = await getSigKey(alg, key, 'verify')
  checkKeyLength(alg, cryptoKey)
  const algorithm = subtleAlgorithm(alg, cryptoKey.algorithm)
  try {
    return await crypto.subtle.verify(
      algorithm,
      cryptoKey,
      signature as Uint8Array<ArrayBuffer>,
      data as Uint8Array<ArrayBuffer>,
    )
  } catch {
    return false
  }
}
