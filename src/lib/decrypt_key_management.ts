import type { JWEHeaderParameters, KeyLike } from '../types.d'
import type { JWEKeyManagementHeaderResults } from '../types.i.d'
import { JOSENotSupported, JWEInvalid } from '../util/errors.js'
import { unwrap as aesKw } from '../runtime/aeskw.js'
import * as ECDH from '../runtime/ecdhes.js'
import { decrypt as pbes2Kw } from '../runtime/pbes2kw.js'
import { decrypt as rsaEs } from '../runtime/rsaes.js'
import { unwrap as aesGcmKw } from '../runtime/aesgcmkw.js'
import { decode as base64url } from '../runtime/base64url.js'
import { bitLengths as cekLengths } from '../lib/cek.js'

function assertEnryptedKey(encryptedKey: any) {
  if (!encryptedKey) {
    throw new JWEInvalid('JWE Encrypted Key missing')
  }
}

function assertHeaderParameter(
  joseHeader: { [propName: string]: any },
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
    // eslint-disable-next-line no-fallthrough
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
      const ephemeralKey = await ECDH.publicJwkToEphemeralKey(joseHeader.epk!)
      let partyUInfo!: Uint8Array
      let partyVInfo!: Uint8Array
      if (joseHeader.apu !== undefined) partyUInfo = base64url(joseHeader.apu)
      if (joseHeader.apv !== undefined) partyVInfo = base64url(joseHeader.apv)
      const sharedSecret = await ECDH.deriveKey(
        ephemeralKey,
        key,
        alg === 'ECDH-ES' ? joseHeader.enc! : alg,
        parseInt(alg.substr(-5, 3), 10) || (cekLengths.get(joseHeader.enc!) as number),
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
      throw new JOSENotSupported('unsupported or invalid "alg" (JWE Algorithm) header value')
    }
  }
}

export default decryptKeyManagement
