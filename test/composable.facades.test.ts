import test, { type ExecutionContext } from 'ava'

import * as jwsAlgorithms from '../src/algorithms/jws.js'
import * as jweAlgorithms from '../src/algorithms/jwe.js'
import * as contentEncryptionAlgorithms from '../src/algorithms/jwe/enc.js'
import * as keyAlgorithms from '../src/algorithms/key.js'
import { DEF } from '../src/algorithms/jwe/zip.js'
import { composeSignJWT } from '../src/composable/jwt/sign.js'
import { composeJwtVerify } from '../src/composable/jwt/verify.js'
import { composeEncryptJWT } from '../src/composable/jwt/encrypt.js'
import { composeJwtDecrypt } from '../src/composable/jwt/decrypt.js'
import { composeCompactSign } from '../src/composable/jws/compact/sign.js'
import { composeCompactVerify } from '../src/composable/jws/compact/verify.js'
import { composeFlattenedSign } from '../src/composable/jws/flattened/sign.js'
import { composeFlattenedVerify } from '../src/composable/jws/flattened/verify.js'
import { composeGeneralSign } from '../src/composable/jws/general/sign.js'
import { composeGeneralVerify } from '../src/composable/jws/general/verify.js'
import { composeCompactEncrypt } from '../src/composable/jwe/compact/encrypt.js'
import { composeCompactDecrypt } from '../src/composable/jwe/compact/decrypt.js'
import { composeFlattenedEncrypt } from '../src/composable/jwe/flattened/encrypt.js'
import { composeFlattenedDecrypt } from '../src/composable/jwe/flattened/decrypt.js'
import { composeGeneralEncrypt } from '../src/composable/jwe/general/encrypt.js'
import { composeGeneralDecrypt } from '../src/composable/jwe/general/decrypt.js'
import { composeGenerateKeyPair } from '../src/composable/key/generate/keypair.js'
import { composeGenerateSecret } from '../src/composable/key/generate/secret.js'

type Key = CryptoKey | Uint8Array

type RuntimeCapability = {
  readonly algorithm: string
  readonly category: string
  readonly key?: { readonly secret?: boolean }
}

type RuntimeFactory = () => RuntimeCapability

type RuntimeHeader = { alg: string; enc?: string; zip?: string }

type JWSResult = {
  readonly payload: Uint8Array
  readonly protectedHeader?: RuntimeHeader
}

type JWSProducer<Result> = {
  setProtectedHeader(header: RuntimeHeader): JWSProducer<Result>
  sign(key: Key): Promise<Result>
}

type JWSProducerConstructor<Result> = new (payload: Uint8Array) => JWSProducer<Result>

type GeneralJWSProducer = {
  addSignature(key: Key): {
    setProtectedHeader(header: RuntimeHeader): { sign(): Promise<unknown> }
  }
}

type JWSConsumer<Input> = (input: Input, key: Key) => Promise<JWSResult>

type JWTProducer = {
  setProtectedHeader(header: RuntimeHeader): JWTProducer
  sign(key: Key): Promise<string>
}

type JWTProducerConstructor = new (payload?: Record<string, unknown>) => JWTProducer

type JWTConsumer = (
  input: string,
  key: Key,
) => Promise<{ readonly payload: Record<string, unknown>; readonly protectedHeader: RuntimeHeader }>

type JWEProducer<Result> = {
  setProtectedHeader(header: RuntimeHeader): JWEProducer<Result>
  setContentEncryptionKey(cek: Uint8Array): JWEProducer<Result>
  encrypt(key: Key): Promise<Result>
}

type JWEProducerConstructor<Result> = new (plaintext: Uint8Array) => JWEProducer<Result>

type RuntimeFlattenedJWE = Record<string, unknown> & { encrypted_key?: string }

type RuntimeGeneralJWE = Record<string, unknown> & {
  recipients: (Record<string, unknown> & { encrypted_key?: string })[]
}

type GeneralJWERecipient = {
  addRecipient(key: Key): GeneralJWERecipient
  encrypt(): Promise<RuntimeGeneralJWE>
}

type GeneralJWEProducer = {
  setProtectedHeader(header: RuntimeHeader): GeneralJWEProducer
  addRecipient(key: Key): GeneralJWERecipient
}

