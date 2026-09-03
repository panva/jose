/**
 * JSON Web Token (JWT) Encryption (JWT is in JWE format)
 *
 * @module
 */

import type * as types from '../types.d.ts'
import type { ComposedEncryptJWT, ComposedEncryptJWTConstructor } from '../composable/jwe/types.js'
import { allJWEAlgorithms } from '../lib/jwe_algorithms.js'
import { createEncryptJWTClass } from '../lib/jwt_jwe.js'

export interface EncryptJWT extends ComposedEncryptJWT<types.CompactJWEHeaderParameters> {}

/**
 * EncryptJWT constructor
 *
 * @param payload The JWT Claims Set object. Defaults to an empty object.
 */
const EncryptJWTBase: ComposedEncryptJWTConstructor<types.CompactJWEHeaderParameters> =
  createEncryptJWTClass(allJWEAlgorithms)

/**
 * The EncryptJWT class is used to build and encrypt Compact JWE formatted JSON Web Tokens.
 *
 * This class is exported (as a named export) from the main `'jose'` module entry point as well as
 * from its subpath export `'jose/jwt/encrypt'`.
 *
 * @example
 *
 * ```js
 * const secret = jose.base64url.decode('zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lvI')
 * const jwt = await new jose.EncryptJWT({ 'urn:example:claim': true })
 *   .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
 *   .setIssuedAt()
 *   .setIssuer('urn:example:issuer')
 *   .setAudience('urn:example:audience')
 *   .setExpirationTime('2h')
 *   .encrypt(secret)
 *
 * console.log(jwt)
 * ```
 */
export class EncryptJWT extends EncryptJWTBase {
  declare private encryptJwtBrand: never
}
