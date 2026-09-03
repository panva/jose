import type * as types from '../types.d.ts'
import { JWSInvalid, JWSSignatureVerificationFailed } from '../util/errors.js'
import { assertNotSet } from './helpers.js'
import type { JWSAlgorithmResolver } from './jws_algorithm.js'
import { createCompactSignature, createSignature, type SignInput } from './jws_sign.js'
import {
  encodeJsonUnencodedPayload,
  parseProtectedHeader,
  prepareVerify,
  snapshotJws,
  verifyCompact,
  verifyResult,
  verifySignature,
  type VerifyGetKey,
  type VerifyShared,
} from './jws_verify.js'
import { isObject } from './type_checks.js'

interface CompactSignInstance {
  setProtectedHeader(header: types.CompactJWSHeaderParameters): this
  sign(key: types.KeyInput, options?: types.SignOptions): Promise<string>
}

interface CompactSignConstructor {
  new (payload: Uint8Array): CompactSignInstance
}

export function createCompactSignClass(resolve: JWSAlgorithmResolver): CompactSignConstructor {
  class CompactSign {
    #p: Uint8Array
    #ph!: types.CompactJWSHeaderParameters

    constructor(payload: Uint8Array) {
      if (!(payload instanceof Uint8Array)) {
        throw new TypeError('payload must be an instance of Uint8Array')
      }
      this.#p = payload
    }

    setProtectedHeader(protectedHeader: types.CompactJWSHeaderParameters): this {
      assertNotSet(this.#ph, 'setProtectedHeader')
      this.#ph = protectedHeader
      return this
    }

    async sign(key: types.KeyInput, options?: types.SignOptions): Promise<string> {
      return createCompactSignature(resolve, this.#p, this.#ph, options?.crit, key, () => {
        throw new TypeError('use the flattened module for creating JWS with b64: false')
      })
    }
  }

  return CompactSign
}

type CompactVerifyGetKey = types.GetKeyFunction<
  types.CompactJWSHeaderParameters,
  types.FlattenedJWSInput
>

export type CompactVerifyImplementation = (
  jws: string | Uint8Array,
  key: types.KeyInput | CompactVerifyGetKey,
  options?: types.VerifyOptions,
) => Promise<types.CompactVerifyResult & Partial<types.ResolvedKey>>

export function createCompactVerifyFunction(
  resolve: JWSAlgorithmResolver,
): CompactVerifyImplementation {
  async function compactVerify(
    jws: Parameters<CompactVerifyImplementation>[0],
    key: Parameters<CompactVerifyImplementation>[1],
    options?: Parameters<CompactVerifyImplementation>[2],
  ) {
    const verified = await verifyCompact(
      resolve,
      jws,
      prepareVerify(options),
      key as types.KeyInput | VerifyGetKey,
    )
    const result = {
      payload: verified[0],
      protectedHeader: verified[1] as types.CompactJWSHeaderParameters,
    }
    return typeof key === 'function' ? { ...result, key: verified[3] } : result
  }

  return compactVerify
}

interface FlattenedSignInstance {
  setProtectedHeader(header: types.JWSHeaderParameters): this
  setUnprotectedHeader(header: types.JWSHeaderParameters): this
  sign(key: types.KeyInput, options?: types.SignOptions): Promise<types.FlattenedJWS>
}

interface FlattenedSignConstructor {
  new (payload: Uint8Array): FlattenedSignInstance
}

