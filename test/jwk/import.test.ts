import test from 'ava'

import {
  exportPKCS8,
  exportSPKI,
  generateKeyPair,
  importPKCS8,
  importSPKI,
} from '../../src/index.js'

test('PEM imports reject symmetric algorithms', async (t) => {
  const { privateKey, publicKey } = await generateKeyPair('ES256', { extractable: true })
  const spki = await exportSPKI(publicKey)
  const pkcs8 = await exportPKCS8(privateKey)
  const expected = {
    code: 'ERR_JOSE_NOT_SUPPORTED',
    message: 'Invalid or unsupported "alg" (Algorithm) value',
  }

  for (const alg of ['HS256', 'A128KW']) {
    await t.throwsAsync(importSPKI(spki, alg), expected)
    await t.throwsAsync(importPKCS8(pkcs8, alg), expected)
  }
})
