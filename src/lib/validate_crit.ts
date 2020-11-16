import { JOSENotSupported, JWEInvalid, JWSInvalid } from '../util/errors.js'

interface CritCheckHeader {
  b64?: boolean
  crit?: string[]
  [propName: string]: any
}

function validateCrit(
  Err: typeof JWEInvalid | typeof JWSInvalid,
  supported: Map<string, boolean>,
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

  // eslint-disable-next-line no-restricted-syntax
  for (const parameter of protectedHeader.crit) {
    if (!supported.has(parameter)) {
      throw new JOSENotSupported(
        `Extension Header Parameter "${parameter}" is not supported by this implementation`,
      )
    }

    if (joseHeader[parameter] === undefined) {
      throw new Err(`Extension Header Parameter "${parameter}" is missing`)
    } else if (supported.get(parameter) && protectedHeader[parameter] === undefined) {
      throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`)
    }
  }

  return new Set(protectedHeader.crit)
}

export default validateCrit
