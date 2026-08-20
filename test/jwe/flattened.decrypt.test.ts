import test from 'ava'
import * as crypto from 'crypto'

import { FlattenedEncrypt, base64url, flattenedDecrypt, generateKeyPair } from '../../src/index.js'

test.before(async (t) => {
  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())
  t.context.plaintext = encode('It’s a dangerous business, Frodo, going out your door.')
  t.context.additionalAuthenticatedData = encode('The Fellowship of the Ring')
  t.context.initializationVector = new Uint8Array(12)
  t.context.secret = new Uint8Array(16)
})

test('JWE format validation', async (t) => {
  const fullJwe = await new FlattenedEncrypt(t.context.plaintext)
    .setProtectedHeader({ bar: 'baz' })
    .setUnprotectedHeader({ foo: 'bar' })
    .setSharedUnprotectedHeader({ alg: 'dir', enc: 'A128GCM' })
    .setAdditionalAuthenticatedData(t.context.additionalAuthenticatedData)
    .encrypt(t.context.secret)

  await t.notThrowsAsync(flattenedDecrypt(fullJwe, t.context.secret))

  {
    await t.throwsAsync(flattenedDecrypt(null, t.context.secret), {
      message: 'Flattened JWE must be an object',
      code: 'ERR_JWE_INVALID',
    })
  }

  {
    const jwe = { ...fullJwe }
    jwe.protected = undefined
    jwe.header = undefined
    jwe.unprotected = undefined

    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), {
      message: 'JOSE Header missing',
      code: 'ERR_JWE_INVALID',
    })
  }

  {
    const jwe = { ...fullJwe }
    const assertion = {
      message: 'JWE Initialization Vector incorrect type',
      code: 'ERR_JWE_INVALID',
    }

    jwe.iv = 12
    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), assertion)
    jwe.iv = null
    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), assertion)
    jwe.iv = undefined
    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), {
      message: 'JWE Initialization Vector missing',
      code: 'ERR_JWE_INVALID',
    })
  }

  {
    const jwe = { ...fullJwe }
    jwe.ciphertext = undefined
    const assertion = {
      message: 'JWE Ciphertext missing or incorrect type',
      code: 'ERR_JWE_INVALID',
    }

    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), assertion)
    jwe.ciphertext = null

    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), assertion)
  }

  {
    const jwe = { ...fullJwe }
    const assertion = {
      message: 'JWE Authentication Tag incorrect type',
      code: 'ERR_JWE_INVALID',
    }

    jwe.tag = 12
    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), assertion)
    jwe.tag = null
    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), assertion)
    jwe.tag = undefined
    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), {
      message: 'JWE Authentication Tag missing',
      code: 'ERR_JWE_INVALID',
    })
  }

  {
    const jwe = { ...fullJwe }
    jwe.protected = null

    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), {
      message: 'JWE Protected Header incorrect type',
      code: 'ERR_JWE_INVALID',
    })
  }

  {
    const jwe = { ...fullJwe }
    const assertion = {
      message: 'JWE Protected Header is invalid',
      code: 'ERR_JWE_INVALID',
    }
    jwe.protected = `1${jwe.protected}`
    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), assertion)

    // RFC 7516 Section 4 - the Protected Header must be a JSON object.
    for (const json of ['"foo"', '123', 'null', '[]']) {
      await t.throwsAsync(
        flattenedDecrypt({ ...jwe, protected: base64url.encode(json) }, t.context.secret),
        assertion,
      )
    }
  }

  {
    const jwe = { ...fullJwe }
    jwe.encrypted_key = null

    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), {
      message: 'JWE Encrypted Key incorrect type',
      code: 'ERR_JWE_INVALID',
    })
  }

  {
    const jwe = { ...fullJwe }
    jwe.aad = null

    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), {
      message: 'JWE AAD incorrect type',
      code: 'ERR_JWE_INVALID',
    })
  }

  {
    const jwe = { ...fullJwe }
    jwe.header = null

    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), {
      message: 'JWE Per-Recipient Unprotected Header incorrect type',
      code: 'ERR_JWE_INVALID',
    })
  }

  {
    const jwe = { ...fullJwe }
    jwe.unprotected = null

    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), {
      message: 'JWE Shared Unprotected Header incorrect type',
      code: 'ERR_JWE_INVALID',
    })
  }

  {
    const jwe = { ...fullJwe }
    jwe.unprotected = { foo: 'bar' }

    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), {
      message:
        'JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint',
      code: 'ERR_JWE_INVALID',
    })
  }

  {
    const jwe = { ...fullJwe }
    jwe.unprotected = { enc: 'A128GCM' }

    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), {
      message: 'missing JWE Algorithm (alg) in JWE Header',
      code: 'ERR_JWE_INVALID',
    })
  }

  {
    const jwe = { ...fullJwe }
    jwe.unprotected = { alg: 'dir' }

    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), {
      message: 'missing JWE Encryption Algorithm (enc) in JWE Header',
      code: 'ERR_JWE_INVALID',
    })
  }

  {
    const jwe = { ...fullJwe }
    jwe.encrypted_key = 'foo'

    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), {
      message: 'Encountered unexpected JWE Encrypted Key',
      code: 'ERR_JWE_INVALID',
    })
  }
})

