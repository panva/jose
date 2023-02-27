import test from 'ava'
import { conditional, keyRoot } from '../dist.mjs'

const { importJWK, exportJWK } = await import(keyRoot)

test('JWK must be an object', async (t) => {
  await t.throwsAsync(importJWK(true), {
    instanceOf: TypeError,
    message: 'JWK must be an object',
  })
  await t.throwsAsync(importJWK(null), {
    instanceOf: TypeError,
    message: 'JWK must be an object',
  })
  await t.throwsAsync(importJWK(Boolean), {
    instanceOf: TypeError,
    message: 'JWK must be an object',
  })
  await t.throwsAsync(importJWK([]), {
    instanceOf: TypeError,
    message: 'JWK must be an object',
  })
  await t.throwsAsync(importJWK(''), {
    instanceOf: TypeError,
    message: 'JWK must be an object',
  })
  const nullPrototype = Object.create(null)
  nullPrototype.crv = 'P-256'
  nullPrototype.kty = 'EC'
  nullPrototype.x = 'q3zAwR_kUwtdLEwtB2oVfucXiLHmEhu9bJUFYjJxYGs'
  nullPrototype.y = '8h0D-ONoU-iZqrq28TyUxEULxuGwJZGMJYTMbeMshvI'
  await t.notThrowsAsync(importJWK(nullPrototype, 'ES256'))
})

test('JWK kty must be recognized', async (t) => {
  await t.throwsAsync(importJWK({ kty: 'unrecognized' }, 'HS256'), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
    message: 'Unsupported "kty" (Key Type) Parameter value',
  })
})

test('oct JWK must have "k"', async (t) => {
  await t.throwsAsync(importJWK({ kty: 'oct' }, 'HS256'), {
    instanceOf: TypeError,
    message: 'missing "k" (Key Value) Parameter value',
  })
})

test('RSA JWK with oth is not supported', async (t) => {
  await t.throwsAsync(importJWK({ kty: 'RSA', oth: [] }, 'RS256'), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
    message: 'RSA JWK "oth" (Other Primes Info) Parameter value is not supported',
  })
})

test('oct JWK (ext: true)', async (t) => {
  const oct = {
    k: 'FyCq1CKBflh3I5gikEjpYrdOXllzxB_yc02za8ERknI',
    kty: 'oct',
    ext: true,
  }

  t.deepEqual(
    [...(await importJWK(oct, 'HS256'))],
    [
      23, 32, 170, 212, 34, 129, 126, 88, 119, 35, 152, 34, 144, 72, 233, 98, 183, 78, 94, 89, 115,
      196, 31, 242, 115, 77, 179, 107, 193, 17, 146, 114,
    ],
  )

  const k = await importJWK(oct, 'HS256', true)
  t.true('type' in k)
  t.is(k.type, 'secret')
  if ('extractable' in k) {
    t.is(k.extractable, true)
  }
})

test('oct JWK (ext: false)', async (t) => {
  const oct = {
    k: 'FyCq1CKBflh3I5gikEjpYrdOXllzxB_yc02za8ERknI',
    kty: 'oct',
    ext: false,
  }

  const k = await importJWK(oct, 'HS256', true)

  t.true('type' in k)
  t.is(k.type, 'secret')
  if ('extractable' in k) {
    t.is(k.extractable, false)
  }
})

test('oct JWK (ext missing)', async (t) => {
  const oct = {
    k: 'FyCq1CKBflh3I5gikEjpYrdOXllzxB_yc02za8ERknI',
    kty: 'oct',
  }

  const k = await importJWK(oct, 'HS256', true)

  t.true('type' in k)
  t.is(k.type, 'secret')
  if ('extractable' in k) {
    t.is(k.extractable, false)
  }
})

test('Uin8tArray can be transformed to a JWK', async (t) => {
  t.deepEqual(
    await exportJWK(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])),
    {
      k: 'AQIDBAUGBwgJCgsMDQ4P',
      kty: 'oct',
    },
  )
})

test('secret KeyLike can be transformed to a JWK', async (t) => {
  const keylike = await importJWK(
    {
      ext: true,
      k: 'AQIDBAUGBwgJCgsMDQ4P',
      kty: 'oct',
    },
    'HS256',
    true,
  )
  t.deepEqual(await exportJWK(keylike), {
    k: 'AQIDBAUGBwgJCgsMDQ4P',
    kty: 'oct',
  })
})
