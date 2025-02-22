import * as aeskw from './aeskw.ts'
import * as ecdhes from './ecdhes.ts'
import * as pbes2kw from './pbes2kw.ts'
import * as rsaes from './rsaes.ts'
import * as base64url from '../lib/base64url.ts'

import type * as types from '../types.d.ts'
import { JOSENotSupported, JWEInvalid } from '../util/errors.ts'
import { bitLength as cekLength } from '../lib/cek.ts'
import { importJWK } from '../key/import.ts'
import isObject from './is_object.ts'
import { unwrap as aesGcmKw } from './aesgcmkw.ts'
import { assertCryptoKey } from './is_key_like.ts'

export default async (
  alg: string,
  key: types.CryptoKey | Uint8Array,
  encryptedKey: Uint8Array | undefined,
  joseHeader: types.JWEHeaderParameters,
  options?: types.DecryptOptions,
): Promise<types.CryptoKey | Uint8Array> => {
  switch (alg) {
    case 'dir': {
      // Direct Encryption
      if (encryptedKey !== undefined)
        throw new JWEInvalid('Encountered unexpected JWE Encrypted Key')

      return key
    }
    case 'ECDH-ES':
      // Direct Key Agreement
      if (encryptedKey !== undefined)
        throw new JWEInvalid('Encountered unexpected JWE Encrypted Key')

    case 'ECDH-ES+A128KW':
    case 'ECDH-ES+A192KW':
    case 'ECDH-ES+A256KW': {
      // Direct Key Agreement
      if (!isObject<types.JWK>(joseHeader.epk))
        throw new JWEInvalid(`JOSE Header "epk" (Ephemeral Public Key) missing or invalid`)

      assertCryptoKey(key)
      if (!ecdhes.allowed(key))
        throw new JOSENotSupported(
          'ECDH with the provided key is not allowed or not supported by your javascript runtime',
        )

      const epk = await importJWK(joseHeader.epk, alg)
      assertCryptoKey(epk)
      let partyUInfo!: Uint8Array
      let partyVInfo!: Uint8Array

      if (joseHeader.apu !== undefined) {
        if (typeof joseHeader.apu !== 'string')
          throw new JWEInvalid(`JOSE Header "apu" (Agreement PartyUInfo) invalid`)
        try {
          partyUInfo = base64url.decode(joseHeader.apu)
        } catch {
          throw new JWEInvalid('Failed to base64url decode the apu')
        }
      }

      if (joseHeader.apv !== undefined) {
        if (typeof joseHeader.apv !== 'string')
          throw new JWEInvalid(`JOSE Header "apv" (Agreement PartyVInfo) invalid`)
        try {
          partyVInfo = base64url.decode(joseHeader.apv)
        } catch {
          throw new JWEInvalid('Failed to base64url decode the apv')
        }
      }

      const sharedSecret = await ecdhes.deriveKey(
        epk,
        key,
        alg === 'ECDH-ES' ? joseHeader.enc! : alg,
        alg === 'ECDH-ES' ? cekLength(joseHeader.enc!) : parseInt(alg.slice(-5, -2), 10),
        partyUInfo,
        partyVInfo,
      )

      if (alg === 'ECDH-ES') return sharedSecret

      // Key Agreement with Key Wrapping
      if (encryptedKey === undefined) throw new JWEInvalid('JWE Encrypted Key missing')

      return aeskw.unwrap(alg.slice(-6), sharedSecret, encryptedKey)
    }
    case 'RSA-OAEP':
    case 'RSA-OAEP-256':
    case 'RSA-OAEP-384':
    case 'RSA-OAEP-512': {
      // Key Encryption (RSA)
      if (encryptedKey === undefined) throw new JWEInvalid('JWE Encrypted Key missing')
      assertCryptoKey(key)
      return rsaes.decrypt(alg, key, encryptedKey)
    }
    case 'PBES2-HS256+A128KW':
    case 'PBES2-HS384+A192KW':
    case 'PBES2-HS512+A256KW': {
      // Key Encryption (PBES2)
      if (encryptedKey === undefined) throw new JWEInvalid('JWE Encrypted Key missing')

      if (typeof joseHeader.p2c !== 'number')
        throw new JWEInvalid(`JOSE Header "p2c" (PBES2 Count) missing or invalid`)

      const p2cLimit = options?.maxPBES2Count || 10_000

      if (joseHeader.p2c > p2cLimit)
        throw new JWEInvalid(`JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds`)

      if (typeof joseHeader.p2s !== 'string')
        throw new JWEInvalid(`JOSE Header "p2s" (PBES2 Salt) missing or invalid`)

      let p2s: Uint8Array
      try {
        p2s = base64url.decode(joseHeader.p2s)
      } catch {
        throw new JWEInvalid('Failed to base64url decode the p2s')
      }
      return pbes2kw.unwrap(alg, key, encryptedKey, joseHeader.p2c, p2s)
    }
    case 'A128KW':
    case 'A192KW':
    case 'A256KW': {
      // Key Wrapping (AES KW)
      if (encryptedKey === undefined) throw new JWEInvalid('JWE Encrypted Key missing')

      return aeskw.unwrap(alg, key, encryptedKey)
    }
    case 'A128GCMKW':
    case 'A192GCMKW':
    case 'A256GCMKW': {
      // Key Wrapping (AES GCM KW)
      if (encryptedKey === undefined) throw new JWEInvalid('JWE Encrypted Key missing')

      if (typeof joseHeader.iv !== 'string')
        throw new JWEInvalid(`JOSE Header "iv" (Initialization Vector) missing or invalid`)

      if (typeof joseHeader.tag !== 'string')
        throw new JWEInvalid(`JOSE Header "tag" (Authentication Tag) missing or invalid`)

      let iv: Uint8Array
      try {
        iv = base64url.decode(joseHeader.iv)
      } catch {
        throw new JWEInvalid('Failed to base64url decode the iv')
      }
      let tag: Uint8Array
      try {
        tag = base64url.decode(joseHeader.tag)
      } catch {
        throw new JWEInvalid('Failed to base64url decode the tag')
      }

      return aesGcmKw(alg, key, encryptedKey, iv, tag)
    }
    default: {
      throw new JOSENotSupported('Invalid or unsupported "alg" (JWE Algorithm) header value')
    }
  }
}
