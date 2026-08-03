/**
 * Asymmetric key generation
 *
 * @module
 */

import { JOSENotSupported } from '../util/errors.js'
import { keyAlgorithm, unsupportedAlg, algArgument } from '../lib/key_algorithm.js'

import type * as types from '../types.d.ts'

/**
 * JWA Algorithm Identifiers that {@link generateKeyPair} is able to generate a key pair for, subject
 * to runtime support.
 *
 * @ignore
 */
export type GenerateKeyPairAlgorithm =
  | 'PS256'
  | 'PS384'
  | 'PS512'
  | 'RS256'
  | 'RS384'
  | 'RS512'
  | 'RSA-OAEP'
  | 'RSA-OAEP-256'
  | 'RSA-OAEP-384'
  | 'RSA-OAEP-512'
  | 'ES256'
  | 'ES384'
  | 'ES512'
  | 'Ed25519'
  | 'EdDSA'
  | 'ML-DSA-44'
  | 'ML-DSA-65'
  | 'ML-DSA-87'
  | 'ECDH-ES'
  | 'ECDH-ES+A128KW'
  | 'ECDH-ES+A192KW'
  | 'ECDH-ES+A256KW'
  | (string & {})

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
 * as from its subpath export `'jose/key/generate/keypair'`.
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
  alg: GenerateKeyPairAlgorithm,
  options?: GenerateKeyPairOptions,
): Promise<GenerateKeyPairResult> {
  const entry = keyAlgorithm(alg, algArgument)

  if (entry.secret) {
    unsupportedAlg(algArgument)
  }

  let algorithm: RsaHashedKeyGenParams | EcKeyGenParams | KeyAlgorithm

  if (entry.resolve) {
    // ECDH-ES takes its curve from the option rather than from the identifier.
    const crv = options?.crv ?? 'P-256'
    switch (crv) {
      case 'P-256':
      case 'P-384':
      case 'P-521':
        algorithm = { name: 'ECDH', namedCurve: crv }
        break
      case 'X25519':
        algorithm = { name: 'X25519' }
        break
      default:
        throw new JOSENotSupported(
          'Invalid or unsupported crv option provided, supported values are P-256, P-384, P-521, and X25519',
        )
    }
  } else {
    if (entry.crv !== undefined && options?.crv !== undefined && options.crv !== entry.crv) {
      throw new JOSENotSupported(
        `Invalid or unsupported crv option provided, the only supported value for ${alg} is ${entry.crv}`,
      )
    }

    algorithm =
      entry.kty[0] === 'RSA'
        ? {
            ...(entry.subtle as RsaHashedKeyGenParams),
            publicExponent: Uint8Array.of(0x01, 0x00, 0x01),
            modulusLength: getModulusLengthOption(options),
          }
        : entry.subtle
  }

  return crypto.subtle.generateKey(algorithm, options?.extractable ?? false, [
    ...entry.usages[1],
    ...entry.usages[0],
  ]) as Promise<GenerateKeyPairResult>
}
