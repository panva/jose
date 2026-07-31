import test from 'ava'
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

// https://www.ietf.org/archive/id/draft-ietf-jose-pq-composite-sigs-04.html#appendix-A.1
const vectors = JSON.parse(
  readFileSync(new URL('../fixtures/composite-draft-04.json', import.meta.url), 'utf8'),
) as { jwk: JWK; jws: string; raw_message_representative: string }[]

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

function replaceSignature(jws: string, signature: Uint8Array) {
  return `${jws.slice(0, jws.lastIndexOf('.') + 1)}${Buffer.from(signature).toString('base64url')}`
}

function mldsaSignatureLength(alg: string) {
  return alg.startsWith('ML-DSA-44-') ? 2420 : alg.startsWith('ML-DSA-65-') ? 3309 : 4627
}

for (const { jwk, jws, raw_message_representative } of vectors) {
  const alg = jwk.alg!
  const { priv, kid, ...publicJwk } = jwk
  const signatureLength = mldsaSignatureLength(alg)

  testComposite(`draft-04 Appendix A.1 (${alg})`, async (t) => {
    const publicKey = await importJWK(publicJwk)
    const privateKey = await importJWK({ ...jwk, ext: true })
    const { payload, protectedHeader } = await compactVerify(jws, publicKey)

    t.is(decoder.decode(payload), "It's a dangerous business, Frodo, going out your door.")
    t.deepEqual(await exportJWK(publicKey), publicJwk)
    t.deepEqual(await exportJWK(privateKey), { ...publicJwk, priv })
    await t.notThrowsAsync(compactVerify(jws, createLocalJWKSet({ keys: [{ ...publicJwk, kid }] })))

    const signed = await new CompactSign(payload)
      .setProtectedHeader(protectedHeader)
      .sign(privateKey)
    await t.notThrowsAsync(compactVerify(signed, publicKey))

    // OpenSSL independently checks the DER signature produced from the imported ECPrivateKey.
    if (alg.includes('-ES')) {
      const ecPrivateKey = createPrivateKey({
        key: Buffer.from(priv!, 'base64url').subarray(32),
        format: 'der',
        type: 'sec1',
      })
      const ecPublicKey = createPublicKey(ecPrivateKey)
      const point = Buffer.from(publicJwk.pub!, 'base64url')
      const coordinateLength = alg.endsWith('ES256') ? 32 : 48
      const nativeJwk = ecPublicKey.export({ format: 'jwk' })
      t.is(point[point.length - coordinateLength * 2 - 1], 0x04)
      t.is(
        point.subarray(-coordinateLength * 2, -coordinateLength).toString('base64url'),
        nativeJwk.x!,
      )
      t.is(point.subarray(-coordinateLength).toString('base64url'), nativeJwk.y!)

      const message = Buffer.from(raw_message_representative, 'hex')
      const hash = alg.endsWith('ES256') ? 'sha256' : 'sha384'
      const signature = Buffer.from(signed.split('.')[2], 'base64url')
      t.true(verify(hash, message, ecPublicKey, signature.subarray(signatureLength)))

      // Keep the published ML-DSA signature and replace its ECDSA component with OpenSSL's output.
      const mldsaSignature = Buffer.from(jws.split('.')[2], 'base64url').subarray(
        0,
        signatureLength,
      )
      const nativeSignature = sign(hash, message, ecPrivateKey)
      await t.notThrowsAsync(
        compactVerify(
          replaceSignature(jws, Buffer.concat([mldsaSignature, nativeSignature])),
          publicKey,
        ),
      )
      const rawSignature = sign(hash, message, { key: ecPrivateKey, dsaEncoding: 'ieee-p1363' })
      await t.throwsAsync(
        compactVerify(
          replaceSignature(jws, Buffer.concat([mldsaSignature, rawSignature])),
          publicKey,
        ),
        { code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' },
      )
    }
  })

  testComposite(`both composite components must verify (${alg})`, async (t) => {
    const publicKey = await importJWK(publicJwk)
    const signature = Buffer.from(jws.split('.')[2], 'base64url')
    for (const offset of [0, signature.length - 1]) {
      const tampered = Buffer.from(signature)
      tampered[offset] ^= 1
      await t.throwsAsync(compactVerify(replaceSignature(jws, tampered), publicKey), {
        code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
      })
    }
    for (const truncated of [signature.subarray(0, signatureLength), signature.subarray(0, -1)]) {
      await t.throwsAsync(compactVerify(replaceSignature(jws, truncated), publicKey), {
        code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
      })
    }
    await t.throwsAsync(
      compactVerify(replaceSignature(jws, Buffer.concat([signature, Buffer.of(0)])), publicKey),
      { code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' },
    )
  })

  testComposite(`invalid composite key lengths (${alg})`, async (t) => {
    for (const parameter of ['pub', 'priv'] as const) {
      const bytes = Buffer.from(jwk[parameter]!, 'base64url')
      for (const invalid of [bytes.subarray(0, -1), Buffer.concat([bytes, Buffer.of(0)])]) {
        await t.throwsAsync(importJWK({ ...jwk, [parameter]: invalid.toString('base64url') }), {
          instanceOf: TypeError,
        })
      }
    }
  })

  if (!alg.includes('-ES')) continue

  testComposite(`invalid composite EC key encodings (${alg})`, async (t) => {
    const publicBytes = Buffer.from(jwk.pub!, 'base64url')
    const privateBytes = Buffer.from(priv!, 'base64url')
    const coordinateLength = alg.endsWith('ES256') ? 32 : 48
    const pointOffset = publicBytes.length - coordinateLength * 2 - 1
    for (const prefix of [0, 2, 3]) {
      const invalid = Buffer.from(publicBytes)
      invalid[pointOffset] = prefix
      await t.throwsAsync(importJWK({ ...publicJwk, pub: invalid.toString('base64url') }), {
        instanceOf: TypeError,
      })
    }

    // The former coordinate concatenation and private scalar encodings are no longer valid.
    const coordinates = Buffer.concat([
      publicBytes.subarray(0, pointOffset),
      publicBytes.subarray(pointOffset + 1),
    ])
    await t.throwsAsync(importJWK({ ...publicJwk, pub: coordinates.toString('base64url') }), {
      instanceOf: TypeError,
    })
    const rawPrivateKey = Buffer.concat([
      privateBytes.subarray(0, 32),
      privateBytes.subarray(39, 39 + coordinateLength),
    ])
    await t.throwsAsync(importJWK({ ...jwk, priv: rawPrivateKey.toString('base64url') }), {
      instanceOf: TypeError,
    })

    const invalid = Buffer.from(privateBytes)
    invalid[invalid.length - 1] ^= 1 // Wrong curve OID.
    await t.throwsAsync(importJWK({ ...jwk, priv: invalid.toString('base64url') }), {
      instanceOf: TypeError,
    })
  })

  testComposite(`noncanonical composite ECDSA signatures (${alg})`, async (t) => {
    const publicKey = await importJWK(publicJwk)
    const signature = Buffer.from(jws.split('.')[2], 'base64url')
    const mldsaSignature = signature.subarray(0, signatureLength)
    const der = signature.subarray(signatureLength)
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
      await t.throwsAsync(
        compactVerify(replaceSignature(jws, Buffer.concat([mldsaSignature, invalid])), publicKey),
        { code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' },
      )
    }
  })
}

// Valid ECDSA signatures over the Appendix A.1 representatives using d = 1 and the
// indicated nonces. OpenSSL verifies these independently, including short r or s integers.
for (const [alg, signatures] of [
  [
    'ML-DSA-44-ES256',
    [
      // k = 269 (short s), k = 379 (short r)
      '3044022100f66c3919379549fe1fb9c96622161c45cace6fc81a5f18a467d31bb1eb678e17021f72cd4e3ff06df9cffa14a49de50c53296eca6da637c9b28010197fea37f906',
      '3043021f5543894af3d00ed7d740abdbd75c96b06877b787db5f70eea78b90a8d7c00a0220494b57a7ac6b676756a20a3cf59fb3cf16dfd31045ba89994f9d48a7b7f01ada',
    ],
  ],
  [
    'ML-DSA-87-ES384',
    [
      // k = 197 (short r), k = 309 (short s)
      '3063022f4d104b26ee5671f72c10c986841d3e65d285e2516161b7baa341b12631b9e32b6f0d5896d8431c51d5d93a37cbc90e02303b318e4800e7e974f36a0b9aa512e8a02759c70d21a4492676740d452149d68b60d8fa5df3709e8d7d385b581eea7e70',
      '306402310081b1c4445124c8f35c221c5deba923be41bde0aa6a5bd51a36f562f302fc8c5956b3e051f3813de5470d3a9087bf3b9d022f0c0945e8b0329ea7f0ba6312940ba1571b58422f362f02811630652916f27a457b13e82b9b684d86d50d57c8bf5b61',
    ],
  ],
] as const) {
  testComposite(`short composite ECDSA integers (${alg})`, async (t) => {
    const { jwk, jws, raw_message_representative } = vectors.find(({ jwk }) => jwk.alg === alg)!
    const { priv, ...publicJwk } = jwk
    const publicKey = await importJWK(publicJwk)
    const ecPrivateKey = createPrivateKey({
      key: Buffer.from(priv!, 'base64url').subarray(32),
      format: 'der',
      type: 'sec1',
    })
    const message = Buffer.from(raw_message_representative, 'hex')
    const hash = alg.endsWith('ES256') ? 'sha256' : 'sha384'
    const mldsaSignature = Buffer.from(jws.split('.')[2], 'base64url').subarray(
      0,
      mldsaSignatureLength(alg),
    )
    for (const signature of signatures) {
      const der = Buffer.from(signature, 'hex')
      t.true(verify(hash, message, ecPrivateKey, der))
      await t.notThrowsAsync(
        compactVerify(replaceSignature(jws, Buffer.concat([mldsaSignature, der])), publicKey),
      )
    }
  })
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

testComposite('composite key generation snapshots the extractable option', async (t) => {
  let reads = 0
  const { privateKey, publicKey } = await generateKeyPair(vectors[0].jwk.alg!, {
    get extractable() {
      return reads++ === 0 ? false : true
    },
  })

  t.is(reads, 1)
  t.false(privateKey.extractable)
  t.true(publicKey.extractable)
})

test('composite key generation extractable must be a boolean', async (t) => {
  await t.throwsAsync(generateKeyPair(vectors[0].jwk.alg!, { extractable: 'false' as never }), {
    instanceOf: TypeError,
    message: '"extractable" option must be a boolean',
  })
})

testComposite('composite JWK imports snapshot and honor the extractable option', async (t) => {
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

      t.is(reads, 1)
      t.is(imported.extractable, extractable)
    }
  }
})

test('composite JWK imports validate metadata', async (t) => {
  const jwk = vectors[0].jwk
  for (const metadata of [
    { ext: 'false' },
    { key_ops: 'sign' },
    { key_ops: ['sign', 1] },
    { key_ops: ['sign', 'sign'] },
  ]) {
    await t.throwsAsync(importJWK({ ...jwk, ...metadata } as JWK), { instanceOf: TypeError })
  }
  await t.throwsAsync(importJWK(jwk, undefined, { extractable: 'false' as never }), {
    instanceOf: TypeError,
    message: '"extractable" option must be a boolean',
  })
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
    message: 'Invalid or unsupported "alg" (Algorithm) value',
  })
})
