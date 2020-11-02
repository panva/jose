import { JOSENotSupported, JWEInvalid, JWSInvalid } from '../util/errors.js'

type CritCheckHeader = object & {
  b64?: boolean
  crit?: string[]
}

const isString = (input: string) => typeof input !== 'string' || input.length === 0

function validateCrit(
  Err: typeof JWEInvalid | typeof JWSInvalid,
  supported: Map<string, boolean>,
  protectedHeader: CritCheckHeader,
  joseHeader: CritCheckHeader,
) {
  if ('crit' in joseHeader && !('crit' in protectedHeader)) {
    throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected')
  }

  if (!protectedHeader || !('crit' in protectedHeader)) {
    return new Set([])
  }

  if (
    !Array.isArray(protectedHeader.crit) ||
    protectedHeader.crit.length === 0 ||
    protectedHeader.crit.some(isString)
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

    if (!(parameter in joseHeader)) {
      throw new Err(`Extension Header Parameter "${parameter}" is missing`)
    } else if (supported.get(parameter) && !(parameter in protectedHeader)) {
      throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`)
    }
  }

  return new Set(protectedHeader.crit)
}

export default validateCrit
