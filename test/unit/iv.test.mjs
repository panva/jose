import test from 'ava'

const { default: iv } = await import('#dist/lib/iv')

test('lib/iv.ts', (t) => {
  t.throws(() => iv('foo'), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
    message: 'Unsupported JWE Algorithm: foo',
  })
})
