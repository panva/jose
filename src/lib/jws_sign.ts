import type * as types from '../types.d.ts'
import { encode as b64u } from '../util/base64url.js'
import { sign } from './signing.js'
import type { JWSAlgorithm, JWSAlgorithmResolver } from './jws_algorithm.js'
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

function serializeProtectedHeader(
  protectedHeader: types.JWSHeaderParameters | undefined,
): [types.JWSHeaderParameters | undefined, string] {
  if (protectedHeader === undefined) return [undefined, '']
  const normalized = serializeJoseHeader(JWSInvalid, protectedHeader)
  return [normalized[0], b64u(normalized[1])]
}

function validateSignatureHeader(
  protectedHeader: types.JWSHeaderParameters | undefined,
  joseHeader: types.JWSHeaderParameters,
  crit: { [propName: string]: boolean } | undefined,
): boolean {
  validateCritDuplicates(JWSInvalid, protectedHeader)
  return validateB64(
    protectedHeader,
    validateCrit(JWSInvalid, JWS_RECOGNIZED, crit, protectedHeader, joseHeader),
  )
}

function signatureAlgorithm(joseHeader: types.JWSHeaderParameters) {
  const alg = joseHeader.alg
  if (typeof alg !== 'string' || !alg) {
    throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid')
  }
  return alg
}

async function signSignature(
  protectedHeader: string,
  payload: Uint8Array,
  entry: Readonly<JWSAlgorithm>,
  key: types.KeyInput,
): Promise<string> {
  const data = concat(encode(protectedHeader), encode('.'), payload)
  const k = await prepareKey(entry, key, 'sign')
  return b64u(await sign(entry, k, data))
}

export async function createSignature(
  resolve: JWSAlgorithmResolver,
  input: SignInput,
  key: types.KeyInput,
  assertB64?: (b64: boolean) => void,
): Promise<CreatedSignature> {
  let { protectedHeader, unprotectedHeader } = input

  let protectedHeaderString: string
  ;[protectedHeader, protectedHeaderString] = serializeProtectedHeader(protectedHeader)
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

  const b64 = validateSignatureHeader(protectedHeader, joseHeader, input.crit)

  assertB64?.(b64)

  const entry = resolve(signatureAlgorithm(joseHeader))

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

  const jws: types.FlattenedJWS = {
    signature: await signSignature(protectedHeaderString, payloadB, entry, key),
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
  resolve: JWSAlgorithmResolver,
  payload: Uint8Array,
  inputProtectedHeader: types.JWSHeaderParameters | undefined,
  inputCrit: { [propName: string]: boolean } | undefined,
  key: types.KeyInput,
  rejectUnencoded: () => never,
): Promise<string> {
  const [protectedHeader, protectedHeaderString] = serializeProtectedHeader(inputProtectedHeader)

  if (!protectedHeader) {
    throw new JWSInvalid(
      'either setProtectedHeader or setUnprotectedHeader must be called before #sign()',
    )
  }

  const b64 = validateSignatureHeader(protectedHeader, protectedHeader, inputCrit)
  if (!b64) rejectUnencoded()

  const entry = resolve(signatureAlgorithm(protectedHeader))
  const encodedPayload = b64u(payload)
  const signature = await signSignature(protectedHeaderString, encode(encodedPayload), entry, key)
  return `${protectedHeaderString}.${encodedPayload}.${signature}`
}
