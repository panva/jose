import test from 'ava'
import { createMlKem1024, createMlKem512, createMlKem768 } from 'mlkem'

import { FlattenedEncrypt, flattenedDecrypt, type JWK } from '../../src/index.js'
import { decodeProtectedHeader } from '../../src/util/decode_protected_header.js'
import { encode as b64u } from '../../src/util/base64url.js'

const plaintext = new TextEncoder().encode('pqc kem test payload')
const iv = new Uint8Array(12)
const cek = new Uint8Array(16)
const kemSeed = new Uint8Array(32)

for (let i = 0; i < iv.length; i++) iv[i] = i
for (let i = 0; i < cek.length; i++) cek[i] = i + 1
for (let i = 0; i < kemSeed.length; i++) kemSeed[i] = i + 2

async function keyPair(alg: 'ML-KEM-512' | 'ML-KEM-768' | 'ML-KEM-1024') {
  const seed = new Uint8Array(64)
  for (let i = 0; i < seed.length; i++) seed[i] = i

  const kem = await {
    'ML-KEM-512': createMlKem512,
    'ML-KEM-768': createMlKem768,
    'ML-KEM-1024': createMlKem1024,
  }[alg]()

  const [pub] = kem.deriveKeyPair(seed)
  const publicKey: JWK = { kty: 'AKP', alg, pub: b64u(pub) }
  const privateKey: JWK = { ...publicKey, priv: b64u(seed) }
  return { publicKey, privateKey }
}

test('ML-KEM direct key agreement', async (t) => {
  const { publicKey, privateKey } = await keyPair('ML-KEM-512')
  const jwe = await new FlattenedEncrypt(plaintext)
    .setProtectedHeader({ alg: 'ML-KEM-512', enc: 'A128GCM' })
    .setInitializationVector(iv)
    .setKeyManagementParameters({ kemSeed })
    .encrypt(publicKey)

  t.is(jwe.encrypted_key, undefined)
  t.is(typeof decodeProtectedHeader(jwe).kemct, 'string')

  const { plaintext: decrypted } = await flattenedDecrypt(jwe, privateKey, {
    keyManagementAlgorithms: ['ML-KEM-512'],
    contentEncryptionAlgorithms: ['A128GCM'],
  })
  t.deepEqual(decrypted, plaintext)
})

test('ML-KEM key agreement with key wrap', async (t) => {
  const { publicKey, privateKey } = await keyPair('ML-KEM-512')
  const jwe = await new FlattenedEncrypt(plaintext)
    .setProtectedHeader({ alg: 'ML-KEM-512+A128KW', enc: 'A128GCM' })
    .setContentEncryptionKey(cek)
    .setInitializationVector(iv)
    .setKeyManagementParameters({ kemSeed })
    .encrypt(publicKey)

  t.is(typeof jwe.encrypted_key, 'string')
  t.is(typeof decodeProtectedHeader(jwe).kemct, 'string')

  const { plaintext: decrypted } = await flattenedDecrypt(jwe, privateKey, {
    keyManagementAlgorithms: ['ML-KEM-512+A128KW'],
    contentEncryptionAlgorithms: ['A128GCM'],
  })
  t.deepEqual(decrypted, plaintext)
})

test('ML-KEM private JWK rejects 32-byte seed representation', async (t) => {
  const priv = new Uint8Array(32)
  for (let i = 0; i < priv.length; i++) priv[i] = i + 3

  const kem = await createMlKem512()
  const [pub] = kem.deriveKeyPair(new Uint8Array(64))
  const publicKey: JWK = { kty: 'AKP', alg: 'ML-KEM-512', pub: b64u(pub) }
  const privateKey: JWK = { ...publicKey, priv: b64u(priv) }

  const jwe = await new FlattenedEncrypt(plaintext)
    .setProtectedHeader({ alg: 'ML-KEM-512', enc: 'A128GCM' })
    .setInitializationVector(iv)
    .setKeyManagementParameters({ kemSeed })
    .encrypt(publicKey)

  await t.throwsAsync(
    flattenedDecrypt(jwe, privateKey, {
      keyManagementAlgorithms: ['ML-KEM-512'],
      contentEncryptionAlgorithms: ['A128GCM'],
    }),
    { message: 'ML-KEM private JWK "priv" must be 64 or expanded-key bytes' },
  )
})

test('ML-KEM algorithm levels', async (t) => {
  const vectors = [
    ['ML-KEM-768', 'A192GCM'],
    ['ML-KEM-1024', 'A256GCM'],
    ['ML-KEM-768+A192KW', 'A192GCM'],
    ['ML-KEM-1024+A256KW', 'A256GCM'],
  ] as const

  for (const [alg, enc] of vectors) {
    const keyAlg = alg.startsWith('ML-KEM-768') ? 'ML-KEM-768' : 'ML-KEM-1024'
    const { publicKey, privateKey } = await keyPair(keyAlg)
    let builder = new FlattenedEncrypt(plaintext)
      .setProtectedHeader({ alg, enc })
      .setInitializationVector(iv)
      .setKeyManagementParameters({ kemSeed })
    if (alg.includes('+')) {
      builder = builder.setContentEncryptionKey(new Uint8Array(enc === 'A192GCM' ? 24 : 32))
    }

    const jwe = await builder.encrypt(publicKey)
    const { plaintext: decrypted } = await flattenedDecrypt(jwe, privateKey, {
      keyManagementAlgorithms: [alg],
      contentEncryptionAlgorithms: [enc],
    })
    t.deepEqual(decrypted, plaintext)
  }
})
