import verify from '../flattened/verify.ts'
import type {
  GeneralJWSInput,
  GeneralVerifyResult,
  FlattenedJWSInput,
  GetKeyFunction,
  JWSHeaderParameters,
  KeyLike,
  VerifyOptions,
} from '../../types.d.ts'
import { JWSInvalid, JWSSignatureVerificationFailed } from '../../util/errors.ts'
import isObject from '../../lib/is_object.ts'

/**
 * Interface for General JWS Verification dynamic key resolution.
 * No token components have been verified at the time of this function call.
 *
 * See [createRemoteJWKSet](../functions/jwks_remote.createRemoteJWKSet.md#function-createremotejwkset)
 * to verify using a remote JSON Web Key Set.
 */
export interface GeneralVerifyGetKey
  extends GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput> {}

/**
 * Verifies the signature and format of and afterwards decodes the General JWS.
 *
 * @param jws General JWS.
 * @param key Key, or a function resolving a key, to verify the JWS with.
 * @param options JWS Verify options.
 *
 * @example ESM import
 * ```js
 * import { generalVerify } from 'jose/jws/general/verify'
 * ```
 *
 * @example CJS import
 * ```js
 * const { generalVerify } = require('jose/jws/general/verify')
 * ```
 *
 * @example Deno import
 * ```js
 * import { generalVerify } from 'https://deno.land/x/jose@VERSION/jws/general/verify.ts'
 * ```
 *
 * @example Usage
 * ```js
 * const decoder = new TextDecoder()
 * const jws = {
 *   payload: 'SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4',
 *   signatures: [
 *     {
 *       signature: 'FVVOXwj6kD3DqdfD9yYqfT2W9jv-Nop4kOehp_DeDGNB5dQNSPRvntBY6xH3uxlCxE8na9d_kyhYOcanpDJ0EA',
 *       protected: 'eyJhbGciOiJFUzI1NiJ9'
 *     }
 *   ]
 * }
 *
 * const { payload, protectedHeader } = await generalVerify(jws, publicKey)
 *
 * console.log(protectedHeader)
 * console.log(decoder.decode(payload))
 * ```
 */
async function generalVerify(
  jws: GeneralJWSInput,
  key: KeyLike | GeneralVerifyGetKey,
  options?: VerifyOptions,
): Promise<GeneralVerifyResult> {
  if (!isObject(jws)) {
    throw new JWSInvalid('General JWS must be an object')
  }

  if (!Array.isArray(jws.signatures) || !jws.signatures.every(isObject)) {
    throw new JWSInvalid('JWS Signatures missing or incorrect type')
  }

  for (const signature of jws.signatures) {
    try {
      return await verify(
        {
          header: signature.header,
          payload: jws.payload,
          protected: signature.protected,
          signature: signature.signature,
        },
        <Parameters<typeof verify>[1]>key,
        options,
      )
    } catch {
      //
    }
  }
  throw new JWSSignatureVerificationFailed()
}

export { generalVerify }
export default generalVerify
export type { KeyLike, GeneralJWSInput, VerifyOptions, GeneralVerifyResult }
