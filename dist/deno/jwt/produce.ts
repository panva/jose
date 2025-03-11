import type * as types from '../types.d.ts'
import epoch from '../lib/epoch.ts'
import secs from '../lib/secs.ts'
import isObject from '../lib/is_object.ts'
import { encoder } from '../lib/buffer_utils.ts'

function validateInput(label: string, input: number) {
  if (!Number.isFinite(input)) {
    throw new TypeError(`Invalid ${label} input`)
  }

  return input
}

export class ProduceJWT {
  #payload!: types.JWTPayload

  constructor(payload: types.JWTPayload) {
    if (!isObject(payload)) {
      throw new TypeError('JWT Claims Set MUST be an object')
    }
    this.#payload = structuredClone(payload)
  }

  data(): Uint8Array {
    return encoder.encode(JSON.stringify(this.#payload))
  }

  get iss(): string | undefined {
    return this.#payload.iss
  }

  set iss(value: string) {
    this.#payload.iss = value
  }

  get sub(): string | undefined {
    return this.#payload.sub
  }

  set sub(value: string) {
    this.#payload.sub = value
  }

  get aud(): string | string[] | undefined {
    return this.#payload.aud
  }

  set aud(value: string | string[]) {
    this.#payload.aud = value
  }

  get jti(): string | undefined {
    return this.#payload.jti
  }

  set jti(value: string) {
    this.#payload.jti = value
  }

  get nbf(): number | undefined {
    return this.#payload.nbf
  }

  set nbf(value: number | string | Date) {
    if (typeof value === 'number') {
      this.#payload.nbf = validateInput('setNotBefore', value)
    } else if (value instanceof Date) {
      this.#payload.nbf = validateInput('setNotBefore', epoch(value))
    } else {
      this.#payload.nbf = epoch(new Date()) + secs(value)
    }
  }

  get exp(): number | undefined {
    return this.#payload.exp
  }

  set exp(value: number | string | Date) {
    if (typeof value === 'number') {
      this.#payload.exp = validateInput('setExpirationTime', value)
    } else if (value instanceof Date) {
      this.#payload.exp = validateInput('setExpirationTime', epoch(value))
    } else {
      this.#payload.exp = epoch(new Date()) + secs(value)
    }
  }

  get iat(): number | undefined {
    return this.#payload.iat
  }

  set iat(value: number | string | Date | undefined) {
    if (typeof value === 'undefined') {
      this.#payload.iat = epoch(new Date())
    } else if (value instanceof Date) {
      this.#payload.iat = validateInput('setIssuedAt', epoch(value))
    } else if (typeof value === 'string') {
      this.#payload.iat = validateInput('setIssuedAt', epoch(new Date()) + secs(value))
    } else {
      this.#payload.iat = validateInput('setIssuedAt', value)
    }
  }
}
