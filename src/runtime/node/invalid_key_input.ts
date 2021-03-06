import { inspect } from 'util'

export default (actual: unknown, ...types: string[]) => {
  let msg = 'Key must be '

  if (types.length > 2) {
    const last = types.pop()
    msg += `one of type ${types.join(', ')}, or ${last}.`
  } else if (types.length === 2) {
    msg += `one of type ${types[0]} or ${types[1]}.`
  } else {
    msg += `of type ${types[0]}.`
  }

  if (actual == null) {
    msg += ` Received ${actual}`
  } else if (typeof actual === 'function' && actual.name) {
    msg += ` Received function ${actual.name}`
  } else if (typeof actual === 'object' && actual != null) {
    if (actual.constructor && actual.constructor.name) {
      msg += ` Received an instance of ${actual.constructor.name}`
    } else {
      const inspected = inspect(actual, { depth: -1 })
      msg += ` Received ${inspected}`
    }
  } else {
    let inspected = inspect(actual, { colors: false })
    if (inspected.length > 25) inspected = `${inspected.slice(0, 25)}...`
    msg += ` Received type ${typeof actual} (${inspected})`
  }

  return msg
}
