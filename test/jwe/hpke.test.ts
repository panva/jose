import test from 'ava'

import {
  CompactEncrypt,
  FlattenedEncrypt,
  GeneralEncrypt,
  base64url,
  compactDecrypt,
  flattenedDecrypt,
  generalDecrypt,
  EncryptJWT,
  jwtDecrypt,
  generateKeyPair,
  exportJWK,
  importJWK,
} from '../../src/index.js'

import type { FlattenedJWE, JWEHeaderParameters } from '../../src/index.js'

const encoder = new TextEncoder()
const decoder = new TextDecoder()
const plaintext = encoder.encode('Integrated HPKE JWE')
const aad = encoder.encode('additional authenticated data')

const algorithms = ['HPKE-9', 'HPKE-12', 'HPKE-13'] as const

const supported = new Map<string, boolean>()
const jwkSupported = new Map<string, boolean>()

async function isSupported(alg: string) {
  if (supported.has(alg)) {
    return supported.get(alg)!
  }

  try {
    await generateKeyPair(alg)
    await crypto.subtle.digest(
      { name: 'cSHAKE256', outputLength: 256 } as AlgorithmIdentifier,
      new Uint8Array(),
    )
    supported.set(alg, true)
  } catch {
    supported.set(alg, false)
  }

  return supported.get(alg)!
}

async function isJWKSupported(alg: string) {
  if (jwkSupported.has(alg)) {
    return jwkSupported.get(alg)!
  }

  try {
    const { publicKey, privateKey } = await generateKeyPair(alg, { extractable: true })
    await importJWK(await exportJWK(publicKey))
    await importJWK(await exportJWK(privateKey))
    jwkSupported.set(alg, true)
  } catch {
    jwkSupported.set(alg, false)
  }

  return jwkSupported.get(alg)!
}

async function firstSupported(...algs: string[]) {
  for (const alg of algs) {
    if (await isSupported(alg)) {
      return alg
    }
  }
  return undefined
}

function protectedHeader(jwe: FlattenedJWE): JWEHeaderParameters {
  return JSON.parse(decoder.decode(base64url.decode(jwe.protected!)))
}

function setProtectedHeader(jwe: FlattenedJWE, header: JWEHeaderParameters): FlattenedJWE {
  return { ...jwe, protected: base64url.encode(JSON.stringify(header)) }
}

function tamper(input: string): string {
  const bytes = base64url.decode(input)
  bytes[0]! ^= 0x01
  return base64url.encode(bytes)
}

test('Integrated HPKE flattened and compact roundtrip', async (t) => {
  for (const alg of algorithms) {
    if (!(await isSupported(alg))) {
      t.pass(`${alg} unsupported in this runtime`)
      continue
    }

    const { publicKey, privateKey } = await generateKeyPair(alg)

    const flattened = await new FlattenedEncrypt(plaintext)
      .setProtectedHeader({ alg })
      .setAdditionalAuthenticatedData(aad)
      .encrypt(publicKey)

    t.deepEqual(protectedHeader(flattened), { alg })
    t.truthy(flattened.encrypted_key)
    t.false('iv' in flattened)
    t.false('tag' in flattened)

    const flattenedResult = await flattenedDecrypt(flattened, privateKey, {
      keyManagementAlgorithms: [alg],
    })
    t.deepEqual(flattenedResult.plaintext, plaintext)
    t.deepEqual(flattenedResult.additionalAuthenticatedData, aad)

    const compact = await new CompactEncrypt(plaintext)
      .setProtectedHeader({ alg })
      .encrypt(publicKey)
    const [encodedHeader, encryptedKey, iv, ciphertext, tag] = compact.split('.')
    t.truthy(encodedHeader)
    t.truthy(encryptedKey)
    t.is(iv, '')
    t.truthy(ciphertext)
    t.is(tag, '')

    const compactResult = await compactDecrypt(compact, privateKey, {
      keyManagementAlgorithms: [alg],
    })
    t.deepEqual(compactResult.plaintext, plaintext)
    t.deepEqual(compactResult.protectedHeader, { alg })

    const jwt = await new EncryptJWT({ sub: alg }).setProtectedHeader({ alg }).encrypt(publicKey)
    t.deepEqual((await jwtDecrypt(jwt, privateKey)).payload, { sub: alg })
  }
})

