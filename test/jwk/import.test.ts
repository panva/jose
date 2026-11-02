import assert from 'node:assert/strict'
import test from 'node:test'

import {
  exportJWK,
  exportPKCS8,
  exportSPKI,
  generateKeyPair,
  importJWK,
  importPKCS8,
  importSPKI,
} from '../../src/index.js'
import { errorLike } from '../_errors.js'

test('PEM imports reject symmetric algorithms', async () => {
  const { privateKey, publicKey } = await generateKeyPair('ES256', { extractable: true })
  const spki = await exportSPKI(publicKey)
  const pkcs8 = await exportPKCS8(privateKey)
  const expected = {
    code: 'ERR_JOSE_NOT_SUPPORTED',
    message: 'Invalid or unsupported "alg" (Algorithm) value',
  }

  for (const alg of ['HS256', 'A128KW']) {
    await assert.rejects(importSPKI(spki, alg), errorLike(expected))
    await assert.rejects(importPKCS8(pkcs8, alg), errorLike(expected))
  }
})

test('private key import extractable option must be a boolean', async () => {
  const { privateKey } = await generateKeyPair('ES256', { extractable: true })
  const pkcs8 = await exportPKCS8(privateKey)
  const jwk = await exportJWK(privateKey)

  await assert.rejects(importPKCS8(pkcs8, 'ES256', { extractable: 'false' as never }), TypeError)
  await assert.rejects(importJWK(jwk, 'ES256', { extractable: 'false' as never }), TypeError)
})

test('key imports snapshot the extractable option', async () => {
  const { privateKey, publicKey } = await generateKeyPair('ES256', { extractable: true })
  const pkcs8 = await exportPKCS8(privateKey)
  const jwk = await exportJWK(publicKey)

  for (const importKey of [
    (options) => importPKCS8(pkcs8, 'ES256', options),
    (options) => importJWK(jwk, 'ES256', options),
  ]) {
    let reads = 0
    const key = await importKey({
      get extractable() {
        return reads++ === 0 ? false : true
      },
    })

    assert.strictEqual(reads, 1)
    assert.strictEqual(key.extractable, false)
  }
})
