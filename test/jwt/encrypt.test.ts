import test, { before, after } from 'node:test'
import assert from 'node:assert/strict'
import timekeeper from 'timekeeper'
import { setters, type SetterMethod, type SetterValue } from './time_setters.js'
import { EncryptJWT, compactDecrypt, jwtDecrypt } from '../../src/index.js'
import { errorLike } from '../_errors.js'

const context = {} as {
  secret: Uint8Array
  initializationVector: Uint8Array
  payload: Record<string, unknown>
}

const now = 1604416038

before(async () => {
  context.secret = new Uint8Array(16)
  context.initializationVector = new Uint8Array(12)
  context.payload = { 'urn:example:claim': true }
  timekeeper.freeze(new Date(now * 1000))
})

after(timekeeper.reset)

test('EncryptJWT', async () => {
  const jwt = await new EncryptJWT(context.payload)
    .setInitializationVector(context.initializationVector)
    .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
    .encrypt(context.secret)
  assert.equal(
    jwt,
    'eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4R0NNIn0..AAAAAAAAAAAAAAAA.eKqvvA6MxuqSRbLVFIidFJb8x4lzPytWkoA.aglYAurAaFCoM8sCqaXSyw',
  )
})

test('EncryptJWT w/crit', async () => {
  const expected =
    'eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4R0NNIiwiY3JpdCI6WyJodHRwOi8vb3BlbmJhbmtpbmcub3JnLnVrL2lhdCJdLCJodHRwOi8vb3BlbmJhbmtpbmcub3JnLnVrL2lhdCI6MH0..AAAAAAAAAAAAAAAA.eKqvvA6MxuqSRbLVFIidFJb8x4lzPytWkoA.Kl-auiUImwUWk4X0xpxa8A'
  await assert.rejects(
    new EncryptJWT(context.payload)
      .setInitializationVector(context.initializationVector)
      .setProtectedHeader({
        alg: 'dir',
        enc: 'A128GCM',
        crit: ['http://openbanking.org.uk/iat'],
        'http://openbanking.org.uk/iat': 0,
      })
      .encrypt(context.secret),
    errorLike({
      code: 'ERR_JOSE_NOT_SUPPORTED',
      message: 'Extension Header Parameter "http://openbanking.org.uk/iat" is not recognized',
    }),
  )
  await assert.doesNotReject(async () => {
    const jwt = await new EncryptJWT(context.payload)
      .setInitializationVector(context.initializationVector)
      .setProtectedHeader({
        alg: 'dir',
        enc: 'A128GCM',
        crit: ['http://openbanking.org.uk/iat'],
        'http://openbanking.org.uk/iat': 0,
      })
      .encrypt(context.secret, { crit: { 'http://openbanking.org.uk/iat': true } })
    assert.equal(jwt, expected)
  })
  await assert.rejects(
    jwtDecrypt(expected, context.secret),
    errorLike({
      code: 'ERR_JOSE_NOT_SUPPORTED',
      message: 'Extension Header Parameter "http://openbanking.org.uk/iat" is not recognized',
    }),
  )
  await assert.doesNotReject(
    jwtDecrypt(expected, context.secret, { crit: { 'http://openbanking.org.uk/iat': true } }),
  )
})

async function testJWTsetFunction(
  method: SetterMethod,
  claim: string,
  value: SetterValue,
  duplicate = false,
  expected: SetterValue = value,
) {
  let enc = new EncryptJWT()
    .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
    [method](value as never)
  if (duplicate) {
    enc =
      enc[
        `replicate${method.slice(3)}AsHeader` as
          'replicateIssuerAsHeader' | 'replicateSubjectAsHeader' | 'replicateAudienceAsHeader'
      ]()
  }
  const jwt = await enc.encrypt(context.secret)
  const {
    plaintext,
    protectedHeader,
    key: resolvedKey,
  } = await compactDecrypt(jwt, async (header, token) => {
    assert.equal('alg' in header, true)
    assert.equal('enc' in header, true)
    assert.equal(header.alg, 'dir')
    assert.equal(header.enc, 'A128GCM')
    assert.equal('ciphertext' in token, true)
    assert.equal('iv' in token, true)
    assert.equal('protected' in token, true)
    assert.equal('tag' in token, true)
    return context.secret
  })
  assert.equal(resolvedKey, context.secret)
  const payload = JSON.parse(new TextDecoder().decode(plaintext))
  assert.equal(payload[claim], expected)
  if (duplicate) {
    assert.equal(claim in protectedHeader, true)
    assert.equal(protectedHeader[claim], expected)
  } else {
    assert.equal(claim in protectedHeader, false)
  }
}

