import type * as types from '../types.d.ts'

export function isObject<T = object>(input: unknown): input is T {
  if (
    typeof input !== 'object' ||
    input === null ||
    Object.prototype.toString.call(input) !== '[object Object]'
  ) {
    return false
  }
  const prototype = Object.getPrototypeOf(input)
  return prototype === null || Object.getPrototypeOf(prototype) === null
}

export function isJwkSet(input: unknown): input is types.JSONWebKeySet {
  return (
    isObject<types.JSONWebKeySet>(input) &&
    Array.isArray(input.keys) &&
    Array.from(input.keys).every(isObject)
  )
}

export function isDisjoint(...headers: Array<object | undefined>): boolean {
  const parameters = new Set<string>()
  for (const header of headers) {
    if (!header) continue
    for (const parameter of Object.keys(header)) {
      if (parameters.has(parameter)) {
        return false
      }
      parameters.add(parameter)
    }
  }

  return true
}
