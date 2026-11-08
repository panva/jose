import test, { before } from 'node:test'
import assert from 'node:assert/strict'
import { captureRejection, errorLike } from '../_errors.js'
import * as crypto from 'crypto'

import {
  base64url,
  FlattenedEncrypt,
  GeneralEncrypt,
  generalDecrypt,
  generateKeyPair,
} from '../../src/index.js'
import type * as types from '../../src/types.d.ts'

const protectedHeader = (jwe: types.GeneralJWE): Record<string, any> =>
  JSON.parse(new TextDecoder().decode(base64url.decode(jwe.protected!)))

const context = {} as {
  plaintext: Uint8Array<ArrayBuffer>
  additionalAuthenticatedData: Uint8Array<ArrayBuffer>
  initializationVector: Uint8Array<ArrayBuffer>
  secret: Uint8Array<ArrayBuffer>
  secret2: Uint8Array<ArrayBuffer>
}

before(async () => {
  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())
  context.plaintext = encode('It’s a dangerous business, Frodo, going out your door.')
  context.additionalAuthenticatedData = encode('The Fellowship of the Ring')
  context.initializationVector = crypto.randomFillSync(new Uint8Array(12))
  context.secret = crypto.randomFillSync(new Uint8Array(32))
  context.secret2 = crypto.randomFillSync(new Uint8Array(16))
})

test('General JWE encryption', async () => {
  const generalJwe = await new GeneralEncrypt(context.plaintext)
    .setAdditionalAuthenticatedData(context.additionalAuthenticatedData)
    .setProtectedHeader({ enc: 'A256GCM' })
    .setSharedUnprotectedHeader({ foo: 'bar' })
    .addRecipient(context.secret)
    .setUnprotectedHeader({ alg: 'A256GCMKW' })
    .addRecipient(context.secret2)
    .setUnprotectedHeader({ alg: 'A128GCMKW' })
    .encrypt()

  assert.strictEqual(generalJwe.aad && typeof generalJwe.aad === 'string', true)
  assert.strictEqual(generalJwe.ciphertext && typeof generalJwe.ciphertext === 'string', true)
  assert.strictEqual(generalJwe.iv && typeof generalJwe.iv === 'string', true)
  assert.strictEqual(generalJwe.protected && typeof generalJwe.protected === 'string', true)
  assert.strictEqual(
    generalJwe.unprotected &&
      typeof generalJwe.unprotected === 'object' &&
      Object.keys(generalJwe.unprotected).length === 1,
    true,
  )
  assert.strictEqual(generalJwe.tag && typeof generalJwe.tag === 'string', true)
  assert.strictEqual(generalJwe.recipients.length, 2)

  for (const recipient of generalJwe.recipients) {
    assert.strictEqual(recipient.encrypted_key && typeof recipient.encrypted_key === 'string', true)
    assert.strictEqual(
      recipient.header &&
        typeof recipient.header === 'object' &&
        Object.keys(recipient.header).length !== 0,
      true,
    )
  }

  for (const secret of [context.secret, context.secret2]) {
    await generalDecrypt(generalJwe, secret)
  }
})

test('GeneralEncrypt validates and emits normalized recipient headers', async () => {
  await assert.rejects(
    new GeneralEncrypt(context.plaintext)
      .setProtectedHeader({ enc: 'A128GCM', crit: ['foo'] })
      .addRecipient(context.secret, { crit: { foo: false } })
      .setUnprotectedHeader({ alg: 'A256KW', foo: true })
      .addRecipient(context.secret2, { crit: { foo: false } })
      .setUnprotectedHeader({ alg: 'A128KW', foo: () => true })
      .encrypt(),
    errorLike({ code: 'ERR_JWE_INVALID' }),
  )

  let protectedReads = 0
  let recipientReads = 0
  const jwe = await new GeneralEncrypt(context.plaintext)
    .setProtectedHeader({
      get enc() {
        protectedReads++
        return 'A128GCM'
      },
    })
    .addRecipient(context.secret)
    .setUnprotectedHeader({ alg: 'A256KW' })
    .addRecipient(context.secret2)
    .setUnprotectedHeader({
      get alg() {
        recipientReads++
        return recipientReads === 1 ? 'A128KW' : 'A256KW'
      },
    })
    .encrypt()

  assert.strictEqual(protectedReads, 1)
  assert.strictEqual(recipientReads, 1)
  assert.strictEqual(jwe.recipients[1].header!.alg, 'A128KW')
  await assert.doesNotReject(generalDecrypt(jwe, context.secret2))
})

