import test, { before } from 'node:test'
import assert from 'node:assert/strict'
import { captureRejection, errorLike } from '../_errors.js'
import * as crypto from 'crypto'

import {
  FlattenedEncrypt,
  base64url,
  flattenedDecrypt,
  generateKeyPair,
  generateSecret,
} from '../../src/index.js'

const context = {} as {
  plaintext: Uint8Array<ArrayBuffer>
  additionalAuthenticatedData: Uint8Array<ArrayBuffer>
  initializationVector: Uint8Array<ArrayBuffer>
  secret: Uint8Array<ArrayBuffer>
}

before(async () => {
  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())
  context.plaintext = encode('It’s a dangerous business, Frodo, going out your door.')
  context.additionalAuthenticatedData = encode('The Fellowship of the Ring')
  context.initializationVector = new Uint8Array(12)
  context.secret = new Uint8Array(16)
})

test('JWE format validation', async () => {
  const fullJwe = await new FlattenedEncrypt(context.plaintext)
    .setProtectedHeader({ bar: 'baz' })
    .setUnprotectedHeader({ foo: 'bar' })
    .setSharedUnprotectedHeader({ alg: 'dir', enc: 'A128GCM' })
    .setAdditionalAuthenticatedData(context.additionalAuthenticatedData)
    .encrypt(context.secret)

  await assert.doesNotReject(flattenedDecrypt(fullJwe, context.secret))

  {
    await assert.rejects(
      flattenedDecrypt(null, context.secret),
      errorLike({
        message: 'Flattened JWE must be an object',
        code: 'ERR_JWE_INVALID',
      }),
    )
  }

  {
    const jwe = { ...fullJwe }
    jwe.protected = undefined
    jwe.header = undefined
    jwe.unprotected = undefined

    await assert.rejects(
      flattenedDecrypt(jwe, context.secret),
      errorLike({
        message: 'JOSE Header missing',
        code: 'ERR_JWE_INVALID',
      }),
    )
  }

  {
    const jwe = { ...fullJwe }
    const assertion = {
      message: 'JWE Initialization Vector incorrect type',
      code: 'ERR_JWE_INVALID',
    }

    jwe.iv = 12
    await assert.rejects(flattenedDecrypt(jwe, context.secret), errorLike(assertion))
    jwe.iv = null
    await assert.rejects(flattenedDecrypt(jwe, context.secret), errorLike(assertion))
    jwe.iv = ''
    await assert.rejects(flattenedDecrypt(jwe, context.secret), errorLike(assertion))
    jwe.iv = undefined
    await assert.rejects(
      flattenedDecrypt(jwe, context.secret),
      errorLike({
        message: 'JWE Initialization Vector missing',
        code: 'ERR_JWE_INVALID',
      }),
    )
  }

  {
    const jwe = { ...fullJwe }
    jwe.ciphertext = undefined
    const assertion = {
      message: 'JWE Ciphertext missing or incorrect type',
      code: 'ERR_JWE_INVALID',
    }

    await assert.rejects(flattenedDecrypt(jwe, context.secret), errorLike(assertion))
    jwe.ciphertext = null

    await assert.rejects(flattenedDecrypt(jwe, context.secret), errorLike(assertion))
  }

  {
    const jwe = { ...fullJwe }
    const assertion = {
      message: 'JWE Authentication Tag incorrect type',
      code: 'ERR_JWE_INVALID',
    }

    jwe.tag = 12
    await assert.rejects(flattenedDecrypt(jwe, context.secret), errorLike(assertion))
    jwe.tag = null
    await assert.rejects(flattenedDecrypt(jwe, context.secret), errorLike(assertion))
    jwe.tag = ''
    await assert.rejects(flattenedDecrypt(jwe, context.secret), errorLike(assertion))
    jwe.tag = undefined
    await assert.rejects(
      flattenedDecrypt(jwe, context.secret),
      errorLike({
        message: 'JWE Authentication Tag missing',
        code: 'ERR_JWE_INVALID',
      }),
    )
  }

  {
    const jwe = { ...fullJwe }
    jwe.protected = null

    await assert.rejects(
      flattenedDecrypt(jwe, context.secret),
      errorLike({
        message: 'JWE Protected Header incorrect type',
        code: 'ERR_JWE_INVALID',
      }),
    )
  }

  {
    const jwe = { ...fullJwe }
    const assertion = {
      message: 'JWE Protected Header is invalid',
      code: 'ERR_JWE_INVALID',
    }
    jwe.protected = `1${jwe.protected}`
    await assert.rejects(flattenedDecrypt(jwe, context.secret), errorLike(assertion))

    // RFC 7516 Section 4 - the Protected Header must be a JSON object.
    for (const json of ['"foo"', '123', 'null', '[]']) {
      await assert.rejects(
        flattenedDecrypt({ ...jwe, protected: base64url.encode(json) }, context.secret),
        errorLike(assertion),
      )
    }
  }

  {
    const jwe = { ...fullJwe }
    const assertion = {
      message: 'JWE Encrypted Key incorrect type',
      code: 'ERR_JWE_INVALID',
    }

    jwe.encrypted_key = null
    await assert.rejects(flattenedDecrypt(jwe, context.secret), errorLike(assertion))
    jwe.encrypted_key = ''
    await assert.rejects(flattenedDecrypt(jwe, context.secret), errorLike(assertion))
  }

  {
    const jwe = { ...fullJwe }
    jwe.aad = null

    await assert.rejects(
      flattenedDecrypt(jwe, context.secret),
      errorLike({
        message: 'JWE AAD incorrect type',
        code: 'ERR_JWE_INVALID',
      }),
    )
  }

  {
    const jwe = { ...fullJwe }
    jwe.header = null

    await assert.rejects(
      flattenedDecrypt(jwe, context.secret),
      errorLike({
        message: 'JWE Per-Recipient Unprotected Header incorrect type',
        code: 'ERR_JWE_INVALID',
      }),
    )
  }

  {
    const jwe = { ...fullJwe }
    jwe.unprotected = null

    await assert.rejects(
      flattenedDecrypt(jwe, context.secret),
      errorLike({
        message: 'JWE Shared Unprotected Header incorrect type',
        code: 'ERR_JWE_INVALID',
      }),
    )
  }

  {
    const jwe = { ...fullJwe }
    jwe.unprotected = { foo: 'bar' }

    await assert.rejects(
      flattenedDecrypt(jwe, context.secret),
      errorLike({
        message:
          'JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint',
        code: 'ERR_JWE_INVALID',
      }),
    )
  }

  {
    const jwe = { ...fullJwe }
    jwe.unprotected = { enc: 'A128GCM' }

    await assert.rejects(
      flattenedDecrypt(jwe, context.secret),
      errorLike({
        message: 'missing JWE Algorithm (alg) in JWE Header',
        code: 'ERR_JWE_INVALID',
      }),
    )
  }

  {
    const jwe = { ...fullJwe }
    jwe.unprotected = { alg: 'dir' }

    await assert.rejects(
      flattenedDecrypt(jwe, context.secret),
      errorLike({
        message: 'missing JWE Encryption Algorithm (enc) in JWE Header',
        code: 'ERR_JWE_INVALID',
      }),
    )
  }

  {
    const jwe = { ...fullJwe }
    jwe.encrypted_key = 'foo'

    await assert.rejects(
      flattenedDecrypt(jwe, context.secret),
      errorLike({
        message: 'Encountered unexpected JWE Encrypted Key',
        code: 'ERR_JWE_INVALID',
      }),
    )
  }
})

