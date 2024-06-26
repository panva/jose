import type { KeyLike, FlattenedJWSInput, JWSHeaderParameters } from '../types.d.ts'
import { importJWK } from '../key/import.ts'
import isObject from '../lib/is_object.ts'
import { JWSInvalid } from '../util/errors.ts'

/**
 * EmbeddedJWK is an implementation of a GetKeyFunction intended to be used with the JWS/JWT verify
 * operations whenever you need to opt-in to verify signatures with a public key embedded in the
 * token's "jwk" (JSON Web Key) Header Parameter. It is recommended to combine this with the verify
 * function's `algorithms` option to define accepted JWS "alg" (Algorithm) Header Parameter values.
 *
 */
export async function EmbeddedJWK<KeyLikeType extends KeyLike = KeyLike>(
  protectedHeader?: JWSHeaderParameters,
  token?: FlattenedJWSInput,
): Promise<KeyLikeType> {
  const joseHeader = {
    ...protectedHeader,
    ...token?.header,
  }
  if (!isObject(joseHeader.jwk)) {
    throw new JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a JSON object')
  }

  const key = await importJWK<KeyLikeType>({ ...joseHeader.jwk, ext: true }, joseHeader.alg!)

  if (key instanceof Uint8Array || key.type !== 'public') {
    throw new JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a public key')
  }

  return key
}