test('an empty JWE AAD value must be represented by omitting the member', async (t) => {
  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())
  const protectedHeader = base64url.encode(JSON.stringify({ alg: 'dir', enc: 'A128GCM' }))
  const iv = new Uint8Array(12)
  const key = await crypto.subtle.importKey('raw', t.context.secret, 'AES-GCM', false, ['encrypt'])
  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt(
      {
        additionalData: encode(`${protectedHeader}.`),
        iv,
        name: 'AES-GCM',
        tagLength: 128,
      },
      key,
      t.context.plaintext,
    ),
  )

  await t.throwsAsync(
    flattenedDecrypt(
      {
        aad: '',
        ciphertext: base64url.encode(encrypted.slice(0, -16)),
        iv: base64url.encode(iv),
        protected: protectedHeader,
        tag: base64url.encode(encrypted.slice(-16)),
      },
      t.context.secret,
    ),
    { code: 'ERR_JWE_INVALID' },
  )
})

test('AES CBC + HMAC', async (t) => {
  const secret = crypto.randomFillSync(new Uint8Array(32))
  const jwe = await new FlattenedEncrypt(t.context.plaintext)
    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
    .encrypt(secret)

  await t.notThrowsAsync(flattenedDecrypt(jwe, secret))

  {
    const jweBadTag = { ...jwe }
    jweBadTag.tag = 'foo'
    await t.throwsAsync(flattenedDecrypt(jweBadTag, secret), {
      code: 'ERR_JWE_DECRYPTION_FAILED',
      message: 'decryption operation failed',
    })
  }

  {
    const jweBadEnc = { ...jwe }
    jweBadEnc.ciphertext = 'foo'
    await t.throwsAsync(flattenedDecrypt(jweBadEnc, secret), {
      code: 'ERR_JWE_DECRYPTION_FAILED',
      message: 'decryption operation failed',
    })
  }

  {
    const altSecret = new Uint8Array(32)
    altSecret.set(secret.slice(0, 16), 16)
    altSecret.set(secret.slice(16), 0)
    await t.throwsAsync(flattenedDecrypt(jwe, altSecret), {
      code: 'ERR_JWE_DECRYPTION_FAILED',
      message: 'decryption operation failed',
    })
  }
})

test('decrypt PBES2 p2c limit', async (t) => {
  const jwe = await new FlattenedEncrypt(new Uint8Array(0))
    .setProtectedHeader({ alg: 'PBES2-HS256+A128KW', enc: 'A128CBC-HS256' })
    .setKeyManagementParameters({ p2c: 2049 })
    .encrypt(new Uint8Array(32))

  await t.notThrowsAsync(
    flattenedDecrypt(jwe, new Uint8Array(32), { keyManagementAlgorithms: ['PBES2-HS256+A128KW'] }),
  )

  await t.throwsAsync(
    flattenedDecrypt(jwe, new Uint8Array(32), {
      maxPBES2Count: 2048,
      keyManagementAlgorithms: ['PBES2-HS256+A128KW'],
    }),
    {
      message: 'JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds',
      code: 'ERR_JWE_INVALID',
    },
  )
})

test('PBES2 p2c must be a positive integer on decrypt', async (t) => {
  const jwe = await new FlattenedEncrypt(new Uint8Array(0))
    .setProtectedHeader({ alg: 'PBES2-HS256+A128KW', enc: 'A128CBC-HS256' })
    .setKeyManagementParameters({ p2c: 1 })
    .encrypt(new Uint8Array(32))

  const protectedHeader = JSON.parse(new TextDecoder().decode(base64url.decode(jwe.protected!)))
  protectedHeader.p2c = 1.5
  jwe.protected = base64url.encode(JSON.stringify(protectedHeader))

  await t.throwsAsync(
    flattenedDecrypt(jwe, new Uint8Array(32), {
      keyManagementAlgorithms: ['PBES2-HS256+A128KW'],
    }),
    {
      code: 'ERR_JWE_INVALID',
      message: 'PBES2 Count Input must be a positive integer',
    },
  )
})

