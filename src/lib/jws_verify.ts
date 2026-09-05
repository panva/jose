import type * as types from '../types.d.ts'
import { jwsAlgorithm } from './jws_algorithms.js'
import { JOSEAlgNotAllowed, JWSInvalid, JWSSignatureVerificationFailed } from '../util/errors.js'
import { concat, decoder, encoder, encode } from './buffer_utils.js'
import {
  decodeBase64url,
  encodeBase64url,
  parseJoseHeader,
  isDisjoint,
  isObject,
  validateB64,
  validateCrit,
  validateAlgorithms,
  JWS_RECOGNIZED,
} from './validate.js'
import { prepareKey, rawKey, checkModulusLength } from './key.js'

export type VerifyGetKey = (
  protectedHeader: types.JWSHeaderParameters,
  token: types.FlattenedJWSInput,
) => Promise<types.KeyInput> | types.KeyInput

/** Whatever a verification needs that is the same for every signature over a given payload. */
export type VerifyShared = [
  algorithms: Set<string> | undefined,
  crit: { [propName: string]: boolean } | undefined,
  /** ASCII octets of a base64url payload, reused as signing input across signatures. */
  b64p?: Uint8Array,
]

export type VerifiedSignature = [
  result: types.FlattenedVerifyResult & Partial<types.ResolvedKey>,
  b64: boolean,
]

/** Captures a JSON signature into data properties and validates its serialization members. */
export function snapshotJws(
  jws: types.FlattenedJWSInput,
  sharedPayload?: [payload: types.FlattenedJWSInput['payload']],
): types.FlattenedJWSInput {
  const encodedProtected = jws.protected
  const inputHeader = jws.header
  const header = isObject<types.JWSHeaderParameters>(inputHeader) ? { ...inputHeader } : inputHeader
  let payload = sharedPayload ? sharedPayload[0] : jws.payload
  if (!sharedPayload && payload instanceof Uint8Array) {
    payload = new Uint8Array(payload)
  }
  const signature = jws.signature

  const snapshot: types.FlattenedJWSInput = { payload, signature }
  if (encodedProtected !== undefined) snapshot.protected = encodedProtected
  if (inputHeader !== undefined) snapshot.header = header!

  if (encodedProtected === undefined && header === undefined) {
    throw new JWSInvalid('Flattened JWS must have either of the "protected" or "header" members')
  }
  if (encodedProtected !== undefined && typeof encodedProtected !== 'string') {
    throw new JWSInvalid('JWS Protected Header incorrect type')
  }
  if (payload === undefined) {
    throw new JWSInvalid('JWS Payload missing')
  }
  if (typeof signature !== 'string') {
    throw new JWSInvalid('JWS Signature missing or incorrect type')
  }
  if (header !== undefined && !isObject(header)) {
    throw new JWSInvalid('JWS Unprotected Header incorrect type')
  }
  return snapshot
}

export function prepareVerify(options?: types.VerifyOptions): VerifyShared {
  return [options && validateAlgorithms('algorithms', options.algorithms), options?.crit]
}

export function parseProtectedHeader(
  encodedProtected: string | undefined,
): types.JWSHeaderParameters {
  return encodedProtected === undefined
    ? {}
    : parseJoseHeader(encodedProtected, JWSInvalid, 'JWS Protected Header is invalid')
}

export function encodeJsonUnencodedPayload(payload: string): Uint8Array {
  const invalid = /[\p{Cs}\p{Cn}]/u.exec(payload)?.[0]
  if (invalid !== undefined) {
    throw new JWSInvalid(
      /\p{Cs}/u.test(invalid)
        ? 'JWS Payload must be a well-formed Unicode string'
        : 'JWS Payload must not contain unassigned Unicode code points',
    )
  }
  return encoder.encode(payload)
}

function encodeCompactUnencodedPayload(payload: string): Uint8Array {
  try {
    return encode(payload)
  } catch {
    throw new JWSInvalid('JWS Compact Serialization payload must use only ASCII characters')
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
  encodeUnencodedPayload: (payload: string) => Uint8Array,
  parsedProtected?: types.JWSHeaderParameters,
): Promise<VerifiedSignature> {
  const { protected: encodedProtected, header, payload: inputPayload } = jws
  const parsedProt = parsedProtected ?? parseProtectedHeader(encodedProtected)

  if (!isDisjoint(parsedProt, header)) {
    throw new JWSInvalid(
      'JWS Protected and JWS Unprotected Header Parameter names must be disjoint',
    )
  }
  const joseHeader: types.JWSHeaderParameters = { ...parsedProt, ...header }
  const b64 = validateB64(
    parsedProt,
    validateCrit(JWSInvalid, JWS_RECOGNIZED, shared[1], parsedProt, joseHeader),
  )
  const { alg } = joseHeader
  if (typeof alg !== 'string' || !alg) {
    throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid')
  }
  if (shared[0] && !shared[0].has(alg)) {
    throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed')
  }

  if (b64) {
    if (typeof inputPayload !== 'string') {
      throw new JWSInvalid('JWS Payload must be a string')
    }
  } else if (typeof inputPayload !== 'string' && !(inputPayload instanceof Uint8Array)) {
    throw new JWSInvalid('JWS Payload must be a string or an Uint8Array instance')
  }

  const signingPayload =
    b64 || typeof inputPayload !== 'string' ? inputPayload : encodeUnencodedPayload(inputPayload)

  let resolvedKey = false
  if (typeof key === 'function') {
    key = await key(parsedProt, jws)
    resolvedKey = true
  }

  const entry = jwsAlgorithm(alg)
  const data = concat(
    encodedProtected !== undefined ? encode(encodedProtected) : new Uint8Array(),
    encode('.'),
    typeof signingPayload === 'string'
      ? // A base64url payload is ASCII by definition, but it reaches here without having been
        // decoded, so a non-ASCII one must not escape as a bare TypeError.
        (shared[2] ??= encodeBase64url(signingPayload, 'payload', JWSInvalid))
      : signingPayload,
  )
  const signature = decodeBase64url(jws.signature, 'signature', JWSInvalid)

  const k = await prepareKey(entry, key, 'verify')
  const cryptoKey = await rawKey(k, entry.subtle, 'verify')
  if (entry.minRsaBits) checkModulusLength(entry.alg, cryptoKey)
  let verified = false
  try {
    verified = await crypto.subtle.verify(
      entry.signing,
      cryptoKey,
      signature as Uint8Array<ArrayBuffer>,
      data as Uint8Array<ArrayBuffer>,
    )
  } catch {}
  if (!verified) {
    throw new JWSSignatureVerificationFailed()
  }

  const payload =
    typeof signingPayload === 'string'
      ? decodeBase64url(signingPayload, 'payload', JWSInvalid)
      : signingPayload
  const result: types.FlattenedVerifyResult & Partial<types.ResolvedKey> = { payload }
  if (encodedProtected !== undefined) result.protectedHeader = parsedProt
  if (header !== undefined) result.unprotectedHeader = header
  if (resolvedKey) return [{ ...result, key: k }, b64]
  return [result, b64]
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

  return verifySignature(
    { payload, protected: protectedHeader, signature },
    shared,
    key,
    encodeCompactUnencodedPayload,
  )
}