test('GeneralEncrypt snapshots shared headers in the first recipient normalization order', async () => {
  const reads: string[] = []
  let sharedValue = 'initial'
  const jwe = await new GeneralEncrypt(context.plaintext)
    .setProtectedHeader({
      get enc() {
        reads.push('protected')
        return 'A128GCM'
      },
    })
    .setSharedUnprotectedHeader({
      get foo() {
        reads.push('shared')
        return sharedValue
      },
    })
    .addRecipient(context.secret)
    .setUnprotectedHeader({
      toJSON() {
        reads.push('first recipient')
        sharedValue = 'first'
        return { alg: 'A256KW' }
      },
    })
    .addRecipient(context.secret2)
    .setUnprotectedHeader({
      toJSON() {
        reads.push('second recipient')
        sharedValue = 'second'
        return { alg: 'A128KW' }
      },
    })
    .encrypt()

  assert.deepStrictEqual(reads, ['protected', 'first recipient', 'shared', 'second recipient'])
  assert.deepStrictEqual(jwe.unprotected, { foo: 'first' })
  assert.strictEqual(sharedValue, 'second')
  assert.deepStrictEqual((await generalDecrypt(jwe, context.secret2)).plaintext, context.plaintext)
})

test('GeneralEncrypt reports recipient normalization errors before reading the shared header', async () => {
  const reads: string[] = []
  const recipientError = new Error('recipient header')
  const error = await captureRejection(
    new GeneralEncrypt(context.plaintext)
      .setProtectedHeader({
        get enc() {
          reads.push('protected')
          return 'A128GCM'
        },
      })
      .setSharedUnprotectedHeader({
        get foo() {
          reads.push('shared')
          throw new Error('shared header')
        },
      })
      .addRecipient(context.secret)
      .setUnprotectedHeader({
        toJSON() {
          reads.push('recipient')
          throw recipientError
        },
      })
      .addRecipient(context.secret2)
      .setUnprotectedHeader({ alg: 'A128KW' })
      .encrypt(),
    { code: 'ERR_JWE_INVALID' },
  )

  assert.strictEqual(error?.cause, recipientError)
  assert.deepStrictEqual(reads, ['protected', 'recipient'])
})

test('GeneralEncrypt additional authenticated data must be a Uint8Array', async () => {
  for (const aad of ['secret aad', [1, 2, 3], new ArrayBuffer(3)]) {
    await assert.rejects(
      new GeneralEncrypt(context.plaintext)
        .setAdditionalAuthenticatedData(aad as never)
        .setProtectedHeader({ enc: 'A128GCM' })
        .addRecipient(context.secret)
        .setUnprotectedHeader({ alg: 'A256GCMKW' })
        .addRecipient(context.secret2)
        .setUnprotectedHeader({ alg: 'A128GCMKW' })
        .encrypt(),
      TypeError,
    )
  }
})

test('GeneralEncrypt key management parameters must be an object', async () => {
  for (const value of [null, 'not an object', [], new Date(0), 42, false]) {
    await assert.rejects(
      new GeneralEncrypt(context.plaintext)
        .setProtectedHeader({ enc: 'A128GCM' })
        .addRecipient(context.secret)
        .setUnprotectedHeader({ alg: 'A256KW' })
        .setKeyManagementParameters(value as never)
        .addRecipient(context.secret2)
        .setUnprotectedHeader({ alg: 'A128KW' })
        .encrypt(),
      TypeError,
    )
  }
})

test('AES-GCMKW authentication tags must be 128 bits', async () => {
  const jwe = await new GeneralEncrypt(context.plaintext)
    .setProtectedHeader({ enc: 'A256GCM' })
    .addRecipient(context.secret)
    .setUnprotectedHeader({ alg: 'A256GCMKW' })
    .addRecipient(context.secret2)
    .setUnprotectedHeader({ alg: 'A128GCMKW' })
    .encrypt()
  const recipient = jwe.recipients[0]
  const encryptedKey = base64url.decode(recipient.encrypted_key!)
  const tag = base64url.decode(recipient.header!.tag!)

  const shifted = [
    {
      encryptedKey: encryptedKey.slice(0, -1),
      tag: new Uint8Array([...encryptedKey.slice(-1), ...tag]),
    },
    {
      encryptedKey: new Uint8Array([...encryptedKey, tag[0]]),
      tag: tag.slice(1),
    },
  ]

  for (const members of shifted) {
    const malformed = structuredClone(jwe)
    malformed.recipients[0].encrypted_key = base64url.encode(members.encryptedKey)
    malformed.recipients[0].header!.tag = base64url.encode(members.tag)

    await assert.rejects(
      generalDecrypt(malformed, context.secret),
      errorLike({
        code: 'ERR_JWE_DECRYPTION_FAILED',
      }),
    )
  }
})

