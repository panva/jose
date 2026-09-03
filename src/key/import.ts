/**
 * Cryptographic key import functions
 *
 * @module
 */

import { keyAlgorithm } from '../lib/key_algorithm.js'

import type * as types from '../types.d.ts'
import {
  importJWKWithResolver,
  importPKCS8WithResolver,
  importSPKIWithResolver,
  importX509WithResolver,
} from '../lib/key_import.js'

/**
 * Resolves what {@link importJWK} returns for a given JWK type. The "kty" (Key Type) Parameter fully
 * determines the outcome at runtime: `"oct"` yields a {@link !Uint8Array} secret, every other
 * supported key type yields a {@link types.CryptoKey CryptoKey}. When "kty" is not statically known
 * — the usual case for a JWK parsed from JSON, or for a value typed as {@link types.JWK JWK} — this
 * resolves to their union.
 */
export type ImportedJWK<JWKType extends types.JWK> = JWKType extends { kty: 'oct' }
  ? Uint8Array
  : JWKType extends { kty: 'AKP' | 'EC' | 'OKP' | 'RSA' }
    ? types.CryptoKey
    : types.CryptoKey | Uint8Array

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
  return importSPKIWithResolver(spki, alg, options, keyAlgorithm)
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
  return importX509WithResolver(x509, alg, options, keyAlgorithm)
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
  return importPKCS8WithResolver(pkcs8, alg, options, keyAlgorithm)
}

/**
 * Imports a JWK to a {@link !CryptoKey}. Either the JWK "alg" (Algorithm) Parameter, or the optional
 * "alg" argument, must be present for asymmetric JSON Web Key imports.
 *
 * > [!NOTE]\
 * > The JSON Web Key parameters "key_ops" and "ext" are also used in the {@link !CryptoKey} import
 * > process.
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
export function importJWK<JWKType extends types.JWK>(
  jwk: JWKType,
  alg?: string,
  options?: KeyImportOptions,
): Promise<ImportedJWK<JWKType>>
export async function importJWK(
  jwk: types.JWK,
  alg?: string,
  options?: KeyImportOptions,
): Promise<types.CryptoKey | Uint8Array> {
  return importJWKWithResolver(jwk, alg, options, keyAlgorithm)
}
