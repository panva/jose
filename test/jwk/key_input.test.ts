import test from 'ava'
import { createSecretKey, generateKeyPairSync } from 'node:crypto'

import {
  CompactSign,
  compactVerify,
  CompactEncrypt,
  compactDecrypt,
  generateSecret,
  exportJWK,
  generateKeyPair,
  importJWK,
} from '../../src/index.js'

const payload = new TextEncoder().encode('You step into the Road, and if you do not keep your feet')

test.serial('JWK inputs are frozen before import and cached afterward', async (t) => {
  const { privateKey, publicKey } = await generateKeyPair('ES256', { extractable: true })
  const jwk = await exportJWK(privateKey)
  jwk.key_ops = ['sign']

  const subtle = crypto.subtle
  const descriptor = Object.getOwnPropertyDescriptor(subtle, 'importKey')
  const importKey = subtle.importKey
  let imports = 0
  let release!: () => void
  const blocked = new Promise<void>((resolve) => {
    release = resolve
  })

  Object.defineProperty(subtle, 'importKey', {
    configurable: true,
    async value(...args: Parameters<SubtleCrypto['importKey']>) {
      if (args[0] === 'jwk') {
        imports++
        await blocked
      }
      return Reflect.apply(importKey, subtle, args)
    },
  })

  let firstPending: Promise<string> | undefined
  try {
    // The cache key must become immutable before the import promise can yield.
    firstPending = new CompactSign(payload).setProtectedHeader({ alg: 'ES256' }).sign(jwk)

    t.is(imports, 1)
    t.true(Object.isFrozen(jwk))
    t.true(Object.isFrozen(jwk.key_ops))
    t.throws(() => Object.assign(jwk, { kid: 'changed' }), { instanceOf: TypeError })
    t.throws(() => jwk.key_ops!.push('verify'), { instanceOf: TypeError })

    release()
    const first = await firstPending
    const second = await new CompactSign(payload).setProtectedHeader({ alg: 'ES256' }).sign(jwk)

    t.is(imports, 1)
    await t.notThrowsAsync(compactVerify(first, publicKey))
    await t.notThrowsAsync(compactVerify(second, publicKey))
  } finally {
    release()
    await firstPending?.catch(() => {})
    if (descriptor) {
      Object.defineProperty(subtle, 'importKey', descriptor)
    } else {
      Reflect.deleteProperty(subtle, 'importKey')
    }
  }
})

