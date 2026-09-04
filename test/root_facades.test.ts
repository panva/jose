import test, { type ExecutionContext } from 'ava'

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
  t: ExecutionContext,
  algorithm: (typeof jwsAlgorithms)[number],
  signingKey: Key,
  verificationKey: Key,
) {
  const plaintext = encoder.encode(`root JWS facade matrix: ${algorithm}`)
  const header = { alg: algorithm }

  const compact = await new CompactSign(plaintext).setProtectedHeader(header).sign(signingKey)
  const compactResult = await compactVerify(compact, verificationKey)
  t.deepEqual(compactResult.payload, plaintext, `${algorithm} compact payload`)
  t.is(compactResult.protectedHeader.alg, algorithm, `${algorithm} compact header`)

  const flattened = await new FlattenedSign(plaintext).setProtectedHeader(header).sign(signingKey)
  const flattenedResult = await flattenedVerify(flattened, verificationKey)
  t.deepEqual(flattenedResult.payload, plaintext, `${algorithm} flattened payload`)
  t.is(flattenedResult.protectedHeader?.alg, algorithm, `${algorithm} flattened header`)

  const general = await new GeneralSign(plaintext)
    .addSignature(signingKey)
    .setProtectedHeader(header)
    .sign()
  const generalResult = await generalVerify(general, verificationKey)
  t.deepEqual(generalResult.payload, plaintext, `${algorithm} general payload`)
  t.is(generalResult.protectedHeader?.alg, algorithm, `${algorithm} general header`)

  const jwt = await new SignJWT({ algorithm }).setProtectedHeader(header).sign(signingKey)
  const jwtResult = await jwtVerify(jwt, verificationKey)
  t.is(jwtResult.payload.algorithm, algorithm, `${algorithm} JWT payload`)
  t.is(jwtResult.protectedHeader.alg, algorithm, `${algorithm} JWT header`)
}

