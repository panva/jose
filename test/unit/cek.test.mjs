import test from 'ava'
import { root } from '../dist.mjs'

const { default: cek } = await import(`${root}/lib/cek`)

test('lib/cek.ts', (t) => {
  t.throws(() => cek('foo'), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
    message: 'Unsupported JWE Algorithm: foo',
  })
})
