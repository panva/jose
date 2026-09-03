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
import { composeCompactEncrypt } from '../src/composable/jwe/compact/encrypt.js'
import { composeCompactDecrypt } from '../src/composable/jwe/compact/decrypt.js'
import { composeGeneralEncrypt } from '../src/composable/jwe/general/encrypt.js'
import { composeGeneralDecrypt } from '../src/composable/jwe/general/decrypt.js'
import { composeGeneralSign } from '../src/composable/jws/general/sign.js'
import { composeGeneralVerify } from '../src/composable/jws/general/verify.js'
import { composeKeyImport } from '../src/composable/key/import.js'
import { composeGenerateKeyPair } from '../src/composable/key/generate/keypair.js'
import { composeGenerateSecret } from '../src/composable/key/generate/secret.js'
import { composeEmbeddedJWK } from '../src/composable/jwk/embedded.js'
import { composeLocalJWKSet } from '../src/composable/jwks/local.js'
import { composeRemoteJWKSet } from '../src/composable/jwks/remote.js'
import { exportSPKI } from '../src/key/export.js'
import { jwksCache } from '../src/jwks/remote.js'
import {
  CompactEncrypt as RootCompactEncrypt,
  CompactSign as RootCompactSign,
  EncryptJWT as RootEncryptJWT,
  FlattenedEncrypt as RootFlattenedEncrypt,
  FlattenedSign as RootFlattenedSign,
  GeneralEncrypt as RootGeneralEncrypt,
  GeneralSign as RootGeneralSign,
  SignJWT as RootSignJWT,
  base64url,
} from '../src/index.js'
import { SignJWT as DeepSignJWT } from '../src/jwt/sign.js'
import { EncryptJWT as DeepEncryptJWT } from '../src/jwt/encrypt.js'
import type { JWK } from '../src/types.d.ts'
import { allJWSAlgorithms } from '../src/lib/jws_algorithms.js'
import { allJWEAlgorithms } from '../src/lib/jwe_algorithms.js'

const { ES256, HS256, HS384 } = jwsAlgorithms
const { A128KW, A256GCMKW, A256KW, ECDH_ES_A256KW, PBES2_HS512_A256KW, RSA_OAEP_256, dir } =
  jweAlgorithms
const { A256CBC_HS512, A256GCM } = contentEncryptionAlgorithms
const { ES256: keyES256, HS256: keyHS256, HS384: keyHS384 } = keyAlgorithms

type RuntimeKey = {
  kty: readonly string[]
  subtle: object
  signing?: object
  usages: readonly [readonly KeyUsage[], readonly KeyUsage[]]
  ops?: readonly [string | undefined, string | undefined]
}

type RuntimeCapability = {
  algorithm: string
  category: string
  mode?: unknown
  key?: RuntimeKey
  encrypt?: unknown
  decrypt?: unknown
  compress?: unknown
  decompress?: unknown
}

type RuntimeFactory = () => RuntimeCapability

function assertStableKey(
  t: ExecutionContext,
  name: string,
  capability: RuntimeCapability,
  another: RuntimeCapability,
) {
  t.truthy(capability.key, `${name} key`)
  t.truthy(another.key, `${name} stable key`)
  const key = capability.key!
  const other = another.key!

  t.true(Object.isFrozen(key), `${name} frozen key`)
  t.true(Object.isFrozen(key.kty), `${name} frozen kty`)
  t.true(Object.isFrozen(key.subtle), `${name} frozen subtle`)
  t.true(Object.isFrozen(key.usages), `${name} frozen usages`)
  t.true(Object.isFrozen(key.usages[0]), `${name} frozen public usages`)
  t.true(Object.isFrozen(key.usages[1]), `${name} frozen private usages`)
  t.is(key, other, `${name} stable key`)
  t.is(key.kty, other.kty, `${name} stable kty`)
  t.is(key.subtle, other.subtle, `${name} stable subtle`)
  t.is(key.usages, other.usages, `${name} stable usages`)
  t.is(key.usages[0], other.usages[0], `${name} stable public usages`)
  t.is(key.usages[1], other.usages[1], `${name} stable private usages`)

  if (key.signing) {
    t.true(Object.isFrozen(key.signing), `${name} frozen signing`)
    t.is(key.signing, other.signing, `${name} stable signing`)
  }
  if (key.ops) {
    t.true(Object.isFrozen(key.ops), `${name} frozen ops`)
    t.is(key.ops, other.ops, `${name} stable ops`)
  }
}

