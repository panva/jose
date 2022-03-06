import test from 'ava'
import { root } from '../dist.mjs'

const { default: checkIvLength } = await import(`${root}/lib/check_iv_length`)

test('lib/check_iv_length.ts', (t) => {
  t.throws(() => checkIvLength('A256GCM', new Uint8Array(13)), {
    code: 'ERR_JWE_INVALID',
    message: 'Invalid Initialization Vector length',
  })
  t.notThrows(() => checkIvLength('A256GCM', new Uint8Array(12)))
})
