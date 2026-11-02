import assert from 'node:assert/strict'
import test from 'node:test'

import { exportJWK, generateKeyPair, generateSecret } from '../../src/index.js'
import { errorLike } from '../_errors.js'

test('alg must be a string', async () => {
  await assert.rejects(
    generateKeyPair(['ES256'] as any),
    errorLike({
      code: 'ERR_JOSE_NOT_SUPPORTED',
      message: 'Invalid or unsupported "alg" (Algorithm) value',
    }),
  )
})

test('algorithm lookup ignores Object prototype properties', async () => {
  for (const alg of ['toString', 'constructor', '__proto__']) {
    await assert.rejects(
      generateKeyPair(alg),
      errorLike({
        code: 'ERR_JOSE_NOT_SUPPORTED',
        message: 'Invalid or unsupported "alg" (Algorithm) value',
      }),
    )
  }
})

test('RSA modulusLength must be an integer', async () => {
  await assert.rejects(
    generateKeyPair('RS256', { modulusLength: 2048.5 }),
    errorLike({
      code: 'ERR_JOSE_NOT_SUPPORTED',
      message:
        'Invalid or unsupported modulusLength option provided, 2048 bits or larger keys must be used',
    }),
  )
})

test('extractable must be a boolean', async () => {
  await assert.rejects(generateKeyPair('ES256', { extractable: 'false' as never }), TypeError)
  await assert.rejects(generateSecret('HS256', { extractable: 'false' as never }), TypeError)
})

test('key generation snapshots the extractable option', async () => {
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

    assert.strictEqual(reads, 1)
    assert.strictEqual((key as CryptoKey).extractable, false)
  }
})

test('a crv option conflicting with the algorithm is rejected', async () => {
  for (const [alg, crv, expected] of [
    ['EdDSA', 'Ed448', 'Ed25519'],
    ['Ed25519', 'Ed448', 'Ed25519'],
    ['ES256', 'P-521', 'P-256'],
    ['ES384', 'P-256', 'P-384'],
    ['ES512', 'P-256', 'P-521'],
  ] as const) {
    await assert.rejects(
      generateKeyPair(alg, { crv }),
      errorLike({
        code: 'ERR_JOSE_NOT_SUPPORTED',
        message: `Invalid or unsupported crv option provided, the only supported value for ${alg} is ${expected}`,
      }),
    )
  }
})

test('a crv option matching the algorithm is accepted', async () => {
  for (const [alg, crv] of [
    ['EdDSA', 'Ed25519'],
    ['Ed25519', 'Ed25519'],
    ['ES256', 'P-256'],
    ['ES384', 'P-384'],
    ['ES512', 'P-521'],
  ] as const) {
    const { publicKey } = await generateKeyPair(alg, { crv, extractable: true })
    assert.strictEqual((await exportJWK(publicKey)).crv, crv)
  }
})

test('the crv option remains optional', async () => {
  for (const [alg, expected] of [
    ['EdDSA', 'Ed25519'],
    ['ES256', 'P-256'],
    ['ES512', 'P-521'],
  ] as const) {
    const { publicKey } = await generateKeyPair(alg, { extractable: true })
    assert.strictEqual((await exportJWK(publicKey)).crv, expected)
  }
})

test('ECDH-ES still resolves the crv option itself', async () => {
  const { publicKey } = await generateKeyPair('ECDH-ES', { crv: 'P-384', extractable: true })
  assert.strictEqual((await exportJWK(publicKey)).crv, 'P-384')

  await assert.rejects(
    generateKeyPair('ECDH-ES', { crv: 'Ed25519' }),
    errorLike({
      code: 'ERR_JOSE_NOT_SUPPORTED',
      message:
        'Invalid or unsupported crv option provided, supported values are P-256, P-384, P-521, and X25519',
    }),
  )
})

test('algorithms without a curve ignore the crv option', async () => {
  // RSA and ML-DSA have no curve, so nothing is being substituted and the option stays inert.
  await assert.doesNotReject(generateKeyPair('RS256', { crv: 'P-256' } as any))
})