test('every catalog factory is immutable and composes without using its primitive', (t) => {
  const composeCompactEncryptUnchecked = composeCompactEncrypt as unknown as (
    ...factories: RuntimeFactory[]
  ) => unknown

  t.is(Object.keys(jwsAlgorithms).length, 17)
  for (const [name, factory] of Object.entries(jwsAlgorithms)) {
    const capability = (factory as RuntimeFactory)()
    const another = (factory as RuntimeFactory)()
    t.true(Object.isFrozen(capability), name)
    t.is(capability, another, name)
    t.is(capability.category, 'jws', name)
    assertStableKey(t, name, capability, another)
  }

  t.is(Object.keys(jweAlgorithms).length, 18)
  for (const [name, factory] of Object.entries(jweAlgorithms)) {
    const capability = (factory as RuntimeFactory)()
    const another = (factory as RuntimeFactory)()
    t.true(Object.isFrozen(capability), name)
    t.is(capability, another, name)
    t.is(capability.category, 'jwe-key-management', name)
    const expectedMode = name.startsWith('RSA_')
      ? 'key-encryption'
      : name === 'dir'
        ? 'direct-encryption'
        : name === 'ECDH_ES'
          ? 'direct-key-agreement'
          : name.startsWith('ECDH_ES_')
            ? 'key-agreement-with-key-wrapping'
            : 'key-wrapping'
    t.is(capability.mode, expectedMode, name)
    switch (capability.mode) {
      case 'direct-encryption':
        t.is(capability.key, undefined, name)
        t.is(capability.encrypt, undefined, name)
        t.is(capability.decrypt, undefined, name)
        break
      case 'direct-key-agreement':
      case 'key-wrapping':
      case 'key-encryption':
      case 'key-agreement-with-key-wrapping':
        t.is(typeof capability.encrypt, 'function', name)
        t.is(typeof capability.decrypt, 'function', name)
        assertStableKey(t, name, capability, another)
        break
      default:
        t.fail(`${name} has an invalid key management mode`)
    }
    t.notThrows(() =>
      composeCompactEncryptUnchecked(factory as RuntimeFactory, A256GCM as RuntimeFactory),
    )
  }

  t.is(Object.keys(contentEncryptionAlgorithms).length, 6)
  for (const [name, factory] of Object.entries(contentEncryptionAlgorithms)) {
    const capability = (factory as RuntimeFactory)()
    const another = (factory as RuntimeFactory)()
    t.true(Object.isFrozen(capability), name)
    t.is(capability, another, name)
    t.is(capability.category, 'jwe-content-encryption', name)
    t.is(typeof capability.encrypt, 'function', name)
    t.is(typeof capability.decrypt, 'function', name)
    assertStableKey(t, name, capability, another)
    t.notThrows(() =>
      composeCompactEncryptUnchecked(dir as RuntimeFactory, factory as RuntimeFactory),
    )
  }

  const compression = DEF() as RuntimeCapability
  t.true(Object.isFrozen(compression))
  t.is(compression, DEF() as RuntimeCapability)
  t.is(compression.category, 'jwe-compression')
  t.is(typeof compression.compress, 'function')
  t.is(typeof compression.decompress, 'function')

  t.is(Object.keys(keyAlgorithms).length, 41)
  for (const [name, factory] of Object.entries(keyAlgorithms)) {
    const capability = (factory as RuntimeFactory)()
    t.is(capability, (factory as RuntimeFactory)(), name)
    t.true(Object.isFrozen(capability), name)
    t.is(capability.category, 'key', name)
    assertStableKey(t, name, capability, capability)
  }
})

test('full selections use the same deep-frozen built-in records', (t) => {
  const selections = [
    allJWSAlgorithms,
    allJWEAlgorithms.alg,
    allJWEAlgorithms.enc,
    allJWEAlgorithms.zip,
  ]

  for (const selection of selections) {
    t.true(Object.isFrozen(selection))
    for (const capability of Object.values(selection)) {
      t.true(Object.isFrozen(capability))
      if ('key' in capability) t.true(Object.isFrozen(capability.key))
    }
  }
})

test('composed JWT APIs retain the existing class and function behavior', async (t) => {
  const SignJWT = composeSignJWT(ES256)
  const jwtVerify = composeJwtVerify(ES256)
  const pair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, false, [
    'sign',
    'verify',
  ])

  t.is(SignJWT.name, 'SignJWT')
  const signed = await new SignJWT({ sub: 'alice' })
    .setProtectedHeader({ alg: 'ES256' })
    .sign(pair.privateKey)
  const verified = await jwtVerify(signed, pair.publicKey)
  t.is(verified.payload.sub, 'alice')
  t.is(verified.protectedHeader.alg, 'ES256')

  const EncryptJWT = composeEncryptJWT(dir, A256GCM)
  const jwtDecrypt = composeJwtDecrypt(A256GCM, dir)
  const secret = crypto.getRandomValues(new Uint8Array(32))

  t.is(EncryptJWT.name, 'EncryptJWT')
  const encrypted = await new EncryptJWT({ sub: 'alice' })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .encrypt(secret)
  const decrypted = await jwtDecrypt(encrypted, secret)
  t.is(decrypted.payload.sub, 'alice')
  t.is(decrypted.protectedHeader.alg, 'dir')
  t.is(decrypted.protectedHeader.enc, 'A256GCM')
})

