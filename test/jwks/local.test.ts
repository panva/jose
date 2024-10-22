import test from 'ava'

import { createLocalJWKSet } from '../../src/index.js'

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

  const jwks = { keys: [] }
  const set = createLocalJWKSet(jwks)

  const clone = set.jwks()
  t.false(clone === jwks)
  t.false(clone === set.jwks())
  t.deepEqual(clone, jwks)
  t.deepEqual(clone, set.jwks())
})
