/**
 * Verification using a JWK Embedded in a JWS Header
 *
 * @module
 */

import type * as types from '../types.d.ts'
import { jwkToKey, normalizeJwk } from '../lib/key.js'
import { jwsAlgorithm } from '../lib/jws_algorithms.js'
import { isObject } from '../lib/validate.js'
import { JWSInvalid } from '../util/errors.js'

/**
 * Resolves a verification key from an embedded "jwk" (JSON Web Key) Header Parameter.
 *
 * This {@link types.GetKeyFunction GetKeyFunction} opts JWS and JWT verification into trusting a
 * public key supplied by the token. Combine it with the verify function's `algorithms` option to
 * define the accepted JWS "alg" (Algorithm) Header Parameter values.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/jwk/embedded'`.
 *
 * @example
 *
 * ```js
 * const jwt =
 *   'eyJqd2siOnsiY3J2IjoiUC0yNTYiLCJ4IjoiVU05ZzVuS25aWFlvdldBbE03NmNMejl2VG96UmpfX0NIVV9kT2wtZ09vRSIsInkiOiJkczhhZVF3MWwyY0RDQTdiQ2tPTnZ3REtwWEFidFhqdnFDbGVZSDhXc19VIiwia3R5IjoiRUMifSwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJ1cm46ZXhhbXBsZTppc3N1ZXIiLCJhdWQiOiJ1cm46ZXhhbXBsZTphdWRpZW5jZSIsImlhdCI6MTYwNDU4MDc5NH0.60boak3_dErnW47ZPty1C0nrjeVq86EN_eK0GOq6K8w2OA0thKoBxFK4j-NuU9yZ_A9UKGxPT_G87DladBaV9g'
 *
 * const { payload, protectedHeader } = await jose.jwtVerify(jwt, jose.EmbeddedJWK, {
 *   issuer: 'urn:example:issuer',
 *   audience: 'urn:example:audience',
 * })
 *
 * console.log(protectedHeader)
 * console.log(payload)
 * ```
 *
 * @param protectedHeader JWS Protected Header.
 * @param token The consumed JWS token.
 *
 * @returns The public key from the JWS "jwk" (JSON Web Key) Header Parameter.
 */
export async function EmbeddedJWK(
  protectedHeader?: types.JWSHeaderParameters,
  token?: types.FlattenedJWSInput,
): Promise<types.CryptoKey> {
  const joseHeader = {
    ...protectedHeader,
    ...token?.header,
  }
  if (!isObject(joseHeader.jwk)) {
    throw new JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a JSON object')
  }

  let jwk: types.JWK
  try {
    jwk = normalizeJwk(joseHeader.jwk)
  } catch (cause) {
    throw new JWSInvalid('Invalid Embedded JWK', { cause })
  }

  const entry = jwsAlgorithm(joseHeader.alg)
  if (jwk.use !== undefined && jwk.use !== 'sig') {
    throw new JWSInvalid('Invalid Embedded JWK, its "use" must be "sig" when present')
  }
  if (jwk.alg !== undefined && jwk.alg !== entry.alg) {
    throw new JWSInvalid(`Invalid Embedded JWK, its "alg" must be "${entry.alg}" when present`)
  }
  const key = await jwkToKey(entry, jwk, true)

  if (key.type !== 'public') {
    throw new JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a public key')
  }

  return key
}
