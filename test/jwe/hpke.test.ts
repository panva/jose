import test from 'ava'

import {
  CompactEncrypt,
  FlattenedEncrypt,
  GeneralEncrypt,
  base64url,
  compactDecrypt,
  flattenedDecrypt,
  generalDecrypt,
  generateKeyPair,
} from '../../src/index.js'

import type { FlattenedJWE, JWEHeaderParameters } from '../../src/index.js'

const encoder = new TextEncoder()
const decoder = new TextDecoder()
const plaintext = encoder.encode('Integrated HPKE JWE')
const aad = encoder.encode('additional authenticated data')

const algorithms = ['HPKE-0', 'HPKE-1', 'HPKE-3', 'HPKE-4', 'HPKE-7']

const supported = new Map<string, boolean>()

function getPublicKeyAvailable() {
  return typeof (crypto.subtle as { getPublicKey?: unknown }).getPublicKey === 'function'
}

function keyPairOptions(alg: string) {
  switch (alg) {
    case 'HPKE-0':
    case 'HPKE-1':
    case 'HPKE-3':
    case 'HPKE-4':
    case 'HPKE-7':
      return getPublicKeyAvailable() ? undefined : { extractable: true }
    default:
      return undefined
  }
}

async function isSupported(alg: string) {
  if (supported.has(alg)) {
    return supported.get(alg)!
  }

  try {
    await generateKeyPair(alg, keyPairOptions(alg))
    if (alg === 'HPKE-4') {
      await crypto.subtle.importKey(
        'raw-secret' as 'raw',
        new Uint8Array(32),
        'ChaCha20-Poly1305',
        false,
        ['encrypt'],
      )
    }
    supported.set(alg, true)
  } catch {
    supported.set(alg, false)
  }

  return supported.get(alg)!
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

    const { publicKey, privateKey } = await generateKeyPair(alg, keyPairOptions(alg))

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
  }
})

test('Integrated HPKE general JWE single recipient', async (t) => {
  const alg = await firstSupported('HPKE-0', ...algorithms)
  if (!alg) {
    t.pass('no integrated HPKE algorithm supported in this runtime')
    return
  }

  const { publicKey, privateKey } = await generateKeyPair(alg, keyPairOptions(alg))
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
})

test('Integrated HPKE general JWE multi-recipient encryption rejection', async (t) => {
  const alg = await firstSupported('HPKE-0', ...algorithms)
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
      message: `"${alg}" alg may only be used with a single recipient`,
    },
  )
})

test('Integrated HPKE general JWE multi-recipient decryption iterates recipients', async (t) => {
  const alg = await firstSupported('HPKE-0', ...algorithms)
  if (!alg) {
    t.pass('no integrated HPKE algorithm supported in this runtime')
    return
  }

  const { publicKey, privateKey } = await generateKeyPair(alg, keyPairOptions(alg))
  const flattened = await new FlattenedEncrypt(plaintext)
    .setProtectedHeader({ alg })
    .encrypt(publicKey)
  const { plaintext: decrypted } = await generalDecrypt(
    {
      ciphertext: flattened.ciphertext,
      protected: flattened.protected,
      recipients: [
        { encrypted_key: tamper(flattened.encrypted_key!) },
        { encrypted_key: flattened.encrypted_key },
      ],
    },
    privateKey,
    { keyManagementAlgorithms: [alg] },
  )

  t.deepEqual(decrypted, plaintext)
})

test('Integrated HPKE validation', async (t) => {
  const alg = await firstSupported('HPKE-0', ...algorithms)
  if (!alg) {
    t.pass('no integrated HPKE algorithm supported in this runtime')
    return
  }

  const { publicKey, privateKey } = await generateKeyPair(alg, keyPairOptions(alg))
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
    code: 'ERR_JWE_INVALID',
    message: 'JWE Encrypted Key missing',
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

  await t.throwsAsync(
    flattenedDecrypt(jwe, privateKey, { contentEncryptionAlgorithms: ['A256GCM'] }),
    {
      code: 'ERR_JOSE_ALG_NOT_ALLOWED',
      message: '"enc" (Encryption Algorithm) Header Parameter value not allowed',
    },
  )
})
