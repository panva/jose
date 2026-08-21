import test from 'ava'

import { importJWK, exportJWK } from '../../src/index.js'

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

test('JWK alg must be a string', async (t) => {
  await t.throwsAsync(
    importJWK({
      alg: ['ES256'],
      crv: 'P-256',
      kty: 'EC',
      x: 'q3zAwR_kUwtdLEwtB2oVfucXiLHmEhu9bJUFYjJxYGs',
      y: '8h0D-ONoU-iZqrq28TyUxEULxuGwJZGMJYTMbeMshvI',
    } as any),
    {
      code: 'ERR_JOSE_NOT_SUPPORTED',
      message: 'Invalid or unsupported JWK "alg" (Algorithm) Parameter value',
    },
  )
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

test('oct JWK', async (t) => {
  const oct = {
    k: 'FyCq1CKBflh3I5gikEjpYrdOXllzxB_yc02za8ERknI',
    kty: 'oct',
  }

  t.deepEqual(
    [...(await importJWK(oct, 'HS256'))],
    [
      23, 32, 170, 212, 34, 129, 126, 88, 119, 35, 152, 34, 144, 72, 233, 98, 183, 78, 94, 89, 115,
      196, 31, 242, 115, 77, 179, 107, 193, 17, 146, 114,
    ],
  )
})

test('JWK key_ops must be an array of unique strings', async (t) => {
  for (const key_ops of [null, {}, 0, 'sign', Array(1), ['sign', 'sign'], ['sign', 0]]) {
    await t.throwsAsync(
      importJWK(
        {
          kty: 'oct',
          k: 'FyCq1CKBflh3I5gikEjpYrdOXllzxB_yc02za8ERknI',
          key_ops,
        } as never,
        'HS256',
      ),
      { instanceOf: TypeError },
    )
  }
})

test('JWK ext must be a boolean', async (t) => {
  await t.throwsAsync(
    importJWK(
      {
        crv: 'P-256',
        ext: 'false',
        kty: 'EC',
        x: 'q3zAwR_kUwtdLEwtB2oVfucXiLHmEhu9bJUFYjJxYGs',
        y: '8h0D-ONoU-iZqrq28TyUxEULxuGwJZGMJYTMbeMshvI',
      } as never,
      'ES256',
    ),
    { instanceOf: TypeError },
  )

  await t.throwsAsync(
    importJWK(
      {
        ext: 'false',
        k: 'FyCq1CKBflh3I5gikEjpYrdOXllzxB_yc02za8ERknI',
        kty: 'oct',
      } as never,
      'HS256',
    ),
    { instanceOf: TypeError },
  )
})

test('importJWK snapshots JWK data properties', async (t) => {
  let extReads = 0
  const key = await importJWK(
    {
      crv: 'P-256',
      get ext() {
        return extReads++ === 0 ? false : true
      },
      kty: 'EC',
      x: 'q3zAwR_kUwtdLEwtB2oVfucXiLHmEhu9bJUFYjJxYGs',
      y: '8h0D-ONoU-iZqrq28TyUxEULxuGwJZGMJYTMbeMshvI',
    },
    'ES256',
  )
  t.is(extReads, 1)
  t.false(key.extractable)

  const first = 'FyCq1CKBflh3I5gikEjpYrdOXllzxB_yc02za8ERknI'
  const second = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
  let keyReads = 0
  const secret = await importJWK(
    {
      get k() {
        return keyReads++ === 0 ? first : second
      },
      kty: 'oct',
    },
    'HS256',
  )
  t.is(keyReads, 1)
  t.deepEqual(secret, await importJWK({ k: first, kty: 'oct' }, 'HS256'))
})

test('empty octet sequence JWK export/import round trip', async (t) => {
  const key = new Uint8Array()
  const jwk = await exportJWK(key)

  t.deepEqual(jwk, { kty: 'oct', k: '' })
  t.deepEqual(await importJWK(jwk), key)
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
  )
  t.deepEqual(await exportJWK(keylike), {
    k: 'AQIDBAUGBwgJCgsMDQ4P',
    kty: 'oct',
  })
})
