import { JOSENotSupported, JWEInvalid, JWSInvalid } from '../util/errors.js'

interface CritCheckHeader {
  b64?: boolean
  crit?: string[]
  [propName: string]: unknown
}

/**
 * RFC 7515 Section 4.1.11 forbids producers from listing duplicate names in "crit". A recipient
 * only MAY consider such a header invalid, so this is enforced when producing and not when
 * consuming.
 */
export function validateCritDuplicates(
  Err: typeof JWEInvalid | typeof JWSInvalid,
  protectedHeader: CritCheckHeader | undefined,
): void {
  const { crit } = protectedHeader ?? {}
  if (Array.isArray(crit) && new Set(crit).size !== crit.length) {
    throw new Err('"crit" (Critical) Header Parameter MUST NOT contain duplicate values')
  }
}

export function validateCrit(
  Err: typeof JWEInvalid | typeof JWSInvalid,
  recognizedDefault: Map<string, boolean>,
  recognizedOption: { [propName: string]: boolean } | undefined,
  protectedHeader: CritCheckHeader | undefined,
  joseHeader: CritCheckHeader,
) {
  if (joseHeader.crit !== undefined && protectedHeader?.crit === undefined) {
    throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected')
  }

  if (!protectedHeader || protectedHeader.crit === undefined) {
    return new Set()
  }

  if (
    !Array.isArray(protectedHeader.crit) ||
    protectedHeader.crit.length === 0 ||
    protectedHeader.crit.some((input: string) => typeof input !== 'string' || input.length === 0)
  ) {
    throw new Err(
      '"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present',
    )
  }

  let recognized: Map<string, boolean>
  if (recognizedOption !== undefined) {
    recognized = new Map([...Object.entries(recognizedOption), ...recognizedDefault.entries()])
  } else {
    recognized = recognizedDefault
  }

  for (const parameter of protectedHeader.crit) {
    if (!recognized.has(parameter)) {
      throw new JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`)
    }

    if (joseHeader[parameter] === undefined) {
      throw new Err(`Extension Header Parameter "${parameter}" is missing`)
    }
    if (recognized.get(parameter) && protectedHeader[parameter] === undefined) {
      throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`)
    }
  }

  return new Set(protectedHeader.crit)
}