test('direct oct JWK key_ops must be an array of unique strings', async (t) => {
  const key = {
    k: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    kty: 'oct' as const,
  }

  for (const key_ops of [null, {}, 0, 'sign', ['sign', 'sign'], ['sign', 0]]) {
    await t.throwsAsync(
      new CompactSign(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .sign({ ...key, key_ops } as never),
      { instanceOf: TypeError },
    )
  }
})

test('direct JWK inputs use one normalized snapshot', async (t) => {
  const first = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
  const second = 'AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE'
  let keyReads = 0
  let keyOpsReads = 0
  const jwk = {
    get k() {
      return keyReads++ === 0 ? first : second
    },
    get key_ops() {
      return keyOpsReads++ === 0 ? ['sign'] : ['verify']
    },
    kty: 'oct' as const,
  }

  const signature = await new CompactSign(payload).setProtectedHeader({ alg: 'HS256' }).sign(jwk)

  t.is(keyReads, 1)
  t.is(keyOpsReads, 1)
  await t.notThrowsAsync(compactVerify(signature, await importJWK({ k: first, kty: 'oct' })))
})

test.serial('cached asymmetric data JWKs reuse their imported key', async (t) => {
  const { privateKey, publicKey } = await generateKeyPair('ES256', { extractable: true })
  const jwk = await exportJWK(publicKey)
  const signature = await new CompactSign(payload)
    .setProtectedHeader({ alg: 'ES256' })
    .sign(privateKey)

  const subtle = crypto.subtle
  const descriptor = Object.getOwnPropertyDescriptor(subtle, 'importKey')
  const importKey = subtle.importKey
  let imports = 0
  Object.defineProperty(subtle, 'importKey', {
    configurable: true,
    async value(...args: Parameters<SubtleCrypto['importKey']>) {
      if (args[0] === 'jwk') imports++
      return Reflect.apply(importKey, subtle, args)
    },
  })

  try {
    await t.notThrowsAsync(compactVerify(signature, jwk))
    await t.notThrowsAsync(compactVerify(signature, jwk))
    t.is(imports, 1)
    t.true(Object.isFrozen(jwk))
  } finally {
    if (descriptor) {
      Object.defineProperty(subtle, 'importKey', descriptor)
    } else {
      Reflect.deleteProperty(subtle, 'importKey')
    }
  }
})

test('signing rejects unsupported key inputs', async (t) => {
  for (const key of [undefined, null, 1, 0, true, Boolean, [], '', 'foo', {}]) {
    await t.throwsAsync(
      new CompactSign(payload).setProtectedHeader({ alg: 'HS256' }).sign(key as never),
      {
        instanceOf: TypeError,
        message:
          /^Key for the HS256 algorithm must be one of type CryptoKey, KeyObject, JSON Web Key, or Uint8Array\./,
      },
    )
  }
  await t.throwsAsync(
    new CompactSign(payload).setProtectedHeader({ alg: 'PS256' }).sign(new Uint8Array()),
    {
      instanceOf: TypeError,
      message:
        /^Key for the PS256 algorithm must be one of type CryptoKey, KeyObject, or JSON Web Key\./,
    },
  )
})

test('operations require the appropriate CryptoKey type', async (t) => {
  const secret = await generateSecret('HS256')
  const { privateKey, publicKey } = await generateKeyPair('PS256')
  const sign = (alg: string, key: Parameters<CompactSign['sign']>[0]) =>
    new CompactSign(payload).setProtectedHeader({ alg }).sign(key)

  await t.throwsAsync(sign('PS256', secret), {
    instanceOf: TypeError,
    message: 'CryptoKey instances must be of type "private" for the PS256 algorithm',
  })
  await t.throwsAsync(sign('HS256', privateKey), {
    instanceOf: TypeError,
    message: 'CryptoKey instances must be of type "secret" for the HS256 algorithm',
  })
  await t.throwsAsync(sign('PS256', publicKey), {
    instanceOf: TypeError,
    message: 'CryptoKey instances must be of type "private" for the PS256 algorithm',
  })
  const jws = await sign('PS256', privateKey)
  await t.throwsAsync(compactVerify(jws, privateKey), {
    instanceOf: TypeError,
    message: 'CryptoKey instances must be of type "public" for the PS256 algorithm',
  })

  const ecdh = await generateKeyPair('ECDH-ES')
  const encrypt = (key: Parameters<CompactEncrypt['encrypt']>[0]) =>
    new CompactEncrypt(payload).setProtectedHeader({ alg: 'ECDH-ES', enc: 'A128GCM' }).encrypt(key)
  await t.throwsAsync(encrypt(ecdh.privateKey), {
    instanceOf: TypeError,
    message: 'CryptoKey instances must be of type "public" for the ECDH-ES algorithm',
  })
  const jwe = await encrypt(ecdh.publicKey)
  await t.throwsAsync(compactDecrypt(jwe, ecdh.publicKey), {
    instanceOf: TypeError,
    message: 'CryptoKey instances must be of type "private" for the ECDH-ES algorithm',
  })
})

test('symmetric operations accept raw bytes, CryptoKey, and KeyObject inputs', async (t) => {
  const bytes = new Uint8Array(32)
  for (const key of [bytes, await generateSecret('HS256'), createSecretKey(bytes)]) {
    const jws = await new CompactSign(payload).setProtectedHeader({ alg: 'HS256' }).sign(key)
    t.deepEqual((await compactVerify(jws, key)).payload, payload)
  }
  for (const alg of ['dir', 'PBES2-HS256+A128KW', 'A256GCMKW', 'A256KW']) {
    const keys: Array<Parameters<CompactEncrypt['encrypt']>[0]> = [bytes, createSecretKey(bytes)]
    if (!alg.startsWith('PBES2')) keys.push(await generateSecret(alg === 'dir' ? 'A256GCM' : alg))
    for (const key of keys) {
      const jwe = await new CompactEncrypt(payload)
        .setProtectedHeader({ alg, enc: 'A256GCM' })
        .encrypt(key)
      const result = await compactDecrypt(jwe, key, { keyManagementAlgorithms: [alg] })
      t.deepEqual(result.plaintext, payload)
    }
  }
})

test('operations validate JWK type and metadata before importing', async (t) => {
  const key = { kty: 'oct', k: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' }
  const sign = (jwk: Parameters<CompactSign['sign']>[0]) =>
    new CompactSign(payload).setProtectedHeader({ alg: 'HS256' }).sign(jwk)
  for (const metadata of [{}, { use: 'sig' }, { key_ops: ['sign'] }, { alg: 'HS256' }]) {
    t.deepEqual((await compactVerify(await sign({ ...key, ...metadata }), key)).payload, payload)
  }
  for (const [metadata, message] of [
    [{ use: 'enc' }, 'Invalid key for this operation, its "use" must be "sig" when present'],
    [{ alg: 'HS384' }, 'Invalid key for this operation, its "alg" must be "HS256" when present'],
    [
      { key_ops: ['verify'] },
      'Invalid key for this operation, its "key_ops" must include "sign" when present',
    ],
    [
      { kty: 'RSA' },
      'JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present',
    ],
  ] as const) {
    await t.throwsAsync(sign({ ...key, ...metadata } as never), { instanceOf: TypeError, message })
  }

  const { privateKey, publicKey } = await generateKeyPair('PS256', { extractable: true })
  const privateJwk = await exportJWK(privateKey)
  const publicJwk = await exportJWK(publicKey)
  const jws = await new CompactSign(payload).setProtectedHeader({ alg: 'PS256' }).sign(privateJwk)
  t.deepEqual((await compactVerify(jws, publicJwk)).payload, payload)
  await t.throwsAsync(compactVerify(jws, privateJwk), {
    instanceOf: TypeError,
    message: 'JSON Web Key for this operation must be a public JWK',
  })
  await t.throwsAsync(
    new CompactSign(payload).setProtectedHeader({ alg: 'PS256' }).sign(publicJwk),
    {
      instanceOf: TypeError,
      message: 'JSON Web Key for this operation must be a private JWK',
    },
  )
})

test('JWE JWK key_ops follow each key management operation', async (t) => {
  const { privateKey, publicKey } = await generateKeyPair('ECDH-ES', { extractable: true })
  const privateJwk = await exportJWK(privateKey)
  const publicJwk = await exportJWK(publicKey)
  for (const key_ops of [undefined, []]) {
    const jwe = await new CompactEncrypt(payload)
      .setProtectedHeader({ alg: 'ECDH-ES', enc: 'A128GCM' })
      .encrypt({ ...publicJwk, key_ops })
    const result = await compactDecrypt(jwe, { ...privateJwk, key_ops: ['deriveBits'] })
    t.deepEqual(result.plaintext, payload)
    await t.throwsAsync(compactDecrypt(jwe, { ...privateJwk, key_ops: ['sign'] }), {
      instanceOf: TypeError,
      message:
        'Invalid key for this operation, its "key_ops" must include "deriveBits" when present',
    })
  }
  const key = { kty: 'oct', k: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', key_ops: ['encrypt'] }
  await t.throwsAsync(
    new CompactEncrypt(payload).setProtectedHeader({ alg: 'A256KW', enc: 'A128GCM' }).encrypt(key),
    {
      instanceOf: TypeError,
      message: 'Invalid key for this operation, its "key_ops" must include "wrapKey" when present',
    },
  )
  const jwe = await new CompactEncrypt(payload)
    .setProtectedHeader({ alg: 'A256GCMKW', enc: 'A128GCM' })
    .encrypt(key)
  t.deepEqual((await compactDecrypt(jwe, { ...key, key_ops: ['decrypt'] })).plaintext, payload)
})

for (const fallback of [false, true]) {
  test(`KeyObject signing and verification ${fallback ? 'JWK fallback' : 'direct conversion'}`, async (t) => {
    const { privateKey, publicKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' })
    if (fallback) {
      Object.defineProperty(privateKey, 'toCryptoKey', { value: undefined })
      Object.defineProperty(publicKey, 'toCryptoKey', { value: undefined })
    }
    let conversions = 0
    for (const key of [privateKey, publicKey]) {
      const method = typeof key.toCryptoKey === 'function' ? 'toCryptoKey' : 'export'
      const convert = key[method]
      Object.defineProperty(key, method, {
        value(...args: unknown[]) {
          conversions++
          return Reflect.apply(convert, key, args)
        },
      })
    }
    for (let i = 0; i < 2; i++) {
      const jws = await new CompactSign(payload)
        .setProtectedHeader({ alg: 'ES256' })
        .sign(privateKey)
      t.deepEqual((await compactVerify(jws, publicKey)).payload, payload)
    }
    t.is(conversions, 2)
  })
}
