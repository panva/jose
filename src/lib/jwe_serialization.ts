import type * as types from '../types.d.ts'
import { encode as b64u } from '../util/base64url.js'
import { JWEDecryptionFailed, JWEInvalid } from '../util/errors.js'
import { generateCek } from './content_encryption.js'
import { assertNotSet } from './helpers.js'
import {
  isJWECEKTransport,
  resolveJWEKeyManagement,
  type JWEAlgorithmSet,
} from './jwe_algorithm.js'
import {
  checkRecipient,
  decryptCompact,
  decryptJWE,
  decryptRecipient,
  decryptResult,
  prepareDecrypt,
  shareJWE,
  snapshotRecipientJWE,
  snapshotSharedJWE,
  type DecryptGetKey,
  type DecryptShared,
  type SharedJWE,
} from './jwe_decrypt.js'
import {
  checkDisjoint,
  checkEncryptHeaders,
  createJWE,
  encryptJWE,
  transportCek,
  type CheckedHeaders,
  type EncryptInput,
} from './jwe_encrypt.js'
import { assertUint8Array, isObject } from './type_checks.js'

interface CompactEncryptInstance {
  setContentEncryptionKey(cek: Uint8Array): this
  setInitializationVector(iv: Uint8Array): this
  setProtectedHeader(header: types.CompactJWEHeaderParameters): this
  setKeyManagementParameters(parameters: types.JWEKeyManagementHeaderParameters): this
  encrypt(key: types.KeyInput, options?: types.EncryptOptions): Promise<string>
}

interface CompactEncryptConstructor {
  new (plaintext: Uint8Array): CompactEncryptInstance
  readonly prototype: CompactEncryptInstance
}

