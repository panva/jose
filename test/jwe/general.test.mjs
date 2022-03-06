import test from 'ava'
import * as crypto from 'crypto'
import { root } from '../dist.mjs'

const { GeneralEncrypt, generalDecrypt, generateKeyPair, base64url } = await import(root)

test.before(async (t) => {
  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())
  t.context.plaintext = encode('It’s a dangerous business, Frodo, going out your door.')
  t.context.additionalAuthenticatedData = encode('The Fellowship of the Ring')
  t.context.initializationVector = crypto.randomFillSync(new Uint8Array(12))
  t.context.secret = crypto.randomFillSync(new Uint8Array(32))
  t.context.secret2 = crypto.randomFillSync(new Uint8Array(16))
})

test('General JWE encryption', async (t) => {
  const generalJwe = await new GeneralEncrypt(t.context.plaintext)
    .setAdditionalAuthenticatedData(t.context.additionalAuthenticatedData)
    .setProtectedHeader({ enc: 'A256GCM' })
    .setSharedUnprotectedHeader({ foo: 'bar' })
    .addRecipient(t.context.secret)
    .setUnprotectedHeader({ alg: 'A256GCMKW' })
    .addRecipient(t.context.secret2)
    .setUnprotectedHeader({ alg: 'A128GCMKW' })
    .encrypt()

  t.true(generalJwe.aad && typeof generalJwe.aad === 'string')
  t.true(generalJwe.ciphertext && typeof generalJwe.ciphertext === 'string')
  t.true(generalJwe.iv && typeof generalJwe.iv === 'string')
  t.true(generalJwe.protected && typeof generalJwe.protected === 'string')
  t.true(
    generalJwe.unprotected &&
      typeof generalJwe.unprotected === 'object' &&
      Object.keys(generalJwe.unprotected).length === 1,
  )
  t.true(generalJwe.tag && typeof generalJwe.tag === 'string')
  t.is(generalJwe.recipients.length, 2)

  for (const recipient of generalJwe.recipients) {
    t.true(recipient.encrypted_key && typeof recipient.encrypted_key === 'string')
    t.true(
      recipient.header &&
        typeof recipient.header === 'object' &&
        Object.keys(recipient.header).length !== 0,
    )
  }

  for (const secret of [t.context.secret, t.context.secret2]) {
    await generalDecrypt(generalJwe, secret)
  }
})

test('General JWE encryption (single recipient dir)', async (t) => {
  const generalJwe = await new GeneralEncrypt(t.context.plaintext)
    .setAdditionalAuthenticatedData(t.context.additionalAuthenticatedData)
    .setProtectedHeader({ enc: 'A256GCM' })
    .setSharedUnprotectedHeader({ alg: 'A256GCMKW' })
    .addRecipient(t.context.secret)
    .encrypt()

  t.true(generalJwe.aad && typeof generalJwe.aad === 'string')
  t.true(generalJwe.ciphertext && typeof generalJwe.ciphertext === 'string')
  t.true(generalJwe.iv && typeof generalJwe.iv === 'string')
  t.true(generalJwe.protected && typeof generalJwe.protected === 'string')
  t.true(generalJwe.tag && typeof generalJwe.tag === 'string')
  t.true(
    generalJwe.unprotected &&
      typeof generalJwe.unprotected === 'object' &&
      Object.keys(generalJwe.unprotected).length === 1,
  )
  t.is(generalJwe.recipients.length, 1)

  t.true(
    generalJwe.recipients[0].encrypted_key &&
      typeof generalJwe.recipients[0].encrypted_key === 'string',
  )
  t.false('header' in generalJwe.recipients[0])

  await generalDecrypt(generalJwe, t.context.secret)
})

