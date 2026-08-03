import { JOSENotSupported } from '../util/errors.js'
import type * as types from '../types.d.ts'
import type { KeyDescriptor } from './key_descriptor.js'

export async function jwkToKey(entry: KeyDescriptor, jwk: types.JWK): Promise<types.CryptoKey> {
  if (!entry.kty.includes(jwk.kty!)) {
    throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')
  }

  const algorithm = entry.resolve?.({ kty: jwk.kty, crv: jwk.crv }) ?? entry.subtle
  const isPrivate = !!(jwk.d || jwk.priv)

  const keyData: types.JWK = { ...jwk }
  if (keyData.kty === 'AKP') {
    keyData.alg = entry.jwkAlg ?? keyData.alg
  } else {
    delete keyData.alg
  }
  delete keyData.use

  return crypto.subtle.importKey(
    'jwk',
    keyData,
    algorithm,
    jwk.ext ?? !isPrivate,
    (jwk.key_ops as KeyUsage[]) ?? entry.usages[isPrivate ? 1 : 0],
  )
}