test('composed RSA-OAEP key management round trips', async (t) => {
  let pair: CryptoKeyPair
  try {
    pair = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      false,
      ['encrypt', 'decrypt'],
    )
  } catch (err) {
    if (err instanceof DOMException && err.name === 'NotSupportedError') {
      t.pass('RSA-OAEP is unavailable in this runtime')
      return
    }
    throw err
  }

  const plaintext = new TextEncoder().encode('composed RSA-OAEP')
  const CompactEncrypt = composeCompactEncrypt(RSA_OAEP_256, A256GCM)
  const compactDecrypt = composeCompactDecrypt(A256GCM, RSA_OAEP_256)
  const jwe = await new CompactEncrypt(plaintext)
    .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
    .encrypt(pair.publicKey)

  t.deepEqual((await compactDecrypt(jwe, pair.privateKey)).plaintext, plaintext)
})

test('composed ECDH-ES with AES Key Wrap round trips', async (t) => {
  let pair: CryptoKeyPair
  try {
    pair = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, false, [
      'deriveBits',
    ])
  } catch (err) {
    if (err instanceof DOMException && err.name === 'NotSupportedError') {
      t.pass('ECDH is unavailable in this runtime')
      return
    }
    throw err
  }

  const plaintext = new TextEncoder().encode('composed ECDH-ES+A256KW')
  const CompactEncrypt = composeCompactEncrypt(ECDH_ES_A256KW, A256GCM)
  const compactDecrypt = composeCompactDecrypt(A256GCM, ECDH_ES_A256KW)
  const jwe = await new CompactEncrypt(plaintext)
    .setProtectedHeader({ alg: 'ECDH-ES+A256KW', enc: 'A256GCM' })
    .encrypt(pair.publicKey)

  t.deepEqual((await compactDecrypt(jwe, pair.privateKey)).plaintext, plaintext)
})

test('composed PBES2 and AES-GCM Key Wrap round trip CBC-HMAC content', async (t) => {
  const plaintext = new TextEncoder().encode('composed CBC-HMAC content encryption')

  const password = crypto.getRandomValues(new Uint8Array(32))
  const PBES2Encrypt = composeCompactEncrypt(PBES2_HS512_A256KW, A256CBC_HS512)
  const pbes2Decrypt = composeCompactDecrypt(A256CBC_HS512, PBES2_HS512_A256KW)
  const passwordJwe = await new PBES2Encrypt(plaintext)
    .setProtectedHeader({ alg: 'PBES2-HS512+A256KW', enc: 'A256CBC-HS512' })
    .encrypt(password)
  t.deepEqual(
    (
      await pbes2Decrypt(passwordJwe, password, {
        keyManagementAlgorithms: ['PBES2-HS512+A256KW'],
      })
    ).plaintext,
    plaintext,
  )

  const wrappingKey = crypto.getRandomValues(new Uint8Array(32))
  const AesGcmKwEncrypt = composeCompactEncrypt(A256GCMKW, A256CBC_HS512)
  const aesGcmKwDecrypt = composeCompactDecrypt(A256CBC_HS512, A256GCMKW)
  await t.throwsAsync(
    new AesGcmKwEncrypt(plaintext)
      .setProtectedHeader({ alg: 'A256GCMKW', enc: 'A256CBC-HS512' })
      .encrypt(new Uint8Array(16)),
    {
      code: 'ERR_JWE_INVALID',
      message: 'Invalid Content Encryption Key length. Expected 256 bits, got 128 bits',
    },
  )
  const wrappedJwe = await new AesGcmKwEncrypt(plaintext)
    .setProtectedHeader({ alg: 'A256GCMKW', enc: 'A256CBC-HS512' })
    .encrypt(wrappingKey)
  t.deepEqual((await aesGcmKwDecrypt(wrappedJwe, wrappingKey)).plaintext, plaintext)
})

test('composed DEF performs compression and decompression', async (t) => {
  if (typeof CompressionStream === 'undefined' || typeof DecompressionStream === 'undefined') {
    t.pass('compression streams are unavailable in this runtime')
    return
  }

  const value = 'highly compressible payload '.repeat(500)
  const secret = crypto.getRandomValues(new Uint8Array(32))
  const EncryptJWT = composeEncryptJWT(dir, A256GCM, DEF)
  const jwtDecrypt = composeJwtDecrypt(DEF, A256GCM, dir)
  const jwt = await new EncryptJWT({ value })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM', zip: 'DEF' })
    .encrypt(secret)

  t.true(jwt.split('.')[3].length < value.length / 2)
  const decrypted = await jwtDecrypt(jwt, secret)
  t.is(decrypted.payload.value, value)
  t.is(decrypted.protectedHeader.zip, 'DEF')
})

