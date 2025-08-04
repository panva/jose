/**
 * Cryptographic key import functions
 *
 * @module
 */

import { decode as decodeBase64URL } from '../util/base64url.js'
import { fromSPKI, fromPKCS8, fromX509 } from '../lib/asn1.js'
import toCryptoKey from '../lib/jwk_to_key.js'

import { JOSENotSupported } from '../util/errors.js'
import isObject from '../lib/is_object.js'
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
 * > [!NOTE]\
 * > The OID id-RSASSA-PSS (1.2.840.113549.1.1.10) is not supported in
 * > {@link https://w3c.github.io/webcrypto/ Web Cryptography API}, use the OID rsaEncryption
 * > (1.2.840.113549.1.1.1) instead for all RSA algorithms.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/key/import'`.
 *
 * @example
 *
 * ```js
 * const algorithm = 'ES256'
 * const spki = `-----BEGIN PUBLIC KEY-----
 * MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEFlHHWfLk0gLBbsLTcuCrbCqoHqmM
 * YJepMC+Q+Dd6RBmBiA41evUsNMwLeN+PNFqib+xwi9JkJ8qhZkq8Y/IzGg==
 * -----END PUBLIC KEY-----`
 * const ecPublicKey = await jose.importSPKI(spki, algorithm)
 * ```
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
 * > [!NOTE]\
 * > The OID id-RSASSA-PSS (1.2.840.113549.1.1.10) is not supported in
 * > {@link https://w3c.github.io/webcrypto/ Web Cryptography API}, use the OID rsaEncryption
 * > (1.2.840.113549.1.1.1) instead for all RSA algorithms.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/key/import'`.
 *
 * @example
 *
 * ```js
 * const algorithm = 'ES256'
 * const x509 = `-----BEGIN CERTIFICATE-----
 * MIIBXjCCAQSgAwIBAgIGAXvykuMKMAoGCCqGSM49BAMCMDYxNDAyBgNVBAMMK3Np
 * QXBNOXpBdk1VaXhXVWVGaGtjZXg1NjJRRzFyQUhXaV96UlFQTVpQaG8wHhcNMjEw
 * OTE3MDcwNTE3WhcNMjIwNzE0MDcwNTE3WjA2MTQwMgYDVQQDDCtzaUFwTTl6QXZN
 * VWl4V1VlRmhrY2V4NTYyUUcxckFIV2lfelJRUE1aUGhvMFkwEwYHKoZIzj0CAQYI
 * KoZIzj0DAQcDQgAE8PbPvCv5D5xBFHEZlBp/q5OEUymq7RIgWIi7tkl9aGSpYE35
 * UH+kBKDnphJO3odpPZ5gvgKs2nwRWcrDnUjYLDAKBggqhkjOPQQDAgNIADBFAiEA
 * 1yyMTRe66MhEXID9+uVub7woMkNYd0LhSHwKSPMUUTkCIFQGsfm1ecXOpeGOufAh
 * v+A1QWZMuTWqYt+uh/YSRNDn
 * -----END CERTIFICATE-----`
 * const ecPublicKey = await jose.importX509(x509, algorithm)
 * ```
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
 * > [!NOTE]\
 * > The OID id-RSASSA-PSS (1.2.840.113549.1.1.10) is not supported in
 * > {@link https://w3c.github.io/webcrypto/ Web Cryptography API}, use the OID rsaEncryption
 * > (1.2.840.113549.1.1.1) instead for all RSA algorithms.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/key/import'`.
 *
 * @example
 *
 * ```js
 * const algorithm = 'ES256'
 * const pkcs8 = `-----BEGIN PRIVATE KEY-----
 * MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgiyvo0X+VQ0yIrOaN
 * nlrnUclopnvuuMfoc8HHly3505OhRANCAAQWUcdZ8uTSAsFuwtNy4KtsKqgeqYxg
 * l6kwL5D4N3pEGYGIDjV69Sw0zAt43480WqJv7HCL0mQnyqFmSrxj8jMa
 * -----END PRIVATE KEY-----`
 * const ecPrivateKey = await jose.importPKCS8(pkcs8, algorithm)
 * ```
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
 * > [!NOTE]\
 * > The JSON Web Key parameters "use", "key_ops", and "ext" are also used in the {@link !CryptoKey}
 * > import process.
 *
 * > [!NOTE]\
 * > Symmetric JSON Web Keys (i.e. `kty: "oct"`) yield back an {@link !Uint8Array} instead of a
 * > {@link !CryptoKey}.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/key/import'`.
 *
 * @example
 *
 * ```js
 * const ecPublicKey = await jose.importJWK(
 *   {
 *     crv: 'P-256',
 *     kty: 'EC',
 *     x: 'ySK38C1jBdLwDsNWKzzBHqKYEE5Cgv-qjWvorUXk9fw',
 *     y: '_LeQBw07cf5t57Iavn4j-BqJsAD1dpoz8gokd3sBsOo',
 *   },
 *   'ES256',
 * )
 *
 * const rsaPublicKey = await jose.importJWK(
 *   {
 *     kty: 'RSA',
 *     e: 'AQAB',
 *     n: '12oBZRhCiZFJLcPg59LkZZ9mdhSMTKAQZYq32k_ti5SBB6jerkh-WzOMAO664r_qyLkqHUSp3u5SbXtseZEpN3XPWGKSxjsy-1JyEFTdLSYe6f9gfrmxkUF_7DTpq0gn6rntP05g2-wFW50YO7mosfdslfrTJYWHFhJALabAeYirYD7-9kqq9ebfFMF4sRRELbv9oi36As6Q9B3Qb5_C1rAzqfao_PCsf9EPsTZsVVVkA5qoIAr47lo1ipfiBPxUCCNSdvkmDTYgvvRm6ZoMjFbvOtgyts55fXKdMWv7I9HMD5HwE9uW839PWA514qhbcIsXEYSFMPMV6fnlsiZvQQ',
 *   },
 *   'PS256',
 * )
 * ```
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
      return toCryptoKey({ ...jwk, alg, ext })
    case 'AKP': {
      if (typeof jwk.alg !== 'string' || !jwk.alg) {
        throw new TypeError('missing "alg" (Algorithm) Parameter value')
      }
      if (alg !== undefined && alg !== jwk.alg) {
        throw new TypeError('JWK alg and alg option value mismatch')
      }
      return toCryptoKey({ ...jwk, ext })
    }
    case 'EC':
    case 'OKP':
      return toCryptoKey({ ...jwk, alg, ext })
    default:
      throw new JOSENotSupported('Unsupported "kty" (Key Type) Parameter value')
  }
}
