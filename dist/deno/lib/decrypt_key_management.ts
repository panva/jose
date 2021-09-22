import { unwrap as aesKw } from '../runtime/aeskw.ts'
import * as ECDH from '../runtime/ecdhes.ts'
import { decrypt as pbes2Kw } from '../runtime/pbes2kw.ts'
import { decrypt as rsaEs } from '../runtime/rsaes.ts'
import { unwrap as aesGcmKw } from '../runtime/aesgcmkw.ts'
import { decode as base64url } from '../runtime/base64url.ts'

import type { JWEHeaderParameters, KeyLike } from '../types.d.ts'
import type { JWEKeyManagementHeaderResults } from '../types.i.d.ts'
import { JOSENotSupported, JWEInvalid } from '../util/errors.ts'
import { bitLengths as cekLengths } from '../lib/cek.ts'
import { parseJwk } from '../jwk/parse.ts'
import checkKeyType from './check_key_type.ts'

function assertEnryptedKey(encryptedKey: unknown) {
  if (!encryptedKey) {
    throw new JWEInvalid('JWE Encrypted Key missing')
  }
}

function assertHeaderParameter(
  joseHeader: { [propName: string]: unknown },
  parameter: string,
  name: string,
) {
  if (joseHeader[parameter] === undefined) {
    throw new JWEInvalid(`JOSE Header ${name} (${parameter}) missing`)
  }
}

async function decryptKeyManagement(
  alg: string,
  key: KeyLike,
  encryptedKey: Uint8Array | undefined,
  joseHeader: JWEKeyManagementHeaderResults & JWEHeaderParameters,
): Promise<KeyLike> {
  checkKeyType(alg, key, 'decrypt')

  switch (alg) {
    case 'dir': {
      // Direct Encryption
      if (encryptedKey !== undefined) {
        throw new JWEInvalid('Encountered unexpected JWE Encrypted Key')
      }
      return key
    }
    case 'ECDH-ES':
      // Direct Key Agreement
      if (encryptedKey !== undefined) {
        throw new JWEInvalid('Encountered unexpected JWE Encrypted Key')
      }
    case 'ECDH-ES+A128KW':
    case 'ECDH-ES+A192KW':
    case 'ECDH-ES+A256KW': {
      // Direct Key Agreement
      assertHeaderParameter(joseHeader, 'epk', 'Ephemeral Public Key')
      if (!ECDH.ecdhAllowed(key)) {
        throw new JOSENotSupported(
          'ECDH-ES with the provided key is not allowed or not supported by your javascript runtime',
        )
      }
      const epk = await parseJwk(joseHeader.epk!, alg)
      let partyUInfo!: Uint8Array
      let partyVInfo!: Uint8Array
      if (joseHeader.apu !== undefined) partyUInfo = base64url(joseHeader.apu)
      if (joseHeader.apv !== undefined) partyVInfo = base64url(joseHeader.apv)
      const sharedSecret = await ECDH.deriveKey(
        epk,
        key,
        alg === 'ECDH-ES' ? joseHeader.enc! : alg,
        parseInt(alg.substr(-5, 3), 10) || <number>cekLengths.get(joseHeader.enc!),
        partyUInfo,
        partyVInfo,
      )

      if (alg === 'ECDH-ES') {
        return sharedSecret
      }

      // Key Agreement with Key Wrapping
      assertEnryptedKey(encryptedKey)
      const kwAlg = alg.substr(-6)
      return aesKw(kwAlg, sharedSecret, encryptedKey!)
    }
    case 'RSA1_5':
    case 'RSA-OAEP':
    case 'RSA-OAEP-256':
    case 'RSA-OAEP-384':
    case 'RSA-OAEP-512': {
      // Key Encryption (RSA)
      assertEnryptedKey(encryptedKey)
      return rsaEs(alg, key, encryptedKey!)
    }
    case 'PBES2-HS256+A128KW':
    case 'PBES2-HS384+A192KW':
    case 'PBES2-HS512+A256KW': {
      // Key Encryption (PBES2)
      assertEnryptedKey(encryptedKey)
      assertHeaderParameter(joseHeader, 'p2c', 'PBES2 Count')
      assertHeaderParameter(joseHeader, 'p2s', 'PBES2 Salt')
      const { p2c } = joseHeader
      const p2s = base64url(joseHeader.p2s!)
      return pbes2Kw(alg, key, encryptedKey!, p2c!, p2s)
    }
    case 'A128KW':
    case 'A192KW':
    case 'A256KW': {
      // Key Wrapping (AES KW)
      assertEnryptedKey(encryptedKey)
      return aesKw(alg, key, encryptedKey!)
    }
    case 'A128GCMKW':
    case 'A192GCMKW':
    case 'A256GCMKW': {
      // Key Wrapping (AES GCM KW)
      assertEnryptedKey(encryptedKey)
      assertHeaderParameter(joseHeader, 'iv', 'Initialization Vector')
      assertHeaderParameter(joseHeader, 'tag', 'Authentication Tag')
      const iv = base64url(joseHeader.iv!)
      const tag = base64url(joseHeader.tag!)
      return aesGcmKw(alg, key, encryptedKey!, iv, tag)
    }
    default: {
      throw new JOSENotSupported('Invalid or unsupported "alg" (JWE Algorithm) header value')
    }
  }
}

export default decryptKeyManagement
