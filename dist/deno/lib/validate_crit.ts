import { JOSENotSupported, JWEInvalid, JWSInvalid } from '../util/errors.ts'

interface CritCheckHeader {
  b64?: boolean
  crit?: string[]
  [propName: string]: unknown
}

function validateCrit(
  Err: typeof JWEInvalid | typeof JWSInvalid,
  recognizedDefault: Map<string, boolean>,
  recognizedOption: { [propName: string]: boolean } | undefined,
  protectedHeader: CritCheckHeader,
  joseHeader: CritCheckHeader,
) {
  if (joseHeader.crit !== undefined && protectedHeader.crit === undefined) {
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
    } else if (recognized.get(parameter) && protectedHeader[parameter] === undefined) {
      throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`)
    }
  }

  return new Set(protectedHeader.crit)
}

export default validateCrit
