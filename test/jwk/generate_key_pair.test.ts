import test from 'ava'

import { exportJWK, generateKeyPair } from '../../src/index.js'

test('alg must be a string', async (t) => {
  await t.throwsAsync(generateKeyPair(['ES256'] as any), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
    message: 'Invalid or unsupported JWK "alg" (Algorithm) Parameter value',
  })
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