test('multi-algorithm General JWS supports multiple signatures', async (t) => {
  const payload = new TextEncoder().encode('multiple signatures')
  const secret = crypto.getRandomValues(new Uint8Array(32))
  const pair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, false, [
    'sign',
    'verify',
  ])
  const GeneralSign = composeGeneralSign(ES256, HS256)
  const generalVerify = composeGeneralVerify(HS256, ES256)

  const signed = await new GeneralSign(payload)
    .addSignature(pair.privateKey)
    .setProtectedHeader({ alg: 'ES256' })
    .addSignature(secret)
    .setProtectedHeader({ alg: 'HS256' })
    .sign()

  t.is(signed.signatures.length, 2)
  const asymmetric = await generalVerify(signed, pair.publicKey)
  const symmetric = await generalVerify(signed, secret)
  t.is(asymmetric.protectedHeader?.alg, 'ES256')
  t.is(symmetric.protectedHeader?.alg, 'HS256')
  t.deepEqual(asymmetric.payload, payload)
  t.deepEqual(symmetric.payload, payload)
})

test('multi-algorithm General JWE supports multiple recipients', async (t) => {
  const payload = new TextEncoder().encode('multiple recipients')
  const key128 = crypto.getRandomValues(new Uint8Array(16))
  const key256 = crypto.getRandomValues(new Uint8Array(32))
  const GeneralEncrypt = composeGeneralEncrypt(A128KW, A256KW, A256GCM)
  const generalDecrypt = composeGeneralDecrypt(A256GCM, A256KW, A128KW)

  const encrypted = await new GeneralEncrypt(payload)
    .setProtectedHeader({ enc: 'A256GCM' })
    .addRecipient(key128)
    .setUnprotectedHeader({ alg: 'A128KW' })
    .addRecipient(key256)
    .setUnprotectedHeader({ alg: 'A256KW' })
    .encrypt()

  t.is(encrypted.recipients.length, 2)
  t.deepEqual((await generalDecrypt(encrypted, key128)).plaintext, payload)
  t.deepEqual((await generalDecrypt(encrypted, key256)).plaintext, payload)

  t.deepEqual(
    (
      await generalDecrypt(
        {
          ...encrypted,
          recipients: [encrypted.recipients[0], { header: { alg: 'dir' } }],
        },
        key128,
      )
    ).plaintext,
    payload,
  )

  await t.throwsAsync(
    new GeneralEncrypt(payload)
      .setProtectedHeader({ enc: 'A256GCM' })
      .addRecipient(key128)
      .setUnprotectedHeader({ alg: 'unsupported' as never })
      .addRecipient(key256)
      .setUnprotectedHeader({ alg: 'dir' as never })
      .encrypt(),
    { code: 'ERR_JOSE_NOT_SUPPORTED' },
  )
})

test('General consumers cannot authenticate through an unselected algorithm', async (t) => {
  const payload = new TextEncoder().encode('selection boundary')
  const secret = crypto.getRandomValues(new Uint8Array(32))
  const pair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, false, [
    'sign',
    'verify',
  ])
  const signed = await new (composeGeneralSign(HS256, ES256))(payload)
    .addSignature(secret)
    .setProtectedHeader({ alg: 'HS256' })
    .addSignature(pair.privateKey)
    .setProtectedHeader({ alg: 'ES256' })
    .sign()

  const verified = await composeGeneralVerify(ES256)(signed, pair.publicKey)
  t.is(verified.protectedHeader?.alg, 'ES256')
  await t.throwsAsync(
    composeGeneralVerify(ES256)({ ...signed, signatures: [signed.signatures[0]] }, pair.publicKey),
    { code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' },
  )

  const key128 = crypto.getRandomValues(new Uint8Array(16))
  const key256 = crypto.getRandomValues(new Uint8Array(32))
  const encrypted = await new (composeGeneralEncrypt(A128KW, A256KW, A256GCM))(payload)
    .setProtectedHeader({ enc: 'A256GCM' })
    .addRecipient(key128)
    .setUnprotectedHeader({ alg: 'A128KW' })
    .addRecipient(key256)
    .setUnprotectedHeader({ alg: 'A256KW' })
    .encrypt()

  const decrypt128 = composeGeneralDecrypt(A128KW, A256GCM)
  t.deepEqual((await decrypt128(encrypted, key128)).plaintext, payload)
  await t.throwsAsync(decrypt128({ ...encrypted, recipients: [encrypted.recipients[1]] }, key256), {
    code: 'ERR_JWE_DECRYPTION_FAILED',
  })
})

test('selected algorithms and optional compression are enforced', async (t) => {
  const pair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, false, [
    'sign',
    'verify',
  ])
  const ES256SignJWT = composeSignJWT(ES256)
  await t.throwsAsync(
    new ES256SignJWT().setProtectedHeader({ alg: 'HS256' } as never).sign(pair.privateKey),
    { code: 'ERR_JOSE_NOT_SUPPORTED' },
  )

  const secret = crypto.getRandomValues(new Uint8Array(32))
  const EncryptWithoutCompression = composeEncryptJWT(dir, A256GCM)
  await t.throwsAsync(
    new EncryptWithoutCompression({ sub: 'alice' })
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM', zip: 'DEF' } as never)
      .encrypt(secret),
    { code: 'ERR_JOSE_NOT_SUPPORTED' },
  )

  const EncryptWithCompression = composeEncryptJWT(A256GCM, DEF, dir)
  t.notThrows(() =>
    new EncryptWithCompression({ sub: 'alice' }).setProtectedHeader({
      alg: 'dir',
      enc: 'A256GCM',
      zip: 'DEF',
    }),
  )
})