type JWEConsumer<Input> = (
  input: Input,
  key: Key,
  options?: { keyManagementAlgorithms?: string[] },
) => Promise<{ readonly plaintext: Uint8Array; readonly protectedHeader?: RuntimeHeader }>

type JWTEncryptor = {
  setProtectedHeader(header: RuntimeHeader): JWTEncryptor
  encrypt(key: Key): Promise<string>
}

type JWTEncryptorConstructor = new (payload?: Record<string, unknown>) => JWTEncryptor

type JWTDecryptor = (
  input: string,
  key: Key,
  options?: { keyManagementAlgorithms?: string[] },
) => Promise<{ readonly payload: Record<string, unknown>; readonly protectedHeader: RuntimeHeader }>

type RuntimeComposer<Result> = (...factories: RuntimeFactory[]) => Result

type RuntimeKeyPairGenerator = (
  algorithm: string,
) => Promise<{ readonly privateKey: CryptoKey; readonly publicKey: CryptoKey }>

type RuntimeSecretGenerator = (algorithm: string) => Promise<Key>

const encoder = new TextEncoder()

function runtimeComposer<Result>(composer: unknown): RuntimeComposer<Result> {
  return composer as RuntimeComposer<Result>
}

function catalogEntries(catalog: object): [string, RuntimeFactory][] {
  return Object.entries(catalog) as [string, RuntimeFactory][]
}

function unavailable(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'NotSupportedError'
}

function tamper(value: string): string {
  return `${value[0] === 'A' ? 'B' : 'A'}${value.slice(1)}`
}

function keyFactory(exportName: string): RuntimeFactory {
  const factory = (keyAlgorithms as Record<string, RuntimeFactory>)[exportName]
  if (factory === undefined) throw new Error(`missing key factory ${exportName}`)
  return factory
}

async function jwsKeys(exportName: string, algorithm: string): Promise<readonly [Key, Key]> {
  if (algorithm.startsWith('HS')) {
    const generate = runtimeComposer<RuntimeSecretGenerator>(composeGenerateSecret)(
      keyFactory(exportName),
    )
    const secret = await generate(algorithm)
    return [secret, secret]
  }

  const generate = runtimeComposer<RuntimeKeyPairGenerator>(composeGenerateKeyPair)(
    keyFactory(exportName),
  )
  const { privateKey, publicKey } = await generate(algorithm)
  return [privateKey, publicKey]
}

async function jweKeys(
  keyManagementExportName: string,
  contentEncryptionExportName: string,
  algorithm: string,
  contentEncryptionAlgorithm: string,
): Promise<readonly [Key, Key]> {
  if (algorithm.startsWith('RSA-') || algorithm.startsWith('ECDH-')) {
    const generate = runtimeComposer<RuntimeKeyPairGenerator>(composeGenerateKeyPair)(
      keyFactory(keyManagementExportName),
    )
    const { privateKey, publicKey } = await generate(algorithm)
    return [publicKey, privateKey]
  }

  if (algorithm === 'dir') {
    const generate = runtimeComposer<RuntimeSecretGenerator>(composeGenerateSecret)(
      keyFactory(contentEncryptionExportName),
    )
    const secret = await generate(contentEncryptionAlgorithm)
    return [secret, secret]
  }

  if (algorithm.startsWith('PBES2-')) {
    const password = crypto.getRandomValues(new Uint8Array(32))
    return [password, password]
  }

  const generate = runtimeComposer<RuntimeSecretGenerator>(composeGenerateSecret)(
    keyFactory(keyManagementExportName),
  )
  const secret = await generate(algorithm)
  return [secret, secret]
}

