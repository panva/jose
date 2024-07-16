function message(msg: string, actual: unknown, ...types: string[]) {
  if (types.length > 1) {
    const last = types.pop()
    msg += `one of type ${types.join(', ')} or ${last}.`
  } else {
    msg += `of type ${types[0]}.`
  }

  if (actual == null) {
    msg += ` Received ${actual}`
  } else if (typeof actual === 'function' && actual.name) {
    msg += ` Received function ${actual.name}`
  } else if (typeof actual === 'object' && actual != null) {
    if (actual.constructor?.name) {
      msg += ` Received an instance of ${actual.constructor.name}`
    }
  }

  return msg
}

export default (actual: unknown, ...types: string[]) => {
  return message('Key must be ', actual, ...types)
}

export function withAlg(alg: string, actual: unknown, ...types: string[]) {
  return message(`Key for the ${alg} algorithm must be `, actual, ...types)
}
