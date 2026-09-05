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
  encoded?: [b64?: string, raw?: Uint8Array],
]

export type CreatedSignature = [jws: types.FlattenedJWS, b64: boolean]

export async function createSignature(
  input: SignInput,
  key: types.KeyInput,
  rejectUnencoded?: () => never,
): Promise<CreatedSignature> {
  let [payload, protectedHeader, unprotectedHeader, crit] = input

  let protectedHeaderString = ''
  if (protectedHeader !== undefined) {
    const normalized = serializeJoseHeader(JWSInvalid, protectedHeader)
    protectedHeader = normalized[0]
    protectedHeaderString = b64u(normalized[1])
  }
  if (unprotectedHeader !== undefined) {
    unprotectedHeader = serializeJoseHeader(JWSInvalid, unprotectedHeader)[0]
  }

  if (!protectedHeader && !unprotectedHeader) {
    throw new JWSInvalid(
      'either setProtectedHeader or setUnprotectedHeader must be called before #sign()',
    )
  }

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

  let payloadS = ''
  let payloadB = payload
  let data: Uint8Array | undefined
  if (b64) {
    const encoded = input[4]
    if (encoded) {
      payloadS = encoded[0] ??= b64u(payload)
      payloadB = encoded[1] ??= encode(payloadS)
    } else {
      payloadS = b64u(payload)
      // Both components are generated base64url strings.
      data = encoder.encode(`${protectedHeaderString}.${payloadS}`)
    }
  }

  data ??= concat(encode(protectedHeaderString), encode('.'), payloadB)
  const k = await rawKey(await prepareKey(entry, key, 'sign'), entry.subtle, 'sign')
  if (entry.minRsaBits) checkModulusLength(entry.alg, k)
  const jws: types.FlattenedJWS = {
    signature: b64u(
      new Uint8Array(await crypto.subtle.sign(entry.signing, k, data as Uint8Array<ArrayBuffer>)),
    ),
    payload: payloadS,
  }

  if (protectedHeader) {
    jws.protected = protectedHeaderString
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
