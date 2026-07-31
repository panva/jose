import { JOSENotSupported } from '../util/errors.js'
import type * as types from '../types.d.ts'
import type { KeyDescriptor } from './key_descriptor.js'

export async function jwkToKey(entry: KeyDescriptor, jwk: types.JWK): Promise<types.CryptoKey> {
  if (jwk.kty === 'RSA' && 'oth' in jwk && jwk.oth !== undefined) {
    throw new JOSENotSupported('RSA JWK "oth" (Other Primes Info) Parameter value is not supported')
  }

  if (!entry.kty.includes(jwk.kty!)) {
    throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')
  }

  const algorithm = entry.resolve?.({ kty: jwk.kty, crv: jwk.crv }) ?? entry.subtle
  if (entry.importJWK) {
    return entry.importJWK(entry, { ...jwk, alg: entry.alg })
  }
  const isPrivate = !!(jwk.d || jwk.priv)

  const keyData: types.JWK = { ...jwk }
  if (keyData.kty !== 'AKP') {
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