async function exerciseJWSFacades(
  t: ExecutionContext,
  factory: RuntimeFactory,
  algorithm: string,
  signingKey: Key,
  verificationKey: Key,
) {
  const plaintext = encoder.encode(`composable JWS facade matrix: ${algorithm}`)
  const header = { alg: algorithm }

  const CompactSign = runtimeComposer<JWSProducerConstructor<string>>(composeCompactSign)(factory)
  const compactVerify = runtimeComposer<JWSConsumer<string>>(composeCompactVerify)(factory)
  const compact = await new CompactSign(plaintext).setProtectedHeader(header).sign(signingKey)
  const compactResult = await compactVerify(compact, verificationKey)
  t.deepEqual(compactResult.payload, plaintext, `${algorithm} compact payload`)
  t.is(compactResult.protectedHeader?.alg, algorithm, `${algorithm} compact header`)

  const FlattenedSign =
    runtimeComposer<JWSProducerConstructor<unknown>>(composeFlattenedSign)(factory)
  const flattenedVerify = runtimeComposer<JWSConsumer<unknown>>(composeFlattenedVerify)(factory)
  const flattened = await new FlattenedSign(plaintext).setProtectedHeader(header).sign(signingKey)
  const flattenedResult = await flattenedVerify(flattened, verificationKey)
  t.deepEqual(flattenedResult.payload, plaintext, `${algorithm} flattened payload`)
  t.is(flattenedResult.protectedHeader?.alg, algorithm, `${algorithm} flattened header`)

  const GeneralSign =
    runtimeComposer<new (payload: Uint8Array) => GeneralJWSProducer>(composeGeneralSign)(factory)
  const generalVerify = runtimeComposer<JWSConsumer<unknown>>(composeGeneralVerify)(factory)
  const general = await new GeneralSign(plaintext)
    .addSignature(signingKey)
    .setProtectedHeader(header)
    .sign()
  const generalResult = await generalVerify(general, verificationKey)
  t.deepEqual(generalResult.payload, plaintext, `${algorithm} general payload`)
  t.is(generalResult.protectedHeader?.alg, algorithm, `${algorithm} general header`)

  const SignJWT = runtimeComposer<JWTProducerConstructor>(composeSignJWT)(factory)
  const jwtVerify = runtimeComposer<JWTConsumer>(composeJwtVerify)(factory)
  const jwt = await new SignJWT({ algorithm }).setProtectedHeader(header).sign(signingKey)
  const jwtResult = await jwtVerify(jwt, verificationKey)
  t.is(jwtResult.payload.algorithm, algorithm, `${algorithm} JWT payload`)
  t.is(jwtResult.protectedHeader.alg, algorithm, `${algorithm} JWT header`)
}

for (const [exportName, factory] of catalogEntries(jwsAlgorithms)) {
  const algorithm = factory().algorithm
  test.serial(`every composable JWS facade supports ${algorithm} (${exportName})`, async (t) => {
    let keys: readonly [Key, Key]
    try {
      keys = await jwsKeys(exportName, algorithm)
    } catch (error) {
      if (unavailable(error)) {
        t.pass(`${algorithm} is unavailable in this runtime`)
        return
      }
      throw error
    }

    await exerciseJWSFacades(t, factory, algorithm, ...keys)
  })
}

