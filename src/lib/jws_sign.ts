import type * as types from '../types.d.ts'
import { encode as b64u } from '../util/base64url.js'
import { sign } from './signing.js'
import { jwsAlgorithm } from './jws_algorithms.js'
import { isDisjoint } from './type_checks.js'
import { JWSInvalid } from '../util/errors.js'
import { concat, encode } from './buffer_utils.js'
import {
  serializeJoseHeader,
  validateB64,
  validateCrit,
  validateCritDuplicates,
  JWS_RECOGNIZED,
} from './options.js'
import { prepareKey } from './key.js'

export interface SignInput {
  payload: Uint8Array
  protectedHeader?: types.JWSHeaderParameters
  unprotectedHeader?: types.JWSHeaderParameters
  crit?: { [propName: string]: boolean }
  /** Reused across the signatures of a General JWS, which all cover the same payload. */
  encoded?: [b64?: string, raw?: Uint8Array]
}

export type CreatedSignature = [jws: types.FlattenedJWS, b64: boolean]

export async function createSignature(
  input: SignInput,
  key: types.KeyInput,
  assertB64?: (b64: boolean) => void,
): Promise<CreatedSignature> {
  let { protectedHeader, unprotectedHeader } = input

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
  const extensions = validateCrit(
    JWSInvalid,
    JWS_RECOGNIZED,
    input.crit,
    protectedHeader,
    joseHeader,
  )

  const b64 = validateB64(protectedHeader, extensions)

  assertB64?.(b64)

  const { alg } = joseHeader

  if (typeof alg !== 'string' || !alg) {
    throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid')
  }

  const entry = jwsAlgorithm(alg)

  let payloadS: string
  let payloadB: Uint8Array
  if (b64) {
    const encoded = (input.encoded ??= [])
    encoded[0] ??= b64u(input.payload)
    encoded[1] ??= encode(encoded[0])
    payloadS = encoded[0]
    payloadB = encoded[1]
  } else {
    payloadB = input.payload
    payloadS = ''
  }

  const protectedHeaderBytes = encode(protectedHeaderString)

  const data = concat(protectedHeaderBytes, encode('.'), payloadB)

  const k = await prepareKey(entry, key, 'sign')
  const signature = await sign(entry, k, data)

  const jws: types.FlattenedJWS = {
    signature: b64u(signature),
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
