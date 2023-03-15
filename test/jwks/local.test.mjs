import test from 'ava'

const { createLocalJWKSet } = await import('#dist')

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