async function exerciseJWEFacades(
  t: ExecutionContext,
  factories: readonly RuntimeFactory[],
  keyManagementAlgorithm: string,
  contentEncryptionAlgorithm: string,
  encryptionKey: Key,
  decryptionKey: Key,
  compressed = false,
) {
  const plaintext = encoder.encode(
    `composable JWE facade matrix: ${keyManagementAlgorithm} + ${contentEncryptionAlgorithm}`,
  )
  const header: RuntimeHeader = {
    alg: keyManagementAlgorithm,
    enc: contentEncryptionAlgorithm,
    ...(compressed ? { zip: 'DEF' } : undefined),
  }
  const decryptOptions = keyManagementAlgorithm.startsWith('PBES2-')
    ? { keyManagementAlgorithms: [keyManagementAlgorithm] }
    : undefined
  const transportsCek = keyManagementAlgorithm !== 'dir' && keyManagementAlgorithm !== 'ECDH-ES'

  const CompactEncrypt = runtimeComposer<JWEProducerConstructor<string>>(composeCompactEncrypt)(
    ...factories,
  )
  const compactDecrypt = runtimeComposer<JWEConsumer<string>>(composeCompactDecrypt)(...factories)
  const compact = await new CompactEncrypt(plaintext)
    .setProtectedHeader(header)
    .encrypt(encryptionKey)
  t.is(
    compact.split('.')[1].length > 0,
    transportsCek,
    `${keyManagementAlgorithm} compact encrypted key`,
  )
  const compactResult = await compactDecrypt(compact, decryptionKey, decryptOptions)
  t.deepEqual(compactResult.plaintext, plaintext, `${keyManagementAlgorithm} compact payload`)
  t.is(
    compactResult.protectedHeader?.alg,
    keyManagementAlgorithm,
    `${keyManagementAlgorithm} compact key management`,
  )
  t.is(
    compactResult.protectedHeader?.enc,
    contentEncryptionAlgorithm,
    `${keyManagementAlgorithm} compact header`,
  )
  t.is(compactResult.protectedHeader?.zip, compressed ? 'DEF' : undefined)

  const FlattenedEncrypt = runtimeComposer<JWEProducerConstructor<RuntimeFlattenedJWE>>(
    composeFlattenedEncrypt,
  )(...factories)
  const flattenedDecrypt = runtimeComposer<JWEConsumer<RuntimeFlattenedJWE>>(
    composeFlattenedDecrypt,
  )(...factories)
  const flattened = await new FlattenedEncrypt(plaintext)
    .setProtectedHeader(header)
    .encrypt(encryptionKey)
  t.is(
    Object.hasOwn(flattened, 'encrypted_key'),
    transportsCek,
    `${keyManagementAlgorithm} flattened encrypted key member`,
  )
  t.is(
    Boolean(flattened.encrypted_key),
    transportsCek,
    `${keyManagementAlgorithm} flattened encrypted key value`,
  )
  const flattenedResult = await flattenedDecrypt(flattened, decryptionKey, decryptOptions)
  t.deepEqual(flattenedResult.plaintext, plaintext, `${keyManagementAlgorithm} flattened payload`)
  t.is(
    flattenedResult.protectedHeader?.alg,
    keyManagementAlgorithm,
    `${keyManagementAlgorithm} flattened key management`,
  )
  t.is(
    flattenedResult.protectedHeader?.enc,
    contentEncryptionAlgorithm,
    `${keyManagementAlgorithm} flattened header`,
  )
  t.is(flattenedResult.protectedHeader?.zip, compressed ? 'DEF' : undefined)

  if (transportsCek) {
    const suppliedCek = new Uint8Array(32).fill(0xa5)
    const supplied = await new FlattenedEncrypt(plaintext)
      .setProtectedHeader(header)
      .setContentEncryptionKey(suppliedCek)
      .encrypt(encryptionKey)
    const suppliedResult = await flattenedDecrypt(supplied, decryptionKey, decryptOptions)
    t.deepEqual(
      suppliedResult.plaintext,
      plaintext,
      `${keyManagementAlgorithm} supplied CEK payload`,
    )

    const missingEncryptedKey = { ...flattened }
    delete missingEncryptedKey.encrypted_key
    await t.throwsAsync(flattenedDecrypt(missingEncryptedKey, decryptionKey, decryptOptions), {
      code: 'ERR_JWE_INVALID',
      message: 'JWE Encrypted Key missing',
    })
    await t.throwsAsync(
      flattenedDecrypt(
        { ...flattened, encrypted_key: tamper(flattened.encrypted_key!) },
        decryptionKey,
        decryptOptions,
      ),
      {
        code: 'ERR_JWE_DECRYPTION_FAILED',
        message: 'decryption operation failed',
      },
    )
  } else {
    await t.throwsAsync(
      new FlattenedEncrypt(plaintext)
        .setProtectedHeader(header)
        .setContentEncryptionKey(new Uint8Array(32))
        .encrypt(encryptionKey),
      {
        instanceOf: TypeError,
        message: `setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${keyManagementAlgorithm}`,
      },
    )
    await t.throwsAsync(
      flattenedDecrypt({ ...flattened, encrypted_key: 'AA' }, decryptionKey, decryptOptions),
      {
        code: 'ERR_JWE_INVALID',
        message: 'Encountered unexpected JWE Encrypted Key',
      },
    )
  }

  const GeneralEncrypt = runtimeComposer<new (plaintext: Uint8Array) => GeneralJWEProducer>(
    composeGeneralEncrypt,
  )(...factories)
  const generalDecrypt = runtimeComposer<JWEConsumer<unknown>>(composeGeneralDecrypt)(...factories)
  const general = await new GeneralEncrypt(plaintext)
    .setProtectedHeader(header)
    .addRecipient(encryptionKey)
    .encrypt()
  t.is(
    Object.hasOwn(general.recipients[0], 'encrypted_key'),
    transportsCek,
    `${keyManagementAlgorithm} general encrypted key member`,
  )
  t.is(
    Boolean(general.recipients[0].encrypted_key),
    transportsCek,
    `${keyManagementAlgorithm} general encrypted key value`,
  )
  const generalResult = await generalDecrypt(general, decryptionKey, decryptOptions)
  t.deepEqual(generalResult.plaintext, plaintext, `${keyManagementAlgorithm} general payload`)
  t.is(
    generalResult.protectedHeader?.alg,
    keyManagementAlgorithm,
    `${keyManagementAlgorithm} general key management`,
  )
  t.is(
    generalResult.protectedHeader?.enc,
    contentEncryptionAlgorithm,
    `${keyManagementAlgorithm} general header`,
  )
  t.is(generalResult.protectedHeader?.zip, compressed ? 'DEF' : undefined)

  if (!transportsCek) {
    await t.throwsAsync(
      new GeneralEncrypt(plaintext)
        .setProtectedHeader(header)
        .addRecipient(encryptionKey)
        .addRecipient(encryptionKey)
        .encrypt(),
      {
        code: 'ERR_JWE_INVALID',
        message: `"${keyManagementAlgorithm}" alg may only have a single recipient`,
      },
    )
  }

  const EncryptJWT = runtimeComposer<JWTEncryptorConstructor>(composeEncryptJWT)(...factories)
  const jwtDecrypt = runtimeComposer<JWTDecryptor>(composeJwtDecrypt)(...factories)
  const jwt = await new EncryptJWT({
    keyManagementAlgorithm,
    contentEncryptionAlgorithm,
  })
    .setProtectedHeader(header)
    .encrypt(encryptionKey)
  const jwtResult = await jwtDecrypt(jwt, decryptionKey, decryptOptions)
  t.is(
    jwtResult.payload.keyManagementAlgorithm,
    keyManagementAlgorithm,
    `${keyManagementAlgorithm} JWT payload`,
  )
  t.is(
    jwtResult.payload.contentEncryptionAlgorithm,
    contentEncryptionAlgorithm,
    `${keyManagementAlgorithm} JWT content encryption`,
  )
  t.is(
    jwtResult.protectedHeader.alg,
    keyManagementAlgorithm,
    `${keyManagementAlgorithm} JWT key management`,
  )
  t.is(
    jwtResult.protectedHeader.enc,
    contentEncryptionAlgorithm,
    `${keyManagementAlgorithm} JWT header`,
  )
  t.is(jwtResult.protectedHeader.zip, compressed ? 'DEF' : undefined)
}