test('ECDH-ES with key wrapping validates epk before the encrypted key', async () => {
  const { privateKey } = await generateKeyPair('ECDH-ES', { crv: 'P-256' })
  const jwe = {
    protected: base64url.encode(JSON.stringify({ alg: 'ECDH-ES+A128KW', enc: 'A128GCM' })),
    ciphertext: 'AA',
    iv: 'AA',
    tag: 'AA',
  }

  await assert.rejects(
    flattenedDecrypt(jwe, privateKey),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: 'JOSE Header "epk" (Ephemeral Public Key) missing or invalid',
    }),
  )
})

test('ECDH-ES validates party info and a public-only epk', async () => {
  const { privateKey, publicKey } = await generateKeyPair('ECDH-ES', { crv: 'P-256' })
  const jwe = await new FlattenedEncrypt(context.plaintext)
    .setProtectedHeader({ alg: 'ECDH-ES+A128KW', enc: 'A128GCM' })
    .setKeyManagementParameters({ apu: Uint8Array.of(1), apv: Uint8Array.of(2) })
    .encrypt(publicKey)
  const protectedHeader = JSON.parse(new TextDecoder().decode(base64url.decode(jwe.protected!)))

  await assert.rejects(
    flattenedDecrypt(
      {
        ...jwe,
        protected: base64url.encode(
          JSON.stringify({ ...protectedHeader, apv: protectedHeader.apu }),
        ),
      },
      privateKey,
    ),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: 'JOSE Header "apu" and "apv" values must be distinct',
    }),
  )

  for (const privateParameter of ['d', 'k', 'p', 'q', 'dp', 'dq', 'qi', 'oth', 'priv'] as const) {
    await assert.rejects(
      flattenedDecrypt(
        {
          ...jwe,
          protected: base64url.encode(
            JSON.stringify({
              ...protectedHeader,
              epk: { ...protectedHeader.epk, [privateParameter]: 'AA' },
            }),
          ),
        },
        privateKey,
      ),
      errorLike({
        code: 'ERR_JWE_INVALID',
        message: 'JOSE Header "epk" (Ephemeral Public Key) missing or invalid',
      }),
    )
  }

  for (const parameter of ['apu', 'apv'] as const) {
    const party = parameter === 'apu' ? 'U' : 'V'
    for (const [value, message] of [
      [0, `JOSE Header "${parameter}" (Agreement Party${party}Info) invalid`],
      ['!', `Failed to base64url decode the ${parameter}`],
    ] as const) {
      await assert.rejects(
        flattenedDecrypt(
          {
            ...jwe,
            protected: base64url.encode(JSON.stringify({ ...protectedHeader, [parameter]: value })),
          },
          privateKey,
        ),
        errorLike({ code: 'ERR_JWE_INVALID', message }),
      )
    }
  }
})

