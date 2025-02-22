import type * as types from '../types.d.ts'
import * as aeskw from './aeskw.ts'
import * as ecdhes from './ecdhes.ts'
import * as pbes2kw from './pbes2kw.ts'
import * as rsaes from './rsaes.ts'
import * as base64url from '../lib/base64url.ts'
import normalizeKey from './normalize_key.ts'

import type { JWEKeyManagementHeaderParameters, JWEHeaderParameters, JWK } from '../types.d.ts'
import generateCek, { bitLength as cekLength } from '../lib/cek.ts'
import { JOSENotSupported } from '../util/errors.ts'
import { exportJWK } from '../key/export.ts'
import { wrap as aesGcmKw } from './aesgcmkw.ts'
import { assertCryptoKey } from './is_key_like.ts'

export default async (
  alg: string,
  enc: string,
  key: types.CryptoKey | Uint8Array,
  providedCek?: Uint8Array,
  providedParameters: JWEKeyManagementHeaderParameters = {},
): Promise<{
  cek: types.CryptoKey | Uint8Array
  encryptedKey?: Uint8Array
  parameters?: JWEHeaderParameters
}> => {
  let encryptedKey: Uint8Array | undefined
  let parameters: (JWEHeaderParameters & { epk?: JWK }) | undefined
  let cek: types.CryptoKey | Uint8Array

  switch (alg) {
    case 'dir': {
      // Direct Encryption
      cek = key
      break
    }
    case 'ECDH-ES':
    case 'ECDH-ES+A128KW':
    case 'ECDH-ES+A192KW':
    case 'ECDH-ES+A256KW': {
      assertCryptoKey(key)
      // Direct Key Agreement
      if (!ecdhes.allowed(key)) {
        throw new JOSENotSupported(
          'ECDH with the provided key is not allowed or not supported by your javascript runtime',
        )
      }
      const { apu, apv } = providedParameters
      let ephemeralKey: types.CryptoKey
      if (providedParameters.epk) {
        ephemeralKey = (await normalizeKey(providedParameters.epk, alg)) as types.CryptoKey
      } else {
        ephemeralKey = (
          await crypto.subtle.generateKey(key.algorithm as EcKeyAlgorithm, true, ['deriveBits'])
        ).privateKey
      }
      const { x, y, crv, kty } = await exportJWK(ephemeralKey!)
      const sharedSecret = await ecdhes.deriveKey(
        key,
        ephemeralKey,
        alg === 'ECDH-ES' ? enc : alg,
        alg === 'ECDH-ES' ? cekLength(enc) : parseInt(alg.slice(-5, -2), 10),
        apu,
        apv,
      )
      parameters = { epk: { x, crv, kty } }
      if (kty === 'EC') parameters.epk!.y = y
      if (apu) parameters.apu = base64url.encode(apu)
      if (apv) parameters.apv = base64url.encode(apv)

      if (alg === 'ECDH-ES') {
        cek = sharedSecret
        break
      }

      // Key Agreement with Key Wrapping
      cek = providedCek || generateCek(enc)
      const kwAlg = alg.slice(-6)
      encryptedKey = await aeskw.wrap(kwAlg, sharedSecret, cek)
      break
    }
    case 'RSA-OAEP':
    case 'RSA-OAEP-256':
    case 'RSA-OAEP-384':
    case 'RSA-OAEP-512': {
      // Key Encryption (RSA)
      cek = providedCek || generateCek(enc)
      assertCryptoKey(key)
      encryptedKey = await rsaes.encrypt(alg, key, cek)
      break
    }
    case 'PBES2-HS256+A128KW':
    case 'PBES2-HS384+A192KW':
    case 'PBES2-HS512+A256KW': {
      // Key Encryption (PBES2)
      cek = providedCek || generateCek(enc)
      const { p2c, p2s } = providedParameters
      ;({ encryptedKey, ...parameters } = await pbes2kw.wrap(alg, key, cek, p2c, p2s))
      break
    }
    case 'A128KW':
    case 'A192KW':
    case 'A256KW': {
      // Key Wrapping (AES KW)
      cek = providedCek || generateCek(enc)
      encryptedKey = await aeskw.wrap(alg, key, cek)
      break
    }
    case 'A128GCMKW':
    case 'A192GCMKW':
    case 'A256GCMKW': {
      // Key Wrapping (AES GCM KW)
      cek = providedCek || generateCek(enc)
      const { iv } = providedParameters
      ;({ encryptedKey, ...parameters } = await aesGcmKw(alg, key, cek, iv))
      break
    }
    default: {
      throw new JOSENotSupported('Invalid or unsupported "alg" (JWE Algorithm) header value')
    }
  }

  return { cek, encryptedKey, parameters }
}
