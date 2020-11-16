import { decode as base64url } from '../runtime/base64url.js'
import asKeyObject from '../runtime/jwk_to_key.js'
import { JOSENotSupported } from '../util/errors.js'
import isObject from '../lib/is_object.js'
import type { JWK, KeyLike } from '../types.js'

/**
 * Converts a JWK to a runtime-specific key representation (KeyLike). Either
 * JWK "alg" (Algorithm) Parameter must be present or the optional "alg" argument. When
 * running on a platform using [Web Cryptography API](https://www.w3.org/TR/WebCryptoAPI/)
 * the jwk parameters "use", "key_ops", and "ext" are also used in the resulting `CryptoKey`.
 *
 * @param jwk JSON Web Key.
 * @param alg JSON Web Algorithm identifier to be used with the converted key.
 * Default is the "alg" property on the JWK.
 * @param octAsKeyObject Forces a symmetric key to be converted to a KeyObject or
 * CryptoKey. Default is true unless JWK "ext" (Extractable) is true.
 *
 * @example
 * ```
 * // ESM import
 * import parseJwk from 'jose/jwk/parse'
 * ```
 *
 * @example
 * ```
 * // CJS import
 * const { default: parseJwk } = require('jose/jwk/parse')
 * ```
 *
 * @example
 * ```
 * // usage
 * const ecPrivateKey = await parseJwk({
 *   alg: 'ES256',
 *   crv: 'P-256',
 *   kty: 'EC',
 *   d: 'VhsfgSRKcvHCGpLyygMbO_YpXc7bVKwi12KQTE4yOR4',
 *   x: 'ySK38C1jBdLwDsNWKzzBHqKYEE5Cgv-qjWvorUXk9fw',
 *   y: '_LeQBw07cf5t57Iavn4j-BqJsAD1dpoz8gokd3sBsOo'
 * })
 *
 * const rsaPublicKey = await parseJwk({
 *   kty: 'RSA',
 *   e: 'AQAB',
 *   n: '12oBZRhCiZFJLcPg59LkZZ9mdhSMTKAQZYq32k_ti5SBB6jerkh-WzOMAO664r_qyLkqHUSp3u5SbXtseZEpN3XPWGKSxjsy-1JyEFTdLSYe6f9gfrmxkUF_7DTpq0gn6rntP05g2-wFW50YO7mosfdslfrTJYWHFhJALabAeYirYD7-9kqq9ebfFMF4sRRELbv9oi36As6Q9B3Qb5_C1rAzqfao_PCsf9EPsTZsVVVkA5qoIAr47lo1ipfiBPxUCCNSdvkmDTYgvvRm6ZoMjFbvOtgyts55fXKdMWv7I9HMD5HwE9uW839PWA514qhbcIsXEYSFMPMV6fnlsiZvQQ'
 * }, 'PS256')
 * ```
 */
export default async function parseJwk(
  jwk: JWK,
  alg?: string,
  octAsKeyObject?: boolean,
): Promise<KeyLike> {
  if (!isObject(jwk)) {
    throw new TypeError('JWK must be an object')
  }

  // eslint-disable-next-line no-param-reassign
  alg ||= jwk.alg

  if (typeof alg !== 'string' || !alg) {
    throw new TypeError('"alg" argument is required when "jwk.alg" is not present')
  }

  switch (jwk.kty) {
    case 'oct':
      if (typeof jwk.k !== 'string' || !jwk.k) {
        throw new TypeError('missing "k" (Key Value) Parameter value')
      }

      // eslint-disable-next-line no-param-reassign, eqeqeq
      octAsKeyObject ??= jwk.ext !== true

      if (octAsKeyObject) {
        return asKeyObject({ ...jwk, alg, ext: false })
      }

      return base64url(jwk.k)
    case 'RSA':
      if (jwk.oth !== undefined) {
        throw new JOSENotSupported(
          'RSA JWK "oth" (Other Primes Info) Parameter value is unsupported',
        )
      }
    // eslint-disable-next-line no-fallthrough
    case 'EC':
    case 'OKP':
      return asKeyObject({ ...jwk, alg })
    default:
      throw new JOSENotSupported('unsupported "kty" (Key Type) Parameter value')
  }
}

export type { KeyLike, JWK }
