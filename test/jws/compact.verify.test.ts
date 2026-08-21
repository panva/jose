import test from 'ava'
import * as crypto from 'crypto'

import { compactVerify, CompactSign } from '../../src/index.js'

test.before(async (t) => {
  t.context.secret = crypto.randomFillSync(new Uint8Array(32))
})

test('JWS format validation', async (t) => {
  {
    await t.notThrowsAsync(async () => {
      await compactVerify(
        await new CompactSign(new Uint8Array())
          .setProtectedHeader({ alg: 'HS256' })
          .sign(t.context.secret),
        t.context.secret,
      )
    })
  }

  await t.throwsAsync(compactVerify(null, new Uint8Array(0)), {
    message: 'Compact JWS must be a string or Uint8Array',
    code: 'ERR_JWS_INVALID',
  })
  await t.throwsAsync(compactVerify('.....', new Uint8Array(0)), {
    message: 'Invalid Compact JWS',
    code: 'ERR_JWS_INVALID',
  })
})

test('sign empty data', async (t) => {
  const jws = await new CompactSign(new Uint8Array(0))
    .setProtectedHeader({ alg: 'HS256' })
    .sign(new Uint8Array(32))

  t.is(jws.split('.')[1], '')

  const { payload } = await compactVerify(jws, new Uint8Array(32))
  t.is(payload.byteLength, 0)
})

test.serial('resolved keys are returned as own data properties', async (t) => {
  const jws = await new CompactSign(new Uint8Array())
    .setProtectedHeader({ alg: 'HS256' })
    .sign(t.context.secret)
  let intercepted: unknown
  let result
  const descriptor = Object.getOwnPropertyDescriptor(Object.prototype, 'key')

  Object.defineProperty(Object.prototype, 'key', {
    configurable: true,
    set(value) {
      intercepted = value
    },
  })
  try {
    result = await compactVerify(jws, async () => t.context.secret)
  } finally {
    if (descriptor) Object.defineProperty(Object.prototype, 'key', descriptor)
    else Reflect.deleteProperty(Object.prototype, 'key')
  }

  t.true(Object.hasOwn(result!, 'key'))
  t.is(result!.key, t.context.secret)
  t.is(intercepted, undefined)
})