test('composition rejects unbranded structural factories', (t) => {
  const composeSignJWTUnchecked = composeSignJWT as unknown as (...factories: unknown[]) => unknown
  const composeEncryptJWTUnchecked = composeEncryptJWT as unknown as (
    ...factories: unknown[]
  ) => unknown
  const composeKeyImportUnchecked = composeKeyImport as unknown as (
    ...factories: unknown[]
  ) => unknown

  t.throws(() => composeSignJWTUnchecked(() => ({ ...ES256() })), {
    instanceOf: TypeError,
  })
  t.throws(() => composeEncryptJWTUnchecked(() => ({ ...dir() }), A256GCM), {
    instanceOf: TypeError,
  })
  t.throws(() => composeKeyImportUnchecked(() => ({ ...keyES256() })), {
    instanceOf: TypeError,
  })
})

test('composition validates malformed, duplicate, and incomplete selections eagerly', (t) => {
  const composeSignJWTUnchecked = composeSignJWT as unknown as (...factories: unknown[]) => unknown
  const composeEncryptJWTUnchecked = composeEncryptJWT as unknown as (
    ...factories: unknown[]
  ) => unknown

  t.throws(() => composeSignJWTUnchecked(), { instanceOf: TypeError })
  t.throws(() => composeSignJWTUnchecked('ES256'), { instanceOf: TypeError })
  t.throws(() => composeSignJWTUnchecked(() => null), { instanceOf: TypeError })
  const proxyCause = new Error('proxy factory trap')
  const proxyError = t.throws(
    () =>
      composeSignJWTUnchecked(
        new Proxy(ES256, {
          apply() {
            throw proxyCause
          },
        }),
      ),
    { instanceOf: TypeError, message: 'Invalid algorithm factory' },
  )
  t.is(proxyError.cause, proxyCause)
  const malformedError = t.throws(
    () => composeSignJWTUnchecked(() => Object.freeze({ category: 'jws', algorithm: 'ES256' })),
    { instanceOf: TypeError, message: 'Invalid "ES256" algorithm capability' },
  )
  t.true(malformedError.cause instanceof TypeError)
  const malformedCategory = { ...ES256(), category: 0 }
  Object.defineProperty(malformedCategory, Symbol.for('panva.jose.algorithmCapability.v1'), {
    value: 0,
  })
  Object.freeze(malformedCategory)
  t.throws(() => composeSignJWTUnchecked(() => malformedCategory), {
    instanceOf: TypeError,
    message: 'Invalid algorithm factory',
  })
  const capability = (category: string, algorithm: string, frozen = true) => {
    const value = { category, algorithm }
    return frozen ? Object.freeze(value) : value
  }
  t.throws(() => composeSignJWTUnchecked(() => capability('jws', 'ES256')), {
    instanceOf: TypeError,
  })
  t.throws(() => composeSignJWTUnchecked(dir), { instanceOf: TypeError })
  t.throws(() => composeSignJWTUnchecked(keyES256), { instanceOf: TypeError })
  t.throws(() => composeSignJWTUnchecked(HS256, HS256), {
    instanceOf: TypeError,
    message: /Duplicate "HS256" algorithm capability/u,
  })
  t.throws(() => composeEncryptJWTUnchecked(dir), { instanceOf: TypeError })
  t.throws(() => composeEncryptJWTUnchecked(A256GCM), { instanceOf: TypeError })
  t.throws(() => composeEncryptJWTUnchecked(dir, A256GCM, dir), {
    instanceOf: TypeError,
    message: /Duplicate "dir" algorithm capability/u,
  })
  t.throws(() => composeEncryptJWTUnchecked(keyAlgorithms.dir, A256GCM), {
    instanceOf: TypeError,
  })

  const composeKeyImportUnchecked = composeKeyImport as unknown as (
    ...factories: unknown[]
  ) => unknown
  t.throws(() => composeKeyImportUnchecked(), { instanceOf: TypeError })
  const wrongRole = t.throws(() => composeKeyImportUnchecked(ES256), {
    instanceOf: TypeError,
    message: 'Invalid algorithm factory',
  })
  t.true(wrongRole.cause instanceof TypeError)
  t.throws(() => composeKeyImportUnchecked(keyES256, keyES256), {
    instanceOf: TypeError,
    message: /Duplicate "ES256" algorithm capability/u,
  })
})

