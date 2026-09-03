import type * as types from '../types.d.ts'
import { JWTClaimValidationFailed } from '../util/errors.js'
import { assertNotSet } from './helpers.js'
import type { JWEAlgorithmSet } from './jwe_algorithm.js'
import { decryptCompact, prepareDecrypt, type DecryptGetKey } from './jwe_decrypt.js'
import { createJWE } from './jwe_encrypt.js'
import { JWTClaimsBuilder, jwtClaim, jwtData, validateClaimsSet } from './jwt_claims_set.js'

const EncryptJWTBase: new (payload?: types.JWTPayload) => types.ProduceJWT = JWTClaimsBuilder

interface EncryptJWTInstance extends types.ProduceJWT {
  setProtectedHeader(header: types.CompactJWEHeaderParameters): this
  setKeyManagementParameters(parameters: types.JWEKeyManagementHeaderParameters): this
  setContentEncryptionKey(cek: Uint8Array): this
  setInitializationVector(iv: Uint8Array): this
  replicateIssuerAsHeader(): this
  replicateSubjectAsHeader(): this
  replicateAudienceAsHeader(): this
  encrypt(key: types.KeyInput, options?: types.EncryptOptions): Promise<string>
}

interface EncryptJWTConstructor {
  new (payload?: types.JWTPayload): EncryptJWTInstance
  readonly prototype: EncryptJWTInstance
}

export function createEncryptJWTClass(algorithms: JWEAlgorithmSet): EncryptJWTConstructor {
  class EncryptJWT extends EncryptJWTBase {
    #cek!: Uint8Array
    #iv!: Uint8Array
    #km!: types.JWEKeyManagementHeaderParameters
    #ph!: types.CompactJWEHeaderParameters
    #ri!: boolean
    #rs!: boolean
    #ra!: boolean

    setProtectedHeader(protectedHeader: types.CompactJWEHeaderParameters): this {
      assertNotSet(this.#ph, 'setProtectedHeader')
      this.#ph = protectedHeader
      return this
    }

    setKeyManagementParameters(parameters: types.JWEKeyManagementHeaderParameters): this {
      assertNotSet(this.#km, 'setKeyManagementParameters')
      this.#km = parameters
      return this
    }

    setContentEncryptionKey(cek: Uint8Array): this {
      assertNotSet(this.#cek, 'setContentEncryptionKey')
      this.#cek = cek
      return this
    }

    setInitializationVector(iv: Uint8Array): this {
      assertNotSet(this.#iv, 'setInitializationVector')
      this.#iv = iv
      return this
    }

    replicateIssuerAsHeader(): this {
      this.#ri = true
      return this
    }

    replicateSubjectAsHeader(): this {
      this.#rs = true
      return this
    }

    replicateAudienceAsHeader(): this {
      this.#ra = true
      return this
    }

    async encrypt(key: types.KeyInput, options?: types.EncryptOptions): Promise<string> {
      const plaintext = jwtData(this)
      if (this.#ph && (this.#ri || this.#rs || this.#ra)) {
        this.#ph = {
          ...this.#ph,
          iss: this.#ri ? jwtClaim(this, 'iss') : undefined,
          sub: this.#rs ? jwtClaim(this, 'sub') : undefined,
          aud: this.#ra ? jwtClaim(this, 'aud') : undefined,
        }
      }

      const jwe = await createJWE(
        [
          plaintext,
          this.#ph,
          undefined,
          undefined,
          undefined,
          this.#cek,
          this.#iv,
          this.#km,
          undefined,
          false,
        ],
        key,
        algorithms,
        options,
      )
      return [jwe.protected, jwe.encrypted_key, jwe.iv, jwe.ciphertext, jwe.tag].join('.')
    }
  }

  return EncryptJWT
}

type JWTDecryptOptions = types.DecryptOptions & types.JWTClaimVerificationOptions
type JWTDecryptGetKey = types.GetKeyFunction<types.CompactJWEHeaderParameters, types.FlattenedJWE>

export type JWTDecryptImplementation = (
  jwt: string | Uint8Array,
  key: types.KeyInput | JWTDecryptGetKey,
  options?: JWTDecryptOptions,
) => Promise<types.JWTDecryptResult & Partial<types.ResolvedKey>>

export function createJwtDecryptFunction(algorithms: JWEAlgorithmSet): JWTDecryptImplementation {
  async function jwtDecrypt(
    jwt: Parameters<JWTDecryptImplementation>[0],
    key: Parameters<JWTDecryptImplementation>[1],
    options?: Parameters<JWTDecryptImplementation>[2],
  ) {
    const decrypted = await decryptCompact(
      jwt,
      prepareDecrypt(options, algorithms),
      key as types.KeyInput | DecryptGetKey,
    )
    const protectedHeader = decrypted[1] as types.CompactJWEHeaderParameters
    const payload = validateClaimsSet(protectedHeader, decrypted[0], options)
    for (const claim of ['iss', 'sub', 'aud'] as const) {
      if (
        protectedHeader[claim] !== undefined &&
        (claim === 'aud'
          ? JSON.stringify(protectedHeader.aud) !== JSON.stringify(payload.aud)
          : protectedHeader[claim] !== payload[claim])
      ) {
        throw new JWTClaimValidationFailed(
          `replicated "${claim}" claim header parameter mismatch`,
          payload,
          claim,
          'mismatch',
        )
      }
    }
    const result = { payload, protectedHeader }
    return typeof key === 'function' ? { ...result, key: decrypted[2] } : result
  }

  return jwtDecrypt
}
