import type * as types from '../types.d.ts'
import { decode as b64u } from '../util/base64url.js'
import { verify } from './signing.js'
import { JOSEAlgNotAllowed, JWSInvalid, JWSSignatureVerificationFailed } from '../util/errors.js'
import { concat, decoder, encoder, encode, strictDecoder } from './buffer_utils.js'
import { decodeBase64url, encodeBase64url } from './helpers.js'
import { isDisjoint, isObject } from './type_checks.js'
import { checkKeyType } from './check_key_type.js'
import { validateCrit, validateAlgorithms, JWS_RECOGNIZED } from './options.js'
import { normalizeKey } from './normalize_key.js'

export type VerifyGetKey = (
  protectedHeader: types.JWSHeaderParameters,
  token: types.FlattenedJWSInput,
) => Promise<types.KeyInput> | types.KeyInput

/** Whatever a verification needs that is the same for every signature over a given payload. */
export interface VerifyShared {
  algorithms?: Set<string>
  crit?: { [propName: string]: boolean }
  /** ASCII octets of a base64url payload, reused as signing input across signatures. */
  b64p?: Uint8Array
}

export interface VerifiedSignature {
  payload: Uint8Array
  parsedProt: types.JWSHeaderParameters
  b64: boolean
  key: types.CryptoKey | Uint8Array
  resolvedKey: boolean
}

/** Flattened and General results have the same shape, so they are assembled in one place. */
export function verifyResult(
  jws: types.FlattenedJWSInput | Omit<types.FlattenedJWSInput, 'payload'>,
  verified: VerifiedSignature,
): types.FlattenedVerifyResult & Partial<types.ResolvedKey> {
  const result: types.FlattenedVerifyResult = { payload: verified.payload }

  if (jws.protected !== undefined) {
    result.protectedHeader = verified.parsedProt
  }

  if (jws.header !== undefined) {
    result.unprotectedHeader = jws.header
  }

  if (verified.resolvedKey) {
    return { ...result, key: verified.key }
  }

  return result
}

export function prepareVerify(options?: types.VerifyOptions): VerifyShared {
  return {
    algorithms: options && validateAlgorithms('algorithms', options.algorithms),
    crit: options?.crit,
  }
}

/**
 * Verifies one signature. `jws` must already have been checked to have the member types the
 * Flattened Serialization requires; the Compact adapter gets that for free from String#split.
 */
export async function verifySignature(
  jws: types.FlattenedJWSInput,
  shared: VerifyShared,
  key: types.KeyInput | VerifyGetKey,
): Promise<VerifiedSignature> {
  let parsedProt: types.JWSHeaderParameters = {}
  if (jws.protected) {
    try {
      const protectedHeader = b64u(jws.protected)
      parsedProt = JSON.parse(strictDecoder.decode(protectedHeader))
      if (!isObject(parsedProt)) throw new Error()
    } catch {
      throw new JWSInvalid('JWS Protected Header is invalid')
    }
  }

  let joseHeader: types.JWSHeaderParameters
  if (jws.header !== undefined) {
    if (!isDisjoint(parsedProt, jws.header)) {
      throw new JWSInvalid(
        'JWS Protected and JWS Unprotected Header Parameter names must be disjoint',
      )
    }
    joseHeader = { ...parsedProt, ...jws.header }
  } else {
    joseHeader = parsedProt
  }

  const extensions = validateCrit(JWSInvalid, JWS_RECOGNIZED, shared.crit, parsedProt, joseHeader)

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

  if (shared.algorithms && !shared.algorithms.has(alg)) {
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
    jws.protected !== undefined ? encode(jws.protected) : new Uint8Array(),
    encode('.'),
    typeof jws.payload === 'string'
      ? b64
        ? // A base64url payload is ASCII by definition, but it reaches here without having been
          // decoded, so a non-ASCII one must not escape as a bare TypeError.
          (shared.b64p ??= encodeBase64url(jws.payload, 'payload', JWSInvalid))
        : encoder.encode(jws.payload)
      : jws.payload,
  )
  const signature = decodeBase64url(jws.signature, 'signature', JWSInvalid)

  const k = await normalizeKey(key, alg)
  const verified = await verify(alg, k, signature, data)

  if (!verified) {
    throw new JWSSignatureVerificationFailed()
  }

  let payload: Uint8Array
  if (b64) {
    payload = decodeBase64url(jws.payload as string, 'payload', JWSInvalid)
  } else if (typeof jws.payload === 'string') {
    payload = encoder.encode(jws.payload)
  } else {
    payload = jws.payload
  }

  return { payload, parsedProt, b64, key: k, resolvedKey }
}

/** Splits a Compact JWS and verifies it. Every member is a string by construction. */
export async function verifyCompact(
  jws: string | Uint8Array,
  shared: VerifyShared,
  key: types.KeyInput | VerifyGetKey,
): Promise<VerifiedSignature> {
  if (jws instanceof Uint8Array) {
    jws = decoder.decode(jws)
  }

  if (typeof jws !== 'string') {
    throw new JWSInvalid('Compact JWS must be a string or Uint8Array')
  }

  const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split('.')

  if (length !== 3) {
    throw new JWSInvalid('Invalid Compact JWS')
  }

  return verifySignature({ payload, protected: protectedHeader, signature }, shared, key)
}
