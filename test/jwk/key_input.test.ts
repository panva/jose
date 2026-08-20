import test from 'ava'

import { CompactSign, compactVerify, exportJWK, generateKeyPair } from '../../src/index.js'

const payload = new TextEncoder().encode('You step into the Road, and if you do not keep your feet')

test.serial('JWK inputs are frozen before import and cached afterward', async (t) => {
  const { privateKey, publicKey } = await generateKeyPair('ES256', { extractable: true })
  const jwk = await exportJWK(privateKey)
  jwk.key_ops = ['sign']

  const subtle = crypto.subtle
  const descriptor = Object.getOwnPropertyDescriptor(subtle, 'importKey')
  const importKey = subtle.importKey
  let imports = 0
  let release!: () => void
  const blocked = new Promise<void>((resolve) => {
    release = resolve
  })

  Object.defineProperty(subtle, 'importKey', {
    configurable: true,
    async value(...args: Parameters<SubtleCrypto['importKey']>) {
      if (args[0] === 'jwk') {
        imports++
        await blocked
      }
      return Reflect.apply(importKey, subtle, args)
    },
  })

  let firstPending: Promise<string> | undefined
  try {
    // The cache key must become immutable before the import promise can yield.
    firstPending = new CompactSign(payload).setProtectedHeader({ alg: 'ES256' }).sign(jwk)

    t.is(imports, 1)
    t.true(Object.isFrozen(jwk))
    t.true(Object.isFrozen(jwk.key_ops))
    t.throws(() => Object.assign(jwk, { kid: 'changed' }), { instanceOf: TypeError })
    t.throws(() => jwk.key_ops!.push('verify'), { instanceOf: TypeError })

    release()
    const first = await firstPending
    const second = await new CompactSign(payload).setProtectedHeader({ alg: 'ES256' }).sign(jwk)

    t.is(imports, 1)
    await t.notThrowsAsync(compactVerify(first, publicKey))
    await t.notThrowsAsync(compactVerify(second, publicKey))
  } finally {
    release()
    await firstPending?.catch(() => {})
    if (descriptor) {
      Object.defineProperty(subtle, 'importKey', descriptor)
    } else {
      Reflect.deleteProperty(subtle, 'importKey')
    }
  }
})

test('direct oct JWK key_ops must be an array of unique strings', async (t) => {
  const key = {
    k: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    kty: 'oct' as const,
  }

  for (const key_ops of [null, {}, 0, 'sign', ['sign', 'sign'], ['sign', 0]]) {
    await t.throwsAsync(
      new CompactSign(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .sign({ ...key, key_ops } as never),
      { instanceOf: TypeError },
    )
  }
})
