import test from 'ava'

import {
  exportJWK,
  exportPKCS8,
  exportSPKI,
  generateKeyPair,
  importJWK,
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

test('private key import extractable option must be a boolean', async (t) => {
  const { privateKey } = await generateKeyPair('ES256', { extractable: true })
  const pkcs8 = await exportPKCS8(privateKey)
  const jwk = await exportJWK(privateKey)

  await t.throwsAsync(importPKCS8(pkcs8, 'ES256', { extractable: 'false' as never }), {
    instanceOf: TypeError,
  })
  await t.throwsAsync(importJWK(jwk, 'ES256', { extractable: 'false' as never }), {
    instanceOf: TypeError,
  })
})

test('key imports snapshot the extractable option', async (t) => {
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

    t.is(reads, 1)
    t.false(key.extractable)
  }
})
