import type * as types from '../types.d.ts'

const isObjectLike = (value: unknown) => typeof value === 'object' && value !== null

export function isObject<T = object>(input: unknown): input is T {
  if (!isObjectLike(input) || Object.prototype.toString.call(input) !== '[object Object]') {
    return false
  }
  if (Object.getPrototypeOf(input) === null) {
    return true
  }
  let proto = input
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }
  return Object.getPrototypeOf(input) === proto
}

export function isDisjoint(...headers: Array<object | undefined>) {
  const sources = headers.filter(Boolean) as object[]

  if (sources.length === 0 || sources.length === 1) {
    return true
  }

  let acc!: Set<string>
  for (const header of sources) {
    const parameters = Object.keys(header)
    if (!acc || acc.size === 0) {
      acc = new Set(parameters)
      continue
    }

    for (const parameter of parameters) {
      if (acc.has(parameter)) {
        return false
      }
      acc.add(parameter)
    }
  }

  return true
}

export const isJWK = (key: unknown): key is types.JWK & { kty: string } =>
  isObject<types.JWK>(key) && typeof key.kty === 'string'

export const isPrivateJWK = (key: types.JWK & { kty: string }) =>
  key.kty !== 'oct' &&
  ((key.kty === 'AKP' && typeof key.priv === 'string') || typeof key.d === 'string')

export const isPublicJWK = (key: types.JWK & { kty: string }) =>
  key.kty !== 'oct' && key.d === undefined && key.priv === undefined

export const isSecretJWK = (key: types.JWK & { kty: string }) =>
  key.kty === 'oct' && typeof key.k === 'string'