const baselineContentEncryptionFactory = contentEncryptionAlgorithms.A256GCM as RuntimeFactory

for (const [exportName, keyManagementFactory] of catalogEntries(jweAlgorithms)) {
  const keyManagementAlgorithm = keyManagementFactory().algorithm
  const contentEncryptionAlgorithm = baselineContentEncryptionFactory().algorithm

  test.serial(
    `every composable JWE facade supports key management ${keyManagementAlgorithm} (${exportName})`,
    async (t) => {
      const keys = await jweKeys(
        exportName,
        'A256GCM',
        keyManagementAlgorithm,
        contentEncryptionAlgorithm,
      )
      await exerciseJWEFacades(
        t,
        [keyManagementFactory, baselineContentEncryptionFactory],
        keyManagementAlgorithm,
        contentEncryptionAlgorithm,
        ...keys,
      )
    },
  )
}

const baselineKeyManagementFactory = jweAlgorithms.dir as RuntimeFactory

for (const [exportName, contentEncryptionFactory] of catalogEntries(contentEncryptionAlgorithms)) {
  const keyManagementAlgorithm = baselineKeyManagementFactory().algorithm
  const contentEncryptionAlgorithm = contentEncryptionFactory().algorithm

  test.serial(
    `every composable JWE facade supports content encryption ${contentEncryptionAlgorithm} (${exportName})`,
    async (t) => {
      const keys = await jweKeys(
        'dir',
        exportName,
        keyManagementAlgorithm,
        contentEncryptionAlgorithm,
      )
      await exerciseJWEFacades(
        t,
        [baselineKeyManagementFactory, contentEncryptionFactory],
        keyManagementAlgorithm,
        contentEncryptionAlgorithm,
        ...keys,
      )
    },
  )
}

test.serial('every composable JWE facade supports DEF', async (t) => {
  if (typeof CompressionStream === 'undefined' || typeof DecompressionStream === 'undefined') {
    t.pass('compression streams are unavailable in this runtime')
    return
  }

  const keyManagementFactory = jweAlgorithms.dir as RuntimeFactory
  const contentEncryptionFactory = contentEncryptionAlgorithms.A256GCM as RuntimeFactory
  const keys = await jweKeys('dir', 'A256GCM', 'dir', 'A256GCM')
  await exerciseJWEFacades(
    t,
    [keyManagementFactory, contentEncryptionFactory, DEF as RuntimeFactory],
    'dir',
    'A256GCM',
    ...keys,
    true,
  )
})

