import test from 'node:test'
import assert from 'node:assert/strict'

import { CompactEncrypt, compactDecrypt } from '../../src/index.js'
import { errorLike } from '../_errors.js'

test('JWE format validation', async () => {
  await assert.rejects(
    compactDecrypt(null, new Uint8Array(0)),
    errorLike({
      message: 'Compact JWE must be a string or Uint8Array',
      code: 'ERR_JWE_INVALID',
    }),
  )
  await assert.rejects(
    compactDecrypt('...', new Uint8Array(0)),
    errorLike({
      message: 'Invalid Compact JWE',
      code: 'ERR_JWE_INVALID',
    }),
  )
})

test('Compact JWE members are decoded in serialization order', async () => {
  for (const [jwe, message] of [
    ['!..AA.AA.AA', 'JWE Protected Header is invalid'],
    ['e30..AA.!.AA', 'Failed to base64url decode the ciphertext'],
    ['e30..!.AA.AA', 'Failed to base64url decode the iv'],
    ['e30..AA.AA.!', 'Failed to base64url decode the tag'],
  ]) {
    await assert.rejects(
      compactDecrypt(jwe, new Uint8Array(16)),
      errorLike({
        code: 'ERR_JWE_INVALID',
        message,
      }),
    )
  }
})

test('Uint8Array input and resolver receive the Compact JWE member shape', async () => {
  const plaintext = new TextEncoder().encode('plaintext')
  const secret = new Uint8Array(16)
  const jwe = await new CompactEncrypt(plaintext)
    .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
    .setInitializationVector(new Uint8Array(12))
    .encrypt(secret)

  const result = await compactDecrypt(new TextEncoder().encode(jwe), (protectedHeader, token) => {
    assert.deepStrictEqual(protectedHeader, { alg: 'dir', enc: 'A128GCM' })
    assert.deepStrictEqual(Object.keys(token).sort(), [
      'ciphertext',
      'encrypted_key',
      'iv',
      'protected',
      'tag',
    ])
    assert.strictEqual('aad' in token, false)
    assert.strictEqual('header' in token, false)
    assert.strictEqual('unprotected' in token, false)
    return secret
  })

  assert.deepStrictEqual(result.plaintext, plaintext)
  assert.strictEqual(result.key, secret)
})

test('Compact JWE results retain their shape when a resolver mutates token members', async () => {
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

  assert.deepStrictEqual(result, { plaintext, protectedHeader, key: secret })
})