test('JWE mode dispatch and transported Encrypted Key postconditions are defensive', async (t) => {
  const marker = Symbol.for('panva.jose.algorithmCapability.v1')
  const source = A128KW() as unknown as RuntimeCapability
  const brandedFactory = (overrides: Partial<RuntimeCapability>): RuntimeFactory => {
    const capability = { ...source, ...overrides }
    Object.defineProperty(capability, marker, Object.getOwnPropertyDescriptor(source, marker)!)
    Object.freeze(capability)
    return () => capability
  }
  const invalidMode = brandedFactory({ mode: 'not-a-key-management-mode' })
  const InvalidEncrypt = (
    composeEncryptJWT as unknown as (...factories: RuntimeFactory[]) => typeof RootEncryptJWT
  )(invalidMode, A256GCM as RuntimeFactory)
  await t.throwsAsync(
    new InvalidEncrypt()
      .setProtectedHeader({ alg: 'A128KW', enc: 'A256GCM' })
      .encrypt(new Uint8Array(16)),
    { instanceOf: TypeError, message: 'Invalid JWE key management mode' },
  )

  const invalidDecrypt = (
    composeCompactDecrypt as unknown as (
      ...factories: RuntimeFactory[]
    ) => ReturnType<typeof composeCompactDecrypt>
  )(invalidMode, A256GCM as RuntimeFactory)
  const protectedHeader = base64url.encode(JSON.stringify({ alg: 'A128KW', enc: 'A256GCM' }))
  await t.throwsAsync(invalidDecrypt(`${protectedHeader}..AA.AA.AA`, new Uint8Array(16)), {
    instanceOf: TypeError,
    message: 'Invalid JWE key management mode',
  })

  const emptyEncryptedKey = brandedFactory({
    encrypt: async () => [new Uint8Array(), undefined],
  })
  const EmptyEncryptedKey = (
    composeEncryptJWT as unknown as (...factories: RuntimeFactory[]) => typeof RootEncryptJWT
  )(emptyEncryptedKey, A256GCM as RuntimeFactory)
  await t.throwsAsync(
    new EmptyEncryptedKey()
      .setProtectedHeader({ alg: 'A128KW', enc: 'A256GCM' })
      .encrypt(new Uint8Array(16)),
    {
      instanceOf: TypeError,
      message: 'JWE key management algorithm did not produce an Encrypted Key',
    },
  )

  let encryptCalled = false
  const observesCek = brandedFactory({
    encrypt: async () => {
      encryptCalled = true
      return [new Uint8Array(1), undefined]
    },
  })
  const ObservesCek = (
    composeCompactEncrypt as unknown as (
      ...factories: RuntimeFactory[]
    ) => typeof RootCompactEncrypt
  )(observesCek, A256GCM as RuntimeFactory)
  await t.throwsAsync(
    new ObservesCek(new Uint8Array())
      .setContentEncryptionKey(new Uint8Array(16))
      .setProtectedHeader({ alg: 'A128KW', enc: 'A256GCM' })
      .encrypt(new Uint8Array(16)),
    {
      code: 'ERR_JWE_INVALID',
      message: 'Invalid Content Encryption Key length. Expected 256 bits, got 128 bits',
    },
  )
  t.false(encryptCalled)
})

test('composition invokes each selected factory exactly once', (t) => {
  let jwsCalls = 0
  let keyCalls = 0
  const jwsFactory = () => {
    jwsCalls++
    return ES256()
  }
  const keyFactory = () => {
    keyCalls++
    return keyES256()
  }

  ;(composeSignJWT as unknown as (factory: RuntimeFactory) => unknown)(jwsFactory)
  ;(composeKeyImport as unknown as (factory: RuntimeFactory) => unknown)(keyFactory)
  t.is(jwsCalls, 1)
  t.is(keyCalls, 1)
})

test('JWE composition invokes and snapshots every factory exactly once', (t) => {
  const marker = Symbol.for('panva.jose.algorithmCapability.v1')
  const sources = [dir(), A256GCM(), DEF()] as readonly RuntimeCapability[]
  const factoryCalls = [0, 0, 0]
  const categoryReads = [0, 0, 0]
  const algorithmReads = [0, 0, 0]

  const factories = sources.map((source, index) => {
    const { category, algorithm, ...implementation } = source
    return () => {
      factoryCalls[index]++
      Object.defineProperties(implementation, {
        category: {
          enumerable: true,
          get() {
            if (++categoryReads[index] !== 1) throw new Error('category was read more than once')
            return category
          },
        },
        algorithm: {
          enumerable: true,
          get() {
            if (++algorithmReads[index] !== 1) throw new Error('algorithm was read more than once')
            return algorithm
          },
        },
        [marker]: Object.getOwnPropertyDescriptor(source, marker)!,
      })
      return Object.freeze(implementation) as unknown as RuntimeCapability
    }
  })

  ;(composeEncryptJWT as unknown as (...factories: RuntimeFactory[]) => unknown)(...factories)
  t.deepEqual(factoryCalls, [1, 1, 1])
  t.deepEqual(categoryReads, [1, 1, 1])
  t.deepEqual(algorithmReads, [1, 1, 1])
})