test('AES-GCMKW validates its key-management iv and tag', async () => {
  const jwe = await new FlattenedEncrypt(context.plaintext)
    .setProtectedHeader({ alg: 'A128GCMKW', enc: 'A128GCM' })
    .encrypt(context.secret)
  const protectedHeader = JSON.parse(new TextDecoder().decode(base64url.decode(jwe.protected!)))

  const cases = [
    ['iv', undefined, 'JOSE Header "iv" (Initialization Vector) missing or invalid'],
    ['iv', 0, 'JOSE Header "iv" (Initialization Vector) missing or invalid'],
    ['iv', '!', 'Failed to base64url decode the iv'],
    ['iv', base64url.encode(new Uint8Array(11)), 'Invalid Initialization Vector length'],
    ['tag', undefined, 'JOSE Header "tag" (Authentication Tag) missing or invalid'],
    ['tag', 0, 'JOSE Header "tag" (Authentication Tag) missing or invalid'],
    ['tag', '!', 'Failed to base64url decode the tag'],
    ['tag', base64url.encode(new Uint8Array(15)), 'Invalid Authentication Tag length'],
  ] as const

  for (const [parameter, value, message] of cases) {
    const header = { ...protectedHeader, [parameter]: value }
    if (value === undefined) delete header[parameter]
    await assert.rejects(
      flattenedDecrypt(
        { ...jwe, protected: base64url.encode(JSON.stringify(header)) },
        context.secret,
      ),
      errorLike({ code: 'ERR_JWE_INVALID', message }),
    )
  }
})

test('shared headers are snapshotted before recipient members', async () => {
  const direct = await new FlattenedEncrypt(context.plaintext)
    .setSharedUnprotectedHeader({ alg: 'dir', enc: 'A128GCM' })
    .encrypt(context.secret)
  const unprotected = { alg: 'A256KW', enc: 'A128GCM' }
  let encryptedKeyReads = 0
  const switching = Object.defineProperty({ ...direct, unprotected }, 'encrypted_key', {
    enumerable: true,
    get() {
      encryptedKeyReads++
      unprotected.alg = 'dir'
      return undefined
    },
  })

  await assert.rejects(flattenedDecrypt(switching, context.secret), Error)
  assert.strictEqual(encryptedKeyReads, 1)
})

