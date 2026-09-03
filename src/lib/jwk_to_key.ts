import { JOSENotSupported } from '../util/errors.js'
import type * as types from '../types.d.ts'
import type { KeyDescriptor } from './key_descriptor.js'

export async function jwkToKey(
  entry: KeyDescriptor,
  jwk: types.JWK,
  algorithm: KeyDescriptor['subtle'] = entry.subtle,
): Promise<types.CryptoKey> {
  if (!entry.kty.includes(jwk.kty!)) {
    throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')
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
