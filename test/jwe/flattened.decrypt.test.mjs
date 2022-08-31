import test from 'ava'
import * as crypto from 'crypto'
import { root, conditional } from '../dist.mjs'

const { FlattenedEncrypt, flattenedDecrypt, base64url } = await import(root)

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

  {
    await t.throwsAsync(flattenedDecrypt(null, t.context.secret), {
      message: 'Flattened JWE must be an object',
      code: 'ERR_JWE_INVALID',
    })
  }

  {
    const jwe = { ...fullJwe }
    delete jwe.protected
    delete jwe.header
    delete jwe.unprotected

    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), {
      message: 'JOSE Header missing',
      code: 'ERR_JWE_INVALID',
    })
  }

  {
    const jwe = { ...fullJwe }
    delete jwe.iv
    const assertion = {
      message: 'JWE Initialization Vector missing or incorrect type',
      code: 'ERR_JWE_INVALID',
    }

    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), assertion)
    jwe.iv = null

    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), assertion)
  }

  {
    const jwe = { ...fullJwe }
    delete jwe.ciphertext
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
    delete jwe.tag
    const assertion = {
      message: 'JWE Authentication Tag missing or incorrect type',
      code: 'ERR_JWE_INVALID',
    }

    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), assertion)
    jwe.tag = null

    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), assertion)
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
      message: 'JWE Shared Unprotected Header incorrect type',
      code: 'ERR_JWE_INVALID',
    })
  }

  {
    const jwe = { ...fullJwe }
    jwe.unprotected = null

    await t.throwsAsync(flattenedDecrypt(jwe, t.context.secret), {
      message: 'JWE Per-Recipient Unprotected Header incorrect type',
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

test('AES CBC + HMAC', async (t) => {
  const secret = crypto.randomFillSync(new Uint8Array(32))
  const jwe = await new FlattenedEncrypt(t.context.plaintext)
    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
    .encrypt(secret)

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

test('decrypt empty data (GCM)', async (t) => {
  const jwe = await new FlattenedEncrypt(new Uint8Array(0))
    .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
    .encrypt(new Uint8Array(16))

  t.is(jwe.ciphertext, '')

  const { plaintext } = await flattenedDecrypt(jwe, new Uint8Array(16))
  t.is(plaintext.byteLength, 0)
})

test('decrypt empty data (CBC)', async (t) => {
  const jwe = await new FlattenedEncrypt(new Uint8Array(0))
    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
    .encrypt(new Uint8Array(32))

  t.is(base64url.decode(jwe.ciphertext).byteLength, 16)

  const { plaintext } = await flattenedDecrypt(jwe, new Uint8Array(32))
  t.is(plaintext.byteLength, 0)
})

conditional({ electron: 0 })('decrypt PBES2 p2c limit', async (t) => {
  const jwe = await new FlattenedEncrypt(new Uint8Array(0))
    .setProtectedHeader({ alg: 'PBES2-HS256+A128KW', enc: 'A128CBC-HS256' })
    .setKeyManagementParameters({ p2c: 2049 })
    .encrypt(new Uint8Array(32))

  await t.throwsAsync(flattenedDecrypt(jwe, new Uint8Array(32), { maxPBES2Count: 2048 }), {
    message: 'JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds',
    code: 'ERR_JWE_INVALID',
  })
})
