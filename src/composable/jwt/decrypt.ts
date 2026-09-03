/** Composable JWT decryption. @module */

import type * as types from '../../types.d.ts'
import type { JWEAlgorithmSelection, ValidJWEAlgorithmSelection } from '../../algorithms/types.js'
import { loadJWEAlgorithms } from '../../lib/jwe_algorithm.js'
import { createJwtDecryptFunction } from '../../lib/jwt_jwe.js'
import type { ComposedCompactJWEHeader, ComposedDecryptOptions } from '../jwe/types.js'

export type { ComposedCompactJWEHeader, ComposedDecryptOptions } from '../jwe/types.js'

/** JWT decryption options with IntelliSense for the selected JWE algorithms. */
export type ComposedJWTDecryptOptions<Factories extends JWEAlgorithmSelection> =
  ComposedDecryptOptions<Factories> & types.JWTClaimVerificationOptions

/** A JWT decryption result with protected-header suggestions from the selected JWE algorithms. */
export type ComposedJWTDecryptResult<
  Factories extends JWEAlgorithmSelection,
  PayloadType = types.JWTPayload,
> = Omit<types.JWTDecryptResult<PayloadType>, 'protectedHeader'> & {
  protectedHeader: ComposedCompactJWEHeader<Factories>
}

/** Dynamic key resolver for composed JWT decryption. */
export interface ComposedJWTDecryptGetKey<
  Factories extends JWEAlgorithmSelection,
  KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array,
> extends types.GetKeyFunction<
  ComposedCompactJWEHeader<Factories>,
  types.FlattenedJWE,
  KeyType | types.KeyObject | types.JWK
> {}

/** A JWT decryptor restricted to the selected JWE algorithms. */
export interface ComposedJWTDecryptFunction<Factories extends JWEAlgorithmSelection> {
  <PayloadType = types.JWTPayload>(
    jwt: string | Uint8Array,
    key: types.KeyInput,
    options?: ComposedJWTDecryptOptions<Factories>,
  ): Promise<ComposedJWTDecryptResult<Factories, PayloadType>>
  <
    PayloadType = types.JWTPayload,
    KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array,
  >(
    jwt: string | Uint8Array,
    getKey: ComposedJWTDecryptGetKey<Factories, KeyType>,
    options?: ComposedJWTDecryptOptions<Factories>,
  ): Promise<ComposedJWTDecryptResult<Factories, PayloadType> & types.ResolvedKey<KeyType>>
  <PayloadType = types.JWTPayload>(
    jwt: string | Uint8Array,
    key: types.KeyInput | ComposedJWTDecryptGetKey<Factories>,
    options?: ComposedJWTDecryptOptions<Factories>,
  ): Promise<ComposedJWTDecryptResult<Factories, PayloadType> & Partial<types.ResolvedKey>>
}

/**
 * Composes a JWT decryptor from the selected JWE algorithm factories.
 *
 * @example
 *
 * ```js
 * import { dir } from 'jose/algorithms/jwe'
 * import { A256CBC_HS512, A256GCM } from 'jose/algorithms/jwe/enc'
 * import { composeJwtDecrypt } from 'jose/composable/jwt/decrypt'
 *
 * const jwtDecrypt = composeJwtDecrypt(dir, A256GCM, A256CBC_HS512)
 * const { payload, protectedHeader } = await jwtDecrypt(jwt, secretKey)
 * ```
 */
export function composeJwtDecrypt<const Factories extends JWEAlgorithmSelection>(
  ...factories: Factories & ValidJWEAlgorithmSelection<Factories>
): ComposedJWTDecryptFunction<Factories> {
  return createJwtDecryptFunction(
    loadJWEAlgorithms(factories),
  ) as unknown as ComposedJWTDecryptFunction<Factories>
}
