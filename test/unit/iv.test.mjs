import test from 'ava'
import { root } from '../dist.mjs'

const { default: iv } = await import(`${root}/lib/iv`)

test('lib/iv.ts', (t) => {
  t.throws(() => iv('foo'), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
    message: 'Unsupported JWE Algorithm: foo',
  })
})