test('composition snapshots factory selection metadata and uses pollution-safe indexes', (t) => {
  const source = ES256() as unknown as RuntimeCapability
  const marker = Symbol.for('panva.jose.algorithmCapability.v1')
  const brandedCapability = (category: () => string, identifier: () => string) => {
    const { category: ignoredCategory, algorithm: ignoredAlgorithm, ...implementation } = source
    void ignoredCategory
    void ignoredAlgorithm
    Object.defineProperties(implementation, {
      category: { enumerable: true, get: category },
      algorithm: { enumerable: true, get: identifier },
      [marker]: Object.getOwnPropertyDescriptor(source, marker)!,
    })
    return Object.freeze(implementation) as unknown as RuntimeCapability
  }
  let categoryReads = 0
  let algorithmReads = 0
  const capability = brandedCapability(
    () => {
      if (++categoryReads !== 1) throw new Error('category was read more than once')
      return 'jws' as const
    },
    () => {
      if (++algorithmReads !== 1) throw new Error('algorithm was read more than once')
      return 'ES256' as const
    },
  )

  const SignJWT = (
    composeSignJWT as unknown as (factory: () => RuntimeCapability) => typeof RootSignJWT
  )(() => capability)
  t.truthy(new SignJWT().setProtectedHeader({ alg: 'ES256' }))
  t.is(categoryReads, 1)
  t.is(algorithmReads, 1)

  const prototypeNamed = brandedCapability(
    () => 'jws',
    () => '__proto__',
  )
  const prototypeFactory = () => prototypeNamed
  t.throws(
    () =>
      (composeSignJWT as unknown as (...factories: RuntimeFactory[]) => unknown)(
        prototypeFactory,
        prototypeFactory,
      ),
    { instanceOf: TypeError, message: /Duplicate "__proto__" algorithm capability/u },
  )
})

test('built-in capability records cannot change after composition', async (t) => {
  const selected = ES256() as unknown as RuntimeCapability
  const SignJWT = (
    composeSignJWT as unknown as (factory: () => RuntimeCapability) => typeof RootSignJWT
  )(() => selected)

  t.false(Reflect.set(selected.key!, 'alg', 'HS256'))
  t.false(Reflect.set(selected.key!.signing!, 'name', 'HMAC'))
  t.throws(() => (selected.key!.kty as string[]).push('oct'), { instanceOf: TypeError })

  const pair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, false, [
    'sign',
    'verify',
  ])
  const token = await new SignJWT().setProtectedHeader({ alg: 'ES256' }).sign(pair.privateKey)
  await t.notThrowsAsync(composeJwtVerify(ES256)(token, pair.publicKey))

  const selectedEncryption = A256GCM() as unknown as RuntimeCapability
  const EncryptJWT = (
    composeEncryptJWT as unknown as (
      keyManagement: RuntimeFactory,
      contentEncryption: () => RuntimeCapability,
    ) => typeof RootEncryptJWT
  )(dir as RuntimeFactory, () => selectedEncryption)
  t.false(Reflect.set(selectedEncryption.key!.subtle, 'name', 'AES-CBC'))
  t.false(Reflect.set(selectedEncryption.key!, 'alg', 'A128GCM'))
  await t.notThrowsAsync(
    new EncryptJWT().setProtectedHeader({ alg: 'dir', enc: 'A256GCM' }).encrypt(new Uint8Array(32)),
  )
})

test('composed decryption preserves legacy algorithm error precedence', async (t) => {
  const compactDecrypt = composeCompactDecrypt(dir, A256GCM)
  const compact = (alg: string, encryptedKey = '') =>
    `${base64url.encode(JSON.stringify({ alg, enc: 'A256GCM' }))}.${encryptedKey}.AA.AA.AA`

  await t.throwsAsync(compactDecrypt(compact('RSA-OAEP', '!'), new Uint8Array(32)), {
    code: 'ERR_JWE_INVALID',
    message: 'Failed to base64url decode the encrypted_key',
  })

  let resolverCalled = false
  await t.throwsAsync(
    compactDecrypt(compact('RSA-OAEP'), async () => {
      resolverCalled = true
      return new Uint8Array(32)
    }),
    { code: 'ERR_JOSE_NOT_SUPPORTED' },
  )
  t.true(resolverCalled)

  for (const alg of ['PBES2-HS256+A128KW', 'PBES2-unsupported']) {
    await t.throwsAsync(compactDecrypt(compact(alg), new Uint8Array(32)), {
      code: 'ERR_JOSE_ALG_NOT_ALLOWED',
      message: '"alg" (Algorithm) Header Parameter value not allowed',
    })
  }
})

async function es256KeyFixture() {
  const generateKeyPair = composeGenerateKeyPair(keyES256)
  const pair = await generateKeyPair('ES256', { extractable: true })
  const exported = (await crypto.subtle.exportKey('jwk', pair.publicKey)) as JWK
  const jwk: JWK = { ...exported, alg: 'ES256', kid: 'es256', use: 'sig' }
  return { generateKeyPair, pair, jwk }
}

