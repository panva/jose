import type * as types from '../types.d.ts'
import { encode as b64u } from '../util/base64url.js'
import { sign } from './signing.js'
import { jwsAlgorithm } from './jws_algorithms.js'
import { isDisjoint } from './type_checks.js'
import { JWSInvalid } from '../util/errors.js'
import { concat, encode } from './buffer_utils.js'
import { checkKeyType } from './check_key_type.js'
import { validateCrit, validateCritDuplicates, JWS_RECOGNIZED } from './options.js'
import { normalizeKey } from './normalize_key.js'

export interface SignInput {
  payload: Uint8Array
  protectedHeader?: types.JWSHeaderParameters
  unprotectedHeader?: types.JWSHeaderParameters
  crit?: { [propName: string]: boolean }
  /** Reused across the signatures of a General JWS, which all cover the same payload. */
  encoded?: { b64?: string; raw?: Uint8Array }
}

/** RFC 7797 - whether this Protected Header opts the payload out of base64url encoding. */
export function unencodedPayload(protectedHeader?: types.JWSHeaderParameters): boolean {
  return (
    protectedHeader?.b64 === false &&
    Array.isArray(protectedHeader.crit) &&
    protectedHeader.crit.includes('b64')
  )
}

export async function createSignature(
  input: SignInput,
  key: types.KeyInput,
): Promise<types.FlattenedJWS> {
  const { protectedHeader, unprotectedHeader } = input

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

  let b64 = true
  if (extensions.has('b64')) {
    b64 = protectedHeader!.b64!
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

  checkKeyType(alg, key, 'sign')

  let payloadS: string
  let payloadB: Uint8Array
  if (b64) {
    const encoded = (input.encoded ??= {})
    encoded.b64 ??= b64u(input.payload)
    encoded.raw ??= encode(encoded.b64)
    payloadS = encoded.b64
    payloadB = encoded.raw
  } else {
    payloadB = input.payload
    payloadS = ''
  }

  let protectedHeaderString: string
  let protectedHeaderBytes: Uint8Array
  if (protectedHeader) {
    protectedHeaderString = b64u(JSON.stringify(protectedHeader))
    protectedHeaderBytes = encode(protectedHeaderString)
  } else {
    protectedHeaderString = ''
    protectedHeaderBytes = new Uint8Array()
  }

  const data = concat(protectedHeaderBytes, encode('.'), payloadB)

  const k = await normalizeKey(key, alg)
  const signature = await sign(jwsAlgorithm(alg), k, data)

  const jws: types.FlattenedJWS = {
    signature: b64u(signature),
    payload: payloadS,
  }

  if (protectedHeader) {
    jws.protected = protectedHeaderString
  }

  return jws
}
