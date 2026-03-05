import type * as types from '../types.d.ts'
import { isObject } from './is_object.ts'

export const isJWK = (key: unknown): key is types.JWK & { kty: string } =>
  isObject<types.JWK>(key) && typeof key.kty === 'string'

export const isPrivateJWK = (key: types.JWK & { kty: string }) =>
  key.kty !== 'oct' &&
  ((key.kty === 'AKP' && typeof key.priv === 'string') || typeof key.d === 'string')

export const isPublicJWK = (key: types.JWK & { kty: string }) =>
  key.kty !== 'oct' && key.d === undefined && key.priv === undefined

export const isSecretJWK = (key: types.JWK & { kty: string }) =>
  key.kty === 'oct' && typeof key.k === 'string'
