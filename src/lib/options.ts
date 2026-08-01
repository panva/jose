import { JOSENotSupported, JWEInvalid, JWSInvalid } from '../util/errors.js'

interface CritCheckHeader {
  b64?: boolean
  crit?: string[]
  [propName: string]: unknown
}

/** Extension Header Parameters a JWS implementation recognizes without being asked to. */
export const JWS_RECOGNIZED = { __proto__: null, b64: true } as unknown as Record<string, boolean>

/** JWE defines no Extension Header Parameters that are recognized by default. */
export const JWE_RECOGNIZED = { __proto__: null } as unknown as Record<string, boolean>

export function validateAlgorithms(option: string, algorithms?: string[]): Set<string> | undefined {
  if (
    algorithms !== undefined &&
    (!Array.isArray(algorithms) || algorithms.some((s) => typeof s !== 'string'))
  ) {
    throw new TypeError(`"${option}" option must be an array of strings`)
  }

  if (!algorithms) {
    return undefined
  }

  return new Set(algorithms)
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
  recognizedDefault: Record<string, boolean>,
  recognizedOption: { [propName: string]: boolean } | undefined,
  protectedHeader: CritCheckHeader | undefined,
  joseHeader: CritCheckHeader,
): string[] {
  if (joseHeader.crit !== undefined && protectedHeader?.crit === undefined) {
    throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected')
  }

  if (!protectedHeader || protectedHeader.crit === undefined) {
    return []
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

  const recognized: Record<string, boolean> =
    recognizedOption === undefined
      ? recognizedDefault
      : ({ __proto__: null, ...recognizedOption, ...recognizedDefault } as unknown as Record<
          string,
          boolean
        >)

  for (const parameter of protectedHeader.crit) {
    if (!(parameter in recognized)) {
      throw new JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`)
    }

    if (joseHeader[parameter] === undefined) {
      throw new Err(`Extension Header Parameter "${parameter}" is missing`)
    }
    if (recognized[parameter] && protectedHeader[parameter] === undefined) {
      throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`)
    }
  }

  return protectedHeader.crit
}