test('Integrated HPKE general JWE single recipient', async (t) => {
  for (const alg of algorithms) {
    if (!(await isSupported(alg))) {
      t.pass(`${alg} unsupported in this runtime`)
      continue
    }

    const { publicKey, privateKey } = await generateKeyPair(alg)
    const jwe = await new GeneralEncrypt(plaintext)
      .setProtectedHeader({ alg })
      .addRecipient(publicKey)
      .encrypt()

    t.false('iv' in jwe)
    t.false('tag' in jwe)
    t.truthy(jwe.recipients[0].encrypted_key)

    const { plaintext: decrypted } = await generalDecrypt(jwe, privateKey, {
      keyManagementAlgorithms: [alg],
    })
    t.deepEqual(decrypted, plaintext)
  }
})

test('Integrated HPKE general JWE multi-recipient encryption rejection', async (t) => {
  const alg = await firstSupported(...algorithms)
  if (!alg) {
    t.pass('no integrated HPKE algorithm supported in this runtime')
    return
  }

  const { publicKey } = await generateKeyPair(alg)

  await t.throwsAsync(
    new GeneralEncrypt(plaintext)
      .setProtectedHeader({ alg })
      .addRecipient(publicKey)
      .addRecipient(publicKey)
      .encrypt(),
    {
      code: 'ERR_JWE_INVALID',
      message: `"${alg}" alg may only have a single recipient`,
    },
  )
})

test('Integrated HPKE general JWE multi-recipient decryption rejection', async (t) => {
  const alg = await firstSupported(...algorithms)
  if (!alg) {
    t.pass('no integrated HPKE algorithm supported in this runtime')
    return
  }

  const { publicKey, privateKey } = await generateKeyPair(alg)
  const flattened = await new FlattenedEncrypt(plaintext)
    .setProtectedHeader({ alg })
    .encrypt(publicKey)

  await t.throwsAsync(
    generalDecrypt(
      {
        ciphertext: flattened.ciphertext,
        protected: flattened.protected,
        recipients: [
          { encrypted_key: flattened.encrypted_key },
          { encrypted_key: tamper(flattened.encrypted_key!) },
        ],
      },
      privateKey,
      { keyManagementAlgorithms: [alg] },
    ),
    {
      code: 'ERR_JWE_INVALID',
      message: `"${alg}" alg may only have a single recipient`,
    },
  )
})