test('General JWE encryption validates multi-recipient plaintext', async () => {
  const encrypt = new GeneralEncrypt(new ArrayBuffer(1) as any).setProtectedHeader({
    enc: 'A128GCM',
  })
  encrypt.addRecipient(context.secret).setUnprotectedHeader({ alg: 'A256KW' })
  encrypt.addRecipient(context.secret2).setUnprotectedHeader({ alg: 'A128KW' })

  await assert.rejects(
    encrypt.encrypt(),
    (error) =>
      error instanceof TypeError && error.message === 'plaintext must be an instance of Uint8Array',
  )
})

test('General JWE single-recipient encryption requires a JOSE header', async () => {
  const encrypt = new GeneralEncrypt(context.plaintext).addRecipient(context.secret)

  await assert.rejects(
    encrypt.encrypt(),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message:
        'either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()',
    }),
  )
})

test('General JWE multi-recipient encryption requires a JOSE header', async () => {
  const encrypt = new GeneralEncrypt(context.plaintext)
  encrypt.addRecipient(context.secret)
  encrypt.addRecipient(context.secret2)

  await assert.rejects(
    encrypt.encrypt(),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message:
        'either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()',
    }),
  )
})

test('General JWE resolves algorithms after cross-recipient validation', async () => {
  await assert.rejects(
    new GeneralEncrypt(context.plaintext)
      .setProtectedHeader({ enc: 'A128GCM' })
      .addRecipient(context.secret)
      .setUnprotectedHeader({ alg: 'unsupported' })
      .addRecipient(context.secret2)
      .setUnprotectedHeader({ alg: 'dir' })
      .encrypt(),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: '"dir" alg may only have a single recipient',
    }),
  )

  await assert.rejects(
    new GeneralEncrypt(context.plaintext)
      .addRecipient(context.secret)
      .setUnprotectedHeader({ alg: 'unsupported', enc: 'A128GCM' })
      .addRecipient(context.secret2)
      .setUnprotectedHeader({ alg: 'A128KW', enc: 'A256GCM' })
      .encrypt(),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message:
        'JWE "enc" (Encryption Algorithm) Header Parameter must be the same for all recipients',
    }),
  )
})

test('General JWE resolves every recipient before performing cryptographic operations', async () => {
  await assert.rejects(
    new GeneralEncrypt(context.plaintext)
      .setProtectedHeader({ enc: 'A128GCM' })
      .addRecipient(new Uint8Array(1))
      .setUnprotectedHeader({ alg: 'A128KW' })
      .addRecipient(context.secret2)
      .setUnprotectedHeader({ alg: 'unsupported' })
      .encrypt(),
    errorLike({
      code: 'ERR_JOSE_NOT_SUPPORTED',
      message: 'Invalid or unsupported "alg" (JWE Algorithm) header value',
    }),
  )
})

test('General JWE encryption (single recipient dir)', async () => {
  const generalJwe = await new GeneralEncrypt(context.plaintext)
    .setAdditionalAuthenticatedData(context.additionalAuthenticatedData)
    .setProtectedHeader({ enc: 'A256GCM' })
    .setSharedUnprotectedHeader({ alg: 'dir' })
    .addRecipient(context.secret)
    .encrypt()

  assert.strictEqual(generalJwe.aad && typeof generalJwe.aad === 'string', true)
  assert.strictEqual(generalJwe.ciphertext && typeof generalJwe.ciphertext === 'string', true)
  assert.strictEqual(generalJwe.iv && typeof generalJwe.iv === 'string', true)
  assert.strictEqual(generalJwe.protected && typeof generalJwe.protected === 'string', true)
  assert.strictEqual(generalJwe.tag && typeof generalJwe.tag === 'string', true)
  assert.strictEqual(
    generalJwe.unprotected &&
      typeof generalJwe.unprotected === 'object' &&
      Object.keys(generalJwe.unprotected).length === 1,
    true,
  )
  assert.strictEqual(generalJwe.recipients.length, 1)

  assert.deepStrictEqual(generalJwe.recipients, [{}])

  await generalDecrypt(generalJwe, context.secret)
})

