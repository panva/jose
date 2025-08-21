import type * as types from '../types.d.ts'
import isObject from './is_object.ts'

export function isJWK(key: unknown): key is types.JWK & { kty: string } {
  return isObject<types.JWK>(key) && typeof key.kty === 'string'
}

export function isPrivateJWK(key: types.JWK & { kty: string }) {
  return key.kty !== 'oct' && typeof key.d === 'string'
}

export function isPublicJWK(key: types.JWK & { kty: string }) {
  return key.kty !== 'oct' && typeof key.d === 'undefined'
}

export function isSecretJWK(key: types.JWK & { kty: string }) {
  return key.kty === 'oct' && typeof key.k === 'string'
}
