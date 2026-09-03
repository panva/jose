import type * as types from '../types.d.ts'
import { JWSInvalid } from '../util/errors.js'
import type { JWSAlgorithm } from './jws_algorithm.js'
import { jwkToKey } from './jwk_to_key.js'
import { normalizeJwk } from './jwk_metadata.js'
import { isObject } from './type_checks.js'

export type JWSAlgorithmResolver = (alg: unknown) => JWSAlgorithm

export async function embeddedJWKWithResolver(
  resolve: JWSAlgorithmResolver,
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

  const entry = resolve(joseHeader.alg)
  if (jwk.use !== undefined && jwk.use !== 'sig') {
    throw new JWSInvalid('Invalid Embedded JWK, its "use" must be "sig" when present')
  }
  if (jwk.alg !== undefined && jwk.alg !== entry.alg) {
    throw new JWSInvalid(`Invalid Embedded JWK, its "alg" must be "${entry.alg}" when present`)
  }
  const key = await jwkToKey(entry, { ...jwk, ext: true })

  if (key.type !== 'public') {
    throw new JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a public key')
  }

  return key
}
