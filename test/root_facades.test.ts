import assert from 'node:assert/strict'
import test from 'node:test'

import {
  CompactEncrypt,
  CompactSign,
  EncryptJWT,
  FlattenedEncrypt,
  FlattenedSign,
  GeneralEncrypt,
  GeneralSign,
  SignJWT,
  base64url,
  compactDecrypt,
  compactVerify,
  flattenedDecrypt,
  flattenedVerify,
  generalDecrypt,
  generalVerify,
  generateKeyPair,
  generateSecret,
  jwtDecrypt,
  jwtVerify,
  type JWEContentEncryptionAlgorithm,
  type JWEKeyManagementAlgorithm,
  type JWSAlgorithm,
} from '../src/index.js'
import { errorLike } from './_errors.js'

type Key = CryptoKey | Uint8Array

const encoder = new TextEncoder()

function tamperEncoded(input: string): string {
  const bytes = new Uint8Array(base64url.decode(input))
  bytes[0] ^= 1
  return base64url.encode(bytes)
}

const jwsAlgorithms = [
  'HS256',
  'HS384',
  'HS512',
  'RS256',
  'RS384',
  'RS512',
  'PS256',
  'PS384',
  'PS512',
  'ES256',
  'ES384',
  'ES512',
  'EdDSA',
  'Ed25519',
  'ML-DSA-44',
  'ML-DSA-65',
  'ML-DSA-87',
] as const satisfies readonly JWSAlgorithm[]

const keyManagementAlgorithms = [
  'dir',
  'RSA-OAEP',
  'RSA-OAEP-256',
  'RSA-OAEP-384',
  'RSA-OAEP-512',
  'ECDH-ES',
  'ECDH-ES+A128KW',
  'ECDH-ES+A192KW',
  'ECDH-ES+A256KW',
  'A128KW',
  'A192KW',
  'A256KW',
  'A128GCMKW',
  'A192GCMKW',
  'A256GCMKW',
  'PBES2-HS256+A128KW',
  'PBES2-HS384+A192KW',
  'PBES2-HS512+A256KW',
] as const satisfies readonly JWEKeyManagementAlgorithm[]

const contentEncryptionAlgorithms = [
  'A128GCM',
  'A192GCM',
  'A256GCM',
  'A128CBC-HS256',
  'A192CBC-HS384',
  'A256CBC-HS512',
] as const satisfies readonly JWEContentEncryptionAlgorithm[]

function unavailable(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'NotSupportedError'
}

async function jwsKeys(algorithm: (typeof jwsAlgorithms)[number]): Promise<readonly [Key, Key]> {
  if (algorithm.startsWith('HS')) {
    const secret = await generateSecret(algorithm)
    return [secret, secret]
  }

  const { privateKey, publicKey } = await generateKeyPair(algorithm)
  return [privateKey, publicKey]
}

async function exerciseJWSFacades(
  algorithm: (typeof jwsAlgorithms)[number],
  signingKey: Key,
  verificationKey: Key,
) {
  const plaintext = encoder.encode(`root JWS facade matrix: ${algorithm}`)
  const header = { alg: algorithm }

  const compact = await new CompactSign(plaintext).setProtectedHeader(header).sign(signingKey)
  const compactResult = await compactVerify(compact, verificationKey)
  assert.deepStrictEqual(compactResult.payload, plaintext, `${algorithm} compact payload`)
  assert.strictEqual(compactResult.protectedHeader.alg, algorithm, `${algorithm} compact header`)

  const flattened = await new FlattenedSign(plaintext).setProtectedHeader(header).sign(signingKey)
  const flattenedResult = await flattenedVerify(flattened, verificationKey)
  assert.deepStrictEqual(flattenedResult.payload, plaintext, `${algorithm} flattened payload`)
  assert.strictEqual(
    flattenedResult.protectedHeader?.alg,
    algorithm,
    `${algorithm} flattened header`,
  )

  const general = await new GeneralSign(plaintext)
    .addSignature(signingKey)
    .setProtectedHeader(header)
    .sign()
  const generalResult = await generalVerify(general, verificationKey)
  assert.deepStrictEqual(generalResult.payload, plaintext, `${algorithm} general payload`)
  assert.strictEqual(generalResult.protectedHeader?.alg, algorithm, `${algorithm} general header`)

  const jwt = await new SignJWT({ algorithm }).setProtectedHeader(header).sign(signingKey)
  const jwtResult = await jwtVerify(jwt, verificationKey)
  assert.strictEqual(jwtResult.payload.algorithm, algorithm, `${algorithm} JWT payload`)
  assert.strictEqual(jwtResult.protectedHeader.alg, algorithm, `${algorithm} JWT header`)
}