test('recipient snapshots preserve an undefined thrown value', async () => {
  const direct = await new FlattenedEncrypt(context.plaintext)
    .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
    .encrypt(context.secret)
  const throwing = Object.defineProperty({ ...direct }, 'encrypted_key', {
    enumerable: true,
    get() {
      throw undefined
    },
  })

  let rejected = false
  const reason = await flattenedDecrypt(throwing, context.secret).catch((error) => {
    rejected = true
    return error
  })
  assert.strictEqual(rejected, true)
  assert.strictEqual(reason, undefined)
})

test('an empty JWE AAD value must be represented by omitting the member', async () => {
  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())
  const protectedHeader = base64url.encode(JSON.stringify({ alg: 'dir', enc: 'A128GCM' }))
  const iv = new Uint8Array(12)
  const key = await crypto.subtle.importKey('raw', context.secret, 'AES-GCM', false, ['encrypt'])
  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt(
      {
        additionalData: encode(`${protectedHeader}.`),
        iv,
        name: 'AES-GCM',
        tagLength: 128,
      },
      key,
      context.plaintext,
    ),
  )

  const jwe = {
    aad: '',
    ciphertext: base64url.encode(encrypted.slice(0, -16)),
    iv: base64url.encode(iv),
    protected: protectedHeader,
    tag: base64url.encode(encrypted.slice(-16)),
  }

  await assert.rejects(
    flattenedDecrypt(jwe, context.secret),
    errorLike({ code: 'ERR_JWE_INVALID' }),
  )

  let reads = 0
  const accessor = Object.defineProperty({ ...jwe, aad: undefined }, 'aad', {
    enumerable: true,
    get() {
      reads++
      return reads === 2 || reads === 3 ? 'eA' : ''
    },
  })

  await assert.rejects(
    flattenedDecrypt(accessor, context.secret),
    errorLike({
      code: 'ERR_JWE_INVALID',
    }),
  )
  assert.strictEqual(reads, 1)
})

test('AES CBC + HMAC', async () => {
  const secret = crypto.randomFillSync(new Uint8Array(32))
  const jwe = await new FlattenedEncrypt(context.plaintext)
    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
    .encrypt(secret)

  await assert.doesNotReject(flattenedDecrypt(jwe, secret))

  {
    const jweBadTag = { ...jwe }
    jweBadTag.tag = 'foo'
    await assert.rejects(
      flattenedDecrypt(jweBadTag, secret),
      errorLike({
        code: 'ERR_JWE_DECRYPTION_FAILED',
        message: 'decryption operation failed',
      }),
    )
  }

  {
    const jweBadEnc = { ...jwe }
    jweBadEnc.ciphertext = 'foo'
    await assert.rejects(
      flattenedDecrypt(jweBadEnc, secret),
      errorLike({
        code: 'ERR_JWE_DECRYPTION_FAILED',
        message: 'decryption operation failed',
      }),
    )
  }

  {
    const altSecret = new Uint8Array(32)
    altSecret.set(secret.slice(0, 16), 16)
    altSecret.set(secret.slice(16), 0)
    await assert.rejects(
      flattenedDecrypt(jwe, altSecret),
      errorLike({
        code: 'ERR_JWE_DECRYPTION_FAILED',
        message: 'decryption operation failed',
      }),
    )
  }
})