export function createCompactEncryptClass(algorithms: JWEAlgorithmSet): CompactEncryptConstructor {
  class CompactEncrypt {
    #p: Uint8Array
    #ph!: types.CompactJWEHeaderParameters
    #cek!: Uint8Array
    #iv!: Uint8Array
    #km!: types.JWEKeyManagementHeaderParameters

    constructor(plaintext: Uint8Array) {
      assertUint8Array(plaintext, 'plaintext')
      this.#p = plaintext
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

    async encrypt(key: types.KeyInput, options?: types.EncryptOptions): Promise<string> {
      const jwe = await createJWE(
        [
          this.#p,
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

  return CompactEncrypt
}

type CompactDecryptGetKey = types.GetKeyFunction<
  types.CompactJWEHeaderParameters,
  types.FlattenedJWE
>

export type CompactDecryptImplementation = (
  jwe: string | Uint8Array,
  key: types.KeyInput | CompactDecryptGetKey,
  options?: types.DecryptOptions,
) => Promise<types.CompactDecryptResult & Partial<types.ResolvedKey>>

export function createCompactDecryptFunction(
  algorithms: JWEAlgorithmSet,
): CompactDecryptImplementation {
  async function compactDecrypt(
    jwe: Parameters<CompactDecryptImplementation>[0],
    key: Parameters<CompactDecryptImplementation>[1],
    options?: Parameters<CompactDecryptImplementation>[2],
  ) {
    const decrypted = await decryptCompact(
      jwe,
      prepareDecrypt(options, algorithms),
      key as types.KeyInput | DecryptGetKey,
    )
    const result = {
      plaintext: decrypted[0],
      protectedHeader: decrypted[1] as types.CompactJWEHeaderParameters,
    }
    return typeof key === 'function' ? { ...result, key: decrypted[2] } : result
  }

  return compactDecrypt
}

interface FlattenedEncryptInstance {
  setKeyManagementParameters(parameters: types.JWEKeyManagementHeaderParameters): this
  setProtectedHeader(header: types.JWEHeaderParameters): this
  setSharedUnprotectedHeader(header: types.JWEHeaderParameters): this
  setUnprotectedHeader(header: types.JWEHeaderParameters): this
  setAdditionalAuthenticatedData(aad: Uint8Array): this
  setContentEncryptionKey(cek: Uint8Array): this
  setInitializationVector(iv: Uint8Array): this
  encrypt(key: types.KeyInput, options?: types.EncryptOptions): Promise<types.FlattenedJWE>
}

interface FlattenedEncryptConstructor {
  new (plaintext: Uint8Array): FlattenedEncryptInstance
  readonly prototype: FlattenedEncryptInstance
}

export function createFlattenedEncryptClass(
  algorithms: JWEAlgorithmSet,
): FlattenedEncryptConstructor {
  class FlattenedEncrypt {
    #p: Uint8Array
    #ph!: types.JWEHeaderParameters | undefined
    #sh!: types.JWEHeaderParameters | undefined
    #uh!: types.JWEHeaderParameters | undefined
    #aad!: Uint8Array | undefined
    #cek!: Uint8Array | undefined
    #iv!: Uint8Array | undefined
    #km?: types.JWEKeyManagementHeaderParameters

    constructor(plaintext: Uint8Array) {
      assertUint8Array(plaintext, 'plaintext')
      this.#p = plaintext
    }

    setKeyManagementParameters(parameters: types.JWEKeyManagementHeaderParameters): this {
      assertNotSet(this.#km, 'setKeyManagementParameters')
      this.#km = parameters
      return this
    }

    setProtectedHeader(protectedHeader: types.JWEHeaderParameters): this {
      assertNotSet(this.#ph, 'setProtectedHeader')
      this.#ph = protectedHeader
      return this
    }

    setSharedUnprotectedHeader(sharedUnprotectedHeader: types.JWEHeaderParameters): this {
      assertNotSet(this.#sh, 'setSharedUnprotectedHeader')
      this.#sh = sharedUnprotectedHeader
      return this
    }

    setUnprotectedHeader(unprotectedHeader: types.JWEHeaderParameters): this {
      assertNotSet(this.#uh, 'setUnprotectedHeader')
      this.#uh = unprotectedHeader
      return this
    }

    setAdditionalAuthenticatedData(aad: Uint8Array): this {
      this.#aad = aad
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

    encrypt(key: types.KeyInput, options?: types.EncryptOptions): Promise<types.FlattenedJWE> {
      return createJWE(
        [
          this.#p,
          this.#ph,
          this.#uh,
          this.#sh,
          this.#aad,
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
    }
  }

  return FlattenedEncrypt
}

export type FlattenedDecryptImplementation = (
  jwe: types.FlattenedJWE,
  key: types.KeyInput | DecryptGetKey,
  options?: types.DecryptOptions,
) => Promise<types.FlattenedDecryptResult & Partial<types.ResolvedKey>>

export function createFlattenedDecryptFunction(
  algorithms: JWEAlgorithmSet,
): FlattenedDecryptImplementation {
  async function flattenedDecrypt(
    jwe: Parameters<FlattenedDecryptImplementation>[0],
    key: Parameters<FlattenedDecryptImplementation>[1],
    options?: Parameters<FlattenedDecryptImplementation>[2],
  ) {
    if (!isObject(jwe)) throw new JWEInvalid('Flattened JWE must be an object')
    const shared = snapshotSharedJWE(jwe)
    const [recipient, , error] = snapshotRecipientJWE(jwe)
    if (!recipient) throw error
    const snapshot: types.FlattenedJWE = { ...shared, ...recipient }
    checkRecipient(snapshot)
    return decryptResult(
      snapshot,
      await decryptJWE(snapshot, prepareDecrypt(options, algorithms), key),
    )
  }

  return flattenedDecrypt
}

function copyOptionalMembers(
  flattened: types.FlattenedJWE,
  jwe: types.GeneralJWE,
  recipient: types.GeneralJWE['recipients'][number],
): void {
  const { aad, protected: protectedHeader, unprotected, header } = flattened
  if (aad) jwe.aad = aad
  if (protectedHeader) jwe.protected = protectedHeader
  if (unprotected) jwe.unprotected = unprotected
  if (header) recipient.header = header
}

interface GeneralEncryptRecipient {
  setUnprotectedHeader(header: types.JWEHeaderParameters): this
  setKeyManagementParameters(parameters: types.JWEKeyManagementHeaderParameters): this
  addRecipient(key: types.KeyInput, options?: types.CritOption): GeneralEncryptRecipient
  encrypt(): Promise<types.GeneralJWE>
  done(): GeneralEncryptInstance
}

interface GeneralEncryptInstance {
  addRecipient(key: types.KeyInput, options?: types.CritOption): GeneralEncryptRecipient
  setProtectedHeader(header: types.JWEHeaderParameters): this
  setSharedUnprotectedHeader(header: types.JWEHeaderParameters): this
  setAdditionalAuthenticatedData(aad: Uint8Array): this
  encrypt(): Promise<types.GeneralJWE>
}

interface GeneralEncryptConstructor {
  new (plaintext: Uint8Array): GeneralEncryptInstance
  readonly prototype: GeneralEncryptInstance
}

export function createGeneralEncryptClass(algorithms: JWEAlgorithmSet): GeneralEncryptConstructor {
  type RecipientState = [
    unprotectedHeader: types.JWEHeaderParameters | undefined,
    keyManagementParameters: types.JWEKeyManagementHeaderParameters | undefined,
    key: types.KeyInput,
    crit: types.CritOption['crit'],
  ]

  class GeneralEncrypt {
    #p: Uint8Array
    #r: IndividualRecipient[] = []
    #ph!: types.JWEHeaderParameters
    #uh!: types.JWEHeaderParameters
    #aad!: Uint8Array

    constructor(plaintext: Uint8Array) {
      this.#p = plaintext
    }

    addRecipient(key: types.KeyInput, options?: types.CritOption): IndividualRecipient {
      const recipient = new IndividualRecipient(this, key, options?.crit)
      this.#r.push(recipient)
      return recipient
    }

    setProtectedHeader(protectedHeader: types.JWEHeaderParameters): this {
      assertNotSet(this.#ph, 'setProtectedHeader')
      this.#ph = protectedHeader
      return this
    }

    setSharedUnprotectedHeader(sharedUnprotectedHeader: types.JWEHeaderParameters): this {
      assertNotSet(this.#uh, 'setSharedUnprotectedHeader')
      this.#uh = sharedUnprotectedHeader
      return this
    }

    setAdditionalAuthenticatedData(aad: Uint8Array): this {
      this.#aad = aad
      return this
    }

    async encrypt(): Promise<types.GeneralJWE> {
      if (!this.#r.length) throw new JWEInvalid('at least one recipient must be added')
      assertUint8Array(this.#p, 'plaintext')

      if (this.#r.length === 1) {
        const [unprotectedHeader, keyManagementParameters, key, crit] = this.#r[0].state
        const flattened = await createJWE(
          [
            this.#p,
            this.#ph,
            unprotectedHeader,
            this.#uh,
            this.#aad,
            undefined,
            undefined,
            keyManagementParameters,
            crit,
            false,
          ],
          key,
          algorithms,
        )
        const jwe: types.GeneralJWE = {
          ciphertext: flattened.ciphertext,
          recipients: [{}],
        }
        if (flattened.iv !== undefined) jwe.iv = flattened.iv
        if (flattened.tag !== undefined) jwe.tag = flattened.tag
        if (flattened.encrypted_key) jwe.recipients[0].encrypted_key = flattened.encrypted_key
        copyOptionalMembers(flattened, jwe, jwe.recipients[0])
        return jwe
      }

      let enc!: string
      let protectedHeader = this.#ph
      let sharedUnprotectedHeader = this.#uh
      const inputs: EncryptInput[] = []
      const checked: CheckedHeaders[] = []
      for (let index = 0; index < this.#r.length; index++) {
        const [unprotectedHeader, keyManagementParameters, , crit] = this.#r[index].state
        const input: EncryptInput = [
          this.#p,
          protectedHeader,
          unprotectedHeader,
          sharedUnprotectedHeader,
          this.#aad,
          undefined,
          undefined,
          keyManagementParameters,
          crit,
          true,
        ]
        const headers = checkEncryptHeaders(input, algorithms)
        inputs.push(input)
        checked.push(headers)
        if (index === 0) {
          protectedHeader = input[1]!
          sharedUnprotectedHeader = input[3]!
        }
        const capability = algorithms.alg[headers[1]]
        if (capability && !isJWECEKTransport(capability)) {
          throw new JWEInvalid(`"${headers[1]}" alg may only have a single recipient`)
        }
        if (!enc) enc = headers[2]!
        else if (enc !== headers[2]) {
          throw new JWEInvalid(
            'JWE "enc" (Encryption Algorithm) Header Parameter must be the same for all recipients',
          )
        }
      }

      const algEntries = checked.map(([, alg]) => {
        const capability = resolveJWEKeyManagement(algorithms, alg)
        if (!isJWECEKTransport(capability)) {
          throw new JWEInvalid(`"${alg}" alg may only have a single recipient`)
        }
        return capability
      })
      const cek = generateCek(checked[0][3]!)
      const jwe: types.GeneralJWE = { ciphertext: '', recipients: [] }
      for (let index = 0; index < this.#r.length; index++) {
        const [, keyManagementParameters, key] = this.#r[index].state
        const target: Record<string, string | types.JWEHeaderParameters> = {}
        jwe.recipients.push(target)
        if (index === 0) {
          inputs[0][5] = cek
          const flattened = await encryptJWE(inputs[0], checked[0], key, algorithms, algEntries[0])
          jwe.ciphertext = flattened.ciphertext
          jwe.iv = flattened.iv
          jwe.tag = flattened.tag
          target.encrypted_key = flattened.encrypted_key!
          copyOptionalMembers(flattened, jwe, target)
          continue
        }

        const [, , , encEntry] = checked[index]
        const unprotectedHeader = inputs[index][2]
        const algEntry = algEntries[index]
        const [, encryptedKey, parameters] = await transportCek(
          algEntry,
          encEntry!,
          key,
          cek,
          checked[index][0],
          keyManagementParameters,
        )
        target.encrypted_key = b64u(encryptedKey)
        if (unprotectedHeader || parameters) {
          const header: types.JWEHeaderParameters = { ...unprotectedHeader, ...parameters }
          if (parameters) checkDisjoint(inputs[index][1], header, inputs[index][3])
          target.header = header
        }
      }
      return jwe
    }
  }

  class IndividualRecipient {
    #p: GeneralEncrypt
    state: RecipientState

    constructor(parent: GeneralEncrypt, key: types.KeyInput, crit: types.CritOption['crit']) {
      this.#p = parent
      this.state = [undefined, undefined, key, crit]
    }

    setUnprotectedHeader(unprotectedHeader: types.JWEHeaderParameters): this {
      assertNotSet(this.state[0], 'setUnprotectedHeader')
      this.state[0] = unprotectedHeader
      return this
    }

    setKeyManagementParameters(parameters: types.JWEKeyManagementHeaderParameters): this {
      assertNotSet(this.state[1], 'setKeyManagementParameters')
      this.state[1] = parameters
      return this
    }

    addRecipient(...args: Parameters<GeneralEncrypt['addRecipient']>): IndividualRecipient {
      return this.#p.addRecipient(...args)
    }

    encrypt(): Promise<types.GeneralJWE> {
      return this.#p.encrypt()
    }

    done(): GeneralEncrypt {
      return this.#p
    }
  }

  return GeneralEncrypt
}

export type GeneralDecryptImplementation = (
  jwe: types.GeneralJWE,
  key: types.KeyInput | DecryptGetKey,
  options?: types.DecryptOptions,
) => Promise<types.GeneralDecryptResult & Partial<types.ResolvedKey>>

export function createGeneralDecryptFunction(
  algorithms: JWEAlgorithmSet,
): GeneralDecryptImplementation {
  async function generalDecrypt(
    jwe: Parameters<GeneralDecryptImplementation>[0],
    key: Parameters<GeneralDecryptImplementation>[1],
    options?: Parameters<GeneralDecryptImplementation>[2],
  ) {
    if (!isObject(jwe)) throw new JWEInvalid('General JWE must be an object')
    const inputRecipients = jwe.recipients
    if (!Array.isArray(inputRecipients)) {
      throw new JWEInvalid('JWE Recipients missing or incorrect type')
    }
    const recipients = Array.from(inputRecipients)
    if (!recipients.every(isObject)) {
      throw new JWEInvalid('JWE Recipients missing or incorrect type')
    }
    if (!recipients.length) throw new JWEInvalid('JWE Recipients has no members')

    let shared: DecryptShared
    let sharedJwe!: types.FlattenedJWE
    let token: SharedJWE
    try {
      shared = prepareDecrypt(options, algorithms)
      sharedJwe = snapshotSharedJWE(jwe)
      token = shareJWE(sharedJwe)
    } catch {
      throw new JWEDecryptionFailed()
    }

    const snapshots = recipients.map((recipient) => snapshotRecipientJWE(recipient))
    if (recipients.length > 1) {
      for (const [, headerAlg] of snapshots) {
        const alg = token[0]?.alg ?? headerAlg ?? sharedJwe.unprotected?.alg
        const capability = typeof alg === 'string' ? shared[5].alg[alg] : undefined
        if (capability && !isJWECEKTransport(capability)) {
          throw new JWEInvalid(`"${alg}" alg may only have a single recipient`)
        }
      }
    }

    for (const [recipient] of snapshots) {
      if (!recipient) continue
      try {
        const flattened: types.FlattenedJWE = { ...sharedJwe, ...recipient }
        checkRecipient(flattened)
        return decryptResult(flattened, await decryptRecipient(flattened, token, shared, key))
      } catch {
        // Try the next recipient without revealing which key matched.
      }
    }
    throw new JWEDecryptionFailed()
  }

  return generalDecrypt
}
