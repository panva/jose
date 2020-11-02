/* eslint-disable jsdoc/require-param */
import type { KeyObject } from 'crypto'
import { FlattenedJWSInput, JWSHeaderParameters } from '../types.d'
import parseJwk from './parse.js'
import isObject from '../lib/is_object.js'
import { JWSInvalid } from '../util/errors.js'

/**
 * EmbeddedJWK is an implementation of a GetKeyFunction intended to be used with the
 * JWS/JWT verify operations whenever you need to opt-in to verify signatures with
 * a public key embedded in the token's "jwk" (JSON Web Key) Header Parameter.
 * It is recommended to combine this with the verify algorithms option to whitelist
 * JWS algorithms to accept.
 *
 * @example
 * ```
 * // ESM import
 * import EmbeddedJWK from 'jose/jwk/embedded'
 * ```
 *
 * @example
 * ```
 * // CJS import
 * const { default: EmbeddedJWK } = require('jose/jwk/embedded')
 * ```
 *
 * @example
 * ```
 * // usage
 * import jwtVerify from 'jose/jwt/verify'
 *
 * const jwt = 'eyJqd2siOnsiY3J2IjoiUC0yNTYiLCJ4IjoiVU05ZzVuS25aWFlvdldBbE03NmNMejl2VG96UmpfX0NIVV9kT2wtZ09vRSIsInkiOiJkczhhZVF3MWwyY0RDQTdiQ2tPTnZ3REtwWEFidFhqdnFDbGVZSDhXc19VIiwia3R5IjoiRUMifSwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJ1cm46ZXhhbXBsZTppc3N1ZXIiLCJhdWQiOiJ1cm46ZXhhbXBsZTphdWRpZW5jZSIsImlhdCI6MTYwNDU4MDc5NH0.60boak3_dErnW47ZPty1C0nrjeVq86EN_eK0GOq6K8w2OA0thKoBxFK4j-NuU9yZ_A9UKGxPT_G87DladBaV9g'
 *
 * const { payload, protectedHeader } = await jwtVerify(jwt, EmbeddedJWK, {
 *   issuer: 'urn:example:issuer',
 *   audience: 'urn:example:audience'
 * })
 *
 * console.log(protectedHeader)
 * console.log(payload)
 * ```
 */
export default async function EmbeddedJWK(
  protectedHeader: JWSHeaderParameters,
  token: FlattenedJWSInput,
) {
  const combinedHeader = {
    ...protectedHeader,
    ...token.header,
  }
  if (!isObject(combinedHeader.jwk)) {
    throw new JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a JSON object')
  }

  const key = (await parseJwk(combinedHeader.jwk!, combinedHeader.alg!, true)) as
    | CryptoKey
    | KeyObject

  if (key.type !== 'public') {
    throw new JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a public key')
  }

  return key
}
