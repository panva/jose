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
  if (prototype === null) {
    return true
  }
  let proto = prototype
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }
  return prototype === proto
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

export const isJWK = (key: unknown): key is types.JWK & { kty: string } =>
  isObject<types.JWK>(key) && typeof key.kty === 'string'

export const isPrivateJWK = (key: types.JWK & { kty: string }): boolean =>
  key.kty !== 'oct' &&
  ((key.kty === 'AKP' && typeof key.priv === 'string') || typeof key.d === 'string')

export const isPublicJWK = (key: types.JWK & { kty: string }): boolean =>
  key.kty !== 'oct' && key.d === undefined && key.priv === undefined

export const isSecretJWK = (key: types.JWK & { kty: string }): boolean =>
  key.kty === 'oct' && typeof key.k === 'string'