for (const algorithm of jwsAlgorithms) {
  test(`every root JWS facade supports ${algorithm}`, async (t) => {
    try {
      await exerciseJWSFacades(algorithm, ...(await jwsKeys(algorithm)))
    } catch (error) {
      if (unavailable(error)) {
        t.skip(`${algorithm} is unavailable in this runtime`)
        return
      }
      throw error
    }
  })
}

async function jweKeys(
  algorithm: (typeof keyManagementAlgorithms)[number],
  contentEncryptionAlgorithm: (typeof contentEncryptionAlgorithms)[number],
): Promise<readonly [Key, Key]> {
  if (algorithm.startsWith('RSA-') || algorithm.startsWith('ECDH-')) {
    const { privateKey, publicKey } = await generateKeyPair(algorithm)
    return [publicKey, privateKey]
  }

  if (algorithm === 'dir') {
    const secret = await generateSecret(contentEncryptionAlgorithm)
    return [secret, secret]
  }

  if (algorithm.startsWith('PBES2-')) {
    const password = crypto.getRandomValues(new Uint8Array(32))
    return [password, password]
  }

  const secret = await generateSecret(algorithm)
  return [secret, secret]
}

async function exerciseJWEFacades(
  keyManagementAlgorithm: (typeof keyManagementAlgorithms)[number],
  contentEncryptionAlgorithm: (typeof contentEncryptionAlgorithms)[number],
  encryptionKey: Key,
  decryptionKey: Key,
  compressed = false,
) {
  const plaintext = encoder.encode(
    `root JWE facade matrix: ${keyManagementAlgorithm} + ${contentEncryptionAlgorithm}`,
  )
  const header = {
    alg: keyManagementAlgorithm,
    enc: contentEncryptionAlgorithm,
    ...(compressed ? { zip: 'DEF' as const } : undefined),
  }
  const decryptOptions = keyManagementAlgorithm.startsWith('PBES2-')
    ? { keyManagementAlgorithms: [keyManagementAlgorithm] }
    : undefined
  const transportsCek = keyManagementAlgorithm !== 'dir' && keyManagementAlgorithm !== 'ECDH-ES'

  const compact = await new CompactEncrypt(plaintext)
    .setProtectedHeader(header)
    .encrypt(encryptionKey)
  assert.strictEqual(
    compact.split('.')[1].length > 0,
    transportsCek,
    `${keyManagementAlgorithm} compact encrypted key`,
  )
  const compactResult = await compactDecrypt(compact, decryptionKey, decryptOptions)
  assert.deepStrictEqual(
    compactResult.plaintext,
    plaintext,
    `${keyManagementAlgorithm} compact payload`,
  )
  assert.strictEqual(
    compactResult.protectedHeader.alg,
    keyManagementAlgorithm,
    `${keyManagementAlgorithm} compact key management`,
  )
  assert.strictEqual(
    compactResult.protectedHeader.enc,
    contentEncryptionAlgorithm,
    `${keyManagementAlgorithm} compact content encryption`,
  )
  assert.strictEqual(compactResult.protectedHeader.zip, compressed ? 'DEF' : undefined)

  const flattened = await new FlattenedEncrypt(plaintext)
    .setProtectedHeader(header)
    .encrypt(encryptionKey)
  assert.strictEqual(
    Object.hasOwn(flattened, 'encrypted_key'),
    transportsCek,
    `${keyManagementAlgorithm} flattened encrypted key`,
  )
  const flattenedResult = await flattenedDecrypt(flattened, decryptionKey, decryptOptions)
  assert.deepStrictEqual(
    flattenedResult.plaintext,
    plaintext,
    `${keyManagementAlgorithm} flattened payload`,
  )
  assert.strictEqual(
    flattenedResult.protectedHeader?.alg,
    keyManagementAlgorithm,
    `${keyManagementAlgorithm} flattened key management`,
  )
  assert.strictEqual(
    flattenedResult.protectedHeader?.enc,
    contentEncryptionAlgorithm,
    `${keyManagementAlgorithm} flattened content encryption`,
  )
  assert.strictEqual(flattenedResult.protectedHeader?.zip, compressed ? 'DEF' : undefined)

  const general = await new GeneralEncrypt(plaintext)
    .setProtectedHeader(header)
    .addRecipient(encryptionKey)
    .encrypt()
  assert.strictEqual(
    Object.hasOwn(general.recipients[0], 'encrypted_key'),
    transportsCek,
    `${keyManagementAlgorithm} general encrypted key`,
  )
  const generalResult = await generalDecrypt(general, decryptionKey, decryptOptions)
  assert.deepStrictEqual(
    generalResult.plaintext,
    plaintext,
    `${keyManagementAlgorithm} general payload`,
  )
  assert.strictEqual(
    generalResult.protectedHeader?.alg,
    keyManagementAlgorithm,
    `${keyManagementAlgorithm} general key management`,
  )
  assert.strictEqual(
    generalResult.protectedHeader?.enc,
    contentEncryptionAlgorithm,
    `${keyManagementAlgorithm} general content encryption`,
  )
  assert.strictEqual(generalResult.protectedHeader?.zip, compressed ? 'DEF' : undefined)

  const jwt = await new EncryptJWT({
    keyManagementAlgorithm,
    contentEncryptionAlgorithm,
  })
    .setProtectedHeader(header)
    .encrypt(encryptionKey)
  const jwtResult = await jwtDecrypt(jwt, decryptionKey, decryptOptions)
  assert.strictEqual(
    jwtResult.payload.keyManagementAlgorithm,
    keyManagementAlgorithm,
    `${keyManagementAlgorithm} JWT payload`,
  )
  assert.strictEqual(
    jwtResult.payload.contentEncryptionAlgorithm,
    contentEncryptionAlgorithm,
    `${keyManagementAlgorithm} JWT content encryption payload`,
  )
  assert.strictEqual(
    jwtResult.protectedHeader.alg,
    keyManagementAlgorithm,
    `${keyManagementAlgorithm} JWT key management`,
  )
  assert.strictEqual(
    jwtResult.protectedHeader.enc,
    contentEncryptionAlgorithm,
    `${keyManagementAlgorithm} JWT content encryption`,
  )
  assert.strictEqual(jwtResult.protectedHeader.zip, compressed ? 'DEF' : undefined)
}

