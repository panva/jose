import { flattenedVerify } from '../flattened/verify.ts'
import type {
  JWK,
  GeneralJWSInput,
  GeneralVerifyResult,
  FlattenedJWSInput,
  GenericGetKeyFunction,
  JWSHeaderParameters,
  KeyLike,
  VerifyOptions,
  ResolvedKey,
} from '../../types.d.ts'
import { JWSInvalid, JWSSignatureVerificationFailed } from '../../util/errors.ts'
import isObject from '../../lib/is_object.ts'

/**
 * Interface for General JWS Verification dynamic key resolution. No token components have been
 * verified at the time of this function call.
 *
 * @see {@link jwks/remote.createRemoteJWKSet createRemoteJWKSet} to verify using a remote JSON Web Key Set.
 */
export interface GeneralVerifyGetKey
  extends GenericGetKeyFunction<
    JWSHeaderParameters,
    FlattenedJWSInput,
    KeyLike | JWK | Uint8Array
  > {}

/**
 * Verifies the signature and format of and afterwards decodes the General JWS.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/jws/general/verify'`.
 *
 * @param jws General JWS.
 * @param key Key to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWS Verify options.
 */
export function generalVerify(
  jws: GeneralJWSInput,
  key: KeyLike | Uint8Array | JWK,
  options?: VerifyOptions,
): Promise<GeneralVerifyResult>
/**
 * @param jws General JWS.
 * @param getKey Function resolving a key to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWS Verify options.
 */
export function generalVerify<KeyLikeType extends KeyLike = KeyLike>(
  jws: GeneralJWSInput,
  getKey: GeneralVerifyGetKey,
  options?: VerifyOptions,
): Promise<GeneralVerifyResult & ResolvedKey<KeyLikeType>>
export async function generalVerify(
  jws: GeneralJWSInput,
  key: KeyLike | Uint8Array | JWK | GeneralVerifyGetKey,
  options?: VerifyOptions,
) {
  if (!isObject(jws)) {
    throw new JWSInvalid('General JWS must be an object')
  }

  if (!Array.isArray(jws.signatures) || !jws.signatures.every(isObject)) {
    throw new JWSInvalid('JWS Signatures missing or incorrect type')
  }

  for (const signature of jws.signatures) {
    try {
      return await flattenedVerify(
        {
          header: signature.header,
          payload: jws.payload,
          protected: signature.protected,
          signature: signature.signature,
        },
        key as Parameters<typeof flattenedVerify>[1],
        options,
      )
    } catch {
      //
    }
  }
  throw new JWSSignatureVerificationFailed()
}
