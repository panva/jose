/**
 * HTTP Message Signature signing and verification primitives
 *
 * This functionality is exported exclusively from the `'jose/httpsig'` subpath.
 *
 * This module implements the `HTTP_SIGN` and `HTTP_VERIFY` cryptographic primitives defined in
 * {@link https://www.rfc-editor.org/info/rfc9421/#section-3.3 RFC 9421 Section 3.3}. Constructing
 * the signature base, resolving derived components, parsing and serializing Structured Fields,
 * producing the `Signature-Input` and `Signature` field values, calculating `Content-Digest`, and
 * enforcing component coverage, `created`, `expires`, `nonce`, `tag`, `keyid`, and replay policy
 * remain the application's responsibility.
 *
 * Both the identifiers from the IANA "HTTP Signature Algorithms" registry and the JSON Web
 * Signature algorithm identifiers supported by `jose` are accepted.
 *
 * @module
 *
 * @example
 *
 * ```js
 * import * as httpsig from 'jose/httpsig'
 *
 * // The signature base is constructed by the application per RFC 9421 Section 2.5
 * const data = new TextEncoder().encode(
 *   '"@method": POST\n' +
 *     '"@authority": example.com\n' +
 *     '"@signature-params": ("@method" "@authority");created=1618884473;keyid="my-key"',
 * )
 *
 * const signature = await httpsig.sign('ecdsa-p256-sha256', privateKey, data)
 *
 * const valid = await httpsig.verify('ecdsa-p256-sha256', publicKey, signature, data)
 * console.log(valid)
 * ```
 */

import type * as types from './types.d.ts'
import { invalidKeyInput } from './lib/invalid_key_input.js'
import { isCryptoKey } from './lib/is_key_like.js'
import { checkSigAlg, sign as jwsSign, verify as jwsVerify } from './lib/signing.js'
import { JOSENotSupported } from './util/errors.js'

// IANA "HTTP Signature Algorithms" registry identifiers and their JOSE equivalents
const registry: Record<string, string> = {
  // @ts-expect-error
  __proto__: null,
  'ecdsa-p256-sha256': 'ES256',
  'ecdsa-p384-sha384': 'ES384',
  ed25519: 'Ed25519',
  'hmac-sha256': 'HS256',
  'ml-dsa-44': 'ML-DSA-44',
  'ml-dsa-65': 'ML-DSA-65',
  'ml-dsa-87': 'ML-DSA-87',
  'rsa-pss-sha512': 'PS512',
  'rsa-v1_5-sha256': 'RS256',
}

function jwa(alg: unknown) {
  if (typeof alg !== 'string') {
    throw new TypeError('alg must be a string')
  }

  // JWS algorithm identifiers, permitted by RFC 9421 Section 3.3.7, are used as given
  const joseAlg = registry[alg] ?? alg

  try {
    checkSigAlg(joseAlg)
  } catch (err) {
    if (err instanceof JOSENotSupported) {
      throw new JOSENotSupported(`Unsupported HTTP Message Signature algorithm: ${alg}`)
    }
    throw err
  }

  return joseAlg
}

function checkBytes(value: unknown, name: string) {
  if (!(value instanceof Uint8Array)) {
    throw new TypeError(`${name} must be an instance of Uint8Array`)
  }
}

function checkKey(key: unknown) {
  if (!isCryptoKey(key)) {
    throw new TypeError(invalidKeyInput(key, 'CryptoKey'))
  }
}

function checkSignatureBase(data: Uint8Array) {
  checkBytes(data, 'data')

  if (data.some((byte) => byte > 127)) {
    throw new TypeError('data must only contain ASCII characters')
  }
}

/**
 * Produces the HTTP message signature for a given signature base, the `HTTP_SIGN` primitive defined
 * in {@link https://www.rfc-editor.org/info/rfc9421/#section-3.3 RFC 9421 Section 3.3}.
 *
 * This function is exported (as a named export) from its subpath export `'jose/httpsig'`.
 *
 * @example
 *
 * ```js
 * // The signature base is constructed by the application per RFC 9421 Section 2.5
 * const data = new TextEncoder().encode(
 *   '"@method": POST\n' +
 *     '"@authority": example.com\n' +
 *     '"@signature-params": ("@method" "@authority");created=1618884473;keyid="my-key"',
 * )
 *
 * const signature = await httpsig.sign('ecdsa-p256-sha256', privateKey, data)
 *
 * console.log(signature)
 * ```
 *
 * @param alg An identifier from the IANA "HTTP Signature Algorithms" registry, or a JWS `alg`
 *   (Algorithm) Header Parameter value supported by `jose`.
 * @param key Private Key or Secret to sign with.
 * @param data {@link https://www.rfc-editor.org/info/rfc9421/#section-2.5 The signature base}.
 *
 * @see {@link https://www.rfc-editor.org/info/rfc9421/ RFC9421}
 */
export async function sign(
  alg: string,
  key: types.CryptoKey,
  data: Uint8Array,
): Promise<Uint8Array> {
  const joseAlg = jwa(alg)
  checkKey(key)
  checkSignatureBase(data)
  return jwsSign(joseAlg, key, data)
}

/**
 * Verifies an HTTP message signature for a given signature base, the `HTTP_VERIFY` primitive
 * defined in {@link https://www.rfc-editor.org/info/rfc9421/#section-3.3 RFC 9421 Section 3.3}.
 *
 * This function is exported (as a named export) from its subpath export `'jose/httpsig'`.
 *
 * @example
 *
 * ```js
 * // The signature base is recreated by the application per RFC 9421 Section 2.5
 * const data = new TextEncoder().encode(
 *   '"@method": POST\n' +
 *     '"@authority": example.com\n' +
 *     '"@signature-params": ("@method" "@authority");created=1618884473;keyid="my-key"',
 * )
 *
 * const valid = await httpsig.verify('ecdsa-p256-sha256', publicKey, signature, data)
 *
 * console.log(valid)
 * ```
 *
 * @param alg An identifier from the IANA "HTTP Signature Algorithms" registry, or a JWS `alg`
 *   (Algorithm) Header Parameter value supported by `jose`.
 * @param key Public Key or Secret to verify with.
 * @param signature The HTTP message signature to verify.
 * @param data {@link https://www.rfc-editor.org/info/rfc9421/#section-2.5 The signature base}.
 *
 * @see {@link https://www.rfc-editor.org/info/rfc9421/ RFC9421}
 */
export async function verify(
  alg: string,
  key: types.CryptoKey,
  signature: Uint8Array,
  data: Uint8Array,
): Promise<boolean> {
  const joseAlg = jwa(alg)
  checkKey(key)
  checkBytes(signature, 'signature')
  checkSignatureBase(data)
  return jwsVerify(joseAlg, key, signature, data)
}
