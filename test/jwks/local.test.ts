import test from 'ava'

import { createLocalJWKSet } from '../../src/index.js'

test('LocalJWKSet', async (t) => {
  const sparseKeys = Array<object>(1)
  for (const f of [
    null,
    {},
    { keys: null },
    { keys: {} },
    { keys: [null] },
    { keys: [0] },
    { keys: [undefined] },
    { keys: [[]] },
    { keys: sparseKeys },
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

test('JWK use must be a string', async (t) => {
  const set = createLocalJWKSet({
    keys: [
      {
        kty: 'EC',
        crv: 'P-256',
        x: 'fqCXPnWs3sSfwztvwYU9SthmRdoT4WCXxS8eD8icF6U',
        y: 'nP6GIc42c61hoKqPcZqkvzhzIJkBV3Jw3g8sGG7UeP8',
        // @ts-expect-error malformed input from parsed JSON
        use: 0,
      },
    ],
  })

  await t.throwsAsync(set({ alg: 'ES256' }), {
    code: 'ERR_JWKS_NO_MATCHING_KEY',
  })
})

test('JWK alg must be a string', async (t) => {
  const set = createLocalJWKSet({
    keys: [
      {
        kty: 'EC',
        crv: 'P-256',
        x: 'fqCXPnWs3sSfwztvwYU9SthmRdoT4WCXxS8eD8icF6U',
        y: 'nP6GIc42c61hoKqPcZqkvzhzIJkBV3Jw3g8sGG7UeP8',
        // @ts-expect-error malformed input from parsed JSON
        alg: 0,
      },
    ],
  })

  await t.throwsAsync(set({ alg: 'ES256' }), {
    code: 'ERR_JWKS_NO_MATCHING_KEY',
  })
})

test('a non-string kid must not bypass key selection', async (t) => {
  const set = createLocalJWKSet({
    keys: [
      {
        kty: 'EC',
        crv: 'P-256',
        x: 'fqCXPnWs3sSfwztvwYU9SthmRdoT4WCXxS8eD8icF6U',
        y: 'nP6GIc42c61hoKqPcZqkvzhzIJkBV3Jw3g8sGG7UeP8',
        kid: 'expected',
      },
    ],
  })

  await t.throwsAsync(set({ alg: 'ES256', kid: 0 as never }), {
    code: 'ERR_JWKS_NO_MATCHING_KEY',
  })
})

test('JWK key_ops must be an array of unique strings', async (t) => {
  const key = {
    kty: 'EC',
    crv: 'P-256',
    x: 'fqCXPnWs3sSfwztvwYU9SthmRdoT4WCXxS8eD8icF6U',
    y: 'nP6GIc42c61hoKqPcZqkvzhzIJkBV3Jw3g8sGG7UeP8',
  }

  const sparseKeyOps = Array<string>(2)
  sparseKeyOps[1] = 'verify'

  for (const key_ops of [
    null,
    {},
    'verify',
    0,
    ['verify', 'verify'],
    ['verify', 0],
    sparseKeyOps,
  ]) {
    const set = createLocalJWKSet({
      keys: [{ ...key, key_ops } as never],
    })

    await t.throwsAsync(set({ alg: 'ES256' }), {
      code: 'ERR_JWKS_NO_MATCHING_KEY',
    })
  }
})
