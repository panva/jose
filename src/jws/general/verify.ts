/**
 * Verifying JSON Web Signature (JWS) in General JSON Serialization
 *
 * @module
 */

import type * as types from '../../types.d.ts'
import {
  encodeJsonUnencodedPayload,
  parseProtectedHeader,
  prepareVerify,
  snapshotJws,
  verifySignature,
} from '../../lib/jws_verify.js'
import type { VerifyShared } from '../../lib/jws_verify.js'
import { JWSInvalid, JWSSignatureVerificationFailed } from '../../util/errors.js'
import { isObject } from '../../lib/validate.js'

type SignatureCandidate = [
  jws: types.FlattenedJWSInput,
  protectedHeader: types.JWSHeaderParameters,
  mode: 0 | 1 | 2,
]

function snapshotSignature(
  signature: Record<string, unknown>,
  payload: types.FlattenedJWSInput['payload'],
): SignatureCandidate | undefined {
  try {
    const jws = snapshotJws(signature as unknown as types.FlattenedJWSInput, [payload])
    const protectedHeader = parseProtectedHeader(jws.protected)

    const { b64, crit } = protectedHeader
    return [
      jws,
      protectedHeader,
      Array.isArray(crit) && crit.includes('b64')
        ? typeof b64 === 'boolean'
          ? b64
            ? 1
            : 2
          : 0
        : 1,
    ]
  } catch {
    return undefined
  }
}

/**
 * Resolves a key for General JWS verification from unverified headers and token data.
 *
 * @typeParam KeyType Type definition of the keys the function resolves. Narrowing it is what lets
 *   {@link types.ResolvedKey.key ResolvedKey.key} be inferred at the call site.
 *
 * @see {@link jwks/remote.createRemoteJWKSet createRemoteJWKSet} to verify using a remote JSON Web Key Set.
 */
export interface GeneralVerifyGetKey<
  KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array,
> extends types.GetKeyFunction<
  types.JWSHeaderParameters,
  types.FlattenedJWSInput,
  KeyType | types.KeyObject | types.JWK
> {}

/**
 * Verifies a General JWS signature and decodes its payload.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/jws/general/verify'`.
 *
 * > [!NOTE]\
 * > Returns payload and headers from the first signature that verifies successfully. Other entries'
 * > headers may be inspected to reject inconsistent use of the JWS Unencoded Payload Option, but are
 * > not included in the result. Rely only on the returned data.
 *
 * @example
 *
 * ```js
 * const jws = {
 *   payload: 'SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4',
 *   signatures: [
 *     {
 *       signature:
 *         'FVVOXwj6kD3DqdfD9yYqfT2W9jv-Nop4kOehp_DeDGNB5dQNSPRvntBY6xH3uxlCxE8na9d_kyhYOcanpDJ0EA',
 *       protected: 'eyJhbGciOiJFUzI1NiJ9',
 *     },
 *   ],
 * }
 *
 * const { payload, protectedHeader } = await jose.generalVerify(jws, publicKey)
 *
 * console.log(protectedHeader)
 * console.log(new TextDecoder().decode(payload))
 * ```
 *
 * @param jws General JWS.
 * @param key Public key or shared secret. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWS Verify options.
 */
export function generalVerify(
  jws: types.GeneralJWSInput,
  key: types.KeyInput,
  options?: types.VerifyOptions,
): Promise<types.GeneralVerifyResult>
/**
 * Verifies a General JWS signature and decodes its payload with a dynamically resolved key,
 * included in the result.
 *
 * @param jws General JWS.
 * @param getKey Resolves a public key or shared secret from unverified token data.
 * @param options JWS Verify options.
 */
export function generalVerify<
  KeyType extends types.CryptoKey | Uint8Array = types.CryptoKey | Uint8Array,
>(
  jws: types.GeneralJWSInput,
  getKey: GeneralVerifyGetKey<KeyType>,
  options?: types.VerifyOptions,
): Promise<types.GeneralVerifyResult & types.ResolvedKey<KeyType>>
/**
 * Verifies a General JWS and decodes its payload using a key or key resolver. The result includes
 * `key` only when a resolver is used.
 *
 * @param jws General JWS.
 * @param key Public key or shared secret, or a function resolving one.
 * @param options JWS Verify options.
 */
export function generalVerify(
  jws: types.GeneralJWSInput,
  key: types.KeyInput | GeneralVerifyGetKey,
  options?: types.VerifyOptions,
): Promise<types.GeneralVerifyResult & Partial<types.ResolvedKey>>
export async function generalVerify(
  jws: types.GeneralJWSInput,
  key: types.KeyInput | GeneralVerifyGetKey,
  options?: types.VerifyOptions,
) {
  if (!isObject(jws)) {
    throw new JWSInvalid('General JWS must be an object')
  }

  const { signatures, payload: inputPayload } = jws
  if (!Array.isArray(signatures)) {
    throw new JWSInvalid('JWS Signatures missing or incorrect type')
  }
  const signatureEntries = Array.from(signatures)
  if (!signatureEntries.every(isObject)) {
    throw new JWSInvalid('JWS Signatures missing or incorrect type')
  }

  let shared: VerifyShared
  try {
    if (inputPayload === undefined) throw new Error()
    shared = prepareVerify(options)
  } catch {
    // Reporting the real fault here would distinguish a malformed token from a signature that is
    // simply not the caller's. Stay indistinguishable.
    throw new JWSSignatureVerificationFailed()
  }

  const payload = inputPayload instanceof Uint8Array ? new Uint8Array(inputPayload) : inputPayload
  const candidates = signatureEntries
    .map((signature) => snapshotSignature(signature, payload))
    .filter((candidate): candidate is SignatureCandidate => candidate !== undefined)

  let modes = 0
  for (const [, , mode] of candidates) {
    modes |= mode
    if (modes === 3) {
      throw new JWSInvalid('inconsistent use of JWS Unencoded Payload (RFC7797)')
    }
  }

  for (const candidate of candidates) {
    try {
      const [result] = await verifySignature(
        candidate[0],
        shared,
        key,
        encodeJsonUnencodedPayload,
        candidate[1],
      )
      return result
    } catch {
      //
    }
  }

  throw new JWSSignatureVerificationFailed()
}
