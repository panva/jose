import test from 'ava'

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto'
const { compactVerify } = await import(root)

test('JWS format validation', async (t) => {
  await t.throwsAsync(compactVerify(null, new Uint8Array(0)), {
    message: 'Compact JWS must be a string or Uint8Array',
    code: 'ERR_JWS_INVALID',
  })
  await t.throwsAsync(compactVerify('.....', new Uint8Array(0)), {
    message: 'Invalid Compact JWS',
    code: 'ERR_JWS_INVALID',
  })
})
