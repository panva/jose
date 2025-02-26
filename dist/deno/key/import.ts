/**
 * Cryptographic key import functions
 *
 * @module
 */

import { decode as decodeBase64URL } from '../util/base64url.ts'
import { fromSPKI, fromPKCS8, fromX509 } from '../lib/asn1.ts'
import toCryptoKey from '../lib/jwk_to_key.ts'

import { JOSENotSupported } from '../util/errors.ts'
import isObject from '../lib/is_object.ts'
import type * as types from '../types.d.ts'

/** Key Import Function options. */
export interface KeyImportOptions {
  /**
   * The value to use as {@link !SubtleCrypto.importKey} `extractable` argument. Default is false for
   * private keys, true otherwise.
   */
  extractable?: boolean
}

/**
 * Imports a PEM-encoded SPKI string as a {@link !CryptoKey}.
 *
 * Note: The OID id-RSASSA-PSS (1.2.840.113549.1.1.10) is not supported in
 * {@link https://w3c.github.io/webcrypto/ Web Cryptography API}, use the OID rsaEncryption
 * (1.2.840.113549.1.1.1) instead for all RSA algorithms.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/key/import'`.
 *
 * @param spki PEM-encoded SPKI string
 * @param alg JSON Web Algorithm identifier to be used with the imported key. See
 *   {@link https://github.com/panva/jose/issues/210 Algorithm Key Requirements}.
 */
export async function importSPKI(
  spki: string,
  alg: string,
  options?: KeyImportOptions,
): Promise<types.CryptoKey> {
  if (typeof spki !== 'string' || spki.indexOf('-----BEGIN PUBLIC KEY-----') !== 0) {
    throw new TypeError('"spki" must be SPKI formatted string')
  }
  return fromSPKI(spki, alg, options)
}

/**
 * Imports the SPKI from an X.509 string certificate as a {@link !CryptoKey}.
 *
 * Note: The OID id-RSASSA-PSS (1.2.840.113549.1.1.10) is not supported in
 * {@link https://w3c.github.io/webcrypto/ Web Cryptography API}, use the OID rsaEncryption
 * (1.2.840.113549.1.1.1) instead for all RSA algorithms.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/key/import'`.
 *
 * @param x509 X.509 certificate string
 * @param alg JSON Web Algorithm identifier to be used with the imported key. See
 *   {@link https://github.com/panva/jose/issues/210 Algorithm Key Requirements}.
 */
export async function importX509(
  x509: string,
  alg: string,
  options?: KeyImportOptions,
): Promise<types.CryptoKey> {
  if (typeof x509 !== 'string' || x509.indexOf('-----BEGIN CERTIFICATE-----') !== 0) {
    throw new TypeError('"x509" must be X.509 formatted string')
  }
  return fromX509(x509, alg, options)
}

/**
 * Imports a PEM-encoded PKCS#8 string as a {@link !CryptoKey}.
 *
 * Note: The OID id-RSASSA-PSS (1.2.840.113549.1.1.10) is not supported in
 * {@link https://w3c.github.io/webcrypto/ Web Cryptography API}, use the OID rsaEncryption
 * (1.2.840.113549.1.1.1) instead for all RSA algorithms.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/key/import'`.
 *
 * @param pkcs8 PEM-encoded PKCS#8 string
 * @param alg JSON Web Algorithm identifier to be used with the imported key. See
 *   {@link https://github.com/panva/jose/issues/210 Algorithm Key Requirements}.
 */
export async function importPKCS8(
  pkcs8: string,
  alg: string,
  options?: KeyImportOptions,
): Promise<types.CryptoKey> {
  if (typeof pkcs8 !== 'string' || pkcs8.indexOf('-----BEGIN PRIVATE KEY-----') !== 0) {
    throw new TypeError('"pkcs8" must be PKCS#8 formatted string')
  }
  return fromPKCS8(pkcs8, alg, options)
}

/**
 * Imports a JWK to a {@link !CryptoKey}. Either the JWK "alg" (Algorithm) Parameter, or the optional
 * "alg" argument, must be present for asymmetric JSON Web Key imports.
 *
 * Note: The JSON Web Key parameters "use", "key_ops", and "ext" are also used in the
 * {@link !CryptoKey} import process.
 *
 * Note: Symmetric JSON Web Keys (i.e. `kty: "oct"`) yield back an {@link !Uint8Array} instead of a
 * {@link !CryptoKey}.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/key/import'`.
 *
 * @param jwk JSON Web Key.
 * @param alg JSON Web Algorithm identifier to be used with the imported key. Default is the "alg"
 *   property on the JWK. See
 *   {@link https://github.com/panva/jose/issues/210 Algorithm Key Requirements}.
 */
export async function importJWK(
  jwk: types.JWK,
  alg?: string,
  options?: KeyImportOptions,
): Promise<types.CryptoKey | Uint8Array> {
  if (!isObject(jwk)) {
    throw new TypeError('JWK must be an object')
  }

  let ext: boolean | undefined

  alg ??= jwk.alg
  ext ??= options?.extractable ?? jwk.ext

  switch (jwk.kty) {
    case 'oct':
      if (typeof jwk.k !== 'string' || !jwk.k) {
        throw new TypeError('missing "k" (Key Value) Parameter value')
      }

      return decodeBase64URL(jwk.k)
    case 'RSA':
      if ('oth' in jwk && jwk.oth !== undefined) {
        throw new JOSENotSupported(
          'RSA JWK "oth" (Other Primes Info) Parameter value is not supported',
        )
      }
    case 'EC':
    case 'OKP':
      return toCryptoKey({ ...jwk, alg, ext })
    default:
      throw new JOSENotSupported('Unsupported "kty" (Key Type) Parameter value')
  }
}
