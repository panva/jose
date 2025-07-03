import type * as types from '../types.d.ts'
import { JOSENotSupported } from '../util/errors.js'

export function getSdAlg(value?: unknown) {
  switch (value) {
    case undefined:
      return 'sha-256'
    case 'sha-256':
    case 'sha-384':
    case 'sha-512':
      return value
    default:
      throw new JOSENotSupported('unsupported _sd_alg')
  }
}

/**
 * Formats an SD-JWT or SD-JWT+KB
 *
 * This function is exported (as a named export) from the subpath exports `'jose/sd/issuer'` and
 * `'jose/sd/holder'`.
 *
 * @param token Compact JWS token
 * @param disclosures Array of Disclosures
 * @param kbJwt Optional KB-JWT
 */
export function formatSdJwt(token: string, disclosures: string[], kbJwt?: string): string
/**
 * Formats an SD-JWT or SD-JWT+KB
 *
 * This function is exported (as a named export) from the subpath exports `'jose/sd/issuer'` and
 * `'jose/sd/holder'`.
 *
 * @param token Flattened JWS token
 * @param disclosures Array of Disclosures
 * @param kbJwt Optional KB-JWT
 */
export function formatSdJwt(
  token: types.FlattenedJWS,
  disclosures: string[],
  kbJwt?: string,
): types.FlattenedJWS
/**
 * Formats an SD-JWT or SD-JWT+KB
 *
 * This function is exported (as a named export) from the subpath exports `'jose/sd/issuer'` and
 * `'jose/sd/holder'`.
 *
 * @param token General JWS token
 * @param disclosures Array of Disclosures
 * @param kbJwt Optional KB-JWT
 */
export function formatSdJwt(
  token: types.GeneralJWS,
  disclosures: string[],
  kbJwt?: string,
): types.GeneralJWS
export function formatSdJwt(
  token: string | types.FlattenedJWS | types.GeneralJWS,
  disclosures: string[],
  kbJwt?: string,
): string | types.FlattenedJWS | types.GeneralJWS {
  kbJwt ||= ''

  if (typeof token === 'string') {
    return [token, ...disclosures, kbJwt].join('~')
  }

  let header: types.JWSHeaderParameters
  if ('signatures' in token) {
    header = token.signatures[0].header ||= {}
  } else {
    header = token.header ||= {}
  }

  header.disclosures = disclosures
  if (kbJwt) {
    header.kb_jwt = kbJwt
  }

  return token
}

/**
 * Parses an SD-JWT or SD-JWT+KB and returns a Compact JWS, Array of Disclosures, and optionally the
 * KB-JWT
 *
 * This function is exported (as a named export) from the subpath exports `'jose/sd/holder'` and
 * `'jose/sd/verifier'`.
 *
 * @param token Compact JWS token
 */
export function parseSdJwt(token: string): { jws: string; disclosures: string[]; kbJwt?: string }
/**
 * Parses an SD-JWT or SD-JWT+KB and returns a Flattened JWS, Array of Disclosures, and optionally
 * the KB-JWT
 *
 * This function is exported (as a named export) from the subpath exports `'jose/sd/holder'` and
 * `'jose/sd/verifier'`.
 *
 * @param token Flattened JWS token
 */
export function parseSdJwt(token: types.FlattenedJWS): {
  jws: types.FlattenedJWS
  disclosures: string[]
  kbJwt?: string
}
/**
 * Parses an SD-JWT or SD-JWT+KB and returns a General JWS, Array of Disclosures, and optionally the
 * KB-JWT
 *
 * This function is exported (as a named export) from the subpath exports `'jose/sd/holder'` and
 * `'jose/sd/verifier'`.
 *
 * @param token General JWS token
 */
export function parseSdJwt(token: types.GeneralJWS): {
  jws: types.GeneralJWS
  disclosures: string[]
  kbJwt?: string
}
export function parseSdJwt(token: string | types.FlattenedJWS | types.GeneralJWS): {
  jws: string | types.FlattenedJWS | types.GeneralJWS
  disclosures: string[]
  kbJwt?: string
} {
  if (typeof token === 'string') {
    const parts = token.split('~')
    const jws = parts.shift()
    if (typeof jws !== 'string') {
      throw new Error('TODO')
    }
    const kbJwt = parts.pop()
    if (typeof kbJwt !== 'string') {
      throw new Error('TODO')
    }
    const disclosures = parts
    return { jws, disclosures, kbJwt: kbJwt || undefined }
  }

  if ('signatures' in token) {
    const first = token.signatures[0]
    const payload = token.payload
    const {
      disclosures,
      kbJwt,
      jws: { header },
    } = parseSdJwt({ payload, ...first })

    token = structuredClone(token)
    token.signatures[0].header = header
    if (token.signatures[0].header === undefined) {
      delete token.signatures[0].header
    }
    return { jws: token, disclosures, kbJwt }
  }

  token = structuredClone(token)

  let disclosures!: string[]
  if (Array.isArray(token.header?.disclosures)) {
    disclosures = token.header.disclosures.slice()
    delete token.header.disclosures
  }

  if (!disclosures || !disclosures.every((el) => typeof el === 'string')) {
    throw new Error('TODO')
  }

  let kbJwt!: string
  if (token.header?.kb_jwt !== undefined) {
    if (typeof token.header.kb_jwt !== 'string') {
      throw new Error('TODO')
    }
    kbJwt = token.header.kb_jwt
    delete token.header.kb_jwt
  }

  if (Object.keys(token.header!).length === 0) {
    delete token.header
  }

  return { jws: token, disclosures, kbJwt }
}
