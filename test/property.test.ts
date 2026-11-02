import assert from 'node:assert/strict'
import test from 'node:test'
import fc from 'fast-check'

import {
  base64url,
  CompactEncrypt,
  compactDecrypt,
  CompactSign,
  compactVerify,
  FlattenedEncrypt,
  flattenedDecrypt,
  SignJWT,
  jwtVerify,
} from '../src/index.js'

const key = new Uint8Array(32)
const payloads = fc.uint8Array({ maxLength: 4096 })
const nonEmptyPayloads = fc.uint8Array({ minLength: 1, maxLength: 4096 })
const boundaryPlaintexts = fc.oneof(
  fc
    .constantFrom(0, 1, 15, 16, 17, 31, 32, 33, 63, 64, 65, 255, 256, 257)
    .chain((length) => fc.uint8Array({ minLength: length, maxLength: length })),
  payloads,
)
const contentEncryptionAlgorithms = ['A256GCM', 'A128CBC-HS256'] as const
const options = { numRuns: 100 }

function tamper(encoded: string, position: number): string {
  const decoded = base64url.decode(encoded)
  const offset = position % decoded.length
  decoded[offset] ^= 1 << (position % 8)
  return base64url.encode(decoded)
}

test('HS256 compact JWS round trips preserve the payload', async () => {
  await fc.assert(
    fc.asyncProperty(payloads, async (payload) => {
      const jws = await new CompactSign(payload).setProtectedHeader({ alg: 'HS256' }).sign(key)
      const result = await compactVerify(jws, key)

      assert.deepStrictEqual(result.payload, payload)
      assert.deepStrictEqual(result.protectedHeader, { alg: 'HS256' })
    }),
    options,
  )
})

test('HS256 compact JWS rejects tampered authenticated components', async () => {
  await fc.assert(
    fc.asyncProperty(nonEmptyPayloads, fc.nat(), async (payload, position) => {
      const jws = await new CompactSign(payload).setProtectedHeader({ alg: 'HS256' }).sign(key)
      const members = jws.split('.')

      for (const member of [0, 1, 2]) {
        const tampered = members.slice()
        tampered[member] = tamper(tampered[member], position)

        await assert.rejects(compactVerify(tampered.join('.'), key), Error)
      }
    }),
    options,
  )
})

for (const enc of contentEncryptionAlgorithms) {
  test(`dir/${enc} compact JWE round trips preserve boundary-biased plaintexts`, async () => {
    await fc.assert(
      fc.asyncProperty(boundaryPlaintexts, async (plaintext) => {
        const jwe = await new CompactEncrypt(plaintext)
          .setProtectedHeader({ alg: 'dir', enc })
          .encrypt(key)
        const result = await compactDecrypt(jwe, key)

        assert.deepStrictEqual(result.plaintext, plaintext)
        assert.deepStrictEqual(result.protectedHeader, { alg: 'dir', enc })
      }),
      options,
    )
  })

  test(`dir/${enc} compact JWE rejects tampered authenticated components`, async () => {
    await fc.assert(
      fc.asyncProperty(nonEmptyPayloads, fc.nat(), async (plaintext, position) => {
        const jwe = await new CompactEncrypt(plaintext)
          .setProtectedHeader({ alg: 'dir', enc })
          .encrypt(key)
        const members = jwe.split('.')

        for (const member of [0, 2, 3, 4]) {
          const tampered = members.slice()
          tampered[member] = tamper(tampered[member], position)

          await assert.rejects(compactDecrypt(tampered.join('.'), key), Error)
        }
      }),
      options,
    )
  })

  test(`dir/${enc} flattened JWE round trips arbitrary additional authenticated data`, async () => {
    await fc.assert(
      fc.asyncProperty(boundaryPlaintexts, payloads, async (plaintext, aad) => {
        const jwe = await new FlattenedEncrypt(plaintext)
          .setProtectedHeader({ alg: 'dir', enc })
          .setAdditionalAuthenticatedData(aad)
          .encrypt(key)
        const result = await flattenedDecrypt(jwe, key)

        assert.deepStrictEqual(result.plaintext, plaintext)
        assert.deepStrictEqual(result.protectedHeader, { alg: 'dir', enc })
        if (aad.length === 0) {
          assert.strictEqual(Object.hasOwn(jwe, 'aad'), false)
          assert.strictEqual(result.additionalAuthenticatedData, undefined)
        } else {
          assert.strictEqual(jwe.aad, base64url.encode(aad))
          assert.deepStrictEqual(result.additionalAuthenticatedData, aad)
        }
      }),
      options,
    )
  })

  test(`dir/${enc} flattened JWE rejects tampered additional authenticated data`, async () => {
    await fc.assert(
      fc.asyncProperty(payloads, nonEmptyPayloads, fc.nat(), async (plaintext, aad, position) => {
        const jwe = await new FlattenedEncrypt(plaintext)
          .setProtectedHeader({ alg: 'dir', enc })
          .setAdditionalAuthenticatedData(aad)
          .encrypt(key)

        await assert.rejects(
          flattenedDecrypt({ ...jwe, aad: tamper(jwe.aad!, position) }, key),
          Error,
        )

        const withoutAad = { ...jwe }
        delete withoutAad.aad
        await assert.rejects(flattenedDecrypt(withoutAad, key), Error)
      }),
      options,
    )
  })
}

const registeredClaims = new Set(['iss', 'sub', 'aud', 'exp', 'nbf', 'iat', 'jti'])
const jwtPayloads = fc.dictionary(
  fc.string({ unit: 'grapheme', maxLength: 32 }).filter((claim) => !registeredClaims.has(claim)),
  fc.jsonValue({ maxDepth: 4, stringUnit: 'grapheme' }),
  { maxKeys: 12, noNullPrototype: true },
)

test('HS256 JWT round trips preserve arbitrary structured JSON claims', async () => {
  await fc.assert(
    fc.asyncProperty(jwtPayloads, async (payload) => {
      const jwt = await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).sign(key)
      const result = await jwtVerify(jwt, key)
      const normalized = JSON.parse(JSON.stringify(payload))

      assert.deepStrictEqual(result.payload, normalized)
      assert.deepStrictEqual(result.protectedHeader, { alg: 'HS256' })
    }),
    options,
  )
})