for (const keyManagementAlgorithm of keyManagementAlgorithms) {
  test(`every root JWE facade supports key management ${keyManagementAlgorithm}`, async (t) => {
    const contentEncryptionAlgorithm = 'A256GCM'
    try {
      await exerciseJWEFacades(
        keyManagementAlgorithm,
        contentEncryptionAlgorithm,
        ...(await jweKeys(keyManagementAlgorithm, contentEncryptionAlgorithm)),
      )
    } catch (error) {
      if (unavailable(error)) {
        t.skip(`${keyManagementAlgorithm} is unavailable in this runtime`)
        return
      }
      throw error
    }
  })
}

for (const contentEncryptionAlgorithm of contentEncryptionAlgorithms) {
  test(`every root JWE facade supports content encryption ${contentEncryptionAlgorithm}`, async (t) => {
    const keyManagementAlgorithm = 'dir'
    try {
      await exerciseJWEFacades(
        keyManagementAlgorithm,
        contentEncryptionAlgorithm,
        ...(await jweKeys(keyManagementAlgorithm, contentEncryptionAlgorithm)),
      )
    } catch (error) {
      if (unavailable(error)) {
        t.skip(`${contentEncryptionAlgorithm} is unavailable in this runtime`)
        return
      }
      throw error
    }
  })
}

test('every root JWE facade supports DEF', async (t) => {
  if (typeof CompressionStream === 'undefined' || typeof DecompressionStream === 'undefined') {
    t.skip('compression streams are unavailable in this runtime')
    return
  }

  const keyManagementAlgorithm = 'dir'
  const contentEncryptionAlgorithm = 'A256GCM'
  await exerciseJWEFacades(
    keyManagementAlgorithm,
    contentEncryptionAlgorithm,
    ...(await jweKeys(keyManagementAlgorithm, contentEncryptionAlgorithm)),
    true,
  )
})

