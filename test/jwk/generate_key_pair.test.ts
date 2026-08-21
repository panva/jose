import test from 'ava'

import { exportJWK, generateKeyPair, generateSecret } from '../../src/index.js'

test('alg must be a string', async (t) => {
  await t.throwsAsync(generateKeyPair(['ES256'] as any), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
    message: 'Invalid or unsupported "alg" (Algorithm) value',
  })
})

test('RSA modulusLength must be an integer', async (t) => {
  await t.throwsAsync(generateKeyPair('RS256', { modulusLength: 2048.5 }), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
    message:
      'Invalid or unsupported modulusLength option provided, 2048 bits or larger keys must be used',
  })
})

test('extractable must be a boolean', async (t) => {
  await t.throwsAsync(generateKeyPair('ES256', { extractable: 'false' as never }), {
    instanceOf: TypeError,
  })
  await t.throwsAsync(generateSecret('HS256', { extractable: 'false' as never }), {
    instanceOf: TypeError,
  })
})

test('key generation snapshots the extractable option', async (t) => {
  for (const generate of [
    async (options) => (await generateKeyPair('ES256', options)).privateKey,
    (options) => generateSecret('HS256', options),
  ]) {
    let reads = 0
    const key = await generate({
      get extractable() {
        return reads++ === 0 ? false : true
      },
    })

    t.is(reads, 1)
    t.false((key as CryptoKey).extractable)
  }
})

test('a crv option conflicting with the algorithm is rejected', async (t) => {
  for (const [alg, crv, expected] of [
    ['EdDSA', 'Ed448', 'Ed25519'],
    ['Ed25519', 'Ed448', 'Ed25519'],
    ['ES256', 'P-521', 'P-256'],
    ['ES384', 'P-256', 'P-384'],
    ['ES512', 'P-256', 'P-521'],
  ] as const) {
    await t.throwsAsync(generateKeyPair(alg, { crv }), {
      code: 'ERR_JOSE_NOT_SUPPORTED',
      message: `Invalid or unsupported crv option provided, the only supported value for ${alg} is ${expected}`,
    })
  }
})

test('a crv option matching the algorithm is accepted', async (t) => {
  for (const [alg, crv] of [
    ['EdDSA', 'Ed25519'],
    ['Ed25519', 'Ed25519'],
    ['ES256', 'P-256'],
    ['ES384', 'P-384'],
    ['ES512', 'P-521'],
  ] as const) {
    const { publicKey } = await generateKeyPair(alg, { crv, extractable: true })
    t.is((await exportJWK(publicKey)).crv, crv)
  }
})

test('the crv option remains optional', async (t) => {
  for (const [alg, expected] of [
    ['EdDSA', 'Ed25519'],
    ['ES256', 'P-256'],
    ['ES512', 'P-521'],
  ] as const) {
    const { publicKey } = await generateKeyPair(alg, { extractable: true })
    t.is((await exportJWK(publicKey)).crv, expected)
  }
})

test('ECDH-ES still resolves the crv option itself', async (t) => {
  const { publicKey } = await generateKeyPair('ECDH-ES', { crv: 'P-384', extractable: true })
  t.is((await exportJWK(publicKey)).crv, 'P-384')

  await t.throwsAsync(generateKeyPair('ECDH-ES', { crv: 'Ed25519' }), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
    message:
      'Invalid or unsupported crv option provided, supported values are P-256, P-384, P-521, and X25519',
  })
})

test('algorithms without a curve ignore the crv option', async (t) => {
  // RSA and ML-DSA have no curve, so nothing is being substituted and the option stays inert.
  await t.notThrowsAsync(generateKeyPair('RS256', { crv: 'P-256' } as any))
})
