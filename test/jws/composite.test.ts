import assert from 'node:assert/strict'
import test from 'node:test'
import { errorLike } from '../_errors.js'
import { createPrivateKey, createPublicKey, sign, verify } from 'node:crypto'
import { readFileSync } from 'node:fs'

import {
  CompactSign,
  SignJWT,
  compactVerify,
  createLocalJWKSet,
  exportJWK,
  generateKeyPair,
  importJWK,
  jwtVerify,
  type JWK,
} from '../../src/index.js'

// https://www.ietf.org/archive/id/draft-ietf-jose-pq-composite-sigs-06.html#appendix-A.1
const vectors = JSON.parse(
  readFileSync(new URL('../fixtures/composite-draft-06.json', import.meta.url), 'utf8'),
) as { jwk: JWK; jws: string; raw_message_representative: string }[]

const algorithms = ['ML-DSA-44-ES256', 'ML-DSA-44-Ed25519']
const mldsaSignatureLength = 2420

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

function replaceSignature(jws: string, signature: Uint8Array) {
  return `${jws.slice(0, jws.lastIndexOf('.') + 1)}${Buffer.from(signature).toString('base64url')}`
}

for (const { jwk, jws, raw_message_representative } of vectors) {
  const alg = jwk.alg!
  const { priv, kid, ...publicJwk } = jwk

  testComposite(`draft-06 Appendix A.1 (${alg})`, async () => {
    const publicKey = await importJWK(publicJwk)
    const privateKey = await importJWK({ ...jwk, ext: true })
    const { payload, protectedHeader } = await compactVerify(jws, publicKey)

    assert.strictEqual(
      decoder.decode(payload),
      "It's a dangerous business, Frodo, going out your door.",
    )
    assert.deepStrictEqual(await exportJWK(publicKey), publicJwk)
    assert.deepStrictEqual(await exportJWK(privateKey), { ...publicJwk, priv })
    await assert.doesNotReject(
      compactVerify(jws, createLocalJWKSet({ keys: [{ ...publicJwk, kid }] })),
    )

    const signed = await new CompactSign(payload)
      .setProtectedHeader(protectedHeader)
      .sign(privateKey)
    await assert.doesNotReject(compactVerify(signed, publicKey))

    // OpenSSL independently checks the DER signature produced from the imported ECPrivateKey.
    if (alg.includes('-ES')) {
      const ecPrivateKey = createPrivateKey({
        key: Buffer.from(priv!, 'base64url').subarray(32),
        format: 'der',
        type: 'sec1',
      })
      const ecPublicKey = createPublicKey(ecPrivateKey)
      const point = Buffer.from(publicJwk.pub!, 'base64url')
      const coordinateLength = 32
      const nativeJwk = ecPublicKey.export({ format: 'jwk' })
      assert.strictEqual(point[point.length - coordinateLength * 2 - 1], 0x04)
      assert.strictEqual(
        point.subarray(-coordinateLength * 2, -coordinateLength).toString('base64url'),
        nativeJwk.x!,
      )
      assert.strictEqual(point.subarray(-coordinateLength).toString('base64url'), nativeJwk.y!)

      const messageRepresentative = Buffer.from(raw_message_representative, 'hex')
      const signature = Buffer.from(signed.split('.')[2], 'base64url')
      assert.strictEqual(
        verify(
          'sha256',
          messageRepresentative,
          ecPublicKey,
          signature.subarray(mldsaSignatureLength),
        ),
        true,
      )

      // Keep the published ML-DSA signature and replace its ECDSA component with OpenSSL's output.
      const mldsaSignature = Buffer.from(jws.split('.')[2], 'base64url').subarray(
        0,
        mldsaSignatureLength,
      )
      const nativeSignature = sign('sha256', messageRepresentative, ecPrivateKey)
      await assert.doesNotReject(
        compactVerify(
          replaceSignature(jws, Buffer.concat([mldsaSignature, nativeSignature])),
          publicKey,
        ),
      )
      const rawSignature = sign('sha256', messageRepresentative, {
        key: ecPrivateKey,
        dsaEncoding: 'ieee-p1363',
      })
      await assert.rejects(
        compactVerify(
          replaceSignature(jws, Buffer.concat([mldsaSignature, rawSignature])),
          publicKey,
        ),
        errorLike({ code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' }),
      )
    }
  })

  testComposite(`both composite components must verify (${alg})`, async () => {
    const publicKey = await importJWK(publicJwk)
    const signature = Buffer.from(jws.split('.')[2], 'base64url')
    for (const offset of [0, signature.length - 1]) {
      const tampered = Buffer.from(signature)
      tampered[offset] ^= 1
      await assert.rejects(
        compactVerify(replaceSignature(jws, tampered), publicKey),
        errorLike({
          code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
        }),
      )
    }
    for (const truncated of [
      signature.subarray(0, mldsaSignatureLength),
      signature.subarray(0, -1),
    ]) {
      await assert.rejects(
        compactVerify(replaceSignature(jws, truncated), publicKey),
        errorLike({
          code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
        }),
      )
    }
    await assert.rejects(
      compactVerify(replaceSignature(jws, Buffer.concat([signature, Buffer.of(0)])), publicKey),
      errorLike({ code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' }),
    )
  })

  testComposite(`invalid composite key lengths (${alg})`, async () => {
    for (const parameter of ['pub', 'priv'] as const) {
      const bytes = Buffer.from(jwk[parameter]!, 'base64url')
      for (const invalid of [bytes.subarray(0, -1), Buffer.concat([bytes, Buffer.of(0)])]) {
        await assert.rejects(
          importJWK({ ...jwk, [parameter]: invalid.toString('base64url') }),
          TypeError,
        )
      }
    }
  })

  if (!alg.includes('-ES')) continue

  testComposite(`invalid composite EC key encodings (${alg})`, async () => {
    const publicBytes = Buffer.from(jwk.pub!, 'base64url')
    const privateBytes = Buffer.from(priv!, 'base64url')
    const coordinateLength = 32
    const pointOffset = publicBytes.length - coordinateLength * 2 - 1
    for (const prefix of [0, 2, 3]) {
      const invalid = Buffer.from(publicBytes)
      invalid[pointOffset] = prefix
      await assert.rejects(
        importJWK({ ...publicJwk, pub: invalid.toString('base64url') }),
        TypeError,
      )
    }

    // The former coordinate concatenation and private scalar encodings are no longer valid.
    const coordinates = Buffer.concat([
      publicBytes.subarray(0, pointOffset),
      publicBytes.subarray(pointOffset + 1),
    ])
    await assert.rejects(
      importJWK({ ...publicJwk, pub: coordinates.toString('base64url') }),
      TypeError,
    )
    const rawPrivateKey = Buffer.concat([
      privateBytes.subarray(0, 32),
      privateBytes.subarray(39, 39 + coordinateLength),
    ])
    await assert.rejects(
      importJWK({ ...jwk, priv: rawPrivateKey.toString('base64url') }),
      TypeError,
    )

    // draft-06 requires rejecting the optional publicKey field, even in a valid ECPrivateKey.
    const point = publicBytes.subarray(pointOffset)
    const body = Buffer.concat([
      privateBytes.subarray(34),
      Buffer.of(0xa1, point.length + 3, 0x03, point.length + 1, 0),
      point,
    ])
    const withPublicKey = Buffer.concat([
      body.length < 128 ? Buffer.of(0x30, body.length) : Buffer.of(0x30, 0x81, body.length),
      body,
    ])
    assert.doesNotThrow(() => createPrivateKey({ key: withPublicKey, format: 'der', type: 'sec1' }))
    await assert.rejects(
      importJWK({
        ...jwk,
        priv: Buffer.concat([privateBytes.subarray(0, 32), withPublicKey]).toString('base64url'),
      }),
      TypeError,
    )

    const invalid = Buffer.from(privateBytes)
    invalid[invalid.length - 1] ^= 1 // Wrong curve OID.
    await assert.rejects(importJWK({ ...jwk, priv: invalid.toString('base64url') }), TypeError)
  })

  testComposite(`noncanonical composite ECDSA signatures (${alg})`, async () => {
    const publicKey = await importJWK(publicJwk)
    const signature = Buffer.from(jws.split('.')[2], 'base64url')
    const mldsaSignature = signature.subarray(0, mldsaSignatureLength)
    const der = signature.subarray(mldsaSignatureLength)
    const r = der.subarray(4, 4 + der[3])
    const s = der.subarray(6 + r.length)
    const sequence = (r: Uint8Array, s: Uint8Array) =>
      Buffer.concat([
        Buffer.of(0x30, 4 + r.length + s.length, 2, r.length),
        r,
        Buffer.of(2, s.length),
        s,
      ])

    const malformed = [
      sequence(Buffer.concat([Buffer.of(0), r]), s),
      sequence(r, Buffer.concat([Buffer.of(0), s])),
      sequence(Buffer.of(0), s),
      sequence(r, Buffer.of(0)),
      Buffer.concat([Buffer.of(0x30, 0x81, der[1]), der.subarray(2)]),
    ]
    for (const invalid of malformed) {
      await assert.rejects(
        compactVerify(replaceSignature(jws, Buffer.concat([mldsaSignature, invalid])), publicKey),
        errorLike({ code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' }),
      )
    }
  })
}

// Valid ECDSA signatures over the Appendix A.1 representatives using d = 1 and the
// indicated nonces. OpenSSL verifies these independently, including short r or s integers.
testComposite('short composite ECDSA integers', async () => {
  const { jwk, jws, raw_message_representative } = vectors.find(
    ({ jwk }) => jwk.alg === 'ML-DSA-44-ES256',
  )!
  const { priv, ...publicJwk } = jwk
  const publicKey = await importJWK(publicJwk)
  const ecPrivateKey = createPrivateKey({
    key: Buffer.from(priv!, 'base64url').subarray(32),
    format: 'der',
    type: 'sec1',
  })
  const messageRepresentative = Buffer.from(raw_message_representative, 'hex')
  const mldsaSignature = Buffer.from(jws.split('.')[2], 'base64url').subarray(
    0,
    mldsaSignatureLength,
  )
  for (const signature of [
    // k = 269 (short s), k = 379 (short r)
    '3044022100f66c3919379549fe1fb9c96622161c45cace6fc81a5f18a467d31bb1eb678e17021f72cd4e3ff06df9cffa14a49de50c53296eca6da637c9b28010197fea37f906',
    '3043021f5543894af3d00ed7d740abdbd75c96b06877b787db5f70eea78b90a8d7c00a0220494b57a7ac6b676756a20a3cf59fb3cf16dfd31045ba89994f9d48a7b7f01ada',
  ]) {
    const der = Buffer.from(signature, 'hex')
    assert.strictEqual(verify('sha256', messageRepresentative, ecPrivateKey, der), true)
    await assert.doesNotReject(
      compactVerify(replaceSignature(jws, Buffer.concat([mldsaSignature, der])), publicKey),
    )
  }
})

for (const alg of algorithms) {
  testComposite(`composite JWS roundtrip (${alg})`, async () => {
    const payload = encoder.encode(`payload for ${alg}`)
    const { privateKey, publicKey } = await generateKeyPair(alg, { extractable: true })
    const jws = await new CompactSign(payload).setProtectedHeader({ alg }).sign(privateKey)

    const { payload: verified } = await compactVerify(jws, publicKey, { algorithms: [alg] })
    assert.strictEqual(decoder.decode(verified), `payload for ${alg}`)

    await assert.rejects(
      compactVerify(tamper(jws), publicKey),
      errorLike({
        code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
      }),
    )

    const publicJwk = await exportJWK(publicKey)
    const privateJwk = await exportJWK(privateKey)
    assert.partialDeepStrictEqual(publicJwk, { kty: 'AKP', alg })
    assert.partialDeepStrictEqual(privateJwk, { kty: 'AKP', alg })
    assert.strictEqual('priv' in publicJwk, false)
    assert.strictEqual('priv' in privateJwk, true)
    for (const jwk of [publicJwk, privateJwk]) {
      assert.strictEqual('ext' in jwk, false)
      assert.strictEqual('key_ops' in jwk, false)
      assert.strictEqual('use' in jwk, false)
    }

    const importedPublic = await importJWK(publicJwk)
    const importedPrivate = await importJWK(privateJwk)
    const importedJws = await new CompactSign(payload)
      .setProtectedHeader({ alg })
      .sign(importedPrivate)

    await assert.doesNotReject(compactVerify(importedJws, importedPublic))
    await assert.doesNotReject(compactVerify(importedJws, publicKey))

    const jwks = createLocalJWKSet({ keys: [publicJwk] })
    await assert.doesNotReject(compactVerify(jws, jwks))
  })

  testComposite(`non-extractable composite JWS roundtrip (${alg})`, async () => {
    const payload = encoder.encode(`payload for ${alg}`)
    const { privateKey, publicKey } = await generateKeyPair(alg)
    assert.strictEqual(privateKey.extractable, false)
    assert.strictEqual(publicKey.extractable, true)
    await assert.rejects(
      exportJWK(privateKey),
      errorLike({
        message: 'non-extractable CryptoKey cannot be exported as a JWK',
      }),
    )

    const jws = await new CompactSign(payload).setProtectedHeader({ alg }).sign(privateKey)
    const { payload: verified } = await compactVerify(jws, publicKey)
    assert.deepStrictEqual(verified, payload)

    const publicJwk = await exportJWK(publicKey)
    assert.partialDeepStrictEqual(publicJwk, { kty: 'AKP', alg })
    assert.strictEqual('priv' in publicJwk, false)
    await assert.doesNotReject(compactVerify(jws, await importJWK(publicJwk)))
  })
}

testComposite('composite JWT roundtrip', async () => {
  const alg = 'ML-DSA-44-ES256'
  const { privateKey, publicKey } = await generateKeyPair(alg)
  const jwt = await new SignJWT({ sub: 'alice' }).setProtectedHeader({ alg }).sign(privateKey)
  const { payload } = await jwtVerify(jwt, publicKey, { algorithms: [alg] })

  assert.strictEqual(payload.sub, 'alice')
})

testComposite('composite key generation snapshots the extractable option', async () => {
  let reads = 0
  const { privateKey, publicKey } = await generateKeyPair(vectors[0].jwk.alg!, {
    get extractable() {
      return reads++ === 0 ? false : true
    },
  })

  assert.strictEqual(reads, 1)
  assert.strictEqual(privateKey.extractable, false)
  assert.strictEqual(publicKey.extractable, true)
})

test('composite key generation extractable must be a boolean', async () => {
  await assert.rejects(
    generateKeyPair(vectors[0].jwk.alg!, { extractable: 'false' as never }),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.strictEqual(error.message, '"extractable" option must be a boolean')
      return true
    },
  )
})

testComposite('composite JWK imports snapshot and honor the extractable option', async () => {
  const jwk = vectors[0].jwk
  const { priv, ...publicJwk } = jwk
  for (const key of [publicJwk, jwk]) {
    for (const extractable of [true, false]) {
      let reads = 0
      const imported = await importJWK({ ...key, ext: !extractable }, undefined, {
        get extractable() {
          return reads++ === 0 ? extractable : !extractable
        },
      })

      assert.strictEqual(reads, 1)
      assert.strictEqual(imported.extractable, extractable)
    }
  }
})

test('composite JWK imports validate metadata', async () => {
  const jwk = vectors[0].jwk
  for (const metadata of [
    { ext: 'false' },
    { key_ops: 'sign' },
    { key_ops: ['sign', 1] },
    { key_ops: ['sign', 'sign'] },
  ]) {
    await assert.rejects(importJWK({ ...jwk, ...metadata } as JWK), TypeError)
  }
  await assert.rejects(importJWK(jwk, undefined, { extractable: 'false' as never }), (error) => {
    assert.ok(error instanceof TypeError)
    assert.strictEqual(error.message, '"extractable" option must be a boolean')
    return true
  })
})

testComposite('non-extractable composite private keys do not expose key material', async () => {
  const alg = 'ML-DSA-44-ES256'
  const { privateKey } = await generateKeyPair(alg)

  assert.deepStrictEqual(Object.keys(privateKey), ['type', 'extractable', 'algorithm', 'usages'])
  assert.deepStrictEqual(Object.getOwnPropertyNames(privateKey), [
    'type',
    'extractable',
    'algorithm',
    'usages',
  ])
  assert.strictEqual('jwk' in privateKey, false)
  assert.strictEqual('components' in privateKey, false)
  assert.strictEqual(privateKey.extractable, false)
  await assert.rejects(
    exportJWK(privateKey),
    errorLike({
      message: 'non-extractable CryptoKey cannot be exported as a JWK',
    }),
  )
})

testComposite(
  'imported non-extractable composite private JWKs do not expose key material',
  async () => {
    const alg = 'ML-DSA-44-ES256'
    const generated = await generateKeyPair(alg, { extractable: true })
    const jwk = await exportJWK(generated.privateKey)
    const privateKey = await importJWK({ ...jwk, ext: false })

    assert.deepStrictEqual(Object.keys(privateKey), ['type', 'extractable', 'algorithm', 'usages'])
    assert.strictEqual('jwk' in privateKey, false)
    assert.strictEqual('components' in privateKey, false)
    await assert.rejects(
      exportJWK(privateKey),
      errorLike({
        message: 'non-extractable CryptoKey cannot be exported as a JWK',
      }),
    )

    const jws = await new CompactSign(encoder.encode('payload'))
      .setProtectedHeader({ alg })
      .sign(privateKey)
    await assert.doesNotReject(compactVerify(jws, generated.publicKey))
  },
)

testComposite('imported non-extractable composite public JWKs cannot be exported', async () => {
  const alg = 'ML-DSA-44-ES256'
  const generated = await generateKeyPair(alg, { extractable: true })
  const jwk = await exportJWK(generated.publicKey)
  const publicKey = await importJWK({ ...jwk, ext: false })

  assert.deepStrictEqual(Object.keys(publicKey), ['type', 'extractable', 'algorithm', 'usages'])
  assert.strictEqual('jwk' in publicKey, false)
  assert.strictEqual('components' in publicKey, false)
  await assert.rejects(
    exportJWK(publicKey),
    errorLike({
      message: 'non-extractable CryptoKey cannot be exported as a JWK',
    }),
  )

  const jws = await new CompactSign(encoder.encode('payload'))
    .setProtectedHeader({ alg })
    .sign(generated.privateKey)
  await assert.doesNotReject(compactVerify(jws, publicKey))
})

for (const alg of [
  'ML-DSA-65-ES256',
  'ML-DSA-65-ES384',
  'ML-DSA-87-ES384',
  'ML-DSA-65-Ed25519',
  'ML-DSA-87-Ed448',
]) {
  test(`unsupported composite signature algorithm (${alg})`, async () => {
    await assert.rejects(
      generateKeyPair(alg),
      errorLike({
        message: 'Invalid or unsupported "alg" (Algorithm) value',
      }),
    )
  })
}