test('decrypt PBES2 p2c limit', async () => {
  const jwe = await new FlattenedEncrypt(new Uint8Array(0))
    .setProtectedHeader({ alg: 'PBES2-HS256+A128KW', enc: 'A128CBC-HS256' })
    .setKeyManagementParameters({ p2c: 2049 })
    .encrypt(new Uint8Array(32))

  await assert.doesNotReject(
    flattenedDecrypt(jwe, new Uint8Array(32), { keyManagementAlgorithms: ['PBES2-HS256+A128KW'] }),
  )

  await assert.rejects(
    flattenedDecrypt(jwe, new Uint8Array(32), {
      maxPBES2Count: 2048,
      keyManagementAlgorithms: ['PBES2-HS256+A128KW'],
    }),
    errorLike({
      message: 'JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds',
      code: 'ERR_JWE_INVALID',
    }),
  )

  await assert.doesNotReject(
    flattenedDecrypt(jwe, new Uint8Array(32), {
      maxPBES2Count: Infinity,
      keyManagementAlgorithms: ['PBES2-HS256+A128KW'],
    }),
  )

  for (const maxPBES2Count of [0, -1, 1.5, NaN, -Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    await assert.rejects(
      flattenedDecrypt(jwe, new Uint8Array(32), {
        maxPBES2Count,
        keyManagementAlgorithms: ['PBES2-HS256+A128KW'],
      }),
      (error) =>
        error instanceof TypeError &&
        error.message === 'maxPBES2Count must be a positive safe integer or Infinity',
    )
  }
})

test('PBES2 p2c must be a positive integer on decrypt', async () => {
  const jwe = await new FlattenedEncrypt(new Uint8Array(0))
    .setProtectedHeader({ alg: 'PBES2-HS256+A128KW', enc: 'A128CBC-HS256' })
    .setKeyManagementParameters({ p2c: 1 })
    .encrypt(new Uint8Array(32))

  const protectedHeader = JSON.parse(new TextDecoder().decode(base64url.decode(jwe.protected!)))
  protectedHeader.p2c = 1.5
  jwe.protected = base64url.encode(JSON.stringify(protectedHeader))

  await assert.rejects(
    flattenedDecrypt(jwe, new Uint8Array(32), {
      keyManagementAlgorithms: ['PBES2-HS256+A128KW'],
    }),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: 'PBES2 Count Input must be a positive integer',
    }),
  )
})

test('PBES2 p2s must be present, encoded, and contain at least 8 octets', async () => {
  const jwe = await new FlattenedEncrypt(new Uint8Array())
    .setProtectedHeader({ alg: 'PBES2-HS256+A128KW', enc: 'A128CBC-HS256' })
    .setKeyManagementParameters({ p2c: 1 })
    .encrypt(new Uint8Array(32))
  const protectedHeader = JSON.parse(new TextDecoder().decode(base64url.decode(jwe.protected!)))
  const cases = [
    [undefined, 'JOSE Header "p2s" (PBES2 Salt) missing or invalid'],
    [0, 'JOSE Header "p2s" (PBES2 Salt) missing or invalid'],
    ['!', 'Failed to base64url decode the p2s'],
    [base64url.encode(new Uint8Array(7)), 'PBES2 Salt Input must be 8 or more octets'],
  ] as const

  for (const [value, message] of cases) {
    const header = { ...protectedHeader, p2s: value }
    if (value === undefined) delete header.p2s
    await assert.rejects(
      flattenedDecrypt(
        { ...jwe, protected: base64url.encode(JSON.stringify(header)) },
        new Uint8Array(32),
        { keyManagementAlgorithms: ['PBES2-HS256+A128KW'] },
      ),
      errorLike({ code: 'ERR_JWE_INVALID', message }),
    )
  }
})

test('decrypt with PBES2 is not allowed by default', async () => {
  const jwe = await new FlattenedEncrypt(new Uint8Array(0))
    .setProtectedHeader({ alg: 'PBES2-HS256+A128KW', enc: 'A128CBC-HS256' })
    .encrypt(new Uint8Array(32))

  await assert.rejects(
    flattenedDecrypt(jwe, new Uint8Array(32)),
    errorLike({
      message: '"alg" (Algorithm) Header Parameter value not allowed',
      code: 'ERR_JOSE_ALG_NOT_ALLOWED',
    }),
  )
})

test('a non-ASCII "aad" is a JWEInvalid', async () => {
  // "aad" is only base64url decoded after decryption, so its octets reach the AEAD input as-is.
  const jwe = await new FlattenedEncrypt(context.plaintext)
    .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
    .setAdditionalAuthenticatedData(context.additionalAuthenticatedData)
    .encrypt(context.secret)

  await assert.rejects(
    flattenedDecrypt({ ...jwe, aad: '€' }, context.secret),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: 'The aad is not a valid base64url string',
    }),
  )

  // A well-formed but wrong "aad" still fails as a decryption failure.
  await assert.rejects(
    flattenedDecrypt({ ...jwe, aad: 'AQID' }, context.secret),
    errorLike({
      code: 'ERR_JWE_DECRYPTION_FAILED',
    }),
  )
})