test('General JWE encryption (single recipient ECDH-ES)', async () => {
  const kp = await generateKeyPair('ECDH-ES')
  const generalJwe = await new GeneralEncrypt(context.plaintext)
    .setAdditionalAuthenticatedData(context.additionalAuthenticatedData)
    .setProtectedHeader({ enc: 'A256GCM' })
    .setSharedUnprotectedHeader({ alg: 'ECDH-ES' })
    .addRecipient(kp.publicKey)
    .encrypt()

  assert.strictEqual(generalJwe.aad && typeof generalJwe.aad === 'string', true)
  assert.strictEqual(generalJwe.ciphertext && typeof generalJwe.ciphertext === 'string', true)
  assert.strictEqual(generalJwe.iv && typeof generalJwe.iv === 'string', true)
  assert.strictEqual(generalJwe.protected && typeof generalJwe.protected === 'string', true)
  assert.strictEqual(generalJwe.tag && typeof generalJwe.tag === 'string', true)
  assert.deepStrictEqual(generalJwe.recipients, [{}])
  assert.strictEqual(
    generalJwe.unprotected &&
      typeof generalJwe.unprotected === 'object' &&
      Object.keys(generalJwe.unprotected).length === 1,
    true,
  )

  await generalDecrypt(generalJwe, kp.privateKey)
})

test('General JWE decryption does not hide invalid algorithms options', async () => {
  const jwe = await new GeneralEncrypt(context.plaintext)
    .setProtectedHeader({ enc: 'A256GCM' })
    .addRecipient(context.secret)
    .setUnprotectedHeader({ alg: 'A256KW' })
    .addRecipient(context.secret2)
    .setUnprotectedHeader({ alg: 'A128KW' })
    .encrypt()
  let resolveCalls = 0
  const resolve = () => {
    resolveCalls++
    return context.secret
  }
  for (const option of ['keyManagementAlgorithms', 'contentEncryptionAlgorithms']) {
    for (const algorithms of [null, 'A256KW', {}, [1], ['A256KW', null]]) {
      for (const input of [
        jwe,
        { ...jwe, ciphertext: null },
        { ...jwe, protected: '*' },
        { ...jwe, recipients: [{}] },
      ]) {
        for (const key of [context.secret, resolve]) {
          await assert.rejects(
            generalDecrypt(input as never, key, { [option]: algorithms }),
            errorLike({
              name: 'TypeError',
              message: `"${option}" option must be an array of strings`,
            }),
          )
        }
      }
    }
  }
  assert.equal(resolveCalls, 0)
  for (const input of [
    { ...jwe, ciphertext: null },
    { ...jwe, protected: '*' },
    { ...jwe, recipients: [{}] },
  ]) {
    await assert.rejects(
      generalDecrypt(input as never, context.secret),
      errorLike({ code: 'ERR_JWE_DECRYPTION_FAILED' }),
    )
  }
  for (const options of [
    { keyManagementAlgorithms: [] },
    { keyManagementAlgorithms: ['A192KW'] },
    { contentEncryptionAlgorithms: [] },
    { contentEncryptionAlgorithms: ['A128GCM'] },
  ]) {
    await assert.rejects(
      generalDecrypt(jwe, resolve, options as types.DecryptOptions),
      errorLike({ code: 'ERR_JWE_DECRYPTION_FAILED' }),
    )
  }
  assert.equal(resolveCalls, 0)
})

