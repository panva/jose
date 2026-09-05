import test from 'ava'

import { CompactEncrypt, compactDecrypt } from '../../src/index.js'

test('JWE format validation', async (t) => {
  await t.throwsAsync(compactDecrypt(null, new Uint8Array(0)), {
    message: 'Compact JWE must be a string or Uint8Array',
    code: 'ERR_JWE_INVALID',
  })
  await t.throwsAsync(compactDecrypt('...', new Uint8Array(0)), {
    message: 'Invalid Compact JWE',
    code: 'ERR_JWE_INVALID',
  })
})

test('Compact JWE members are decoded in serialization order', async (t) => {
  for (const [jwe, message] of [
    ['!..AA.AA.AA', 'JWE Protected Header is invalid'],
    ['e30..AA.!.AA', 'Failed to base64url decode the ciphertext'],
    ['e30..!.AA.AA', 'Failed to base64url decode the iv'],
    ['e30..AA.AA.!', 'Failed to base64url decode the tag'],
  ]) {
    await t.throwsAsync(compactDecrypt(jwe, new Uint8Array(16)), {
      code: 'ERR_JWE_INVALID',
      message,
    })
  }
})

test('Uint8Array input and resolver receive the Compact JWE member shape', async (t) => {
  const plaintext = new TextEncoder().encode('plaintext')
  const secret = new Uint8Array(16)
  const jwe = await new CompactEncrypt(plaintext)
    .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
    .setInitializationVector(new Uint8Array(12))
    .encrypt(secret)

  const result = await compactDecrypt(new TextEncoder().encode(jwe), (protectedHeader, token) => {
    t.deepEqual(protectedHeader, { alg: 'dir', enc: 'A128GCM' })
    t.deepEqual(Object.keys(token).sort(), [
      'ciphertext',
      'encrypted_key',
      'iv',
      'protected',
      'tag',
    ])
    t.false('aad' in token)
    t.false('header' in token)
    t.false('unprotected' in token)
    return secret
  })

  t.deepEqual(result.plaintext, plaintext)
  t.is(result.key, secret)
})

test('Compact JWE results retain their shape when a resolver mutates token members', async (t) => {
  const plaintext = new TextEncoder().encode('plaintext')
  const secret = new Uint8Array(16)
  const protectedHeader = { alg: 'dir', enc: 'A128GCM' } as const
  const jwe = await new CompactEncrypt(plaintext)
    .setProtectedHeader(protectedHeader)
    .encrypt(secret)

  const result = await compactDecrypt(jwe, (_, token) => {
    delete token.protected
    token.header = { kid: 'added' }
    token.unprotected = { kid: 'added' }
    token.aad = 'YWRkZWQ'
    return secret
  })

  t.deepEqual(result, { plaintext, protectedHeader, key: secret })
})
