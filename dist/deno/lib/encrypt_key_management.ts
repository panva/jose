import type { KeyLike, JWEKeyManagementHeaderParameters } from '../types.d.ts'
import type { JWEKeyManagementHeaderResults } from '../types.i.d.ts'
import cekFactory, { bitLengths as cekLengths } from '../lib/cek.ts'
import { JOSENotSupported } from '../util/errors.ts'
import random from '../runtime/random.ts'
import { wrap as aesKw } from '../runtime/aeskw.ts'
import * as ECDH from '../runtime/ecdhes.ts'
import { encrypt as pbes2Kw } from '../runtime/pbes2kw.ts'
import { encrypt as rsaEs } from '../runtime/rsaes.ts'
import { wrap as aesGcmKw } from '../runtime/aesgcmkw.ts'
import { encode as base64url } from '../runtime/base64url.ts'
import { fromKeyLike } from '../jwk/from_key_like.ts'
import checkKeyType from './check_key_type.ts'

const generateCek = cekFactory(random)

async function encryptKeyManagement(
  alg: string,
  enc: string,
  key: KeyLike,
  providedCek?: Uint8Array,
  providedParameters: JWEKeyManagementHeaderParameters = {},
): Promise<{
  cek: KeyLike
  encryptedKey?: Uint8Array
  parameters?: JWEKeyManagementHeaderResults
}> {
  let encryptedKey: Uint8Array | undefined
  let parameters: JWEKeyManagementHeaderResults | undefined
  let cek: KeyLike

  checkKeyType(alg, key, 'encrypt')

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
      // Direct Key Agreement
      if (!ECDH.ecdhAllowed(key)) {
        throw new JOSENotSupported(
          'ECDH-ES with the provided key is not allowed or not supported by your javascript runtime',
        )
      }
      const { apu, apv } = providedParameters
      let { epk: ephemeralKey } = providedParameters
      ephemeralKey ||= await ECDH.generateEpk(key)
      const { x, y, crv, kty } = await fromKeyLike(ephemeralKey)
      const sharedSecret = await ECDH.deriveKey(
        key,
        ephemeralKey,
        alg === 'ECDH-ES' ? enc : alg,
        parseInt(alg.substr(-5, 3), 10) || <number>cekLengths.get(enc),
        apu,
        apv,
      )
      parameters = { epk: { x, y, crv, kty } }
      if (apu) parameters.apu = base64url(apu)
      if (apv) parameters.apv = base64url(apv)

      if (alg === 'ECDH-ES') {
        cek = sharedSecret
        break
      }

      // Key Agreement with Key Wrapping
      cek = providedCek || generateCek(enc)
      const kwAlg = alg.substr(-6)
      encryptedKey = await aesKw(kwAlg, sharedSecret, cek)
      break
    }
    case 'RSA1_5':
    case 'RSA-OAEP':
    case 'RSA-OAEP-256':
    case 'RSA-OAEP-384':
    case 'RSA-OAEP-512': {
      // Key Encryption (RSA)
      cek = providedCek || generateCek(enc)
      encryptedKey = await rsaEs(alg, key, cek)
      break
    }
    case 'PBES2-HS256+A128KW':
    case 'PBES2-HS384+A192KW':
    case 'PBES2-HS512+A256KW': {
      // Key Encryption (PBES2)
      cek = providedCek || generateCek(enc)
      const { p2c, p2s } = providedParameters
      ;({ encryptedKey, ...parameters } = await pbes2Kw(alg, key, cek, p2c, p2s))
      break
    }
    case 'A128KW':
    case 'A192KW':
    case 'A256KW': {
      // Key Wrapping (AES KW)
      cek = providedCek || generateCek(enc)
      encryptedKey = await aesKw(alg, key, cek)
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
      throw new JOSENotSupported('unsupported or invalid "alg" (JWE Algorithm) header value')
    }
  }

  return { cek, encryptedKey, parameters }
}

export default encryptKeyManagement
