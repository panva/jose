import type { FlattenedJWSInput, JWSHeaderParameters } from '../types.d.ts'
import { importJWK } from '../key/import.ts'
import isObject from '../lib/is_object.ts'
import { JWSInvalid } from '../util/errors.ts'

/**
 * EmbeddedJWK is an implementation of a GetKeyFunction intended to be used with the
 * JWS/JWT verify operations whenever you need to opt-in to verify signatures with
 * a public key embedded in the token's "jwk" (JSON Web Key) Header Parameter.
 * It is recommended to combine this with the verify algorithms option to whitelist
 * JWS algorithms to accept.
 *
 * @example Usage
 * ```js
 * const jwt = 'eyJqd2siOnsiY3J2IjoiUC0yNTYiLCJ4IjoiVU05ZzVuS25aWFlvdldBbE03NmNMejl2VG96UmpfX0NIVV9kT2wtZ09vRSIsInkiOiJkczhhZVF3MWwyY0RDQTdiQ2tPTnZ3REtwWEFidFhqdnFDbGVZSDhXc19VIiwia3R5IjoiRUMifSwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJ1cm46ZXhhbXBsZTppc3N1ZXIiLCJhdWQiOiJ1cm46ZXhhbXBsZTphdWRpZW5jZSIsImlhdCI6MTYwNDU4MDc5NH0.60boak3_dErnW47ZPty1C0nrjeVq86EN_eK0GOq6K8w2OA0thKoBxFK4j-NuU9yZ_A9UKGxPT_G87DladBaV9g'
 *
 * const { payload, protectedHeader } = await jose.jwtVerify(jwt, jose.EmbeddedJWK, {
 *   issuer: 'urn:example:issuer',
 *   audience: 'urn:example:audience'
 * })
 *
 * console.log(protectedHeader)
 * console.log(payload)
 * ```
 */
export async function EmbeddedJWK(protectedHeader: JWSHeaderParameters, token: FlattenedJWSInput) {
  const joseHeader = {
    ...protectedHeader,
    ...token.header,
  }
  if (!isObject(joseHeader.jwk)) {
    throw new JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a JSON object')
  }

  const key = await importJWK({ ...joseHeader.jwk, ext: true }, joseHeader.alg!, true)

  if (key instanceof Uint8Array || key.type !== 'public') {
    throw new JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a public key')
  }

  return key
}
