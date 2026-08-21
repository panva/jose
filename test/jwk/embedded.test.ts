import test from 'ava'

import {
  importJWK,
  EmbeddedJWK,
  FlattenedSign,
  flattenedVerify,
  exportJWK,
  generateKeyPair,
} from '../../src/index.js'

const mlDsaTest = SubtleCrypto.supports?.('generateKey', 'ML-DSA-65') === true ? test : test.skip

function pubjwk(jwk) {
  const { d, p, q, dp, dq, qi, ext, alg, ...publicJwk } = jwk
  return publicJwk
}

test.before(async (t) => {
  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())
  t.context.key = {
    crv: 'P-256',
    alg: 'ES256',
    ext: false,
    x: 'Sp3KpzPjwcCF04_W2GvSSf-vGDvp3Iv2kQYqAjnMB-Y',
    y: 'lZmecT2quXe0i9f7b4qHvDAFDpxs0oxCoJx4tOOqsks',
    d: 'hRVo5TGE_d_4tQC1KEQIlCdo9rteZmLSmaMPpFOjeDI',
    kty: 'EC',
  }

  const privateKey = await importJWK(t.context.key)
  t.context.token = await new FlattenedSign(
    encode('It’s a dangerous business, Frodo, going out your door.'),
  )
    .setProtectedHeader({ alg: 'ES256', jwk: pubjwk(t.context.key) })
    .sign(privateKey)
  t.context.tokenMissingJwk = await new FlattenedSign(
    encode('It’s a dangerous business, Frodo, going out your door.'),
  )
    .setProtectedHeader({ alg: 'ES256' })
    .sign(privateKey)
  t.context.tokenInvalidJWK = await new FlattenedSign(
    encode('It’s a dangerous business, Frodo, going out your door.'),
  )
    .setProtectedHeader({ alg: 'ES256', jwk: null })
    .sign(privateKey)
  t.context.tokenPrivateJWK = await new FlattenedSign(
    encode('It’s a dangerous business, Frodo, going out your door.'),
  )
    .setProtectedHeader({ alg: 'ES256', jwk: t.context.key })
    .sign(privateKey)
})

test('EmbeddedJWK', async (t) => {
  await t.notThrowsAsync(async () => {
    const { key: resolvedKey } = await flattenedVerify(t.context.token, EmbeddedJWK)
    t.truthy(resolvedKey)
    t.is(resolvedKey.type, 'public')
  })
})

test('EmbeddedJWK requires "jwk" to be an object', async (t) => {
  await t.throwsAsync(flattenedVerify(t.context.tokenMissingJwk, EmbeddedJWK), {
    code: 'ERR_JWS_INVALID',
    message: '"jwk" (JSON Web Key) Header Parameter must be a JSON object',
  })
  await t.throwsAsync(flattenedVerify(t.context.tokenInvalidJWK, EmbeddedJWK), {
    code: 'ERR_JWS_INVALID',
    message: '"jwk" (JSON Web Key) Header Parameter must be a JSON object',
  })
})

test('EmbeddedJWK requires "jwk" to be a public one', async (t) => {
  await t.throwsAsync(flattenedVerify(t.context.tokenPrivateJWK, EmbeddedJWK), {
    code: 'ERR_JWS_INVALID',
    message: '"jwk" (JSON Web Key) Header Parameter must be a public key',
  })
})

test('EmbeddedJWK rejects a key intended for encryption', async (t) => {
  const jwk = { ...pubjwk(t.context.key), use: 'enc' }

  await t.throwsAsync(EmbeddedJWK({ alg: 'ES256', jwk }), {
    code: 'ERR_JWS_INVALID',
  })
})

test('EmbeddedJWK rejects a key intended for another algorithm', async (t) => {
  const jwk = { ...pubjwk(t.context.key), alg: 'ECDH-ES' }

  await t.throwsAsync(EmbeddedJWK({ alg: 'ES256', jwk }), {
    code: 'ERR_JWS_INVALID',
  })
})

test('EmbeddedJWK snapshots JWK operation metadata', async (t) => {
  for (const [parameter, first, second] of [
    ['use', 'sig', 'enc'],
    ['alg', 'ES256', 'ECDH-ES'],
  ] as const) {
    let reads = 0
    const jwk = pubjwk(t.context.key)
    Object.defineProperty(jwk, parameter, {
      enumerable: true,
      get() {
        return reads++ === 0 ? first : second
      },
    })

    await t.notThrowsAsync(EmbeddedJWK({ alg: 'ES256', jwk }))
    t.is(reads, 1)
  }
})

test('EmbeddedJWK translates malformed JWK metadata', async (t) => {
  await t.throwsAsync(
    EmbeddedJWK({ alg: 'ES256', jwk: { ...pubjwk(t.context.key), ext: 'false' as never } }),
    {
      code: 'ERR_JWS_INVALID',
      message: 'Invalid Embedded JWK',
    },
  )
})

test('EmbeddedJWK requires "alg" to be a string', async (t) => {
  const jwk = pubjwk(t.context.key)
  // A non-string that stringifies to a registered identifier must not resolve one.
  for (const alg of [['ES256'], { toString: () => 'ES256' }, undefined]) {
    await t.throwsAsync(EmbeddedJWK({ alg, jwk } as any), {
      code: 'ERR_JOSE_NOT_SUPPORTED',
    })
  }
})

mlDsaTest('EmbeddedJWK validates AKP metadata before WebCrypto key data', async (t) => {
  const { publicKey } = await generateKeyPair('ML-DSA-65', { extractable: true })
  const { alg, ...jwk } = await exportJWK(publicKey)

  const incomplete = await t.throwsAsync(EmbeddedJWK({ alg: 'ML-DSA-65', jwk }))
  t.true(incomplete instanceof DOMException)
  t.is(incomplete.name, 'DataError')

  await t.throwsAsync(EmbeddedJWK({ alg: 'ML-DSA-44', jwk: { ...jwk, alg } }), {
    code: 'ERR_JWS_INVALID',
  })
})
