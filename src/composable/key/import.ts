/** Composable cryptographic key import functions. @module */

import type * as types from '../../types.d.ts'
import type { ImportedJWK, KeyImportOptions } from '../../key/import.js'
import type {
  AlgorithmFactory,
  AlgorithmOf,
  KeyImportAlgorithmSelection,
  UniqueAlgorithmFactories,
} from '../../algorithms/types.js'
import { loadKeyAlgorithms, resolveKeyAlgorithm } from '../../lib/key_algorithm.js'
import {
  importJWKWithResolver,
  importPKCS8WithResolver,
  importSPKIWithResolver,
  importX509WithResolver,
} from '../../lib/key_import.js'
import { JOSENotSupported } from '../../util/errors.js'

/** Key import functions restricted to the algorithms selected by {@link composeKeyImport}. */
export interface ComposedKeyImport<Algorithm extends string> {
  readonly importSPKI: (
    spki: string,
    alg: Algorithm,
    options?: KeyImportOptions,
  ) => Promise<types.CryptoKey>
  readonly importX509: (
    x509: string,
    alg: Algorithm,
    options?: KeyImportOptions,
  ) => Promise<types.CryptoKey>
  readonly importPKCS8: (
    pkcs8: string,
    alg: Algorithm,
    options?: KeyImportOptions,
  ) => Promise<types.CryptoKey>
  readonly importJWK: <JWKType extends types.JWK>(
    jwk: JWKType,
    alg?: Algorithm,
    options?: KeyImportOptions,
  ) => Promise<ImportedJWK<JWKType>>
}

/**
 * Composes key import functions from one or more key algorithm factories.
 *
 * @example
 *
 * ```js
 * import { Ed25519, ES256 } from 'jose/algorithms/key'
 * import { composeKeyImport } from 'jose/composable/key/import'
 *
 * const { importPKCS8, importSPKI } = composeKeyImport(Ed25519, ES256)
 * const privateKey = await importPKCS8(pkcs8, 'Ed25519')
 * const publicKey = await importSPKI(spki, 'ES256')
 * ```
 */
export function composeKeyImport<const Factories extends KeyImportAlgorithmSelection>(
  ...factories: Factories & UniqueAlgorithmFactories<Factories>
): ComposedKeyImport<AlgorithmOf<Factories>> {
  const capabilities = loadKeyAlgorithms(factories as readonly AlgorithmFactory[], 1)
  const resolve = (alg: unknown, source?: string) => resolveKeyAlgorithm(capabilities, alg, source)
  const validateOct = (alg: string | undefined, jwkAlg: string | undefined) => {
    if (jwkAlg !== undefined && alg !== jwkAlg) {
      throw new TypeError('JWK alg and alg option value mismatch')
    }
    if (!resolve(alg).secret) {
      throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')
    }
  }

  return Object.freeze({
    importSPKI: (spki: string, alg: string, options?: KeyImportOptions) =>
      importSPKIWithResolver(spki, alg, options, resolve),
    importX509: (x509: string, alg: string, options?: KeyImportOptions) =>
      importX509WithResolver(x509, alg, options, resolve),
    importPKCS8: (pkcs8: string, alg: string, options?: KeyImportOptions) =>
      importPKCS8WithResolver(pkcs8, alg, options, resolve),
    importJWK: (jwk: types.JWK, alg?: string, options?: KeyImportOptions) =>
      importJWKWithResolver(jwk, alg, options, resolve, validateOct),
  }) as ComposedKeyImport<AlgorithmOf<Factories>>
}