test('General JWE decryption does not hide invalid numeric options', async () => {
  const jwe = await new GeneralEncrypt(context.plaintext)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .addRecipient(context.secret)
    .encrypt()
  let resolveCalls = 0
  const resolve = () => {
    resolveCalls++
    return context.secret
  }
  const invalid = [-1, 0.5, NaN, -Infinity, Number.MAX_SAFE_INTEGER + 1, '1', false, {}]
  for (const [option, values, message] of [
    [
      'maxPBES2Count',
      [0, null, ...invalid],
      'maxPBES2Count must be a positive safe integer or Infinity',
    ],
    [
      'maxDecompressedLength',
      invalid,
      'maxDecompressedLength must be 0, a positive safe integer, or Infinity',
    ],
  ] as const) {
    for (const value of values) {
      for (const input of [jwe, { ...jwe, ciphertext: null }, { ...jwe, protected: '*' }]) {
        for (const key of [context.secret, resolve]) {
          await assert.rejects(
            generalDecrypt(input as never, key, { [option]: value }),
            errorLike({ name: 'TypeError', message }),
          )
        }
      }
    }
  }
  assert.equal(resolveCalls, 0)
  for (const value of [undefined, 1, Number.MAX_SAFE_INTEGER, Infinity]) {
    await assert.doesNotReject(
      generalDecrypt(jwe, context.secret, {
        maxPBES2Count: value,
        maxDecompressedLength: value,
      }),
    )
  }
  await assert.doesNotReject(generalDecrypt(jwe, context.secret, { maxDecompressedLength: 0 }))
})

test('General JWE format validation', async () => {
  const encrypt = new GeneralEncrypt(context.plaintext)
    .setProtectedHeader({ bar: 'baz' })
    .setSharedUnprotectedHeader({ foo: 'bar' })
    .setAdditionalAuthenticatedData(context.additionalAuthenticatedData)

  encrypt.addRecipient(context.secret).setUnprotectedHeader({ alg: 'A256GCMKW', enc: 'A256GCM' })

  const generalJwe = await encrypt.encrypt()

  {
    await assert.rejects(
      generalDecrypt(null, context.secret),
      errorLike({
        message: 'General JWE must be an object',
        code: 'ERR_JWE_INVALID',
      }),
    )
  }

  {
    await assert.rejects(
      generalDecrypt({ recipients: null }, context.secret),
      errorLike({
        message: 'JWE Recipients missing or incorrect type',
        code: 'ERR_JWE_INVALID',
      }),
    )
  }

  {
    await assert.rejects(
      generalDecrypt({ recipients: [null] }, context.secret),
      errorLike({
        message: 'JWE Recipients missing or incorrect type',
        code: 'ERR_JWE_INVALID',
      }),
    )
  }

  {
    await assert.rejects(
      generalDecrypt({ recipients: Array(1) }, context.secret),
      errorLike({
        message: 'JWE Recipients missing or incorrect type',
        code: 'ERR_JWE_INVALID',
      }),
    )
  }

  {
    const jwe = { ...generalJwe, recipients: [] }

    await assert.rejects(
      generalDecrypt(jwe, context.secret),
      errorLike({
        message: 'JWE Recipients has no members',
        code: 'ERR_JWE_INVALID',
      }),
    )
  }

  {
    const jwe = { ...generalJwe, recipients: [{}] }

    await assert.rejects(
      generalDecrypt(jwe, context.secret),
      errorLike({
        message: 'decryption operation failed',
        code: 'ERR_JWE_DECRYPTION_FAILED',
      }),
    )
  }

  {
    const jwe = { ...generalJwe, recipients: [generalJwe.recipients[0]] }

    await assert.doesNotReject(generalDecrypt(jwe, context.secret))
  }

  {
    const jwe = { ...generalJwe, recipients: [generalJwe.recipients[0], {}] }

    await assert.doesNotReject(generalDecrypt(jwe, context.secret))
  }

  {
    const jwe = { ...generalJwe, recipients: [{}, generalJwe.recipients[0]] }

    await assert.doesNotReject(generalDecrypt(jwe, context.secret))
  }
})

test('an empty protected member is not an encoded protected header', async () => {
  const jwe = await new GeneralEncrypt(context.plaintext)
    .setSharedUnprotectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .addRecipient(context.secret)
    .encrypt()

  jwe.protected = ''

  await assert.rejects(
    generalDecrypt(jwe, context.secret),
    errorLike({
      code: 'ERR_JWE_DECRYPTION_FAILED',
    }),
  )
})

