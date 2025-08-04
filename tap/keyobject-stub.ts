/// <reference types="node"/>

import { promisify } from 'node:util'
import * as crypto from 'node:crypto'
import { Buffer } from 'node:buffer'

const generate = promisify(crypto.generateKeyPair)

const stub: Pick<
  typeof import('../src/index.js'),
  'exportJWK' | 'generateKeyPair' | 'generateSecret' | 'importJWK'
> = {
  // @ts-expect-error
  exportJWK(key) {
    let k: crypto.KeyObject
    if (key instanceof Uint8Array) {
      k = crypto.createSecretKey(key)
    } else {
      // @ts-expect-error
      k = key
    }

    return (k as unknown as crypto.KeyObject).export({ format: 'jwk' })
  },
  // @ts-expect-error
  importJWK(jwk) {
    if (jwk.k) {
      return Buffer.from(jwk.k, 'base64url')
    }
    if (jwk.d || jwk.priv) {
      return crypto.createPrivateKey({ format: 'jwk', key: jwk as crypto.JsonWebKey })
    }
    return crypto.createPublicKey({ format: 'jwk', key: jwk as crypto.JsonWebKey })
  },
  // @ts-expect-error
  generateSecret(alg) {
    let length: number
    switch (alg) {
      case 'HS256':
      case 'HS384':
      case 'HS512':
      case 'A128CBC-HS256':
      case 'A192CBC-HS384':
      case 'A256CBC-HS512':
        length = parseInt(alg.slice(-3), 10)
        break
      case 'A128KW':
      case 'A192KW':
      case 'A256KW':
      case 'A128GCMKW':
      case 'A192GCMKW':
      case 'A256GCMKW':
      case 'A128GCM':
      case 'A192GCM':
      case 'A256GCM':
        length = parseInt(alg.slice(1, 4), 10)
        break
      default:
        throw new Error('unreachable')
    }

    return crypto.createSecretKey(crypto.randomBytes(length >> 3))
  },
  // @ts-expect-error
  async generateKeyPair(alg, options) {
    switch (alg) {
      case 'RS256':
      case 'RS384':
      case 'RS512':
      case 'PS256':
      case 'PS384':
      case 'PS512':
      case 'RSA-OAEP':
      case 'RSA-OAEP-256':
      case 'RSA-OAEP-384':
      case 'RSA-OAEP-512': {
        const modulusLength = options?.modulusLength ?? 2048
        const keypair = await generate('rsa', {
          modulusLength,
          publicExponent: 0x10001,
        })
        return keypair
      }
      case 'ES256':
        return generate('ec', { namedCurve: 'P-256' })
      case 'ES384':
        return generate('ec', { namedCurve: 'P-384' })
      case 'ES512':
        return generate('ec', { namedCurve: 'P-521' })
      case 'Ed25519': // Fall through
      case 'EdDSA':
        return generate('ed25519')
      case 'ECDH-ES':
      case 'ECDH-ES+A128KW':
      case 'ECDH-ES+A192KW':
      case 'ECDH-ES+A256KW': {
        const crv = options?.crv ?? 'P-256'
        switch (crv) {
          case 'P-256':
          case 'P-384':
          case 'P-521':
            return generate('ec', { namedCurve: crv })
          case 'X25519':
            return generate('x25519')
          default:
            Error('unreachable')
        }
      }
      case 'ML-DSA-44':
      case 'ML-DSA-65':
      case 'ML-DSA-87':
        return generate(alg.toLowerCase())
      default:
        Error('unreachable')
    }
  },
}

export { stub }