test('a supplied CEK is used by every CEK-transport mode', async () => {
  const plaintext = encoder.encode('root JWE supplied CEK transport')
  const suppliedCek = new Uint8Array(32).fill(0xa5)
  const iv = new Uint8Array(12).fill(0x5a)
  const cek = await crypto.subtle.importKey('raw', suppliedCek, 'AES-GCM', false, ['encrypt'])

  for (const algorithm of ['A256KW', 'RSA-OAEP-256', 'ECDH-ES+A256KW'] as const) {
    const [encryptionKey, decryptionKey] = await jweKeys(algorithm, 'A256GCM')
    const jwe = await new FlattenedEncrypt(plaintext)
      .setProtectedHeader({ alg: algorithm, enc: 'A256GCM' })
      .setContentEncryptionKey(suppliedCek)
      .setInitializationVector(iv)
      .encrypt(encryptionKey)
    const expected = new Uint8Array(
      await crypto.subtle.encrypt(
        {
          additionalData: encoder.encode(jwe.protected!),
          iv,
          name: 'AES-GCM',
          tagLength: 128,
        },
        cek,
        plaintext,
      ),
    )

    assert.deepStrictEqual(
      new Uint8Array(base64url.decode(jwe.ciphertext)),
      expected.slice(0, -16),
      algorithm,
    )
    assert.deepStrictEqual(
      new Uint8Array(base64url.decode(jwe.tag!)),
      expected.slice(-16),
      algorithm,
    )
    assert.deepStrictEqual(
      (await flattenedDecrypt(jwe, decryptionKey)).plaintext,
      plaintext,
      algorithm,
    )
  }
})

test('JWE failures collapse across every key-management mode', async () => {
  const plaintext = encoder.encode('root JWE mode failure collapsing')

  for (const algorithm of ['dir', 'ECDH-ES', 'A256KW', 'RSA-OAEP-256', 'ECDH-ES+A256KW'] as const) {
    const [encryptionKey, decryptionKey] = await jweKeys(algorithm, 'A256GCM')
    const jwe = await new FlattenedEncrypt(plaintext)
      .setProtectedHeader({ alg: algorithm, enc: 'A256GCM' })
      .encrypt(encryptionKey)
    const malformed =
      algorithm === 'dir' || algorithm === 'ECDH-ES'
        ? { ...jwe, tag: tamperEncoded(jwe.tag!) }
        : { ...jwe, encrypted_key: tamperEncoded(jwe.encrypted_key!) }

    await assert.rejects(
      flattenedDecrypt(malformed, decryptionKey),
      errorLike({
        code: 'ERR_JWE_DECRYPTION_FAILED',
        message: 'decryption operation failed',
      }),
    )
  }
})

test('every CEK-transport mode supports multiple recipients', async () => {
  const plaintext = encoder.encode('root JWE multi-recipient transport modes')

  for (const algorithm of ['A256KW', 'RSA-OAEP-256', 'ECDH-ES+A256KW'] as const) {
    const [firstEncryptionKey, firstDecryptionKey] = await jweKeys(algorithm, 'A256GCM')
    const [secondEncryptionKey, secondDecryptionKey] = await jweKeys(algorithm, 'A256GCM')
    const jwe = await new GeneralEncrypt(plaintext)
      .setProtectedHeader({ alg: algorithm, enc: 'A256GCM' })
      .addRecipient(firstEncryptionKey)
      .addRecipient(secondEncryptionKey)
      .encrypt()

    assert.strictEqual(jwe.recipients.length, 2)
    for (const decryptionKey of [firstDecryptionKey, secondDecryptionKey]) {
      assert.deepStrictEqual(
        (await generalDecrypt(jwe, decryptionKey)).plaintext,
        plaintext,
        algorithm,
      )
    }
  }
})

test('GeneralEncrypt enforces mode-driven recipient counts', async () => {
  const plaintext = encoder.encode('root JWE recipient mode restrictions')

  const directKey = await generateSecret('A256GCM')
  await assert.rejects(
    new GeneralEncrypt(plaintext)
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .addRecipient(directKey)
      .addRecipient(directKey)
      .encrypt(),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: '"dir" alg may only have a single recipient',
    }),
  )

  const { publicKey } = await generateKeyPair('ECDH-ES')
  await assert.rejects(
    new GeneralEncrypt(plaintext)
      .setProtectedHeader({ alg: 'ECDH-ES', enc: 'A256GCM' })
      .addRecipient(publicKey)
      .addRecipient(publicKey)
      .encrypt(),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: '"ECDH-ES" alg may only have a single recipient',
    }),
  )

  const firstWrappingKey = await generateSecret('A256KW')
  const secondWrappingKey = await generateSecret('A256KW')
  const multiRecipient = await new GeneralEncrypt(plaintext)
    .setProtectedHeader({ alg: 'A256KW', enc: 'A256GCM' })
    .addRecipient(firstWrappingKey)
    .addRecipient(secondWrappingKey)
    .encrypt()
  assert.strictEqual(multiRecipient.recipients.length, 2)
  assert.deepStrictEqual(
    (await generalDecrypt(multiRecipient, secondWrappingKey)).plaintext,
    plaintext,
  )
})
