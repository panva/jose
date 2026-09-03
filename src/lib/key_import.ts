import { decode as decodeBase64URL } from '../util/base64url.js'
import { JOSENotSupported } from '../util/errors.js'
import type * as types from '../types.d.ts'
import type { KeyImportOptions } from '../key/import.js'
import { fromSPKI, fromPKCS8, fromX509 } from './asn1.js'
import type { KeyDescriptor } from './key_descriptor.js'
import { normalizeJwk } from './jwk_metadata.js'
import { resolvedJwkToKey } from './jwk_to_key_resolved.js'
import { isObject, validateExtractableOption } from './type_checks.js'

export type KeyAlgorithmResolver = (alg: unknown, source?: string) => KeyDescriptor
type OctKeyValidator = (alg: string | undefined, jwkAlg: string | undefined) => void

export async function importSPKIWithResolver(
  spki: string,
  alg: string,
  options: KeyImportOptions | undefined,
  resolve: KeyAlgorithmResolver,
): Promise<types.CryptoKey> {
  if (typeof spki !== 'string' || spki.indexOf('-----BEGIN PUBLIC KEY-----') !== 0) {
    throw new TypeError('"spki" must be SPKI formatted string')
  }
  return fromSPKI(spki, () => resolve(alg, '"alg" (Algorithm)'), options)
}

export async function importX509WithResolver(
  x509: string,
  alg: string,
  options: KeyImportOptions | undefined,
  resolve: KeyAlgorithmResolver,
): Promise<types.CryptoKey> {
  if (typeof x509 !== 'string' || x509.indexOf('-----BEGIN CERTIFICATE-----') !== 0) {
    throw new TypeError('"x509" must be X.509 formatted string')
  }
  return fromX509(x509, () => resolve(alg, '"alg" (Algorithm)'), options)
}

export async function importPKCS8WithResolver(
  pkcs8: string,
  alg: string,
  options: KeyImportOptions | undefined,
  resolve: KeyAlgorithmResolver,
): Promise<types.CryptoKey> {
  if (typeof pkcs8 !== 'string' || pkcs8.indexOf('-----BEGIN PRIVATE KEY-----') !== 0) {
    throw new TypeError('"pkcs8" must be PKCS#8 formatted string')
  }
  return fromPKCS8(pkcs8, () => resolve(alg, '"alg" (Algorithm)'), options)
}

export async function importJWKWithResolver(
  jwk: types.JWK,
  alg: string | undefined,
  options: KeyImportOptions | undefined,
  resolve: KeyAlgorithmResolver,
  validateOct?: OctKeyValidator,
): Promise<types.CryptoKey | Uint8Array> {
  if (!isObject(jwk)) {
    throw new TypeError('JWK must be an object')
  }
  const normalized = normalizeJwk(jwk)
  const extractable = validateExtractableOption(options?.extractable)

  const { alg: jwkAlg } = normalized
  alg ??= jwkAlg
  const ext = extractable ?? normalized.ext

  if (normalized.kty !== 'oct' && !alg) {
    throw new TypeError('"alg" argument is required when "jwk.alg" is not present')
  }

  switch (normalized.kty) {
    case 'oct':
      if (typeof normalized.k !== 'string') {
        throw new TypeError('missing "k" (Key Value) Parameter value')
      }

      validateOct?.(alg, jwkAlg)
      return decodeBase64URL(normalized.k)
    case 'AKP': {
      if (typeof jwkAlg !== 'string' || !jwkAlg) {
        throw new TypeError('missing "alg" (Algorithm) Parameter value')
      }
      if (alg !== jwkAlg) {
        throw new TypeError('JWK alg and alg option value mismatch')
      }
      return resolvedJwkToKey(resolve(alg), { ...normalized, ext })
    }
    case 'RSA':
    case 'EC':
    case 'OKP':
      return resolvedJwkToKey(resolve(alg), { ...normalized, alg, ext })
    default:
      throw new JOSENotSupported('Unsupported "kty" (Key Type) Parameter value')
  }
}