export function createFlattenedSignClass(resolve: JWSAlgorithmResolver): FlattenedSignConstructor {
  class FlattenedSign {
    #p: Uint8Array
    #ph!: types.JWSHeaderParameters
    #uh!: types.JWSHeaderParameters

    constructor(payload: Uint8Array) {
      if (!(payload instanceof Uint8Array)) {
        throw new TypeError('payload must be an instance of Uint8Array')
      }
      this.#p = payload
    }

    setProtectedHeader(protectedHeader: types.JWSHeaderParameters): this {
      assertNotSet(this.#ph, 'setProtectedHeader')
      this.#ph = protectedHeader
      return this
    }

    setUnprotectedHeader(unprotectedHeader: types.JWSHeaderParameters): this {
      assertNotSet(this.#uh, 'setUnprotectedHeader')
      this.#uh = unprotectedHeader
      return this
    }

    async sign(key: types.KeyInput, options?: types.SignOptions): Promise<types.FlattenedJWS> {
      const [jws] = await createSignature(
        resolve,
        {
          payload: this.#p,
          protectedHeader: this.#ph,
          unprotectedHeader: this.#uh,
          crit: options?.crit,
        },
        key,
      )
      return jws
    }
  }

  return FlattenedSign
}

export type FlattenedVerifyImplementation = (
  jws: types.FlattenedJWSInput,
  key: types.KeyInput | VerifyGetKey,
  options?: types.VerifyOptions,
) => Promise<types.FlattenedVerifyResult & Partial<types.ResolvedKey>>

export function createFlattenedVerifyFunction(
  resolve: JWSAlgorithmResolver,
): FlattenedVerifyImplementation {
  async function flattenedVerify(
    jws: Parameters<FlattenedVerifyImplementation>[0],
    key: Parameters<FlattenedVerifyImplementation>[1],
    options?: Parameters<FlattenedVerifyImplementation>[2],
  ) {
    if (!isObject(jws)) {
      throw new JWSInvalid('Flattened JWS must be an object')
    }

    const snapshot = snapshotJws(jws)
    if (snapshot.protected === undefined && snapshot.header === undefined) {
      throw new JWSInvalid('Flattened JWS must have either of the "protected" or "header" members')
    }
    if (snapshot.protected !== undefined && typeof snapshot.protected !== 'string') {
      throw new JWSInvalid('JWS Protected Header incorrect type')
    }
    if (snapshot.payload === undefined) {
      throw new JWSInvalid('JWS Payload missing')
    }
    if (typeof snapshot.signature !== 'string') {
      throw new JWSInvalid('JWS Signature missing or incorrect type')
    }
    if (snapshot.header !== undefined && !isObject(snapshot.header)) {
      throw new JWSInvalid('JWS Unprotected Header incorrect type')
    }

    return verifyResult(
      snapshot,
      await verifySignature(
        resolve,
        snapshot,
        prepareVerify(options),
        key,
        encodeJsonUnencodedPayload,
      ),
    )
  }

  return flattenedVerify
}

export interface GeneralSignature<Parent> {
  setProtectedHeader(protectedHeader: types.JWSHeaderParameters): GeneralSignature<Parent>
  setUnprotectedHeader(unprotectedHeader: types.JWSHeaderParameters): GeneralSignature<Parent>
  addSignature(key: types.KeyInput, options?: types.SignOptions): GeneralSignature<Parent>
  sign(): Promise<types.GeneralJWS>
  done(): Parent
}

type SignatureState = [
  protectedHeader: types.JWSHeaderParameters | undefined,
  unprotectedHeader: types.JWSHeaderParameters | undefined,
  key: types.KeyInput,
  crit: types.SignOptions['crit'],
]

interface GeneralSignInstance {
  addSignature(
    key: types.KeyInput,
    options?: types.SignOptions,
  ): GeneralSignature<GeneralSignInstance>
  sign(): Promise<types.GeneralJWS>
}

interface GeneralSignConstructor {
  new (payload: Uint8Array): GeneralSignInstance
}

export function createGeneralSignClass(resolve: JWSAlgorithmResolver): GeneralSignConstructor {
  class GeneralSign {
    #p: Uint8Array
    #s: IndividualSignature[] = []

    constructor(payload: Uint8Array) {
      this.#p = payload
    }

    addSignature(key: types.KeyInput, options?: types.SignOptions): GeneralSignature<GeneralSign> {
      const signature = new IndividualSignature(this, key, options)
      this.#s.push(signature)
      return signature
    }

    async sign(): Promise<types.GeneralJWS> {
      if (!this.#s.length) {
        throw new JWSInvalid('at least one signature must be added')
      }
      if (!(this.#p instanceof Uint8Array)) {
        throw new TypeError('payload must be an instance of Uint8Array')
      }

      const jws: types.GeneralJWS = { signatures: [], payload: '' }
      const encoded: NonNullable<SignInput['encoded']> = []
      let b64: boolean | undefined

      for (let i = 0; i < this.#s.length; i++) {
        const signature = this.#s[i]
        const [protectedHeader, unprotectedHeader, key, crit] = signature.state
        const [{ payload, ...rest }, signatureB64] = await createSignature(
          resolve,
          {
            payload: this.#p,
            protectedHeader,
            unprotectedHeader,
            crit,
            encoded,
          },
          key,
        )

        if (b64 === undefined) {
          b64 = signatureB64
          jws.payload = payload
        } else if (b64 !== signatureB64) {
          throw new JWSInvalid('inconsistent use of JWS Unencoded Payload (RFC7797)')
        }
        jws.signatures.push(rest)
      }

      return jws
    }
  }

  class IndividualSignature implements GeneralSignature<GeneralSign> {
    #p: GeneralSign
    state: SignatureState

    constructor(parent: GeneralSign, key: types.KeyInput, options?: types.SignOptions) {
      this.#p = parent
      this.state = [undefined, undefined, key, options?.crit]
    }

    setProtectedHeader(protectedHeader: types.JWSHeaderParameters) {
      assertNotSet(this.state[0], 'setProtectedHeader')
      this.state[0] = protectedHeader
      return this
    }

    setUnprotectedHeader(unprotectedHeader: types.JWSHeaderParameters) {
      assertNotSet(this.state[1], 'setUnprotectedHeader')
      this.state[1] = unprotectedHeader
      return this
    }

    addSignature(...args: Parameters<GeneralSign['addSignature']>) {
      return this.#p.addSignature(...args)
    }

    sign(...args: Parameters<GeneralSign['sign']>) {
      return this.#p.sign(...args)
    }

    done() {
      return this.#p
    }
  }

  return GeneralSign
}

type SignatureCandidate = [
  jws: types.FlattenedJWSInput,
  protectedHeader: types.JWSHeaderParameters,
  mode: 0 | 1 | 2,
]

function snapshotSignature(
  signature: Record<string, unknown>,
  payload: types.FlattenedJWSInput['payload'],
): SignatureCandidate | undefined {
  try {
    const jws = snapshotJws(signature as unknown as types.FlattenedJWSInput, [payload])
    const { protected: encodedProtected, header, signature: encodedSignature } = jws
    if (encodedProtected === undefined && header === undefined) return undefined
    if (encodedProtected !== undefined && typeof encodedProtected !== 'string') return undefined
    if (typeof encodedSignature !== 'string') return undefined
    if (header !== undefined && !isObject<types.JWSHeaderParameters>(header)) return undefined

    const protectedHeader = parseProtectedHeader(encodedProtected)
    const { b64, crit } = protectedHeader
    return [
      jws,
      protectedHeader,
      Array.isArray(crit) && crit.includes('b64')
        ? typeof b64 === 'boolean'
          ? b64
            ? 1
            : 2
          : 0
        : 1,
    ]
  } catch {
    return undefined
  }
}

export type GeneralVerifyImplementation = (
  jws: types.GeneralJWSInput,
  key: types.KeyInput | VerifyGetKey,
  options?: types.VerifyOptions,
) => Promise<types.GeneralVerifyResult & Partial<types.ResolvedKey>>

export function createGeneralVerifyFunction(
  resolve: JWSAlgorithmResolver,
): GeneralVerifyImplementation {
  async function generalVerify(
    jws: Parameters<GeneralVerifyImplementation>[0],
    key: Parameters<GeneralVerifyImplementation>[1],
    options?: Parameters<GeneralVerifyImplementation>[2],
  ) {
    if (!isObject(jws)) {
      throw new JWSInvalid('General JWS must be an object')
    }

    const { signatures, payload: inputPayload } = jws
    if (!Array.isArray(signatures)) {
      throw new JWSInvalid('JWS Signatures missing or incorrect type')
    }
    const signatureEntries = Array.from(signatures)
    if (!signatureEntries.every(isObject)) {
      throw new JWSInvalid('JWS Signatures missing or incorrect type')
    }

    let shared: VerifyShared
    try {
      if (inputPayload === undefined) throw new Error()
      shared = prepareVerify(options)
    } catch {
      throw new JWSSignatureVerificationFailed()
    }

    const payload = inputPayload instanceof Uint8Array ? new Uint8Array(inputPayload) : inputPayload
    const candidates = signatureEntries
      .map((signature) => snapshotSignature(signature, payload))
      .filter((candidate): candidate is SignatureCandidate => candidate !== undefined)

    let modes = 0
    for (const [, , mode] of candidates) {
      modes |= mode
      if (modes === 3) {
        throw new JWSInvalid('inconsistent use of JWS Unencoded Payload (RFC7797)')
      }
    }

    for (const candidate of candidates) {
      try {
        return verifyResult(
          candidate[0],
          await verifySignature(
            resolve,
            candidate[0],
            shared,
            key,
            encodeJsonUnencodedPayload,
            candidate[1],
          ),
        )
      } catch {
        // Try the next signature.
      }
    }

    throw new JWSSignatureVerificationFailed()
  }

  return generalVerify
}
