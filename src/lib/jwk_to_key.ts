import { JOSENotSupported } from '../util/errors.js'
import type * as types from '../types.d.ts'
import type { KeyDescriptor } from './key_descriptor.js'

const unsupportedAlg = 'Invalid or unsupported JWK "alg" (Algorithm) Parameter value'

/**
 * The WebCrypto parameters for importing this JWK under this algorithm. ECDH takes its curve from
 * the key; every other algorithm has it fixed by the identifier.
 */
function subtleParams(
  entry: KeyDescriptor,
  jwk: types.JWK,
): { name: string; hash?: string; namedCurve?: string } {
  if (!entry.kty.includes(jwk.kty!)) {
    throw new JOSENotSupported(unsupportedAlg)
  }

  return entry.subtleFor?.({ kty: jwk.kty, crv: jwk.crv }) ?? entry.subtle
}

export async function jwkToKey(entry: KeyDescriptor, jwk: types.JWK): Promise<types.CryptoKey> {
  if (jwk.kty === 'RSA' && 'oth' in jwk && jwk.oth !== undefined) {
    throw new JOSENotSupported('RSA JWK "oth" (Other Primes Info) Parameter value is not supported')
  }

  const algorithm = subtleParams(entry, jwk)
  const isPrivate = !!(jwk.d || jwk.priv)
  const keyUsages = isPrivate ? entry.usages.private : entry.usages.public

  const keyData: types.JWK = { ...jwk }
  if (keyData.kty !== 'AKP') {
    delete keyData.alg
  }
  delete keyData.use

  return crypto.subtle.importKey(
    'jwk',
    keyData,
    algorithm,
    jwk.ext ?? (isPrivate ? false : true),
    (jwk.key_ops as KeyUsage[]) ?? keyUsages,
  )
}
