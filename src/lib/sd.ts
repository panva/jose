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
