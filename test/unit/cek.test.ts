import assert from 'node:assert/strict'
import test from 'node:test'

import { generateCek } from '../../src/lib/content_encryption.js'
import { jweEncryption } from '../../src/lib/jwe_algorithms.js'
import { errorLike } from '../_errors.js'

test('lib/content_encryption.ts generateCek', () => {
  assert.throws(
    () => jweEncryption('foo'),
    errorLike({
      code: 'ERR_JOSE_NOT_SUPPORTED',
      message: 'Invalid or unsupported "enc" (JWE Encryption Algorithm) header value',
    }),
  )
  assert.strictEqual(generateCek(jweEncryption('A128GCM')).byteLength, 16)
  assert.strictEqual(generateCek(jweEncryption('A256CBC-HS512')).byteLength, 64)
})