test('General JWE decryption requires a single recipient for dir and ECDH-ES', async () => {
  const direct = await new GeneralEncrypt(context.plaintext)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .addRecipient(context.secret)
    .encrypt()

  await assert.rejects(
    generalDecrypt({ ...direct, recipients: [{}, {}] }, context.secret),
    errorLike({
      message: '"dir" alg may only have a single recipient',
      code: 'ERR_JWE_INVALID',
    }),
  )

  const perRecipient = await new GeneralEncrypt(context.plaintext)
    .setProtectedHeader({ enc: 'A256GCM' })
    .addRecipient(context.secret)
    .setUnprotectedHeader({ alg: 'A256GCMKW' })
    .addRecipient(context.secret2)
    .setUnprotectedHeader({ alg: 'A128GCMKW' })
    .encrypt()

  await assert.rejects(
    generalDecrypt(
      {
        ...perRecipient,
        recipients: [perRecipient.recipients[0], { header: { alg: 'ECDH-ES' } }],
      },
      context.secret,
    ),
    errorLike({
      message: '"ECDH-ES" alg may only have a single recipient',
      code: 'ERR_JWE_INVALID',
    }),
  )

  await assert.rejects(
    generalDecrypt(
      {
        ...perRecipient,
        recipients: [
          perRecipient.recipients[0],
          { header: { alg: 'dir' }, encrypted_key: 0 as never },
        ],
      },
      context.secret,
    ),
    errorLike({
      message: '"dir" alg may only have a single recipient',
      code: 'ERR_JWE_INVALID',
    }),
  )

  const mutatingHeader = { alg: 'dir' }
  const mutatingRecipient = Object.defineProperty({ header: mutatingHeader }, 'encrypted_key', {
    enumerable: true,
    get() {
      mutatingHeader.alg = 'A256KW'
      return 0
    },
  })
  await assert.rejects(
    generalDecrypt(
      { ...perRecipient, recipients: [perRecipient.recipients[0], mutatingRecipient] },
      context.secret,
    ),
    errorLike({
      message: '"dir" alg may only have a single recipient',
      code: 'ERR_JWE_INVALID',
    }),
  )

  for (const thrown of [new Error('unexpected encrypted key getter'), undefined]) {
    const throwingRecipient = {
      header: { alg: 'dir' },
      get encrypted_key(): string {
        throw thrown
      },
    }
    await assert.rejects(
      generalDecrypt(
        { ...perRecipient, recipients: [perRecipient.recipients[0], throwingRecipient] },
        context.secret,
      ),
      errorLike({
        message: '"dir" alg may only have a single recipient',
        code: 'ERR_JWE_INVALID',
      }),
    )
  }

  const partiallyThrowingHeader = {
    alg: 'dir',
    get z(): never {
      throw new Error('unexpected header getter')
    },
  }
  await assert.rejects(
    generalDecrypt(
      {
        ...perRecipient,
        recipients: [perRecipient.recipients[0], { header: partiallyThrowingHeader }],
      },
      context.secret,
    ),
    errorLike({
      message: '"dir" alg may only have a single recipient',
      code: 'ERR_JWE_INVALID',
    }),
  )

  const flattened = await new FlattenedEncrypt(context.plaintext)
    .setProtectedHeader({ enc: 'A256GCM' })
    .setUnprotectedHeader({ alg: 'dir' })
    .encrypt(context.secret)
  let reads = 0
  const switching = {
    get header() {
      reads++
      return reads === 1 ? { alg: 'A256KW' } : { alg: 'dir' }
    },
  }

  await assert.rejects(
    generalDecrypt(
      {
        ciphertext: flattened.ciphertext,
        iv: flattened.iv,
        protected: flattened.protected,
        recipients: [switching, {}],
        tag: flattened.tag,
      },
      context.secret,
    ),
    errorLike({ code: 'ERR_JWE_DECRYPTION_FAILED' }),
  )
  assert.strictEqual(reads, 1)
})

test('General JWE decryption rejects a dir CEK key-wrapped for a second recipient', async () => {
  const cek = crypto.randomFillSync(new Uint8Array(32))
  const kek = crypto.randomFillSync(new Uint8Array(32))

  const flattened = await new FlattenedEncrypt(context.plaintext)
    .setProtectedHeader({ enc: 'A256GCM' })
    .setUnprotectedHeader({ alg: 'dir' })
    .encrypt(cek)

  const wrapped = await crypto.subtle.wrapKey(
    'raw',
    await crypto.subtle.importKey('raw', cek, 'AES-GCM', true, ['encrypt']),
    await crypto.subtle.importKey('raw', kek, 'AES-KW', false, ['wrapKey']),
    'AES-KW',
  )

  const jwe = {
    protected: flattened.protected,
    iv: flattened.iv,
    ciphertext: flattened.ciphertext,
    tag: flattened.tag,
    recipients: [
      { header: { alg: 'dir' as const } },
      {
        header: { alg: 'A256KW' as const },
        encrypted_key: base64url.encode(new Uint8Array(wrapped)),
      },
    ],
  }

  // "dir" fixes the CEK rather than transporting it, so a second recipient can key wrap that same
  // CEK and both parties really do decrypt. RFC 7516 forbids it regardless.
  for (const key of [cek, kek]) {
    await assert.rejects(
      generalDecrypt(jwe, key),
      errorLike({
        message: '"dir" alg may only have a single recipient',
        code: 'ERR_JWE_INVALID',
      }),
    )
  }
})

