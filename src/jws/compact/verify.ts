import verify from '../flattened/verify.js'
import { JWSInvalid } from '../../util/errors.js'
import { decoder } from '../../lib/buffer_utils.js'
import type {
  CompactVerifyResult,
  FlattenedJWSInput,
  GetKeyFunction,
  JWSHeaderParameters,
  KeyLike,
  VerifyOptions,
} from '../../types.d'

/**
 * Interface for Compact JWS Verification dynamic key resolution.
 * No token components have been verified at the time of this function call.
 */
export interface CompactVerifyGetKey
  extends GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput> {}

/**
 * Verifies the signature and format of and afterwards decodes the Compact JWS.
 *
 * @param jws Compact JWS.
 * @param key Key, or a function resolving a key, to verify the JWS with.
 * @param options JWS Verify options.
 *
 * @example
 * ```
 * // ESM import
 * import compactVerify from 'jose/jws/compact/verify'
 * ```
 *
 * @example
 * ```
 * // CJS import
 * const { default: compactVerify } = require('jose/jws/compact/verify')
 * ```
 *
 * @example
 * ```
 * // usage
 * import parseJwk from 'jose/jwk/parse'
 *
 * const decoder = new TextDecoder()
 * const jws = 'eyJhbGciOiJFUzI1NiJ9.SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4.kkAs_gPPxWMI3rHuVlxHaTPfDWDoqdI8jSvuSmqV-8IHIWXg9mcAeC9ggV-45ZHRbiRJ3obUIFo1rHphPA5URg'
 * const publicKey = await parseJwk({
 *   alg: 'ES256',
 *   crv: 'P-256',
 *   kty: 'EC',
 *   x: 'ySK38C1jBdLwDsNWKzzBHqKYEE5Cgv-qjWvorUXk9fw',
 *   y: '_LeQBw07cf5t57Iavn4j-BqJsAD1dpoz8gokd3sBsOo'
 * })
 *
 * const { payload, protectedHeader } = await compactVerify(jws, publicKey)
 *
 * console.log(protectedHeader)
 * console.log(decoder.decode(payload))
 * ```
 */
export default async function compactVerify(
  jws: string | Uint8Array,
  key: KeyLike | CompactVerifyGetKey,
  options?: VerifyOptions,
): Promise<CompactVerifyResult> {
  if (jws instanceof Uint8Array) {
    // eslint-disable-next-line no-param-reassign
    jws = decoder.decode(jws)
  }

  if (typeof jws !== 'string') {
    throw new JWSInvalid('Compact JWS must be a string or Uint8Array')
  }
  const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split('.')

  if (length !== 3) {
    throw new JWSInvalid('Invalid Compact JWS')
  }

  const verified = await verify(
    {
      payload: (payload || undefined) as string,
      protected: protectedHeader || undefined,
      signature: (signature || undefined) as string,
    },
    key as Parameters<typeof verify>[1],
    options,
  )

  return { payload: verified.payload, protectedHeader: verified.protectedHeader! }
}

export type { KeyLike, VerifyOptions }
