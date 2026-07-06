import test from 'ava'

import {
  CompactSign,
  SignJWT,
  compactVerify,
  createLocalJWKSet,
  exportJWK,
  generateKeyPair,
  importJWK,
  jwtVerify,
} from '../../src/index.js'

const algorithms = [
  'ML-DSA-44-ES256',
  'ML-DSA-65-ES256',
  'ML-DSA-87-ES384',
  'ML-DSA-44-Ed25519',
  'ML-DSA-65-Ed25519',
]

async function supportsCompositeRuntime() {
  try {
    const [mldsa, ecdsa, ed25519] = await Promise.all([
      crypto.subtle.generateKey({ name: 'ML-DSA-44' }, true, ['sign', 'verify']),
      crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']),
      crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify']),
    ])
    const data = new Uint8Array()
    const context = new Uint8Array()
    await Promise.all([
      crypto.subtle.sign({ name: 'ML-DSA-44', context }, mldsa.privateKey, data),
      crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, ecdsa.privateKey, data),
      crypto.subtle.sign({ name: 'Ed25519' }, ed25519.privateKey, data),
    ])
    return true
  } catch {
    return false
  }
}

const testComposite = (await supportsCompositeRuntime()) ? test : test.skip
const encoder = new TextEncoder()
const decoder = new TextDecoder()

function tamper(jws: string) {
  const parts = jws.split('.')
  const signature = parts[2]
  parts[2] = `${signature.startsWith('A') ? 'B' : 'A'}${signature.slice(1)}`
  return parts.join('.')
}

for (const alg of algorithms) {
  testComposite(`composite JWS roundtrip (${alg})`, async (t) => {
    const payload = encoder.encode(`payload for ${alg}`)
    const { privateKey, publicKey } = await generateKeyPair(alg, { extractable: true })
    const jws = await new CompactSign(payload).setProtectedHeader({ alg }).sign(privateKey)

    const { payload: verified } = await compactVerify(jws, publicKey, { algorithms: [alg] })
    t.is(decoder.decode(verified), `payload for ${alg}`)

    await t.throwsAsync(compactVerify(tamper(jws), publicKey), {
      code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
    })

    const publicJwk = await exportJWK(publicKey)
    const privateJwk = await exportJWK(privateKey)
    t.like(publicJwk, { kty: 'AKP', alg })
    t.like(privateJwk, { kty: 'AKP', alg })
    t.false('priv' in publicJwk)
    t.true('priv' in privateJwk)
    for (const jwk of [publicJwk, privateJwk]) {
      t.false('ext' in jwk)
      t.false('key_ops' in jwk)
      t.false('use' in jwk)
    }

    const importedPublic = await importJWK(publicJwk)
    const importedPrivate = await importJWK(privateJwk)
    const importedJws = await new CompactSign(payload)
      .setProtectedHeader({ alg })
      .sign(importedPrivate)

    await t.notThrowsAsync(compactVerify(importedJws, importedPublic))

    const jwks = createLocalJWKSet({ keys: [publicJwk] })
    await t.notThrowsAsync(compactVerify(jws, jwks))
  })
}

testComposite('composite JWT roundtrip', async (t) => {
  const alg = 'ML-DSA-44-ES256'
  const { privateKey, publicKey } = await generateKeyPair(alg)
  const jwt = await new SignJWT({ sub: 'alice' }).setProtectedHeader({ alg }).sign(privateKey)
  const { payload } = await jwtVerify(jwt, publicKey, { algorithms: [alg] })

  t.is(payload.sub, 'alice')
})

testComposite('non-extractable composite private keys do not expose key material', async (t) => {
  const alg = 'ML-DSA-44-ES256'
  const { privateKey } = await generateKeyPair(alg)

  t.deepEqual(Object.keys(privateKey), ['type', 'extractable', 'algorithm', 'usages'])
  t.deepEqual(Object.getOwnPropertyNames(privateKey), [
    'type',
    'extractable',
    'algorithm',
    'usages',
  ])
  t.false('jwk' in privateKey)
  t.false('components' in privateKey)
  t.false(privateKey.extractable)
  await t.throwsAsync(exportJWK(privateKey), {
    message: 'non-extractable CryptoKey cannot be exported as a JWK',
  })
})

testComposite(
  'imported non-extractable composite private JWKs do not expose key material',
  async (t) => {
    const alg = 'ML-DSA-44-ES256'
    const generated = await generateKeyPair(alg, { extractable: true })
    const jwk = await exportJWK(generated.privateKey)
    const privateKey = await importJWK({ ...jwk, ext: false })

    t.deepEqual(Object.keys(privateKey), ['type', 'extractable', 'algorithm', 'usages'])
    t.false('jwk' in privateKey)
    t.false('components' in privateKey)
    await t.throwsAsync(exportJWK(privateKey), {
      message: 'non-extractable CryptoKey cannot be exported as a JWK',
    })

    const jws = await new CompactSign(encoder.encode('payload'))
      .setProtectedHeader({ alg })
      .sign(privateKey)
    await t.notThrowsAsync(compactVerify(jws, generated.publicKey))
  },
)

testComposite('imported non-extractable composite public JWKs cannot be exported', async (t) => {
  const alg = 'ML-DSA-44-ES256'
  const generated = await generateKeyPair(alg, { extractable: true })
  const jwk = await exportJWK(generated.publicKey)
  const publicKey = await importJWK({ ...jwk, ext: false })

  t.deepEqual(Object.keys(publicKey), ['type', 'extractable', 'algorithm', 'usages'])
  t.false('jwk' in publicKey)
  t.false('components' in publicKey)
  await t.throwsAsync(exportJWK(publicKey), {
    message: 'non-extractable CryptoKey cannot be exported as a JWK',
  })

  const jws = await new CompactSign(encoder.encode('payload'))
    .setProtectedHeader({ alg })
    .sign(generated.privateKey)
  await t.notThrowsAsync(compactVerify(jws, publicKey))
})

test('Ed448 composite signature algorithm is not supported', async (t) => {
  await t.throwsAsync(generateKeyPair('ML-DSA-87-Ed448'), {
    message: 'Invalid or unsupported JWK "alg" (Algorithm) Parameter value',
  })
})