test('AES-GCM authentication tags must be 128 bits', async () => {
  const jwe = await new FlattenedEncrypt(context.plaintext)
    .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
    .encrypt(context.secret)
  const ciphertext = base64url.decode(jwe.ciphertext)
  const tag = base64url.decode(jwe.tag!)

  const shifted = [
    {
      ciphertext: ciphertext.slice(0, -1),
      tag: new Uint8Array([...ciphertext.slice(-1), ...tag]),
    },
    {
      ciphertext: new Uint8Array([...ciphertext, tag[0]]),
      tag: tag.slice(1),
    },
    {
      ciphertext: new Uint8Array([...ciphertext, ...tag]),
      tag: new Uint8Array(),
    },
    {
      ciphertext: new Uint8Array(),
      tag: new Uint8Array([...ciphertext, ...tag]),
    },
  ]

  // Without checking the member boundary, every case reconstructs the original ciphertext || tag.
  for (const members of shifted) {
    await assert.rejects(
      flattenedDecrypt(
        {
          ...jwe,
          ciphertext: base64url.encode(members.ciphertext),
          tag: base64url.encode(members.tag),
        },
        context.secret,
      ),
      errorLike({ code: 'ERR_JWE_INVALID' }),
    )
  }
})

test('encrypted CEK length errors are indistinguishable from decryption failures', async () => {
  const { publicKey, privateKey } = await generateKeyPair('RSA-OAEP-256')
  const jwe = await new FlattenedEncrypt(context.plaintext)
    .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A128GCM' })
    .encrypt(publicKey)

  const wrongLength = new Uint8Array(
    await crypto.subtle.encrypt('RSA-OAEP', publicKey, new Uint8Array(1)),
  )
  const malformed = crypto.randomFillSync(new Uint8Array(256))

  const inputs = [
    { ...jwe, encrypted_key: base64url.encode(wrongLength) },
    { ...jwe, encrypted_key: base64url.encode(malformed) },
    { ...jwe, encrypted_key: '!' },
    { ...jwe, encrypted_key: '' },
    { ...jwe, encrypted_key: undefined },
  ]

  for (const input of inputs) {
    const error = await captureRejection(flattenedDecrypt(input, privateKey), {
      code: 'ERR_JWE_DECRYPTION_FAILED',
      message: 'decryption operation failed',
    })
    assert.strictEqual(Object.hasOwn(error!, 'cause'), false)
  }
})

test('an authenticated empty AES-GCMKW CEK still follows failure substitution', async () => {
  const key = await generateSecret('A128GCMKW')
  const jwe = await new FlattenedEncrypt(context.plaintext)
    .setProtectedHeader({ alg: 'A128GCMKW', enc: 'A128GCM' })
    .encrypt(key)
  const protectedHeader = JSON.parse(new TextDecoder().decode(base64url.decode(jwe.protected!)))
  const authenticationTag = new Uint8Array(
    await crypto.subtle.encrypt(
      {
        additionalData: new Uint8Array(),
        iv: base64url.decode(protectedHeader.iv),
        name: 'AES-GCM',
        tagLength: 128,
      },
      key,
      new Uint8Array(),
    ),
  )
  protectedHeader.tag = base64url.encode(authenticationTag)
  jwe.protected = base64url.encode(JSON.stringify(protectedHeader))

  for (const encryptedKey of [undefined, '']) {
    await assert.rejects(
      flattenedDecrypt({ ...jwe, encrypted_key: encryptedKey }, key),
      errorLike({
        code: 'ERR_JWE_DECRYPTION_FAILED',
        message: 'decryption operation failed',
      }),
    )
  }
})

test('an empty protected member is not an encoded protected header', async () => {
  const jwe = await new FlattenedEncrypt(context.plaintext)
    .setSharedUnprotectedHeader({ alg: 'dir', enc: 'A128GCM' })
    .encrypt(context.secret)

  await assert.rejects(
    flattenedDecrypt({ ...jwe, protected: '' }, context.secret),
    errorLike({
      code: 'ERR_JWE_INVALID',
    }),
  )
})