test('Default PBES2 Count', async () => {
  const jwe = await new GeneralEncrypt(context.plaintext)
    .setProtectedHeader({ alg: 'PBES2-HS256+A128KW', enc: 'A128GCM' })
    .addRecipient(context.secret)
    .addRecipient(context.secret)
    .encrypt(context.secret)

  const [{ header: bob }, { header: charlie }] = jwe.recipients
  assert.strictEqual(bob.p2c, 2048)
  assert.strictEqual(charlie.p2c, 2048)
  assert.strictEqual(bob.p2s !== charlie.p2s, true)
})

test('single recipient key management parameters are honoured', async () => {
  const jwe = await new GeneralEncrypt(context.plaintext)
    .setProtectedHeader({ alg: 'PBES2-HS256+A128KW', enc: 'A128GCM' })
    .addRecipient(context.secret)
    .setKeyManagementParameters({ p2c: 4096 })
    .encrypt()

  assert.strictEqual(protectedHeader(jwe).p2c, 4096)

  const { plaintext } = await generalDecrypt(jwe, context.secret, {
    keyManagementAlgorithms: ['PBES2-HS256+A128KW'],
  })
  assert.deepStrictEqual(plaintext, context.plaintext)

  await assert.rejects(
    generalDecrypt(jwe, context.secret, {
      keyManagementAlgorithms: ['PBES2-HS256+A128KW'],
      maxPBES2Count: 4095,
    }),
    errorLike({ code: 'ERR_JWE_DECRYPTION_FAILED' }),
  )
})

test('single recipient ECDH-ES apu/apv are honoured', async () => {
  const { privateKey, publicKey } = await generateKeyPair('ECDH-ES', { extractable: true })
  const apu = crypto.randomFillSync(new Uint8Array(8))
  const apv = crypto.randomFillSync(new Uint8Array(8))

  const jwe = await new GeneralEncrypt(context.plaintext)
    .setProtectedHeader({ enc: 'A256GCM' })
    .addRecipient(publicKey)
    .setUnprotectedHeader({ alg: 'ECDH-ES+A256KW' })
    .setKeyManagementParameters({ apu, apv })
    .encrypt()

  // A single recipient does not request per-recipient parameter placement, so the derived
  // parameters land in the JWE Protected Header.
  const { apu: apuS, apv: apvS } = protectedHeader(jwe)
  assert.strictEqual(apuS, base64url.encode(apu))
  assert.strictEqual(apvS, base64url.encode(apv))

  const { plaintext } = await generalDecrypt(jwe, privateKey)
  assert.deepStrictEqual(plaintext, context.plaintext)
})

test('General JWE generated Key Management Parameters must be disjoint', async () => {
  // With more than one recipient the generated Key Management Parameters land in the JWE
  // Per-Recipient Unprotected Header, so a name the caller already used in another header would
  // make the emitted JWE violate RFC 7516 Section 7.2.1 - and generalDecrypt rejects such a JWE.
  const message = {
    code: 'ERR_JWE_INVALID',
    message:
      'JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint',
  }
  await assert.rejects(
    new GeneralEncrypt(context.plaintext)
      .setProtectedHeader({ enc: 'A128GCM', p2c: 4096 })
      .addRecipient(context.secret)
      .setUnprotectedHeader({ alg: 'PBES2-HS256+A128KW' })
      .addRecipient(context.secret2)
      .setUnprotectedHeader({ alg: 'A128GCMKW' })
      .encrypt(),
    errorLike(message),
  )
  await assert.rejects(
    new GeneralEncrypt(context.plaintext)
      .setProtectedHeader({ enc: 'A128GCM' })
      .setSharedUnprotectedHeader({ p2c: 4096 })
      .addRecipient(context.secret2)
      .setUnprotectedHeader({ alg: 'A128GCMKW' })
      .addRecipient(context.secret)
      .setUnprotectedHeader({ alg: 'PBES2-HS256+A128KW' })
      .encrypt(),
    errorLike(message),
  )
})