test('composable key utilities enforce their selections and share the ES256 path', async (t) => {
  const { generateKeyPair, pair, jwk } = await es256KeyFixture()

  t.is(pair.privateKey.algorithm.name, 'ECDSA')
  await t.throwsAsync(generateKeyPair('PS256' as never), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
  })

  const keyImport = composeKeyImport(keyES256)
  const importedJwk = await keyImport.importJWK(jwk, 'ES256')
  const spki = await exportSPKI(pair.publicKey)
  const importedSpki = await keyImport.importSPKI(spki, 'ES256')
  t.is(importedJwk.algorithm.name, 'ECDSA')
  t.is(importedSpki.algorithm.name, 'ECDSA')
  await t.throwsAsync(keyImport.importJWK(jwk, 'PS256' as never), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
  })

  const oct = { kty: 'oct', k: base64url.encode(new Uint8Array(32)) } as const
  await t.throwsAsync(keyImport.importJWK(oct), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
  })
  await t.throwsAsync(keyImport.importJWK({ ...oct, alg: 'ES256' }), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
  })

  const secretImport = composeKeyImport(keyHS256)
  t.deepEqual(await secretImport.importJWK({ ...oct, alg: 'HS256' }), new Uint8Array(32))

  const twoSecretImports = composeKeyImport(keyHS256, keyHS384)
  await t.throwsAsync(twoSecretImports.importJWK({ ...oct, alg: 'HS384' }, 'HS256'), {
    instanceOf: TypeError,
    message: 'JWK alg and alg option value mismatch',
  })

  const generateSecret = composeGenerateSecret(keyHS256)
  const secret = await generateSecret('HS256')
  t.is(secret.type, 'secret')
  t.is(secret.algorithm.name, 'HMAC')
  await t.throwsAsync(generateSecret('HS384' as never), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
  })
})

test('composable Embedded JWK and local JWK Set enforce ES256', async (t) => {
  const { jwk } = await es256KeyFixture()
  const embeddedJWK = composeEmbeddedJWK(ES256)
  const embedded = await embeddedJWK({ alg: 'ES256', jwk })
  t.is(embedded.type, 'public')
  t.is(embedded.algorithm.name, 'ECDSA')
  await t.throwsAsync(embeddedJWK({ alg: 'PS256' as never, jwk }), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
  })

  const createLocalJWKSet = composeLocalJWKSet(ES256)
  const local = createLocalJWKSet({ keys: [jwk] })
  const resolved = await local({ alg: 'ES256', kid: 'es256' })
  t.is(resolved.type, 'public')
  t.deepEqual(local.jwks(), { keys: [jwk] })
  await t.throwsAsync(local({ alg: 'PS256' as never, kid: 'es256' }), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
  })
})

test('composable remote JWK Set can resolve ES256 from a seeded cache', async (t) => {
  const { jwk } = await es256KeyFixture()
  const createRemoteJWKSet = composeRemoteJWKSet(ES256)
  const remote = createRemoteJWKSet(new URL('https://example.com/jwks'), {
    [jwksCache]: { jwks: { keys: [jwk] }, uat: Date.now() },
  })

  const resolved = await remote({ alg: 'ES256', kid: 'es256' })
  t.is(resolved.type, 'public')
  t.true(remote.fresh)
  t.deepEqual(remote.jwks(), { keys: [jwk] })
  await t.throwsAsync(remote({ alg: 'PS256' as never, kid: 'es256' }), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
  })
})

test('composed producer constructors preserve class semantics and public identity', (t) => {
  const FirstSignJWT = composeSignJWT(ES256)
  const SecondSignJWT = composeSignJWT(ES256)
  const FirstEncryptJWT = composeEncryptJWT(dir, A256GCM)
  const SecondEncryptJWT = composeEncryptJWT(dir, A256GCM)

  t.not(FirstSignJWT, SecondSignJWT)
  t.not(FirstEncryptJWT, SecondEncryptJWT)
  t.is(FirstSignJWT.name, 'SignJWT')
  t.is(FirstEncryptJWT.name, 'EncryptJWT')

  class DerivedSignJWT extends FirstSignJWT {}
  class DerivedEncryptJWT extends FirstEncryptJWT {}
  const signed = new DerivedSignJWT()
  const encrypted = new DerivedEncryptJWT()
  t.true(signed instanceof DerivedSignJWT)
  t.true(signed instanceof FirstSignJWT)
  t.true(encrypted instanceof DerivedEncryptJWT)
  t.true(encrypted instanceof FirstEncryptJWT)

  t.is(RootSignJWT, DeepSignJWT)
  t.is(RootEncryptJWT, DeepEncryptJWT)

  for (const constructor of [
    RootCompactSign,
    RootFlattenedSign,
    RootGeneralSign,
    RootCompactEncrypt,
    RootFlattenedEncrypt,
    RootGeneralEncrypt,
  ]) {
    t.is(constructor.length, 1)
  }
  t.is(RootSignJWT.length, 0)
  t.is(RootEncryptJWT.length, 0)
})
