/**
 * Selective Disclosure for JWTs (SD-JWT) Issuer
 *
 * @module
 */

import type * as types from '../types.d.ts'
import * as base64url from '../util/base64url.js'
import { encoder } from '../lib/buffer_utils.js'
import { formatSdJwt, getSdAlg } from '../lib/sd.js'

export { formatSdJwt }
export type JsonObject = { [Key in string]: JsonValue }
export type JsonArray = JsonValue[]
export type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | JsonObject | JsonArray

interface DisclosureInput {
  value: JsonValue
  key?: string
  alg?: string
}

function disclosureString(input: DisclosureInput) {
  const salt = base64url.encode(crypto.getRandomValues(new Uint8Array(16)))
  let array: JsonArray
  if (input.key !== undefined) {
    array = [salt, input.key, input.value]
  } else {
    array = [salt, input.value]
  }
  return base64url.encode(encoder.encode(JSON.stringify(array)))
}

async function disclosureDigest(disclosure: string, alg: string) {
  return base64url.encode(
    new Uint8Array(await crypto.subtle.digest(alg, encoder.encode(disclosure))),
  )
}

interface ConcealThis {
  disclosures: string[]
  alg: string
}

const concealTarget: ConcealTargetFn = async function concealTarget(
  this: ConcealThis,
  value: Array<any> | Record<string, any>,
  properties?: (string | number)[],
) {
  properties ??= Object.keys(value)
  if (Array.isArray(value)) {
    for (const key of properties) {
      value[+key] = await concealArrayMember.call(this, value[+key])
    }
  } else {
    await concealObjectProperties.call(this, value, properties as string[])
  }
}

/**
 * Conceal a payload claim.
 *
 * @param target Object or Array to conceal.
 * @param properties The properties of the `target` to conceal. Default is that all properties of
 *   the `target` are concealed (when `target` is an Object) and that all members of the `target`
 *   are concealed (when `target` is an Array).
 */
export type ConcealTargetFn = (
  target: Array<any> | Record<string, any>,
  properties?: (string | number)[],
) => Promise<void>

/**
 * Adds a random number of Decoy Digests to a claim.
 *
 * @param target Target claim to add Decoy Digests to.
 * @param options
 */
export type AddDecoysToTargetFn = (
  target: Array<any> | Record<string, any>,
  options?: {
    /** Minimum number of Decoy Digests to add. Default is 3 */
    min?: number
    /** Maximum number of Decoy Digests to add. Default is 5 */
    max?: number
  },
) => Promise<void>

function secureRandomIndex(max: number) {
  if (max <= 0 || max > Number.MAX_SAFE_INTEGER) {
    throw new Error('TODO')
  }

  const uint32Max = 0xffffffff
  const limit = uint32Max - (uint32Max % max) // Avoid modulo bias

  let rand: number
  do {
    const randArray = new Uint32Array(1)
    crypto.getRandomValues(randArray)
    rand = randArray[0]
  } while (rand >= limit) // Re-roll if biased

  return rand % max
}

async function generateDecoy(alg: string) {
  return base64url.encode(
    new Uint8Array(await crypto.subtle.digest(alg, crypto.getRandomValues(new Uint8Array(16)))),
  )
}

const addDecoysToTarget: AddDecoysToTargetFn = async function addDecoysToTarget(
  this: ConcealThis,
  target: Array<any> | Record<string, any>,
  options?: { min?: number; max?: number },
) {
  const min = options?.min ?? 3
  const max = options?.max ?? 5
  if (typeof min !== 'number' || typeof max !== 'number' || min <= 0 || max < min) {
    throw new Error('addDecoys: max must be >= min and min must be > 0')
  }
  const decoyCount = secureRandomIndex(max - min + 1) + min
  for (let i = 0; i < decoyCount; i++) {
    const decoy = await generateDecoy(this.alg)
    if (Array.isArray(target)) {
      target.splice(secureRandomIndex(target.length + 1), 0, { '...': decoy })
    } else {
      if (target._sd === undefined) {
        target._sd = []
      } else if (!Array.isArray(target._sd)) {
        throw new Error('TODO')
      }
      target._sd.push(decoy)
      target._sd = target._sd.sort()
    }
  }
}

