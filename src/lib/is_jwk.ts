import type { JWK } from '../types.d.ts'
import isObject from './is_object.js'

export function isJWK(key: unknown): key is JWK & { kty: string } {
  return isObject<JWK>(key) && typeof key.kty === 'string'
}

export function isPrivateJWK(key: JWK & { kty: string }) {
  return key.kty !== 'oct' && typeof key.d === 'string'
}

export function isPublicJWK(key: JWK & { kty: string }) {
  return key.kty !== 'oct' && typeof key.d === 'undefined'
}

export function isSecretJWK(key: JWK & { kty: string }) {
  return key.kty === 'oct' && typeof key.k === 'string'
}
