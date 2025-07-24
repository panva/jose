/**
 * Asymmetric key generation
 *
 * @module
 */

import { JOSENotSupported } from '../util/errors.js'

import type * as types from '../types.d.ts'

/** Asymmetric key pair generation function result. */
export interface GenerateKeyPairResult {
  /** The generated Private Key. */
  privateKey: types.CryptoKey

  /** Public Key corresponding to the generated Private Key. */
  publicKey: types.CryptoKey
}

/** Asymmetric key pair generation function options. */
export interface GenerateKeyPairOptions {
  /**
   * The EC "crv" (Curve) or OKP "crv" (Subtype of Key Pair) value to generate. The curve must be
   * both supported on the runtime as well as applicable for the given JWA algorithm identifier.
   */
  crv?: string

  /**
   * A hint for RSA algorithms to generate an RSA key of a given `modulusLength` (Key size in bits).
   * JOSE requires 2048 bits or larger. Default is 2048.
   */
  modulusLength?: number

  /**
   * The value to use as {@link !SubtleCrypto.generateKey} `extractable` argument. Default is false.
   *
   * @example
   *
   * ```js
   * const { publicKey, privateKey } = await jose.generateKeyPair('PS256', {
   *   extractable: true,
   * })
   * console.log(await jose.exportJWK(privateKey))
   * console.log(await jose.exportPKCS8(privateKey))
   * ```
   */
  extractable?: boolean
}

function getModulusLengthOption(options?: GenerateKeyPairOptions) {
  const modulusLength = options?.modulusLength ?? 2048
  if (typeof modulusLength !== 'number' || modulusLength < 2048) {
    throw new JOSENotSupported(
      'Invalid or unsupported modulusLength option provided, 2048 bits or larger keys must be used',
    )
  }
  return modulusLength
}

/**
 * Generates a private and a public key for a given JWA algorithm identifier. This can only generate
 * asymmetric key pairs. For symmetric secrets use the `generateSecret` function.
 *
 * > [!NOTE]\
 * > The `privateKey` is generated with `extractable` set to `false` by default. See
 * > {@link GenerateKeyPairOptions.extractable} to generate an extractable `privateKey`.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/generate/keypair'`.
 *
 * @example
 *
 * ```js
 * const { publicKey, privateKey } = await jose.generateKeyPair('PS256')
 * console.log(publicKey)
 * console.log(privateKey)
 * ```
 *
 * @param alg JWA Algorithm Identifier to be used with the generated key pair. See
 *   {@link https://github.com/panva/jose/issues/210 Algorithm Key Requirements}.
 * @param options Additional options passed down to the key pair generation.
 */
export async function generateKeyPair(
  alg: string,
  options?: GenerateKeyPairOptions,
): Promise<GenerateKeyPairResult> {
  let algorithm: RsaHashedKeyGenParams | EcKeyGenParams | KeyAlgorithm
  let keyUsages: KeyUsage[]

  switch (alg) {
    case 'PS256':
    case 'PS384':
    case 'PS512':
      algorithm = {
        name: 'RSA-PSS',
        hash: `SHA-${alg.slice(-3)}`,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        modulusLength: getModulusLengthOption(options),
      }
      keyUsages = ['sign', 'verify']
      break
    case 'RS256':
    case 'RS384':
    case 'RS512':
      algorithm = {
        name: 'RSASSA-PKCS1-v1_5',
        hash: `SHA-${alg.slice(-3)}`,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        modulusLength: getModulusLengthOption(options),
      }
      keyUsages = ['sign', 'verify']
      break
    case 'RSA-OAEP':
    case 'RSA-OAEP-256':
    case 'RSA-OAEP-384':
    case 'RSA-OAEP-512':
      algorithm = {
        name: 'RSA-OAEP',
        hash: `SHA-${parseInt(alg.slice(-3), 10) || 1}`,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        modulusLength: getModulusLengthOption(options),
      }
      keyUsages = ['decrypt', 'unwrapKey', 'encrypt', 'wrapKey']
      break
    case 'ES256':
      algorithm = { name: 'ECDSA', namedCurve: 'P-256' }
      keyUsages = ['sign', 'verify']
      break
    case 'ES384':
      algorithm = { name: 'ECDSA', namedCurve: 'P-384' }
      keyUsages = ['sign', 'verify']
      break
    case 'ES512':
      algorithm = { name: 'ECDSA', namedCurve: 'P-521' }
      keyUsages = ['sign', 'verify']
      break
    case 'Ed25519': // Fall through
    case 'EdDSA': {
      keyUsages = ['sign', 'verify']
      algorithm = { name: 'Ed25519' }
      break
    }
    case 'ML-DSA-44':
    case 'ML-DSA-65':
    case 'ML-DSA-87': {
      keyUsages = ['sign', 'verify']
      algorithm = { name: alg }
      break
    }
    case 'ECDH-ES':
    case 'ECDH-ES+A128KW':
    case 'ECDH-ES+A192KW':
    case 'ECDH-ES+A256KW': {
      keyUsages = ['deriveBits']
      const crv = options?.crv ?? 'P-256'
      switch (crv) {
        case 'P-256':
        case 'P-384':
        case 'P-521': {
          algorithm = { name: 'ECDH', namedCurve: crv }
          break
        }
        case 'X25519':
          algorithm = { name: 'X25519' }
          break
        default:
          throw new JOSENotSupported(
            'Invalid or unsupported crv option provided, supported values are P-256, P-384, P-521, and X25519',
          )
      }
      break
    }
    default:
      throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')
  }

  return crypto.subtle.generateKey(
    algorithm,
    options?.extractable ?? false,
    keyUsages,
  ) as Promise<GenerateKeyPairResult>
}
