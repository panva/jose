import test from 'ava'

import { errors, importJWK, exportJWK } from '../../src/index.js'

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

test('RSA JWK oth validation is left to WebCrypto', async (t) => {
  try {
    await importJWK(
      {
        kty: 'RSA',
        n: 'oyYNlYf4jWxQoEGPpXFg7k2w2TzeWKJ60ZfKQFf3NNO0X6Q98FiTkaMdYfLMUUcPU1eNrtG2HHXVbJzaiBiEwhZyJImCk4MVZmeG0_OizmAXNbHVFx8Yth_3SsYhcwQ0JjQAb-MiClKin9nCZDzfYJK32g0u8d9k5mWvf8oIQ1BwedFermjPrMzGIjv5ae2Tmn561Ucp7MCsWfHq36BCjmoZqPEBA4iNrfqMP0UjVj8aWy2H_tF5TQWN3ecTlKLlXyyLe1k7LX0CL-atk_Abyv6nwW9Evj1zSf41Rwrc0ppBd9rVNWha1w_xT-iJrmF_p7dfWxbiDpsBAL2Y7PhoUQ',
        e: 'AQAB',
        d: 'hr1NqLoUB1B2QfQDW4KIqCbXsIH5q7_8qQ6wRXWgvys8o2R0lwPAVB4fjR5FqbaDLLR5WfDucxDKA5qDTLTbJ6P7_rrmcUdoLBvCGVf0lHZ9lKXas6B81EbRkZR_kqwLGcr9KUgwpIecSWvtGPmD8F3nkiet5K4nt92D0BLJxMS9BDProig4ufbJc4QTLcptEUzuXxIpS2GSGZWJt3Dg4K0DkyKX3POmm9GLDzCK6dxsLEaZPi7Uc9xC2SGd_QqQTdFK4gtNmeFbBL3D1LzQQzSF9ehaUUqi0rE-U6qsiAjTJYO7QzC56mnqjROiT8vzojbO_BCphZpDdDa-iIzD8Q',
        p: 'B2kDhh0c2eqIfL2wCA5QpfaGol7XD7MtQsKDvS_iuAmh6vsRV1qwOj0itVfC380egRaV95tmzA67gY-OM0V0l_vT3kOyzz7y7tX9M-eDvRlkIy5tgIM',
        q: 'BluXe6kE6899vPdzI_o06MSid0jMKx7iD-HdOl6CLahxHWC33bulkZcHbldvxQJJcpgK1D22WOd71ADxNRUVGaj2k-xvDMMxOkAlEEbM8ZjeTuSNXI8',
        dp: 'BBM7TeDqweiZ4MfMa9G7hlmZ1ueDK-4kgOdJ3Zvc-crKUdh6w-hqq8x9Lu8xizRZhzItjPrYQHYFpg2VbRrQMNjbvgrK5fA_Vxs1YPr71t2E1Vgt_hM',
        dq: 'BBBM_bRludewtbSwOqG1acYtVfMI1NLziVVDkwhPSqGsUyu7uhUzWaBgFo36mcDBc2ZtHYWoZKDoy_QiOFyWVQVjPd9Uh6LHd0UCq6mlWxLrnR-Gn08',
        qi: 'BoI69XFCVG75TTJ1FA2lx0aed0PTDkz509agSBuUkpHe5qp7U2ESrcVUhYuop9RypYgnoYlkhw2UXdu9G3dkO0sfa1lakPe5EkVzs7PVNq98KBGnKUc',
        oth: [
          {
            r: 'A3aEh8x-O_mosY-0RQReHMrwmW3KqSnTmALoTsV23xePSeYC60HdQmbyGzrMr3rX51gqDY-lTUlVSeF9LAgB9lHQwPnBRb1B0r59J47YBpzoPjBj1jU',
            d: 'ApIyH-kyKDFakEqTm1J81X_PVvrvJt3JHem6tRFjCowhdMpzjFvgfPaV9qWXZwob1sXcoyjtoA48ZpgmKVTgsBNanIxSdQbpIiEQJxilR3Oj8thWp6k',
            t: 'AztfynJ6yc4Dy-V_k54ZMgquUEEeIvLTeVrqBKra1NkaIdfZGHrO34WxgRpX_7hhr9tc_JmyNCtnk2QBSBOyrQ75QP76j3BgF132XRt3FKRcY3R6uYs',
          },
        ],
      },
      'RS256',
    )
    t.pass()
  } catch (err) {
    t.false(err instanceof errors.JOSEError)
  }
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
