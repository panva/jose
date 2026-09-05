/**
 * Asymmetric key generation
 *
 * @module
 */

import { JOSENotSupported } from '../util/errors.js'
import { validateExtractableOption } from '../lib/key.js'
import { keyAlgorithm, unsupportedAlg, algArgument } from '../lib/key_algorithm.js'

import type * as types from '../types.d.ts'

/**
 * Algorithms supported by {@link generateKeyPair}, subject to runtime support.
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

/** Generated asymmetric key pair. */
export interface GenerateKeyPairResult {
  privateKey: types.CryptoKey

  publicKey: types.CryptoKey
}

/** Asymmetric key pair generation options. */
export interface GenerateKeyPairOptions {
  /**
   * EC curve or OKP key subtype. Must be supported by the algorithm and runtime. ECDH-ES defaults
   * to P-256.
   */
  crv?: string

  /** RSA modulus length in bits. Must be an integer of at least 2048; defaults to 2048. */
  modulusLength?: number

  /**
   * Whether the private key is extractable. Defaults to false; the public key is always
   * extractable.
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
  if (
    typeof modulusLength !== 'number' ||
    !Number.isInteger(modulusLength) ||
    modulusLength < 2048
  ) {
    throw new JOSENotSupported(
      'Invalid or unsupported modulusLength option provided, 2048 bits or larger keys must be used',
    )
  }
  return modulusLength
}

/**
 * Generates an asymmetric key pair for a JWA algorithm identifier.
 *
 * For symmetric secrets use the {@link key/generate_secret.generateSecret generateSecret} function.
 *
 * > [!NOTE]\
 * > Private keys are not extractable by default. Set {@link GenerateKeyPairOptions.extractable} to
 * > export them; public keys are always extractable.
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
  const extractable = validateExtractableOption(options?.extractable)
  const entry = keyAlgorithm(alg, algArgument)

  if (entry.secret) {
    unsupportedAlg(algArgument)
  }

  let algorithm: RsaHashedKeyGenParams | EcKeyGenParams | KeyAlgorithm

  if (entry.resolve) {
    // ECDH-ES takes its curve from the option rather than from the identifier.
    const crv = options?.crv ?? 'P-256'
    if (!['P-256', 'P-384', 'P-521', 'X25519'].includes(crv)) {
      throw new JOSENotSupported(
        'Invalid or unsupported crv option provided, supported values are P-256, P-384, P-521, and X25519',
      )
    }
    algorithm = entry.resolve({ crv })
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

  return crypto.subtle.generateKey(algorithm, extractable ?? false, [
    ...entry.usages[1],
    ...entry.usages[0],
  ]) as Promise<GenerateKeyPairResult>
}
