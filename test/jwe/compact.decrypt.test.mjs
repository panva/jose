import test from 'ava'

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto'
const { CompactEncrypt, compactDecrypt } = await import(root)

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

test('decrypt empty data', async (t) => {
  const jwe = await new CompactEncrypt(new Uint8Array(0))
    .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
    .encrypt(new Uint8Array(16))

  t.is(jwe.split('.')[3], '')

  const { plaintext } = await compactDecrypt(jwe, new Uint8Array(16))
  t.is(plaintext.byteLength, 0)
})
