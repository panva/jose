/**
 * JSON Web Key Thumbprint and JSON Web Key Thumbprint URI
 *
 * @module
 */

import { digest } from '../lib/digest.ts'
import { encode as b64u } from '../util/base64url.ts'

import { JOSENotSupported, JWKInvalid } from '../util/errors.ts'
import { encode } from '../lib/buffer_utils.ts'
import type * as types from '../types.d.ts'
import { isKeyLike } from '../lib/is_key_like.ts'
import { isJWK } from '../lib/is_jwk.ts'
import { exportJWK } from '../key/export.ts'
import { invalidKeyInput } from '../lib/invalid_key_input.ts'

const check = (value: unknown, description: string) => {
  if (typeof value !== 'string' || !value) {
    throw new JWKInvalid(`${description} missing or invalid`)
  }
}

/**
 * Calculates a base64url-encoded JSON Web Key (JWK) Thumbprint
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/jwk/thumbprint'`.
 *
 * @param key Key to calculate the thumbprint for.
 * @param digestAlgorithm Digest Algorithm to use for calculating the thumbprint. Default is
 *   "sha256".
 *
 * @see {@link https://www.rfc-editor.org/rfc/rfc7638 RFC7638}
 */
export async function calculateJwkThumbprint(
  key: types.JWK | types.CryptoKey | types.KeyObject,
  digestAlgorithm?: 'sha256' | 'sha384' | 'sha512',
): Promise<string> {
  let jwk: types.JWK
  if (isJWK(key)) {
    jwk = key
  } else if (isKeyLike(key)) {
    jwk = await exportJWK(key)
  } else {
    throw new TypeError(invalidKeyInput(key, 'CryptoKey', 'KeyObject', 'JSON Web Key'))
  }

  digestAlgorithm ??= 'sha256'

  if (
    digestAlgorithm !== 'sha256' &&
    digestAlgorithm !== 'sha384' &&
    digestAlgorithm !== 'sha512'
  ) {
    throw new TypeError('digestAlgorithm must one of "sha256", "sha384", or "sha512"')
  }

  let components: types.JWK
  switch (jwk.kty) {
    case 'AKP':
      check(jwk.alg, '"alg" (Algorithm) Parameter')
      check(jwk.pub, '"pub" (Public key) Parameter')
      components = { alg: jwk.alg, kty: jwk.kty, pub: jwk.pub }
      break
    case 'EC':
      check(jwk.crv, '"crv" (Curve) Parameter')
      check(jwk.x, '"x" (X Coordinate) Parameter')
      check(jwk.y, '"y" (Y Coordinate) Parameter')
      components = { crv: jwk.crv, kty: jwk.kty, x: jwk.x, y: jwk.y }
      break
    case 'OKP':
      check(jwk.crv, '"crv" (Subtype of Key Pair) Parameter')
      check(jwk.x, '"x" (Public Key) Parameter')
      components = { crv: jwk.crv, kty: jwk.kty, x: jwk.x }
      break
    case 'RSA':
      check(jwk.e, '"e" (Exponent) Parameter')
      check(jwk.n, '"n" (Modulus) Parameter')
      components = { e: jwk.e, kty: jwk.kty, n: jwk.n }
      break
    case 'oct':
      check(jwk.k, '"k" (Key Value) Parameter')
      components = { k: jwk.k, kty: jwk.kty }
      break
    default:
      throw new JOSENotSupported('"kty" (Key Type) Parameter missing or unsupported')
  }

  const data = encode(JSON.stringify(components))
  return b64u(await digest(digestAlgorithm, data))
}

/**
 * Calculates a JSON Web Key (JWK) Thumbprint URI
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/jwk/thumbprint'`.
 *
 * @param key Key to calculate the thumbprint for.
 * @param digestAlgorithm Digest Algorithm to use for calculating the thumbprint. Default is
 *   "sha256".
 *
 * @see {@link https://www.rfc-editor.org/rfc/rfc9278 RFC9278}
 */
export async function calculateJwkThumbprintUri(
  key: types.CryptoKey | types.KeyObject | types.JWK,
  digestAlgorithm?: 'sha256' | 'sha384' | 'sha512',
): Promise<string> {
  digestAlgorithm ??= 'sha256'
  const thumbprint = await calculateJwkThumbprint(key, digestAlgorithm)
  return `urn:ietf:params:oauth:jwk-thumbprint:sha-${digestAlgorithm.slice(-3)}:${thumbprint}`
}