async function rejectsUnselected(
  t: ExecutionContext,
  promise: Promise<unknown>,
  label: string,
  code = 'ERR_JOSE_NOT_SUPPORTED',
) {
  await t.throwsAsync(promise, { code }, label)
}

test.serial('every composable JWS facade rejects an unselected algorithm', async (t) => {
  const selected = jwsAlgorithms.ES256 as RuntimeFactory
  const unselected = jwsAlgorithms.HS256 as RuntimeFactory
  const algorithm = unselected().algorithm
  const header = { alg: algorithm }
  const payload = encoder.encode('unselected JWS algorithm')
  const [secret] = await jwsKeys('HS256', algorithm)

  const CompactSign = runtimeComposer<JWSProducerConstructor<string>>(composeCompactSign)(selected)
  await rejectsUnselected(
    t,
    new CompactSign(payload).setProtectedHeader(header).sign(secret),
    'CompactSign',
  )

  const FlattenedSign =
    runtimeComposer<JWSProducerConstructor<unknown>>(composeFlattenedSign)(selected)
  await rejectsUnselected(
    t,
    new FlattenedSign(payload).setProtectedHeader(header).sign(secret),
    'FlattenedSign',
  )

  const GeneralSign =
    runtimeComposer<new (payload: Uint8Array) => GeneralJWSProducer>(composeGeneralSign)(selected)
  await rejectsUnselected(
    t,
    new GeneralSign(payload).addSignature(secret).setProtectedHeader(header).sign(),
    'GeneralSign',
  )

  const SignJWT = runtimeComposer<JWTProducerConstructor>(composeSignJWT)(selected)
  await rejectsUnselected(t, new SignJWT().setProtectedHeader(header).sign(secret), 'SignJWT')

  const ValidCompactSign =
    runtimeComposer<JWSProducerConstructor<string>>(composeCompactSign)(unselected)
  const compact = await new ValidCompactSign(payload).setProtectedHeader(header).sign(secret)
  await rejectsUnselected(
    t,
    runtimeComposer<JWSConsumer<string>>(composeCompactVerify)(selected)(compact, secret),
    'compactVerify',
  )

  const ValidFlattenedSign =
    runtimeComposer<JWSProducerConstructor<unknown>>(composeFlattenedSign)(unselected)
  const flattened = await new ValidFlattenedSign(payload).setProtectedHeader(header).sign(secret)
  await rejectsUnselected(
    t,
    runtimeComposer<JWSConsumer<unknown>>(composeFlattenedVerify)(selected)(flattened, secret),
    'flattenedVerify',
  )

  const ValidGeneralSign =
    runtimeComposer<new (payload: Uint8Array) => GeneralJWSProducer>(composeGeneralSign)(unselected)
  const general = await new ValidGeneralSign(payload)
    .addSignature(secret)
    .setProtectedHeader(header)
    .sign()
  await rejectsUnselected(
    t,
    runtimeComposer<JWSConsumer<unknown>>(composeGeneralVerify)(selected)(general, secret),
    'generalVerify',
    'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
  )

  const ValidSignJWT = runtimeComposer<JWTProducerConstructor>(composeSignJWT)(unselected)
  const jwt = await new ValidSignJWT().setProtectedHeader(header).sign(secret)
  await rejectsUnselected(
    t,
    runtimeComposer<JWTConsumer>(composeJwtVerify)(selected)(jwt, secret),
    'jwtVerify',
  )
})

