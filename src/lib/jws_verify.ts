import type * as types from '../types.d.ts'
import { verify } from './signing.js'
import { jwsAlgorithm } from './jws_algorithms.js'
import { JOSEAlgNotAllowed, JWSInvalid, JWSSignatureVerificationFailed } from '../util/errors.js'
import { concat, decoder, encoder, encode } from './buffer_utils.js'
import { decodeBase64url, encodeBase64url, parseJoseHeader } from './helpers.js'
import { isDisjoint, isObject } from './type_checks.js'
import { validateB64, validateCrit, validateAlgorithms, JWS_RECOGNIZED } from './options.js'
import { prepareKey } from './key.js'

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
  payload: Uint8Array,
  parsedProt: types.JWSHeaderParameters,
  b64: boolean,
  key: types.CryptoKey | Uint8Array,
  resolvedKey: boolean,
]

/** Captures a Flattened JWS and its unprotected header into data properties. */
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
  return snapshot
}

/** Flattened and General results have the same shape, so they are assembled in one place. */
export function verifyResult(
  jws: types.FlattenedJWSInput | Omit<types.FlattenedJWSInput, 'payload'>,
  verified: VerifiedSignature,
): types.FlattenedVerifyResult & Partial<types.ResolvedKey> {
  const [payload, parsedProt, , key, resolvedKey] = verified
  const result: types.FlattenedVerifyResult = { payload }

  if (jws.protected !== undefined) {
    result.protectedHeader = parsedProt
  }

  if (jws.header !== undefined) {
    result.unprotectedHeader = jws.header
  }

  if (resolvedKey) {
    return { ...result, key }
  }

  return result
}

export function prepareVerify(options?: types.VerifyOptions): VerifyShared {
  return [options && validateAlgorithms('algorithms', options.algorithms), options?.crit]
}

export function parseProtectedHeader(
  encodedProtected: string | undefined,
  parsedProtected: types.JWSHeaderParameters = encodedProtected === undefined
    ? {}
    : parseJoseHeader(encodedProtected, JWSInvalid, 'JWS Protected Header is invalid'),
): types.JWSHeaderParameters {
  return parsedProtected
}

export function parseJwsHeaders(
  encodedProtected: string | undefined,
  header: types.JWSHeaderParameters | undefined,
  recognizedOption: VerifyShared[1],
  parsedProtected?: types.JWSHeaderParameters,
): [
  protectedHeader: types.JWSHeaderParameters,
  joseHeader: types.JWSHeaderParameters,
  b64: boolean,
] {
  const parsedProt = parseProtectedHeader(encodedProtected, parsedProtected)

  let joseHeader: types.JWSHeaderParameters
  if (header !== undefined) {
    if (!isDisjoint(parsedProt, header)) {
      throw new JWSInvalid(
        'JWS Protected and JWS Unprotected Header Parameter names must be disjoint',
      )
    }
    joseHeader = { ...parsedProt, ...header }
  } else {
    joseHeader = parsedProt
  }

  const extensions = validateCrit(
    JWSInvalid,
    JWS_RECOGNIZED,
    recognizedOption,
    parsedProt,
    joseHeader,
  )

  const b64 = validateB64(parsedProt, extensions)

  return [parsedProt, joseHeader, b64]
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
  const [parsedProt, joseHeader, b64] = parseJwsHeaders(
    encodedProtected,
    header,
    shared[1],
    parsedProtected,
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

  const unencodedPayload =
    !b64 && typeof inputPayload === 'string' ? encodeUnencodedPayload(inputPayload) : undefined

  let resolvedKey = false
  if (typeof key === 'function') {
    key = await key(parsedProt, jws)
    resolvedKey = true
  }

  const entry = jwsAlgorithm(alg)

  const data = concat(
    encodedProtected !== undefined ? encode(encodedProtected) : new Uint8Array(),
    encode('.'),
    typeof inputPayload === 'string'
      ? b64
        ? // A base64url payload is ASCII by definition, but it reaches here without having been
          // decoded, so a non-ASCII one must not escape as a bare TypeError.
          (shared[2] ??= encodeBase64url(inputPayload, 'payload', JWSInvalid))
        : unencodedPayload!
      : inputPayload,
  )
  const signature = decodeBase64url(jws.signature, 'signature', JWSInvalid)

  const k = await prepareKey(entry, key, 'verify')
  const verified = await verify(entry, k, signature, data)

  if (!verified) {
    throw new JWSSignatureVerificationFailed()
  }

  let payload: Uint8Array
  if (b64) {
    payload = decodeBase64url(inputPayload as string, 'payload', JWSInvalid)
  } else if (typeof inputPayload === 'string') {
    payload = unencodedPayload!
  } else {
    payload = inputPayload
  }

  return [payload, parsedProt, b64, k, resolvedKey]
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
