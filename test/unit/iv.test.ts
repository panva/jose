import assert from 'node:assert/strict'
import test from 'node:test'

import { generateIv } from '../../src/lib/content_encryption.js'
import { jweEncryption } from '../../src/lib/jwe_algorithms.js'
import { errorLike } from '../_errors.js'

test('lib/content_encryption.ts generateIv', () => {
  assert.throws(
    () => jweEncryption('foo'),
    errorLike({
      code: 'ERR_JOSE_NOT_SUPPORTED',
      message: 'Invalid or unsupported "enc" (JWE Encryption Algorithm) header value',
    }),
  )
  assert.strictEqual(generateIv(jweEncryption('A256GCM')).byteLength, 12)
  assert.strictEqual(generateIv(jweEncryption('A256CBC-HS512')).byteLength, 16)
})
