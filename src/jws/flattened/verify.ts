/**
 * Verifying JSON Web Signature (JWS) in Flattened JSON Serialization
 *
 * @module
 */

import type * as types from '../../types.d.ts'
import { decode as b64u } from '../../util/base64url.js'
import verify from '../../lib/verify.js'

import { JOSEAlgNotAllowed, JWSInvalid, JWSSignatureVerificationFailed } from '../../util/errors.js'
import { concat, encoder, decoder } from '../../lib/buffer_utils.js'
import isDisjoint from '../../lib/is_disjoint.js'
import isObject from '../../lib/is_object.js'
import checkKeyType from '../../lib/check_key_type.js'
import validateCrit from '../../lib/validate_crit.js'
import validateAlgorithms from '../../lib/validate_algorithms.js'
import normalizeKey from '../../lib/normalize_key.js'

/**
 * Interface for Flattened JWS Verification dynamic key resolution. No token components have been
 * verified at the time of this function call.
 *
 * @see {@link jwks/remote.createRemoteJWKSet createRemoteJWKSet} to verify using a remote JSON Web Key Set.
 */
export interface FlattenedVerifyGetKey
  extends types.GenericGetKeyFunction<
    types.JWSHeaderParameters | undefined,
    types.FlattenedJWSInput,
    types.CryptoKey | types.KeyObject | types.JWK | Uint8Array
  > {}

/**
 * Verifies the signature and format of and afterwards decodes the Flattened JWS.
 *
 * This function is exported (as a named export) from the main `'jose'` module entry point as well
 * as from its subpath export `'jose/jws/flattened/verify'`.
 *
 * @example
 *
 * ```js
 * const decoder = new TextDecoder()
 * const jws = {
 *   signature:
 *     'FVVOXwj6kD3DqdfD9yYqfT2W9jv-Nop4kOehp_DeDGNB5dQNSPRvntBY6xH3uxlCxE8na9d_kyhYOcanpDJ0EA',
 *   payload: 'SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4',
 *   protected: 'eyJhbGciOiJFUzI1NiJ9',
 * }
 *
 * const { payload, protectedHeader } = await jose.flattenedVerify(jws, publicKey)
 *
 * console.log(protectedHeader)
 * console.log(decoder.decode(payload))
 * ```
 *
 * @param jws Flattened JWS.
 * @param key Key to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWS Verify options.
 */
export function flattenedVerify(
  jws: types.FlattenedJWSInput,
  key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array,
  options?: types.VerifyOptions,
): Promise<types.FlattenedVerifyResult>
/**
 * @param jws Flattened JWS.
 * @param getKey Function resolving a key to verify the JWS with. See
 *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
 * @param options JWS Verify options.
 */
export function flattenedVerify(
  jws: types.FlattenedJWSInput,
  getKey: FlattenedVerifyGetKey,
  options?: types.VerifyOptions,
): Promise<types.FlattenedVerifyResult & types.ResolvedKey>
export async function flattenedVerify(
  jws: types.FlattenedJWSInput,
  key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array | FlattenedVerifyGetKey,
  options?: types.VerifyOptions,
) {
  if (!isObject(jws)) {
    throw new JWSInvalid('Flattened JWS must be an object')
  }

  if (jws.protected === undefined && jws.header === undefined) {
    throw new JWSInvalid('Flattened JWS must have either of the "protected" or "header" members')
  }

  if (jws.protected !== undefined && typeof jws.protected !== 'string') {
    throw new JWSInvalid('JWS Protected Header incorrect type')
  }

  if (jws.payload === undefined) {
    throw new JWSInvalid('JWS Payload missing')
  }

  if (typeof jws.signature !== 'string') {
    throw new JWSInvalid('JWS Signature missing or incorrect type')
  }

  if (jws.header !== undefined && !isObject(jws.header)) {
    throw new JWSInvalid('JWS Unprotected Header incorrect type')
  }

  let parsedProt: types.JWSHeaderParameters = {}
  if (jws.protected) {
    try {
      const protectedHeader = b64u(jws.protected)
      parsedProt = JSON.parse(decoder.decode(protectedHeader))
    } catch {
      throw new JWSInvalid('JWS Protected Header is invalid')
    }
  }
  if (!isDisjoint(parsedProt, jws.header)) {
    throw new JWSInvalid(
      'JWS Protected and JWS Unprotected Header Parameter names must be disjoint',
    )
  }

  const joseHeader: types.JWSHeaderParameters = {
    ...parsedProt,
    ...jws.header,
  }

  const extensions = validateCrit(
    JWSInvalid,
    new Map([['b64', true]]),
    options?.crit,
    parsedProt,
    joseHeader,
  )

  let b64 = true
  if (extensions.has('b64')) {
    b64 = parsedProt.b64!
    if (typeof b64 !== 'boolean') {
      throw new JWSInvalid(
        'The "b64" (base64url-encode payload) Header Parameter must be a boolean',
      )
    }
  }

  const { alg } = joseHeader

  if (typeof alg !== 'string' || !alg) {
    throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid')
  }

  const algorithms = options && validateAlgorithms('algorithms', options.algorithms)

  if (algorithms && !algorithms.has(alg)) {
    throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed')
  }

  if (b64) {
    if (typeof jws.payload !== 'string') {
      throw new JWSInvalid('JWS Payload must be a string')
    }
  } else if (typeof jws.payload !== 'string' && !(jws.payload instanceof Uint8Array)) {
    throw new JWSInvalid('JWS Payload must be a string or an Uint8Array instance')
  }

  let resolvedKey = false
  if (typeof key === 'function') {
    key = await key(parsedProt, jws)
    resolvedKey = true
  }

  checkKeyType(alg, key, 'verify')

  const data = concat(
    encoder.encode(jws.protected ?? ''),
    encoder.encode('.'),
    typeof jws.payload === 'string' ? encoder.encode(jws.payload) : jws.payload,
  )
  let signature: Uint8Array
  try {
    signature = b64u(jws.signature)
  } catch {
    throw new JWSInvalid('Failed to base64url decode the signature')
  }

  const k = await normalizeKey(key, alg)
  const verified = await verify(alg, k, signature, data)

  if (!verified) {
    throw new JWSSignatureVerificationFailed()
  }

  let payload: Uint8Array
  if (b64) {
    try {
      payload = b64u(jws.payload)
    } catch {
      throw new JWSInvalid('Failed to base64url decode the payload')
    }
  } else if (typeof jws.payload === 'string') {
    payload = encoder.encode(jws.payload)
  } else {
    payload = jws.payload
  }

  const result: types.FlattenedVerifyResult = { payload }

  if (jws.protected !== undefined) {
    result.protectedHeader = parsedProt
  }

  if (jws.header !== undefined) {
    result.unprotectedHeader = jws.header
  }

  if (resolvedKey) {
    return { ...result, key: k }
  }

  return result
}