test('Integrated HPKE validation', async (t) => {
  const alg = await firstSupported(...algorithms)
  if (!alg) {
    t.pass('no integrated HPKE algorithm supported in this runtime')
    return
  }

  const { publicKey, privateKey } = await generateKeyPair(alg)
  const jwe = await new FlattenedEncrypt(plaintext).setProtectedHeader({ alg }).encrypt(publicKey)

  await t.throwsAsync(
    new FlattenedEncrypt(plaintext).setUnprotectedHeader({ alg }).encrypt(publicKey),
    {
      code: 'ERR_JWE_INVALID',
      message: 'JWE "alg" (Algorithm) Header Parameter MUST be in a protected header.',
    },
  )

  await t.throwsAsync(
    new FlattenedEncrypt(plaintext).setProtectedHeader({ alg, enc: 'A128GCM' }).encrypt(publicKey),
    {
      code: 'ERR_JWE_INVALID',
      message:
        'JWE "enc" (Encryption Algorithm) Header Parameter must not be present for integrated encryption',
    },
  )

  await t.throwsAsync(
    new FlattenedEncrypt(plaintext).setProtectedHeader({ alg, ek: '' }).encrypt(publicKey),
    {
      code: 'ERR_JWE_INVALID',
      message: 'JWE "ek" Header Parameter must not be present',
    },
  )

  await t.throwsAsync(
    new FlattenedEncrypt(plaintext).setProtectedHeader({ alg, psk_id: '' }).encrypt(publicKey),
    {
      code: 'ERR_JOSE_NOT_SUPPORTED',
      message: 'JWE HPKE PSK mode is not supported',
    },
  )

  await t.throwsAsync(
    new FlattenedEncrypt(plaintext)
      .setProtectedHeader({ alg })
      .setContentEncryptionKey(new Uint8Array(16))
      .encrypt(publicKey),
    {
      instanceOf: TypeError,
      message: `setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${alg}`,
    },
  )

  await t.throwsAsync(
    new FlattenedEncrypt(plaintext)
      .setProtectedHeader({ alg })
      .setInitializationVector(new Uint8Array(12))
      .encrypt(publicKey),
    {
      instanceOf: TypeError,
      message: `setInitializationVector cannot be called with JWE "alg" (Algorithm) Header ${alg}`,
    },
  )

  await t.throwsAsync(
    flattenedDecrypt(setProtectedHeader(jwe, { alg, enc: 'A128GCM' }), privateKey),
    {
      code: 'ERR_JWE_INVALID',
      message:
        'JWE "enc" (Encryption Algorithm) Header Parameter must not be present for integrated encryption',
    },
  )

  await t.throwsAsync(flattenedDecrypt(setProtectedHeader(jwe, { alg, ek: '' }), privateKey), {
    code: 'ERR_JWE_INVALID',
    message: 'JWE "ek" Header Parameter must not be present',
  })

  await t.throwsAsync(flattenedDecrypt(setProtectedHeader(jwe, { alg, psk_id: '' }), privateKey), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
    message: 'JWE HPKE PSK mode is not supported',
  })

  await t.throwsAsync(flattenedDecrypt({ ...jwe, encrypted_key: undefined }, privateKey), {
    code: 'ERR_JWE_DECRYPTION_FAILED',
    message: 'decryption operation failed',
  })

  await t.throwsAsync(
    flattenedDecrypt({ ...jwe, ciphertext: tamper(jwe.ciphertext) }, privateKey),
    {
      code: 'ERR_JWE_DECRYPTION_FAILED',
      message: 'decryption operation failed',
    },
  )

  await t.throwsAsync(
    flattenedDecrypt({ ...jwe, encrypted_key: tamper(jwe.encrypted_key!) }, privateKey),
    {
      code: 'ERR_JWE_DECRYPTION_FAILED',
      message: 'decryption operation failed',
    },
  )

  await t.throwsAsync(
    flattenedDecrypt(jwe, privateKey, { keyManagementAlgorithms: ['RSA-OAEP'] }),
    {
      code: 'ERR_JOSE_ALG_NOT_ALLOWED',
      message: '"alg" (Algorithm) Header Parameter value not allowed',
    },
  )

  await t.notThrowsAsync(flattenedDecrypt(jwe, privateKey, { contentEncryptionAlgorithms: [] }))
})

test('Integrated HPKE AKP JWK import and export', async (t) => {
  for (const alg of algorithms) {
    if (!(await isSupported(alg)) || !(await isJWKSupported(alg))) {
      t.pass(`${alg} JWK import/export unsupported in this runtime`)
      continue
    }

    const { publicKey, privateKey } = await generateKeyPair(alg, { extractable: true })
    const publicJwk = await exportJWK(publicKey)
    const privateJwk = await exportJWK(privateKey)

    t.is(publicJwk.kty, 'AKP')
    t.is(publicJwk.alg, alg)
    t.truthy(publicJwk.pub)
    t.false('priv' in publicJwk)

    t.is(privateJwk.kty, 'AKP')
    t.is(privateJwk.alg, alg)
    t.is(privateJwk.pub, publicJwk.pub)
    t.truthy(privateJwk.priv)

    const importedPublicKey = await importJWK(publicJwk)
    const importedPrivateKey = await importJWK(privateJwk)
    const jwe = await new FlattenedEncrypt(plaintext)
      .setProtectedHeader({ alg })
      .encrypt(importedPublicKey)

    const { plaintext: decrypted } = await flattenedDecrypt(jwe, importedPrivateKey, {
      keyManagementAlgorithms: [alg],
    })
    t.deepEqual(decrypted, plaintext)
  }
})
