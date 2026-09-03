import type * as types from '../types.d.ts'
import { JWTInvalid } from '../util/errors.js'
import { assertNotSet } from './helpers.js'
import type { JWSAlgorithmResolver } from './jws_algorithm.js'
import { createCompactSignature } from './jws_sign.js'
import { prepareVerify, verifyCompact, type VerifyGetKey } from './jws_verify.js'
import { JWTClaimsBuilder, jwtData, validateClaimsSet } from './jwt_claims_set.js'

const SignJWTBase: new (payload?: types.JWTPayload) => types.ProduceJWT = JWTClaimsBuilder

interface SignJWTInstance extends types.ProduceJWT {
  setProtectedHeader(header: types.JWTHeaderParameters): this
  sign(key: types.KeyInput, options?: types.SignOptions): Promise<string>
}

interface SignJWTConstructor {
  new (payload?: types.JWTPayload): SignJWTInstance
}

export function createSignJWTClass(resolve: JWSAlgorithmResolver): SignJWTConstructor {
  class SignJWT extends SignJWTBase {
    #ph!: types.JWTHeaderParameters

    setProtectedHeader(protectedHeader: types.JWTHeaderParameters): this {
      assertNotSet(this.#ph, 'setProtectedHeader')
      this.#ph = protectedHeader
      return this
    }

    async sign(key: types.KeyInput, options?: types.SignOptions): Promise<string> {
      return createCompactSignature(resolve, jwtData(this), this.#ph, options?.crit, key, () => {
        throw new JWTInvalid('JWTs MUST NOT use unencoded payload')
      })
    }
  }

  return SignJWT
}

type JWTVerifyOptions = types.VerifyOptions & types.JWTClaimVerificationOptions
type JWTVerifyGetKey = types.GetKeyFunction<
  types.CompactJWSHeaderParameters,
  types.FlattenedJWSInput
>

export type JWTVerifyImplementation = (
  jwt: string | Uint8Array,
  key: types.KeyInput | JWTVerifyGetKey,
  options?: JWTVerifyOptions,
) => Promise<types.JWTVerifyResult & Partial<types.ResolvedKey>>

export function createJwtVerifyFunction(resolve: JWSAlgorithmResolver): JWTVerifyImplementation {
  async function jwtVerify(
    jwt: Parameters<JWTVerifyImplementation>[0],
    key: Parameters<JWTVerifyImplementation>[1],
    options?: Parameters<JWTVerifyImplementation>[2],
  ) {
    const verified = await verifyCompact(
      resolve,
      jwt,
      prepareVerify(options),
      key as types.KeyInput | VerifyGetKey,
    )
    if (!verified[2]) {
      throw new JWTInvalid('JWTs MUST NOT use unencoded payload')
    }
    const payload = validateClaimsSet(verified[1], verified[0], options)
    const result = { payload, protectedHeader: verified[1] as types.JWTHeaderParameters }
    return typeof key === 'function' ? { ...result, key: verified[3] } : result
  }

  return jwtVerify
}
