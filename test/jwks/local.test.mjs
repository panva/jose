import test from 'ava'
import { keyRoot } from '../dist.mjs'

const { createLocalJWKSet } = await import(keyRoot)

test('LocalJWKSet', async (t) => {
  for (const f of [
    null,
    {},
    { keys: null },
    { keys: {} },
    { keys: [null] },
    { keys: [0] },
    { keys: [undefined] },
    { keys: [[]] },
    1,
    Boolean,
  ]) {
    t.throws(() => createLocalJWKSet(f), { code: 'ERR_JWKS_INVALID' })
  }
})
