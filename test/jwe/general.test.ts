import test from 'ava'
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

test('General JWE encryption validates multi-recipient plaintext', async (t) => {
  const encrypt = new GeneralEncrypt(new ArrayBuffer(1) as any).setProtectedHeader({
    enc: 'A128GCM',
  })
  encrypt.addRecipient(t.context.secret).setUnprotectedHeader({ alg: 'A256KW' })
  encrypt.addRecipient(t.context.secret2).setUnprotectedHeader({ alg: 'A128KW' })

  await t.throwsAsync(encrypt.encrypt(), {
    instanceOf: TypeError,
    message: 'plaintext must be an instance of Uint8Array',
  })
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

test('General JWE decryption requires a single recipient for dir and ECDH-ES', async (t) => {
  const direct = await new GeneralEncrypt(t.context.plaintext)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .addRecipient(t.context.secret)
    .encrypt()

  await t.throwsAsync(generalDecrypt({ ...direct, recipients: [{}, {}] }, t.context.secret), {
    message: '"dir" alg may only have a single recipient',
    code: 'ERR_JWE_INVALID',
  })

  const perRecipient = await new GeneralEncrypt(t.context.plaintext)
    .setProtectedHeader({ enc: 'A256GCM' })
    .addRecipient(t.context.secret)
    .setUnprotectedHeader({ alg: 'A256GCMKW' })
    .addRecipient(t.context.secret2)
    .setUnprotectedHeader({ alg: 'A128GCMKW' })
    .encrypt()

  await t.throwsAsync(
    generalDecrypt(
      {
        ...perRecipient,
        recipients: [perRecipient.recipients[0], { header: { alg: 'ECDH-ES' } }],
      },
      t.context.secret,
    ),
    {
      message: '"ECDH-ES" alg may only have a single recipient',
      code: 'ERR_JWE_INVALID',
    },
  )
})

test('General JWE decryption rejects a dir CEK key-wrapped for a second recipient', async (t) => {
  const cek = crypto.randomFillSync(new Uint8Array(32))
  const kek = crypto.randomFillSync(new Uint8Array(32))

  const flattened = await new FlattenedEncrypt(t.context.plaintext)
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
    await t.throwsAsync(generalDecrypt(jwe, key), {
      message: '"dir" alg may only have a single recipient',
      code: 'ERR_JWE_INVALID',
    })
  }
})

test('Default PBES2 Count', async (t) => {
  const jwe = await new GeneralEncrypt(t.context.plaintext)
    .setProtectedHeader({ alg: 'PBES2-HS256+A128KW', enc: 'A128GCM' })
    .addRecipient(t.context.secret)
    .addRecipient(t.context.secret)
    .encrypt(t.context.secret)

  const [{ header: bob }, { header: charlie }] = jwe.recipients
  t.is(bob.p2c, 2048)
  t.is(charlie.p2c, 2048)
  t.true(bob.p2s !== charlie.p2s)
})

test('single recipient key management parameters are honoured', async (t) => {
  const jwe = await new GeneralEncrypt(t.context.plaintext)
    .setProtectedHeader({ alg: 'PBES2-HS256+A128KW', enc: 'A128GCM' })
    .addRecipient(t.context.secret)
    .setKeyManagementParameters({ p2c: 4096 })
    .encrypt()

  t.is(protectedHeader(jwe).p2c, 4096)

  const { plaintext } = await generalDecrypt(jwe, t.context.secret, {
    keyManagementAlgorithms: ['PBES2-HS256+A128KW'],
  })
  t.deepEqual(plaintext, t.context.plaintext)
})

test('single recipient ECDH-ES apu/apv are honoured', async (t) => {
  const { privateKey, publicKey } = await generateKeyPair('ECDH-ES', { extractable: true })
  const apu = crypto.randomFillSync(new Uint8Array(8))
  const apv = crypto.randomFillSync(new Uint8Array(8))

  const jwe = await new GeneralEncrypt(t.context.plaintext)
    .setProtectedHeader({ enc: 'A256GCM' })
    .addRecipient(publicKey)
    .setUnprotectedHeader({ alg: 'ECDH-ES+A256KW' })
    .setKeyManagementParameters({ apu, apv })
    .encrypt()

  // A single recipient takes the FlattenedEncrypt path without the "unprotected" option, so the
  // derived parameters land in the JWE Protected Header rather than per-recipient.
  const { apu: apuS, apv: apvS } = protectedHeader(jwe)
  t.is(apuS, base64url.encode(apu))
  t.is(apvS, base64url.encode(apv))

  const { plaintext } = await generalDecrypt(jwe, privateKey)
  t.deepEqual(plaintext, t.context.plaintext)
})