test('decrypt with PBES2 is not allowed by default', async (t) => {
  const jwe = await new FlattenedEncrypt(new Uint8Array(0))
    .setProtectedHeader({ alg: 'PBES2-HS256+A128KW', enc: 'A128CBC-HS256' })
    .encrypt(new Uint8Array(32))

  await t.throwsAsync(flattenedDecrypt(jwe, new Uint8Array(32)), {
    message: '"alg" (Algorithm) Header Parameter value not allowed',
    code: 'ERR_JOSE_ALG_NOT_ALLOWED',
  })
})

test('a non-ASCII "aad" is a JWEInvalid', async (t) => {
  // "aad" is only base64url decoded after decryption, so its octets reach the AEAD input as-is.
  const jwe = await new FlattenedEncrypt(t.context.plaintext)
    .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
    .setAdditionalAuthenticatedData(t.context.additionalAuthenticatedData)
    .encrypt(t.context.secret)

  await t.throwsAsync(flattenedDecrypt({ ...jwe, aad: '€' }, t.context.secret), {
    code: 'ERR_JWE_INVALID',
    message: 'The aad is not a valid base64url string',
  })

  // A well-formed but wrong "aad" still fails as a decryption failure.
  await t.throwsAsync(flattenedDecrypt({ ...jwe, aad: 'AQID' }, t.context.secret), {
    code: 'ERR_JWE_DECRYPTION_FAILED',
  })
})

test('AES-GCM authentication tags must be 128 bits', async (t) => {
  const jwe = await new FlattenedEncrypt(t.context.plaintext)
    .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
    .encrypt(t.context.secret)
  const ciphertext = base64url.decode(jwe.ciphertext)
  const tag = base64url.decode(jwe.tag!)

  const shifted = [
    {
      ciphertext: ciphertext.slice(0, -1),
      tag: new Uint8Array([...ciphertext.slice(-1), ...tag]),
    },
    {
      ciphertext: new Uint8Array([...ciphertext, tag[0]]),
      tag: tag.slice(1),
    },
    {
      ciphertext: new Uint8Array([...ciphertext, ...tag]),
      tag: new Uint8Array(),
    },
    {
      ciphertext: new Uint8Array(),
      tag: new Uint8Array([...ciphertext, ...tag]),
    },
  ]

  // Without checking the member boundary, every case reconstructs the original ciphertext || tag.
  for (const members of shifted) {
    await t.throwsAsync(
      flattenedDecrypt(
        {
          ...jwe,
          ciphertext: base64url.encode(members.ciphertext),
          tag: base64url.encode(members.tag),
        },
        t.context.secret,
      ),
      { code: 'ERR_JWE_INVALID' },
    )
  }
})

test('encrypted CEK length errors are indistinguishable from decryption failures', async (t) => {
  const { publicKey, privateKey } = await generateKeyPair('RSA-OAEP-256')
  const jwe = await new FlattenedEncrypt(t.context.plaintext)
    .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A128GCM' })
    .encrypt(publicKey)

  const wrongLength = new Uint8Array(
    await crypto.subtle.encrypt('RSA-OAEP', publicKey, new Uint8Array(1)),
  )
  const malformed = crypto.randomFillSync(new Uint8Array(256))

  for (const encryptedKey of [wrongLength, malformed]) {
    await t.throwsAsync(
      flattenedDecrypt({ ...jwe, encrypted_key: base64url.encode(encryptedKey) }, privateKey),
      {
        code: 'ERR_JWE_DECRYPTION_FAILED',
        message: 'decryption operation failed',
      },
    )
  }
})

test('an empty protected member is not an encoded protected header', async (t) => {
  const jwe = await new FlattenedEncrypt(t.context.plaintext)
    .setSharedUnprotectedHeader({ alg: 'dir', enc: 'A128GCM' })
    .encrypt(t.context.secret)

  await t.throwsAsync(flattenedDecrypt({ ...jwe, protected: '' }, t.context.secret), {
    code: 'ERR_JWE_INVALID',
  })
})