for (const algorithm of jwsAlgorithms) {
  test.serial(`every root JWS facade supports ${algorithm}`, async (t) => {
    try {
      await exerciseJWSFacades(t, algorithm, ...(await jwsKeys(algorithm)))
    } catch (error) {
      if (unavailable(error)) {
        t.pass(`${algorithm} is unavailable in this runtime`)
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
  t: ExecutionContext,
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
  t.is(
    compact.split('.')[1].length > 0,
    transportsCek,
    `${keyManagementAlgorithm} compact encrypted key`,
  )
  const compactResult = await compactDecrypt(compact, decryptionKey, decryptOptions)
  t.deepEqual(compactResult.plaintext, plaintext, `${keyManagementAlgorithm} compact payload`)
  t.is(
    compactResult.protectedHeader.alg,
    keyManagementAlgorithm,
    `${keyManagementAlgorithm} compact key management`,
  )
  t.is(
    compactResult.protectedHeader.enc,
    contentEncryptionAlgorithm,
    `${keyManagementAlgorithm} compact content encryption`,
  )
  t.is(compactResult.protectedHeader.zip, compressed ? 'DEF' : undefined)

  const flattened = await new FlattenedEncrypt(plaintext)
    .setProtectedHeader(header)
    .encrypt(encryptionKey)
  t.is(
    Object.hasOwn(flattened, 'encrypted_key'),
    transportsCek,
    `${keyManagementAlgorithm} flattened encrypted key`,
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
    `${keyManagementAlgorithm} flattened content encryption`,
  )
  t.is(flattenedResult.protectedHeader?.zip, compressed ? 'DEF' : undefined)

  const general = await new GeneralEncrypt(plaintext)
    .setProtectedHeader(header)
    .addRecipient(encryptionKey)
    .encrypt()
  t.is(
    Object.hasOwn(general.recipients[0], 'encrypted_key'),
    transportsCek,
    `${keyManagementAlgorithm} general encrypted key`,
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
    `${keyManagementAlgorithm} general content encryption`,
  )
  t.is(generalResult.protectedHeader?.zip, compressed ? 'DEF' : undefined)

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
    `${keyManagementAlgorithm} JWT content encryption payload`,
  )
  t.is(
    jwtResult.protectedHeader.alg,
    keyManagementAlgorithm,
    `${keyManagementAlgorithm} JWT key management`,
  )
  t.is(
    jwtResult.protectedHeader.enc,
    contentEncryptionAlgorithm,
    `${keyManagementAlgorithm} JWT content encryption`,
  )
  t.is(jwtResult.protectedHeader.zip, compressed ? 'DEF' : undefined)
}

for (const keyManagementAlgorithm of keyManagementAlgorithms) {
  test.serial(
    `every root JWE facade supports key management ${keyManagementAlgorithm}`,
    async (t) => {
      const contentEncryptionAlgorithm = 'A256GCM'
      try {
        await exerciseJWEFacades(
          t,
          keyManagementAlgorithm,
          contentEncryptionAlgorithm,
          ...(await jweKeys(keyManagementAlgorithm, contentEncryptionAlgorithm)),
        )
      } catch (error) {
        if (unavailable(error)) {
          t.pass(`${keyManagementAlgorithm} is unavailable in this runtime`)
          return
        }
        throw error
      }
    },
  )
}

for (const contentEncryptionAlgorithm of contentEncryptionAlgorithms) {
  test.serial(
    `every root JWE facade supports content encryption ${contentEncryptionAlgorithm}`,
    async (t) => {
      const keyManagementAlgorithm = 'dir'
      try {
        await exerciseJWEFacades(
          t,
          keyManagementAlgorithm,
          contentEncryptionAlgorithm,
          ...(await jweKeys(keyManagementAlgorithm, contentEncryptionAlgorithm)),
        )
      } catch (error) {
        if (unavailable(error)) {
          t.pass(`${contentEncryptionAlgorithm} is unavailable in this runtime`)
          return
        }
        throw error
      }
    },
  )
}

test.serial('every root JWE facade supports DEF', async (t) => {
  if (typeof CompressionStream === 'undefined' || typeof DecompressionStream === 'undefined') {
    t.pass('compression streams are unavailable in this runtime')
    return
  }

  const keyManagementAlgorithm = 'dir'
  const contentEncryptionAlgorithm = 'A256GCM'
  await exerciseJWEFacades(
    t,
    keyManagementAlgorithm,
    contentEncryptionAlgorithm,
    ...(await jweKeys(keyManagementAlgorithm, contentEncryptionAlgorithm)),
    true,
  )
})

test.serial('a supplied CEK is used by every CEK-transport mode', async (t) => {
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

    t.deepEqual(new Uint8Array(base64url.decode(jwe.ciphertext)), expected.slice(0, -16), algorithm)
    t.deepEqual(new Uint8Array(base64url.decode(jwe.tag!)), expected.slice(-16), algorithm)
    t.deepEqual((await flattenedDecrypt(jwe, decryptionKey)).plaintext, plaintext, algorithm)
  }
})

test.serial('JWE failures collapse across every key-management mode', async (t) => {
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

    await t.throwsAsync(flattenedDecrypt(malformed, decryptionKey), {
      code: 'ERR_JWE_DECRYPTION_FAILED',
      message: 'decryption operation failed',
    })
  }
})

test.serial('every CEK-transport mode supports multiple recipients', async (t) => {
  const plaintext = encoder.encode('root JWE multi-recipient transport modes')

  for (const algorithm of ['A256KW', 'RSA-OAEP-256', 'ECDH-ES+A256KW'] as const) {
    const [firstEncryptionKey, firstDecryptionKey] = await jweKeys(algorithm, 'A256GCM')
    const [secondEncryptionKey, secondDecryptionKey] = await jweKeys(algorithm, 'A256GCM')
    const jwe = await new GeneralEncrypt(plaintext)
      .setProtectedHeader({ alg: algorithm, enc: 'A256GCM' })
      .addRecipient(firstEncryptionKey)
      .addRecipient(secondEncryptionKey)
      .encrypt()

    t.is(jwe.recipients.length, 2)
    for (const decryptionKey of [firstDecryptionKey, secondDecryptionKey]) {
      t.deepEqual((await generalDecrypt(jwe, decryptionKey)).plaintext, plaintext, algorithm)
    }
  }
})

test.serial('GeneralEncrypt enforces mode-driven recipient counts', async (t) => {
  const plaintext = encoder.encode('root JWE recipient mode restrictions')

  const directKey = await generateSecret('A256GCM')
  await t.throwsAsync(
    new GeneralEncrypt(plaintext)
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .addRecipient(directKey)
      .addRecipient(directKey)
      .encrypt(),
    {
      code: 'ERR_JWE_INVALID',
      message: '"dir" alg may only have a single recipient',
    },
  )

  const { publicKey } = await generateKeyPair('ECDH-ES')
  await t.throwsAsync(
    new GeneralEncrypt(plaintext)
      .setProtectedHeader({ alg: 'ECDH-ES', enc: 'A256GCM' })
      .addRecipient(publicKey)
      .addRecipient(publicKey)
      .encrypt(),
    {
      code: 'ERR_JWE_INVALID',
      message: '"ECDH-ES" alg may only have a single recipient',
    },
  )

  const firstWrappingKey = await generateSecret('A256KW')
  const secondWrappingKey = await generateSecret('A256KW')
  const multiRecipient = await new GeneralEncrypt(plaintext)
    .setProtectedHeader({ alg: 'A256KW', enc: 'A256GCM' })
    .addRecipient(firstWrappingKey)
    .addRecipient(secondWrappingKey)
    .encrypt()
  t.is(multiRecipient.recipients.length, 2)
  t.deepEqual((await generalDecrypt(multiRecipient, secondWrappingKey)).plaintext, plaintext)
})
