import type * as types from '../types.d.ts'
import { encode as b64u } from '../util/base64url.js'
import { jwsAlgorithm } from './jws_algorithms.js'
import {
  isDisjoint,
  serializeJoseHeader,
  validateB64,
  validateCrit,
  validateCritDuplicates,
  JWS_RECOGNIZED,
} from './validate.js'
import { JWSInvalid } from '../util/errors.js'
import { concat, encode, encoder } from './buffer_utils.js'
import { prepareKey, rawKey, checkModulusLength } from './key.js'

export type SignInput = [
  payload: Uint8Array,
  protectedHeader?: types.JWSHeaderParameters,
  unprotectedHeader?: types.JWSHeaderParameters,
  crit?: { [propName: string]: boolean },
  /** Reused across the signatures of a General JWS, which all cover the same payload. */
  encodedPayloadCache?: [value?: string, octets?: Uint8Array],
]

export type CreatedSignature = [jws: types.FlattenedJWS, b64: boolean]

export async function createSignature(
  input: SignInput,
  key: types.KeyInput,
  rejectUnencoded?: () => never,
): Promise<CreatedSignature> {
  let [payload, protectedHeader, unprotectedHeader, crit] = input

  // RFC 7515, Section 5.1, step 4.
  let encodedProtectedHeader = ''
  if (protectedHeader !== undefined) {
    const normalized = serializeJoseHeader(JWSInvalid, protectedHeader)
    protectedHeader = normalized[0]
    encodedProtectedHeader = b64u(normalized[1])
  }
  if (unprotectedHeader !== undefined) {
    unprotectedHeader = serializeJoseHeader(JWSInvalid, unprotectedHeader)[0]
  }

  if (!protectedHeader && !unprotectedHeader) {
    throw new JWSInvalid(
      'either setProtectedHeader or setUnprotectedHeader must be called before #sign()',
    )
  }

  // RFC 7515, Section 7.2.1: the JOSE Header is a disjoint union.
  if (!isDisjoint(protectedHeader, unprotectedHeader)) {
    throw new JWSInvalid(
      'JWS Protected and JWS Unprotected Header Parameter names must be disjoint',
    )
  }

  const joseHeader: types.JWSHeaderParameters = { ...protectedHeader, ...unprotectedHeader }

  validateCritDuplicates(JWSInvalid, protectedHeader)
  const b64 = validateB64(
    protectedHeader,
    validateCrit(JWSInvalid, JWS_RECOGNIZED, crit, protectedHeader, joseHeader),
  )

  if (!b64) rejectUnencoded?.()

  const { alg } = joseHeader
  if (typeof alg !== 'string' || !alg) {
    throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid')
  }
  const entry = jwsAlgorithm(alg)

  // RFC 7515, Section 5.1, step 2; RFC 7797, Section 3 for an unencoded payload.
  let encodedPayload = ''
  let signingPayload = payload
  let signingInput: Uint8Array | undefined
  if (b64) {
    const encodedPayloadCache = input[4]
    if (encodedPayloadCache) {
      encodedPayload = encodedPayloadCache[0] ??= b64u(payload)
      signingPayload = encodedPayloadCache[1] ??= encode(encodedPayload)
    } else {
      encodedPayload = b64u(payload)
      // Both components are generated base64url strings.
      signingInput = encoder.encode(`${encodedProtectedHeader}.${encodedPayload}`)
    }
  }

  // RFC 7515, Section 5.1, step 5: JWS Signing Input (modified by RFC 7797, Section 3).
  signingInput ??= concat(encode(encodedProtectedHeader), encode('.'), signingPayload)
  const signingKey = await rawKey(await prepareKey(entry, key, 'sign'), entry.subtle, 'sign')
  if (entry.minRsaBits) checkModulusLength(entry.alg, signingKey)
  // RFC 7515, Section 5.1, steps 6 and 8: encode the JWS Signature and serialize.
  // With b64=false this API returns detached content (Appendix F; RFC 7797, Section 5.1).
  const jws: types.FlattenedJWS = {
    signature: b64u(
      new Uint8Array(
        await crypto.subtle.sign(
          entry.signing,
          signingKey,
          signingInput as Uint8Array<ArrayBuffer>,
        ),
      ),
    ),
    payload: encodedPayload,
  }

  if (protectedHeader) {
    jws.protected = encodedProtectedHeader
  }
  if (unprotectedHeader) {
    jws.header = unprotectedHeader
  }

  return [jws, b64]
}

export async function createCompactSignature(
  payload: Uint8Array,
  protectedHeader: types.JWSHeaderParameters | undefined,
  crit: { [propName: string]: boolean } | undefined,
  key: types.KeyInput,
  rejectUnencoded: () => never,
): Promise<string> {
  const [jws] = await createSignature(
    [payload, protectedHeader, undefined, crit],
    key,
    rejectUnencoded,
  )
  return `${jws.protected}.${jws.payload}.${jws.signature}`
}
