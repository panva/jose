/** Composable JWT verification. @module */

import type * as types from '../../types.d.ts'
import type {
  JWSAlgorithmOf,
  JWSAlgorithmSelection,
  JWSKeyInput,
  JWSResolvedKey,
  SelectedCompactJWSHeaderParameters,
  SelectedJWSVerifyOptions,
  SelectedJWTHeaderParameters,
  ValidJWSAlgorithmSelection,
} from '../../algorithms/types.js'
import { loadJWSAlgorithms } from '../../lib/jws_algorithm.js'
import { createJwtVerifyFunction } from '../../lib/jwt_jws.js'

/** Verification options with IntelliSense for the selected JWS algorithms. */
export type JWTVerifyOptions<Algorithm extends string> = SelectedJWSVerifyOptions<Algorithm> &
  types.JWTClaimVerificationOptions

/** Dynamic key resolver used by a composed JWT verifier. */
export interface JWTVerifyGetKey<
  Algorithm extends string,
  KeyType extends JWSResolvedKey<Algorithm> = JWSResolvedKey<Algorithm>,
> extends types.GetKeyFunction<
  SelectedCompactJWSHeaderParameters<Algorithm>,
  types.FlattenedJWSInput,
  KeyType | types.KeyObject | types.JWK
> {}

/** JWT verification result with header suggestions from the selected JWS algorithms. */
export type JWTVerifyResult<PayloadType, Algorithm extends string> = Omit<
  types.JWTVerifyResult<PayloadType>,
  'protectedHeader'
> & {
  protectedHeader: SelectedJWTHeaderParameters<Algorithm>
}

/** Callable JWT verifier restricted at runtime to the selected JWS algorithms. */
export interface JWTVerifyFunction<Algorithm extends string> {
  <PayloadType = types.JWTPayload>(
    jwt: string | Uint8Array,
    key: JWSKeyInput<Algorithm>,
    options?: JWTVerifyOptions<Algorithm>,
  ): Promise<JWTVerifyResult<PayloadType, Algorithm>>
  <
    PayloadType = types.JWTPayload,
    KeyType extends JWSResolvedKey<Algorithm> = JWSResolvedKey<Algorithm>,
  >(
    jwt: string | Uint8Array,
    getKey: JWTVerifyGetKey<Algorithm, KeyType>,
    options?: JWTVerifyOptions<Algorithm>,
  ): Promise<JWTVerifyResult<PayloadType, Algorithm> & types.ResolvedKey<KeyType>>
  <PayloadType = types.JWTPayload>(
    jwt: string | Uint8Array,
    key: JWSKeyInput<Algorithm> | JWTVerifyGetKey<Algorithm>,
    options?: JWTVerifyOptions<Algorithm>,
  ): Promise<
    JWTVerifyResult<PayloadType, Algorithm> & Partial<types.ResolvedKey<JWSResolvedKey<Algorithm>>>
  >
}

/**
 * Composes a JWT verifier supporting the selected JWS algorithms.
 *
 * @example
 *
 * ```js
 * import { Ed25519, ES256 } from 'jose/algorithms/jws'
 * import { composeJwtVerify } from 'jose/composable/jwt/verify'
 *
 * const jwtVerify = composeJwtVerify(Ed25519, ES256)
 * const { payload, protectedHeader } = await jwtVerify(jwt, publicKey)
 * ```
 */
export function composeJwtVerify<const Factories extends JWSAlgorithmSelection>(
  ...algorithms: Factories & ValidJWSAlgorithmSelection<Factories>
): JWTVerifyFunction<JWSAlgorithmOf<Factories>> {
  return createJwtVerifyFunction(loadJWSAlgorithms(algorithms)) as JWTVerifyFunction<
    JWSAlgorithmOf<Factories>
  >
}