test('General JWE encryption (single recipient ECDH-ES)', async (t) => {
  const kp = await generateKeyPair('ECDH-ES')
  const generalJwe = await new GeneralEncrypt(t.context.plaintext)
    .setAdditionalAuthenticatedData(t.context.additionalAuthenticatedData)
    .setProtectedHeader({ enc: 'A256GCM' })
    .setSharedUnprotectedHeader({ alg: 'ECDH-ES' })
    .addRecipient(kp.publicKey)
    .encrypt()

  t.true(generalJwe.aad && typeof generalJwe.aad === 'string')
  t.true(generalJwe.ciphertext && typeof generalJwe.ciphertext === 'string')
  t.true(generalJwe.iv && typeof generalJwe.iv === 'string')
  t.true(generalJwe.protected && typeof generalJwe.protected === 'string')
  t.true(generalJwe.tag && typeof generalJwe.tag === 'string')
  t.deepEqual(generalJwe.recipients, [{}])
  t.true(
    generalJwe.unprotected &&
      typeof generalJwe.unprotected === 'object' &&
      Object.keys(generalJwe.unprotected).length === 1,
  )

  await generalDecrypt(generalJwe, kp.privateKey)
})

test('General JWE format validation', async (t) => {
  const encrypt = new GeneralEncrypt(t.context.plaintext)
    .setProtectedHeader({ bar: 'baz' })
    .setSharedUnprotectedHeader({ foo: 'bar' })
    .setAdditionalAuthenticatedData(t.context.additionalAuthenticatedData)

  encrypt.addRecipient(t.context.secret).setUnprotectedHeader({ alg: 'A256GCMKW', enc: 'A256GCM' })

  const generalJwe = await encrypt.encrypt()

  {
    await t.throwsAsync(generalDecrypt(null, t.context.secret), {
      message: 'General JWE must be an object',
      code: 'ERR_JWE_INVALID',
    })
  }

  {
    await t.throwsAsync(generalDecrypt({ recipients: null }, t.context.secret), {
      message: 'JWE Recipients missing or incorrect type',
      code: 'ERR_JWE_INVALID',
    })
  }

  {
    await t.throwsAsync(generalDecrypt({ recipients: [null] }, t.context.secret), {
      message: 'JWE Recipients missing or incorrect type',
      code: 'ERR_JWE_INVALID',
    })
  }

  {
    const jwe = { ...generalJwe, recipients: [] }

    await t.throwsAsync(generalDecrypt(jwe, t.context.secret), {
      message: 'JWE Recipients has no members',
      code: 'ERR_JWE_INVALID',
    })
  }

  {
    const jwe = { ...generalJwe, recipients: [{}] }

    await t.throwsAsync(generalDecrypt(jwe, t.context.secret), {
      message: 'decryption operation failed',
      code: 'ERR_JWE_DECRYPTION_FAILED',
    })
  }

  {
    const jwe = { ...generalJwe, recipients: [generalJwe.recipients[0]] }

    await t.notThrowsAsync(generalDecrypt(jwe, t.context.secret))
  }

  {
    const jwe = { ...generalJwe, recipients: [generalJwe.recipients[0], {}] }

    await t.notThrowsAsync(generalDecrypt(jwe, t.context.secret))
  }

  {
    const jwe = { ...generalJwe, recipients: [{}, generalJwe.recipients[0]] }

    await t.notThrowsAsync(generalDecrypt(jwe, t.context.secret))
  }
})

test('decrypt empty data (GCM)', async (t) => {
  const jwe = await new GeneralEncrypt(new Uint8Array(0))
    .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
    .addRecipient(new Uint8Array(16))
    .encrypt()

  t.is(jwe.ciphertext, '')

  const { plaintext } = await generalDecrypt(jwe, new Uint8Array(16))
  t.is(plaintext.byteLength, 0)
})

test('decrypt empty data (CBC)', async (t) => {
  const jwe = await new GeneralEncrypt(new Uint8Array(0))
    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
    .addRecipient(new Uint8Array(32))
    .encrypt()

  t.is(base64url.decode(jwe.ciphertext).byteLength, 16)

  const { plaintext } = await generalDecrypt(jwe, new Uint8Array(32))
  t.is(plaintext.byteLength, 0)
})
