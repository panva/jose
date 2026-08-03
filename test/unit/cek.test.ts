import test from 'ava'

import { generateCek } from '../../src/lib/content_encryption.js'
import { jweEncryption } from '../../src/lib/jwe_algorithms.js'

test('lib/content_encryption.ts generateCek', (t) => {
  t.throws(() => jweEncryption('foo'), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
    message: 'Invalid or unsupported "enc" (JWE Encryption Algorithm) header value',
  })
  t.is(generateCek(jweEncryption('A128GCM')).byteLength, 16)
  t.is(generateCek(jweEncryption('A256CBC-HS512')).byteLength, 64)
})
