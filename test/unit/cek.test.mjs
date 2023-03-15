import test from 'ava'

const { default: cek } = await import('#dist/lib/cek')

test('lib/cek.ts', (t) => {
  t.throws(() => cek('foo'), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
    message: 'Unsupported JWE Algorithm: foo',
  })
})
