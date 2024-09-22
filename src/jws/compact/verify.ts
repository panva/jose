import { flattenedVerify } from '../flattened/verify.js'
import { JWSInvalid } from '../../util/errors.js'
import { decoder } from '../../lib/buffer_utils.js'
import type {
  JWK,
  CompactVerifyResult,
  FlattenedJWSInput,
  GenericGetKeyFunction,
  CompactJWSHeaderParameters,
  KeyLike,
  VerifyOptions,
  ResolvedKey,
} from '../../types.d'

/**
 * Interface for Compact JWS Verification dynamic key resolution. No token components have been
 * verified at the time of this function call.
 *
 * @see {@link jwks/remote.createRemoteJWKSet createRemoteJWKSet} to verify using a remote JSON Web Key Set.
 */
export interface CompactVerifyGetKey
  extends GenericGetKeyFunction<
    CompactJWSHeaderParameters,
    FlattenedJWSInput,
    KeyLike | JWK | Uint8Array
  > {}

/**
 * Verifies the signature and format of and afterwards decodes the Compact JWS.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/jws/compact/verify'`.
 *
 * @example
 *
 * ```js
 * const jws =
 *   'eyJhbGciOiJFUzI1NiJ9.SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4.kkAs_gPPxWMI3rHuVlxHaTPfDWDoqdI8jSvuSmqV-8IHIWXg9mcAeC9ggV-45ZHRbiRJ3obUIFo1rHphPA5URg'
 *
 * const { payload, protectedHeader } = await jose.compactVerify(jws, publicKey)
 *
 * console.log(protectedHeader)
 * console.log(new TextDecoder().decode(payload))
 * ```
 *
 * @param jws Compact JWS.
 * @param key Key to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWS Verify options.
 */
export function compactVerify(
  jws: string | Uint8Array,
  key: KeyLike | Uint8Array | JWK,
  options?: VerifyOptions,
): Promise<CompactVerifyResult>
/**
 * @param jws Compact JWS.
 * @param getKey Function resolving a key to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWS Verify options.
 */
export function compactVerify<KeyLikeType extends KeyLike = KeyLike>(
  jws: string | Uint8Array,
  getKey: CompactVerifyGetKey,
  options?: VerifyOptions,
): Promise<CompactVerifyResult & ResolvedKey<KeyLikeType>>
export async function compactVerify(
  jws: string | Uint8Array,
  key: KeyLike | Uint8Array | JWK | CompactVerifyGetKey,
  options?: VerifyOptions,
) {
  if (jws instanceof Uint8Array) {
    jws = decoder.decode(jws)
  }

  if (typeof jws !== 'string') {
    throw new JWSInvalid('Compact JWS must be a string or Uint8Array')
  }
  const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split('.')

  if (length !== 3) {
    throw new JWSInvalid('Invalid Compact JWS')
  }

  const verified = await flattenedVerify(
    { payload, protected: protectedHeader, signature },
    key as Parameters<typeof flattenedVerify>[1],
    options,
  )

  const result = { payload: verified.payload, protectedHeader: verified.protectedHeader! }

  if (typeof key === 'function') {
    return { ...result, key: verified.key }
  }

  return result
}