const testJWTsetFunctionTitle = (method: SetterMethod, value: SetterValue, title = '') =>
  `EncryptJWT.prototype.${method} called with ${value?.constructor?.name || typeof value} (${value}) ${title ? ` (${title})` : ''}`

for (const [method, claim, vectors] of setters(now)) {
  for (const [input, output = input] of vectors) {
    test(testJWTsetFunctionTitle(method, input), () =>
      testJWTsetFunction(method, claim, input, false, output),
    )
  }
}

test(testJWTsetFunctionTitle('setIssuer', 'urn:example:issuer', 'duplicated'), () =>
  testJWTsetFunction('setIssuer', 'iss', 'urn:example:issuer', true),
)

test(testJWTsetFunctionTitle('setSubject', 'urn:example:subject', 'duplicated'), () =>
  testJWTsetFunction('setSubject', 'sub', 'urn:example:subject', true),
)

test(testJWTsetFunctionTitle('setAudience', 'urn:example:audience', 'duplicated'), () =>
  testJWTsetFunction('setAudience', 'aud', 'urn:example:audience', true),
)

test('EncryptJWT serializes updated claims and replicated headers per operation', async () => {
  const builder = new EncryptJWT()
    .setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
    .setIssuer('first')
    .replicateIssuerAsHeader()
  const first = builder.encrypt(context.secret)
  builder.setIssuer('second')
  const second = builder.encrypt(context.secret)
  const results = await Promise.all(
    [first, second].map(async (jwt) => jwtDecrypt(await jwt, context.secret)),
  )
  assert.equal(results[0].payload.iss, 'first')
  assert.equal(results[0].protectedHeader.iss, 'first')
  assert.equal(results[1].payload.iss, 'second')
  assert.equal(results[1].protectedHeader.iss, 'second')
})

test('EncryptJWT.prototype.setProtectedHeader', () => {
  assert.throws(
    () => new EncryptJWT(context.payload).setProtectedHeader({}).setProtectedHeader({}),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, 'setProtectedHeader can only be called once')
      return true
    },
  )
})

test('EncryptJWT.prototype.setContentEncryptionKey', () => {
  assert.throws(
    () =>
      new EncryptJWT(context.payload)
        .setContentEncryptionKey(context.secret)
        .setContentEncryptionKey(context.secret),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, 'setContentEncryptionKey can only be called once')
      return true
    },
  )
})

test('EncryptJWT.prototype.setInitializationVector', () => {
  assert.throws(
    () =>
      new EncryptJWT(context.payload)
        .setInitializationVector(context.initializationVector)
        .setInitializationVector(context.initializationVector),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, 'setInitializationVector can only be called once')
      return true
    },
  )
})

test('EncryptJWT.prototype.encrypt must have a JOSE header', async () => {
  let critReads = 0
  const options = {
    get crit() {
      critReads++
      throw new Error('unexpected crit option getter')
    },
  }
  await assert.rejects(
    new EncryptJWT(context.payload).encrypt(context.secret, options),
    errorLike({
      code: 'ERR_JWE_INVALID',
      message:
        'either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()',
    }),
  )
  assert.equal(critReads, 0)
})

test('EncryptJWT validates NumericDate claims before reading replicated headers', async () => {
  let reads = 0
  const protectedHeader = {
    get alg() {
      reads++
      return 'dir'
    },
    enc: 'A128GCM',
  }
  await assert.rejects(
    new EncryptJWT({ exp: NaN })
      .setProtectedHeader(protectedHeader)
      .replicateIssuerAsHeader()
      .encrypt(context.secret),
    (error) => {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, '"exp" claim must be a finite number')
      return true
    },
  )
  assert.equal(reads, 0)
})

test('EncryptJWT does not ignore invalid falsy encryption parameters', async () => {
  for (const [configure, message] of [
    [
      (jwt: EncryptJWT) => jwt.setInitializationVector(0 as never),
      'JWE Initialization Vector must be an instance of Uint8Array',
    ],
    [
      (jwt: EncryptJWT) => jwt.setContentEncryptionKey(0 as never),
      'JWE Content Encryption Key must be an instance of Uint8Array',
    ],
    [
      (jwt: EncryptJWT) => jwt.setKeyManagementParameters(null as never),
      'JWE Key Management Parameters must be an object',
    ],
    [
      (jwt: EncryptJWT) => jwt.setKeyManagementParameters(false as never),
      'JWE Key Management Parameters must be an object',
    ],
  ] as const) {
    await assert.rejects(
      configure(new EncryptJWT(context.payload))
        .setProtectedHeader({
          alg: 'dir',
          enc: 'A128GCM',
        })
        .encrypt(context.secret),
      (error) => {
        assert.ok(error instanceof TypeError)
        assert.equal(error.message, message)
        return true
      },
    )
  }
})
