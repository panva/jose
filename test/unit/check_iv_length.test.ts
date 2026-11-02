import assert from 'node:assert/strict'
import test from 'node:test'

import { checkIvLength } from '../../src/lib/content_encryption.js'
import { jweEncryption } from '../../src/lib/jwe_algorithms.js'
import { errorLike } from '../_errors.js'

test('lib/content_encryption.ts checkIvLength', () => {
  const gcm = jweEncryption('A256GCM')
  assert.throws(
    () => checkIvLength(gcm, new Uint8Array(13)),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message: 'Invalid Initialization Vector length',
    }),
  )
  assert.doesNotThrow(() => checkIvLength(gcm, new Uint8Array(12)))
  assert.doesNotThrow(() => checkIvLength(jweEncryption('A256CBC-HS512'), new Uint8Array(16)))
})
