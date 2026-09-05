import test from 'ava'

import { createLocalJWKSet, errors, exportJWK, generateKeyPair } from '../../src/index.js'

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
    t.deepEqual(set.jwks().keys[0].key_ops, key_ops)
  }
})

test.serial('JWKS selection ignores inherited key metadata', async (t) => {
  const descriptor = Object.getOwnPropertyDescriptor(Object.prototype, 'kid')
  for (const beforeCreation of [true, false]) {
    const install = () =>
      Object.defineProperty(Object.prototype, 'kid', {
        value: 'inherited',
        configurable: true,
        writable: true,
      })
    try {
      if (beforeCreation) install()
      const set = createLocalJWKSet({ keys: [{ kty: 'EC', crv: 'P-256' }] })
      if (!beforeCreation) install()

      await t.throwsAsync(set({ alg: 'ES256', kid: 'inherited' }), {
        code: 'ERR_JWKS_NO_MATCHING_KEY',
      })
      t.false(Object.hasOwn(set.jwks().keys[0], 'kid'))
    } finally {
      if (descriptor) Object.defineProperty(Object.prototype, 'kid', descriptor)
      else Reflect.deleteProperty(Object.prototype, 'kid')
    }
  }
})

test('JWKS selection preserves snapshots, candidate order, and cached keys', async (t) => {
  const first = await exportJWK((await generateKeyPair('ES256')).publicKey)
  const second = await exportJWK((await generateKeyPair('ES256')).publicKey)
  const input = {
    keys: [
      { ...first, key_ops: ['sign'] },
      { ...first, kid: 'first', key_ops: ['verify'] },
      { ...second, kid: 'second', key_ops: ['verify'] },
    ],
  }
  const original = structuredClone(input)
  const set = createLocalJWKSet(input)
  input.keys[1].key_ops[0] = 'sign'
  input.keys.reverse()
  const clone = set.jwks()
  clone.keys[2].kid = 'changed'
  clone.keys[2].key_ops!.push('sign')
  clone.keys.reverse()

  const error = await t.throwsAsync(set({ alg: 'ES256' }), {
    instanceOf: errors.JWKSMultipleMatchingKeys,
  })
  const keys = []
  for await (const key of error!) keys.push(key)
  t.is(keys.length, 2)
  t.deepEqual(await exportJWK(keys[0]), first)
  t.deepEqual(await exportJWK(keys[1]), second)
  t.is(await set({ alg: 'ES256', kid: 'first' }), keys[0])
  t.is(await set({ alg: 'ES256', kid: 'second' }), keys[1])
  t.deepEqual(set.jwks(), original)
})

test('JWKS imports remain limited to public JWS keys', async (t) => {
  const privateKeySet = createLocalJWKSet({
    keys: [
      {
        crv: 'P-256',
        d: 'hRVo5TGE_d_4tQC1KEQIlCdo9rteZmLSmaMPpFOjeDI',
        kty: 'EC',
        x: 'Sp3KpzPjwcCF04_W2GvSSf-vGDvp3Iv2kQYqAjnMB-Y',
        y: 'lZmecT2quXe0i9f7b4qHvDAFDpxs0oxCoJx4tOOqsks',
      },
    ],
  })
  await t.throwsAsync(privateKeySet({ alg: 'ES256' }), {
    code: 'ERR_JWKS_INVALID',
    message: 'JSON Web Key Set members must be public keys',
  })
})
