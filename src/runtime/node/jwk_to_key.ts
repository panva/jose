import { createPrivateKey, createPublicKey, createSecretKey } from 'node:crypto'
import type { KeyObject } from 'node:crypto'

import type { JWKImportFunction } from '../interfaces.d'
import { decode as base64url } from './base64url.js'
import type { JWK } from '../../types.d'

const parse: JWKImportFunction = (jwk: JWK): KeyObject => {
  if (jwk.kty === 'oct') {
    return createSecretKey(base64url(jwk.k!))
  }

  return jwk.d
    ? createPrivateKey({ format: 'jwk', key: jwk })
    : createPublicKey({ format: 'jwk', key: jwk })
}
export default parse