async function exerciseJWESelectionBoundary(
  t: ExecutionContext,
  validFactories: readonly RuntimeFactory[],
  restrictedFactories: readonly RuntimeFactory[],
  header: RuntimeHeader,
  key: Key,
  boundary: string,
) {
  const plaintext = encoder.encode(`unselected JWE ${boundary} algorithm`)

  const CompactEncrypt = runtimeComposer<JWEProducerConstructor<string>>(composeCompactEncrypt)(
    ...restrictedFactories,
  )
  await rejectsUnselected(
    t,
    new CompactEncrypt(plaintext).setProtectedHeader(header).encrypt(key),
    `${boundary} CompactEncrypt`,
  )

  const FlattenedEncrypt = runtimeComposer<JWEProducerConstructor<unknown>>(
    composeFlattenedEncrypt,
  )(...restrictedFactories)
  await rejectsUnselected(
    t,
    new FlattenedEncrypt(plaintext).setProtectedHeader(header).encrypt(key),
    `${boundary} FlattenedEncrypt`,
  )

  const GeneralEncrypt = runtimeComposer<new (plaintext: Uint8Array) => GeneralJWEProducer>(
    composeGeneralEncrypt,
  )(...restrictedFactories)
  await rejectsUnselected(
    t,
    new GeneralEncrypt(plaintext).setProtectedHeader(header).addRecipient(key).encrypt(),
    `${boundary} GeneralEncrypt`,
  )

  const EncryptJWT = runtimeComposer<JWTEncryptorConstructor>(composeEncryptJWT)(
    ...restrictedFactories,
  )
  await rejectsUnselected(
    t,
    new EncryptJWT().setProtectedHeader(header).encrypt(key),
    `${boundary} EncryptJWT`,
  )

  const ValidCompactEncrypt = runtimeComposer<JWEProducerConstructor<string>>(
    composeCompactEncrypt,
  )(...validFactories)
  const compact = await new ValidCompactEncrypt(plaintext).setProtectedHeader(header).encrypt(key)
  await rejectsUnselected(
    t,
    runtimeComposer<JWEConsumer<string>>(composeCompactDecrypt)(...restrictedFactories)(
      compact,
      key,
    ),
    `${boundary} compactDecrypt`,
  )

  const ValidFlattenedEncrypt = runtimeComposer<JWEProducerConstructor<unknown>>(
    composeFlattenedEncrypt,
  )(...validFactories)
  const flattened = await new ValidFlattenedEncrypt(plaintext)
    .setProtectedHeader(header)
    .encrypt(key)
  await rejectsUnselected(
    t,
    runtimeComposer<JWEConsumer<unknown>>(composeFlattenedDecrypt)(...restrictedFactories)(
      flattened,
      key,
    ),
    `${boundary} flattenedDecrypt`,
  )

  const ValidGeneralEncrypt = runtimeComposer<new (plaintext: Uint8Array) => GeneralJWEProducer>(
    composeGeneralEncrypt,
  )(...validFactories)
  const general = await new ValidGeneralEncrypt(plaintext)
    .setProtectedHeader(header)
    .addRecipient(key)
    .encrypt()
  await rejectsUnselected(
    t,
    runtimeComposer<JWEConsumer<unknown>>(composeGeneralDecrypt)(...restrictedFactories)(
      general,
      key,
    ),
    `${boundary} generalDecrypt`,
    'ERR_JWE_DECRYPTION_FAILED',
  )

  const ValidEncryptJWT = runtimeComposer<JWTEncryptorConstructor>(composeEncryptJWT)(
    ...validFactories,
  )
  const jwt = await new ValidEncryptJWT().setProtectedHeader(header).encrypt(key)
  await rejectsUnselected(
    t,
    runtimeComposer<JWTDecryptor>(composeJwtDecrypt)(...restrictedFactories)(jwt, key),
    `${boundary} jwtDecrypt`,
  )
}

test.serial('every composable JWE facade enforces both algorithm selections', async (t) => {
  const dir = jweAlgorithms.dir as RuntimeFactory
  const A128KW = jweAlgorithms.A128KW as RuntimeFactory
  const A128GCM = contentEncryptionAlgorithms.A128GCM as RuntimeFactory
  const A256GCM = contentEncryptionAlgorithms.A256GCM as RuntimeFactory
  const algorithm = dir().algorithm
  const contentEncryptionAlgorithm = A256GCM().algorithm
  const header = { alg: algorithm, enc: contentEncryptionAlgorithm }
  const [secret] = await jweKeys('dir', 'A256GCM', algorithm, contentEncryptionAlgorithm)

  await exerciseJWESelectionBoundary(
    t,
    [dir, A256GCM],
    [A128KW, A256GCM],
    header,
    secret,
    'key management',
  )
  await exerciseJWESelectionBoundary(
    t,
    [dir, A256GCM],
    [dir, A128GCM],
    header,
    secret,
    'content encryption',
  )
})
