import assert from 'node:assert/strict'
import test, { before } from 'node:test'
import { captureRejection, errorLike } from '../_errors.js'

import {
  importJWK,
  EmbeddedJWK,
  FlattenedSign,
  flattenedVerify,
  exportJWK,
  generateKeyPair,
  type JWK,
  type FlattenedJWS,
} from '../../src/index.js'

const mlDsaTest = SubtleCrypto.supports?.('generateKey', 'ML-DSA-65') === true ? test : test.skip

function pubjwk(jwk: JWK) {
  const { d, p, q, dp, dq, qi, ext, alg, ...publicJwk } = jwk
  return publicJwk
}

const key: JWK = {
  crv: 'P-256',
  alg: 'ES256',
  ext: false,
  x: 'Sp3KpzPjwcCF04_W2GvSSf-vGDvp3Iv2kQYqAjnMB-Y',
  y: 'lZmecT2quXe0i9f7b4qHvDAFDpxs0oxCoJx4tOOqsks',
  d: 'hRVo5TGE_d_4tQC1KEQIlCdo9rteZmLSmaMPpFOjeDI',
  kty: 'EC',
}
let token: FlattenedJWS
let tokenMissingJwk: FlattenedJWS
let tokenInvalidJWK: FlattenedJWS
let tokenPrivateJWK: FlattenedJWS

before(async () => {
  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())
  const privateKey = await importJWK(key)
  token = await new FlattenedSign(encode('It’s a dangerous business, Frodo, going out your door.'))
    .setProtectedHeader({ alg: 'ES256', jwk: pubjwk(key) })
    .sign(privateKey)
  tokenMissingJwk = await new FlattenedSign(
    encode('It’s a dangerous business, Frodo, going out your door.'),
  )
    .setProtectedHeader({ alg: 'ES256' })
    .sign(privateKey)
  tokenInvalidJWK = await new FlattenedSign(
    encode('It’s a dangerous business, Frodo, going out your door.'),
  )
    .setProtectedHeader({ alg: 'ES256', jwk: null })
    .sign(privateKey)
  tokenPrivateJWK = await new FlattenedSign(
    encode('It’s a dangerous business, Frodo, going out your door.'),
  )
    .setProtectedHeader({ alg: 'ES256', jwk: key })
    .sign(privateKey)
})

test('EmbeddedJWK', async () => {
  await assert.doesNotReject(async () => {
    const { key: resolvedKey } = await flattenedVerify(token, EmbeddedJWK)
    assert.ok(resolvedKey)
    assert.strictEqual(resolvedKey.type, 'public')
  })
})

test('EmbeddedJWK requires "jwk" to be an object', async () => {
  await assert.rejects(
    flattenedVerify(tokenMissingJwk, EmbeddedJWK),
    errorLike({
      code: 'ERR_JWS_INVALID',
      message: '"jwk" (JSON Web Key) Header Parameter must be a JSON object',
    }),
  )
  await assert.rejects(
    flattenedVerify(tokenInvalidJWK, EmbeddedJWK),
    errorLike({
      code: 'ERR_JWS_INVALID',
      message: '"jwk" (JSON Web Key) Header Parameter must be a JSON object',
    }),
  )
})

test('EmbeddedJWK requires "jwk" to be a public one', async () => {
  await assert.rejects(
    flattenedVerify(tokenPrivateJWK, EmbeddedJWK),
    errorLike({
      code: 'ERR_JWS_INVALID',
      message: '"jwk" (JSON Web Key) Header Parameter must be a public key',
    }),
  )
})

test('EmbeddedJWK rejects a key intended for encryption', async () => {
  const jwk = { ...pubjwk(key), use: 'enc' }

  await assert.rejects(
    EmbeddedJWK({ alg: 'ES256', jwk }),
    errorLike({
      code: 'ERR_JWS_INVALID',
    }),
  )
})

test('EmbeddedJWK rejects a key intended for another algorithm', async () => {
  const jwk = { ...pubjwk(key), alg: 'ECDH-ES' }

  await assert.rejects(
    EmbeddedJWK({ alg: 'ES256', jwk }),
    errorLike({
      code: 'ERR_JWS_INVALID',
    }),
  )
})

test('EmbeddedJWK snapshots JWK operation metadata', async () => {
  for (const [parameter, first, second] of [
    ['use', 'sig', 'enc'],
    ['alg', 'ES256', 'ECDH-ES'],
  ] as const) {
    let reads = 0
    const jwk = pubjwk(key)
    Object.defineProperty(jwk, parameter, {
      enumerable: true,
      get() {
        return reads++ === 0 ? first : second
      },
    })

    await assert.doesNotReject(EmbeddedJWK({ alg: 'ES256', jwk }))
    assert.strictEqual(reads, 1)
  }
})

test('EmbeddedJWK translates malformed JWK metadata', async () => {
  await assert.rejects(
    EmbeddedJWK({ alg: 'ES256', jwk: { ...pubjwk(key), ext: 'false' as never } }),
    errorLike({
      code: 'ERR_JWS_INVALID',
      message: 'Invalid Embedded JWK',
    }),
  )
})

test('EmbeddedJWK requires "alg" to be a string', async () => {
  const jwk = pubjwk(key)
  // A non-string that stringifies to a registered identifier must not resolve one.
  for (const alg of [['ES256'], { toString: () => 'ES256' }, undefined]) {
    await assert.rejects(
      EmbeddedJWK({ alg, jwk } as any),
      errorLike({
        code: 'ERR_JOSE_NOT_SUPPORTED',
      }),
    )
  }
})

mlDsaTest('EmbeddedJWK validates AKP metadata before WebCrypto key data', async () => {
  const { publicKey } = await generateKeyPair('ML-DSA-65', { extractable: true })
  const { alg, ...jwk } = await exportJWK(publicKey)

  const incomplete = await captureRejection(EmbeddedJWK({ alg: 'ML-DSA-65', jwk }))
  assert.strictEqual(incomplete instanceof DOMException, true)
  assert.strictEqual(incomplete.name, 'DataError')

  await assert.rejects(
    EmbeddedJWK({ alg: 'ML-DSA-44', jwk: { ...jwk, alg } }),
    errorLike({
      code: 'ERR_JWS_INVALID',
    }),
  )
})