async function concealArrayMember(this: ConcealThis, value: JsonValue) {
  const { alg } = this
  const disclosure = disclosureString({ value, alg })
  const digest = await disclosureDigest(disclosure, alg)
  this.disclosures.push(disclosure)
  return { '...': digest }
}

async function concealObjectProperties(
  this: ConcealThis,
  value: JsonObject,
  properties: string[] = Object.keys(value),
) {
  if (value._sd !== undefined) {
    throw new Error('TODO')
  }

  const { alg, disclosures } = this
  const sdDigests = [] as string[]

  for (const [k, v] of Object.entries(value)) {
    if (properties.includes(k)) {
      const disclosure = disclosureString({ value: v, alg: alg, key: k })
      disclosures.push(disclosure)
      sdDigests.push(await disclosureDigest(disclosure, alg))
      delete value[k]
    }
  }

  if (sdDigests.length) {
    value._sd = sdDigests.sort()
  }
}

/**
 * Function used to conceal the payload's individual claims and optionally add Decoy Digests.
 *
 * @param payload Payload
 * @param conceal See {@link ConcealTargetFn}
 * @param addDecoys See {@link AddDecoysToTargetFn}
 */
export type ConcealFunction<T> = (
  /** Bar */
  payload: T,
  conceal: ConcealTargetFn,
  addDecoys: AddDecoysToTargetFn,
) => Promise<void>

/**
 * The SdJwtPayload class is used to build SD-JWT payloads and conceal
 *
 * This class is exported (as a named export) from the subpath export `'jose/sd/issuer'`.
 *
 * @example
 *
 * ```js
 * // TODO
 * ```
 */
export class SdJwtPayload<T extends types.JWTPayload = types.JWTPayload> {
  #payload: T & {
    _sd_alg?: string
    cnf?: Record<string, JsonValue>
  }
  #alg: string | undefined
  #disclosures: string[] = []

  constructor(payload: T = {} as T) {
    this.#payload = structuredClone(payload)
  }

  /**
   * Sets the SD-JWT Hash Function Claim (`_sd_alg`) for the payload.
   *
   * @param alg Hash Function Claim value, support are default-length SHA-2 digests.
   */
  setSdAlg(alg: string) {
    if (this.#alg) {
      throw new Error('TODO')
    }
    this.#alg = getSdAlg(alg)
    if (this.#alg !== 'sha-256') {
      this.#payload._sd_alg = this.#alg
    }
    return this
  }

  /**
   * Sets the confirmation claim (`cnf`) in the payload.
   *
   * @example
   *
   * ```ts
   * let payload!: SdJwtPayload
   *
   * payload.setConfirmationClaim('jwk', {
   *   kty: 'EC',
   *   crv: 'P-256',
   *   x: 'TCAER19Zvu3OHF4j4W4vfSVoHIP1ILilDls7vCeGemc',
   *   y: 'ZxjiWWbZMQGHVWKVQ4hbSIirsVfuecCE6t4jT9F2HZQ',
   * })
   * ```
   *
   * @param cnf The confirmation claim value to set.
   */
  setConfirmationClaim(method: string, value: JsonValue) {
    this.#payload.cnf ||= {}
    this.#payload.cnf[method] = value
    return this
  }

  /**
   * Conceal the payload's claims and optionally adds decoys.
   *
   * @param fn - An asynchronous function that receives the payload, a conceal helper, and an
   *   addDecoys helper.
   *
   * @returns A Promise that resolves when the concealment operation is complete.
   */
  async conceal(fn: ConcealFunction<T>) {
    this.#alg ||= getSdAlg()
    const self = { disclosures: this.#disclosures, alg: this.#alg }
    await fn(this.#payload, concealTarget.bind(self), addDecoysToTarget.bind(self))
  }

  /** Returns the SD-JWT Disclosures collected from the payload's concealed claims. */
  get disclosures() {
    return this.#disclosures
  }

  /** Returns the payload in a format fit for the {@link jwt/sign.SignJWT SignJWT} constructor. */
  get payload(): T {
    return this.#payload
  }

  /**
   * Returns the payload in a format fit for the {@link jws/compact/sign.CompactSign CompactSign},
   * {@link jws/flattened/sign.FlattenedSign FlattenedSign}, and
   * {@link jws/general/sign.GeneralSign GeneralSign} constructors.
   */
  data() {
    return encoder.encode(JSON.stringify(this.#payload))
  }
}
