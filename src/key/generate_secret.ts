/**
 * Symmetric key generation
 *
 * @module
 */

import { unsupportedAlg, algArgument } from '../lib/key_algorithm.js'
import { validateExtractableOption } from '../lib/key.js'

import type * as types from '../types.d.ts'

/**
 * Algorithms supported by {@link generateSecret}, subject to runtime support.
 *
 * @ignore
 */
export type GenerateSecretAlgorithm =
  | 'HS256'
  | 'HS384'
  | 'HS512'
  | 'A128CBC-HS256'
  | 'A192CBC-HS384'
  | 'A256CBC-HS512'
  | 'A128KW'
  | 'A192KW'
  | 'A256KW'
  | 'A128GCMKW'
  | 'A192GCMKW'
  | 'A256GCMKW'
  | 'A128GCM'
  | 'A192GCM'
  | 'A256GCM'
  | (string & {})

/**
 * Maps a JWA algorithm identifier to the value returned by {@link generateSecret}. AES-CBC-HMAC
 * algorithms return {@link !Uint8Array}; other supported algorithms return
 * {@link types.CryptoKey CryptoKey}. When the algorithm is not statically known, the result is their
 * union.
 */
export type GeneratedSecret<Alg extends string> = Alg extends
  'A128CBC-HS256' | 'A192CBC-HS384' | 'A256CBC-HS512'
  ? Uint8Array
  : string extends Alg
    ? types.CryptoKey | Uint8Array
    : types.CryptoKey

/** Secret generation options. */
export interface GenerateSecretOptions {
  /**
   * Whether the generated CryptoKey is extractable. Defaults to false; has no effect for
   * A128CBC-HS256, A192CBC-HS384, and A256CBC-HS512, which return raw bytes.
   */
  extractable?: boolean
}

/**
 * Generates a symmetric secret key for a given JWA algorithm identifier.
 *
 * > [!NOTE]\
 * > The secret key is generated with `extractable` set to `false` by default.
 *
 * > [!NOTE]\
 * > A128CBC-HS256, A192CBC-HS384, and A256CBC-HS512 return {@link !Uint8Array} because these secrets
 * > have no CryptoKey representation.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/key/generate/secret'`.
 *
 * @example
 *
 * ```js
 * const secret = await jose.generateSecret('HS256')
 * console.log(secret)
 * ```
 *
 * @param alg JWA Algorithm Identifier to be used with the generated secret. See
 *   {@link https://github.com/panva/jose/issues/210 Algorithm Key Requirements}.
 * @param options Additional options passed down to the secret generation.
 */
export function generateSecret<Alg extends GenerateSecretAlgorithm>(
  alg: Alg,
  options?: GenerateSecretOptions,
): Promise<GeneratedSecret<Alg>>
export async function generateSecret(
  alg: string,
  options?: GenerateSecretOptions,
): Promise<types.CryptoKey | Uint8Array> {
  const extractable = validateExtractableOption(options?.extractable)
  let length: number
  let algorithm: AesKeyGenParams | HmacKeyGenParams
  let keyUsages: KeyUsage[]
  switch (alg) {
    case 'HS256':
    case 'HS384':
    case 'HS512':
      length = +alg.slice(-3)
      algorithm = { name: 'HMAC', hash: `SHA-${length}`, length }
      keyUsages = ['sign', 'verify']
      break
    case 'A128CBC-HS256':
    case 'A192CBC-HS384':
    case 'A256CBC-HS512':
      return crypto.getRandomValues(new Uint8Array(+alg.slice(-3) >> 3))
    case 'A128KW':
    case 'A192KW':
    case 'A256KW':
      length = +alg.slice(1, 4)
      algorithm = { name: 'AES-KW', length }
      keyUsages = ['wrapKey', 'unwrapKey']
      break
    case 'A128GCMKW':
    case 'A192GCMKW':
    case 'A256GCMKW':
    case 'A128GCM':
    case 'A192GCM':
    case 'A256GCM':
      length = +alg.slice(1, 4)
      algorithm = { name: 'AES-GCM', length }
      keyUsages = ['encrypt', 'decrypt']
      break
    default:
      unsupportedAlg(algArgument)
  }

  return crypto.subtle.generateKey(algorithm, extractable ?? false, keyUsages)
}
