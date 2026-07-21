import anyTest, { type ExecutionContext, type TestFn } from 'ava'

import {
  base64url,
  compactVerify,
  exportJWK,
  generateKeyPair,
  type CryptoKey,
} from '../../src/index.js'
import {
  FlattenedSignSDJWT,
  GeneralSignSDJWT,
  SignSDJWT,
  flattenedSdJwtReceive,
  generalSdJwtReceive,
  sdJwtReceive,
  type ProduceSDJWT,
} from '../../src/sd-jwt/index.js'

const decoder = new TextDecoder()

interface Context {
  issuerPrivateKey: CryptoKey
  issuerPublicKey: CryptoKey
  secondIssuerPrivateKey: CryptoKey
  secondIssuerPublicKey: CryptoKey
}

const test = anyTest as TestFn<Context>

function decodeDisclosure(disclosure: string): unknown[] {
  return JSON.parse(decoder.decode(base64url.decode(disclosure)))
}

function assertSortedDigests(t: ExecutionContext, value: unknown): void {
  if (Array.isArray(value)) {
    for (const element of value) assertSortedDigests(t, element)
    return
  }
  if (typeof value !== 'object' || value === null) return
  const object = value as Record<string, unknown>
  if (Array.isArray(object._sd)) {
    t.deepEqual(object._sd, object._sd.slice().sort())
  }
  for (const child of Object.values(object)) assertSortedDigests(t, child)
}

test.before(async (t) => {
  const [issuer, secondIssuer] = await Promise.all([
    generateKeyPair('ES256'),
    generateKeyPair('ES256'),
  ])
  t.context.issuerPrivateKey = issuer.privateKey
  t.context.issuerPublicKey = issuer.publicKey
  t.context.secondIssuerPrivateKey = secondIssuer.privateKey
  t.context.secondIssuerPublicKey = secondIssuer.publicKey
})

test('SignSDJWT mirrors SignJWT and ProduceJWT', async (t) => {
  const input = { permanent: true, concealed: 'value' }
  const before = Math.floor(Date.now() / 1000)
  const producer: ProduceSDJWT = new SignSDJWT(input)
    .setProtectedHeader({ alg: 'ES256', typ: 'example+sd-jwt' })
    .setIssuer('https://issuer.example')
    .setSubject('subject')
    .setAudience('audience')
    .setJti('identifier')
    .setNotBefore(1)
    .setExpirationTime('2h')
    .setIssuedAt(2)
    .setDisclosurePaths(['/concealed'])

  const issued = await (producer as SignSDJWT).sign(t.context.issuerPrivateKey)
  const [jws, disclosure, terminator] = issued.split('~')
  t.truthy(disclosure)
  t.is(terminator, '')

  const verified = await compactVerify(jws, t.context.issuerPublicKey)
  const payload = JSON.parse(decoder.decode(verified.payload))
  t.deepEqual(payload, {
    permanent: true,
    iss: 'https://issuer.example',
    sub: 'subject',
    aud: 'audience',
    jti: 'identifier',
    nbf: 1,
    exp: payload.exp,
    iat: 2,
    _sd: payload._sd,
  })
  t.is(typeof payload.exp, 'number')
  t.true(payload.exp >= before + 2 * 60 * 60)
  t.true(payload.exp <= Math.floor(Date.now() / 1000) + 2 * 60 * 60)
  t.is(payload._sd.length, 1)
  t.deepEqual(input, { permanent: true, concealed: 'value' })
})

test('SD-JWT producers reject symmetric Issuer signatures', async (t) => {
  const rawSecret = crypto.getRandomValues(new Uint8Array(32))
  const secretKey = await crypto.subtle.importKey(
    'raw',
    rawSecret,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const octJwk = {
    kty: 'oct',
    k: base64url.encode(crypto.getRandomValues(new Uint8Array(32))),
  }

  for (const { alg, key } of [
    { alg: 'HS256', key: t.context.issuerPrivateKey },
    { alg: 'ES256', key: rawSecret },
    { alg: 'ES256', key: secretKey },
    { alg: 'ES256', key: octJwk },
  ]) {
    await t.throwsAsync(
      async () => new SignSDJWT().setProtectedHeader({ alg }).sign(key as never),
      { instanceOf: TypeError },
    )

    await t.throwsAsync(
      async () => new FlattenedSignSDJWT().setProtectedHeader({ alg }).sign(key as never),
      { instanceOf: TypeError },
    )

    await t.throwsAsync(
      async () =>
        new GeneralSignSDJWT()
          .addSignature(key as never)
          .setProtectedHeader({ alg })
          .sign(),
      { instanceOf: TypeError },
    )
  }
})

test('SignSDJWT produces fresh transactional Disclosures', async (t) => {
  const signer = new SignSDJWT({ concealed: 'value' })
    .setProtectedHeader({ alg: 'ES256' })
    .setDisclosurePaths(['/concealed'])

  const first = await signer.sign(t.context.issuerPrivateKey)
  const second = await signer.sign(t.context.issuerPrivateKey)
  t.not(first, second)

  const firstCredential = await sdJwtReceive(first, t.context.issuerPublicKey)
  const secondCredential = await sdJwtReceive(second, t.context.issuerPublicKey)
  t.is(firstCredential.payload.concealed, 'value')
  t.is(secondCredential.payload.concealed, 'value')
})

test('SignSDJWT validates Disclosure paths and critical claims', async (t) => {
  await t.throwsAsync(
    new SignSDJWT()
      .setProtectedHeader({ alg: 'ES256' })
      .setDisclosurePaths([''])
      .sign(t.context.issuerPrivateKey),
    { instanceOf: TypeError },
  )
  await t.throwsAsync(
    new SignSDJWT({ value: true })
      .setProtectedHeader({ alg: 'ES256' })
      .setDisclosurePaths(['/value', '/value'])
      .sign(t.context.issuerPrivateKey),
    { instanceOf: TypeError },
  )

  for (const path of ['/iss', '/aud', '/exp', '/nbf', '/cnf', '/cnf/jwk']) {
    await t.throwsAsync(
      new SignSDJWT({ [path.slice(1).split('/')[0]]: true })
        .setProtectedHeader({ alg: 'ES256' })
        .setDisclosurePaths([path])
        .sign(t.context.issuerPrivateKey),
      { instanceOf: TypeError },
    )
  }

  await t.throwsAsync(
    new SignSDJWT({ value: true })
      .setProtectedHeader({ alg: 'ES256' })
      .setDisclosurePaths(['/missing'])
      .sign(t.context.issuerPrivateKey),
    { instanceOf: TypeError },
  )
})

test('SignSDJWT supports SHA-384 and object Decoy Digests', async (t) => {
  const issued = await new SignSDJWT({ concealed: 'value' })
    .setProtectedHeader({ alg: 'ES256' })
    .setDisclosurePaths(['/concealed'])
    .setHashAlgorithm('sha-384')
    .addDecoys('', 2)
    .sign(t.context.issuerPrivateKey)

  const [jws] = issued.split('~')
  const verified = await compactVerify(jws, t.context.issuerPublicKey)
  const payload = JSON.parse(decoder.decode(verified.payload))
  t.is(payload._sd_alg, 'sha-384')
  t.is(payload._sd.length, 3)
})

test('JSON Pointers support escaping, arrays, recursion, and nested Decoys', async (t) => {
  const input = {
    'a/b': {
      '~key': [{ secret: 'value', visible: true }],
      permanent: true,
    },
    array: ['first', 'second'],
  }

  const issued = await new SignSDJWT(input)
    .setProtectedHeader({ alg: 'ES256' })
    .setHashAlgorithm('sha-512')
    .setDisclosurePaths([
      '/a~1b/~0key/0/secret',
      '/a~1b/~0key/0',
      '/a~1b/~0key',
      '/a~1b',
      '/array/1',
    ])
    .addDecoys('/a~1b/~0key/0', 2)
    .addDecoys('/array', { min: 2, max: 2 })
    .sign(t.context.issuerPrivateKey)

  const [jws, ...parts] = issued.split('~')
  const disclosures = parts.slice(0, -1).map(decodeDisclosure)
  const salts = disclosures.map(([salt]) => salt)
  t.is(new Set(salts).size, disclosures.length)
  t.true(salts.every((salt) => typeof salt === 'string' && salt.length === 22))

  const verified = await compactVerify(jws, t.context.issuerPublicKey)
  const payload = JSON.parse(decoder.decode(verified.payload))
  t.is(payload._sd_alg, 'sha-512')
  assertSortedDigests(t, payload)
  for (const disclosure of disclosures) assertSortedDigests(t, disclosure)

  const credential = await sdJwtReceive(issued, t.context.issuerPublicKey)
  t.deepEqual(credential.payload, input)
})

test('individual array audience entries may be selectively disclosed', async (t) => {
  const issued = await new SignSDJWT({ aud: ['one', 'two'] })
    .setProtectedHeader({ alg: 'ES256' })
    .setDisclosurePaths(['/aud/0'])
    .sign(t.context.issuerPrivateKey)

  const credential = await sdJwtReceive(issued, t.context.issuerPublicKey)
  t.deepEqual(credential.payload.aud, ['one', 'two'])
})

test('SignSDJWT validates producer configuration', async (t) => {
  await t.throwsAsync(
    new SignSDJWT()
      .setProtectedHeader({ alg: 'ES256' })
      .setDisclosurePaths(['/bad~escape'])
      .sign(t.context.issuerPrivateKey),
    { instanceOf: TypeError },
  )
  t.throws(() => new SignSDJWT().setDisclosurePaths(['/a']).setDisclosurePaths(['/b']), {
    instanceOf: TypeError,
  })
  const hashOverride = await new SignSDJWT()
    .setProtectedHeader({ alg: 'ES256' })
    .setHashAlgorithm('sha-384')
    .setHashAlgorithm('sha-512')
    .sign(t.context.issuerPrivateKey)
  const [hashOverrideJws] = hashOverride.split('~')
  const hashOverridePayload = JSON.parse(
    decoder.decode((await compactVerify(hashOverrideJws, t.context.issuerPublicKey)).payload),
  )
  t.is(hashOverridePayload._sd_alg, 'sha-512')

  for (const count of [0, -1, 1.5, Number.NaN]) {
    t.throws(() => new SignSDJWT().addDecoys('', count), { instanceOf: TypeError })
  }
  t.throws(() => new SignSDJWT().addDecoys('', { min: 2, max: 1 }), {
    instanceOf: TypeError,
  })
  t.throws(() => new SignSDJWT().addDecoys('', 1).addDecoys('', 1), {
    instanceOf: TypeError,
  })

  await t.throwsAsync(
    new SignSDJWT({ scalar: true })
      .setProtectedHeader({ alg: 'ES256' })
      .addDecoys('/scalar', 1)
      .sign(t.context.issuerPrivateKey),
    { instanceOf: TypeError },
  )
  await t.throwsAsync(
    new SignSDJWT({ array: ['value'] })
      .setProtectedHeader({ alg: 'ES256' })
      .setDisclosurePaths(['/array/01'])
      .sign(t.context.issuerPrivateKey),
    { instanceOf: TypeError },
  )
})

test('SignSDJWT rejects non-JSON and reserved Claims Sets', async (t) => {
  const cyclic: Record<string, unknown> = {}
  cyclic.self = cyclic
  t.throws(() => new SignSDJWT(cyclic), { instanceOf: TypeError })
  t.throws(() => new SignSDJWT({ invalid: undefined }), { instanceOf: TypeError })
  t.throws(() => new SignSDJWT({ invalid: Number.NaN }), { instanceOf: TypeError })
  t.throws(() => new SignSDJWT({ invalid: new Date() }), { instanceOf: TypeError })

  const sparse = new Array(1)
  t.throws(() => new SignSDJWT({ sparse }), { instanceOf: TypeError })

  const arrayWithProperty = ['value'] as string[] & { extra?: string }
  arrayWithProperty.extra = 'ignored by JSON.stringify'
  t.throws(() => new SignSDJWT({ arrayWithProperty }), { instanceOf: TypeError })

  const nonEnumerable: Record<string, unknown> = {}
  Object.defineProperty(nonEnumerable, 'hidden', { value: true })
  t.throws(() => new SignSDJWT({ nonEnumerable }), { instanceOf: TypeError })

  for (const payload of [
    { _sd: [] },
    { _sd_alg: 'sha-256' },
    { nested: { _sd_alg: 'sha-256' } },
    { nested: { '...': 'digest' } },
  ]) {
    await t.throwsAsync(
      new SignSDJWT(payload).setProtectedHeader({ alg: 'ES256' }).sign(t.context.issuerPrivateKey),
      { instanceOf: TypeError },
    )
  }
})

test('SignSDJWT rejects private or symmetric cnf.jwk values', async (t) => {
  const { privateKey } = await generateKeyPair('ES256', { extractable: true })
  const privateJwk = await exportJWK(privateKey)

  await t.throwsAsync(
    new SignSDJWT({ cnf: { jwk: privateJwk } })
      .setProtectedHeader({ alg: 'ES256' })
      .sign(t.context.issuerPrivateKey),
    { instanceOf: TypeError },
  )

  await t.throwsAsync(
    new SignSDJWT({ cnf: { jwk: { kty: 'oct', k: 'AA' } } })
      .setProtectedHeader({ alg: 'ES256' })
      .sign(t.context.issuerPrivateKey),
    { instanceOf: TypeError },
  )

  const { publicKey } = await generateKeyPair('ES256', { extractable: true })
  const publicJwk = await exportJWK(publicKey)
  for (const conflicting of [
    { jwk: publicJwk, jwe: 'encrypted-key' },
    { jwk: publicJwk, jku: '' },
    { jwe: 'encrypted-key', jku: 'https://holder.example/jwks' },
  ]) {
    await t.throwsAsync(
      new SignSDJWT({ cnf: conflicting })
        .setProtectedHeader({ alg: 'ES256' })
        .sign(t.context.issuerPrivateKey),
      { instanceOf: TypeError },
    )
  }
})

test('SignSDJWT accepts public asymmetric cnf.jwk and other confirmation methods', async (t) => {
  const { publicKey } = await generateKeyPair('ES256', { extractable: true })
  const publicJwk = await exportJWK(publicKey)

  for (const cnf of [{ jwk: publicJwk }, { kid: 'holder-key' }]) {
    const issued = await new SignSDJWT({ cnf })
      .setProtectedHeader({ alg: 'ES256' })
      .sign(t.context.issuerPrivateKey)
    const credential = await sdJwtReceive(issued, t.context.issuerPublicKey)
    t.deepEqual(credential.payload.cnf, cnf)
  }
})

test('FlattenedSignSDJWT follows FlattenedSign', async (t) => {
  const issued = await new FlattenedSignSDJWT({ permanent: true, concealed: 'value' })
    .setDisclosurePaths(['/concealed'])
    .setProtectedHeader({ alg: 'ES256', typ: 'example+sd-jwt' })
    .setUnprotectedHeader({ kid: 'issuer-key' })
    .sign(t.context.issuerPrivateKey)

  t.is(issued.header.kid, 'issuer-key')
  t.is(issued.header.disclosures.length, 1)
  const credential = await flattenedSdJwtReceive(issued, t.context.issuerPublicKey)
  t.deepEqual(credential.payload, { permanent: true, concealed: 'value' })
})

test('GeneralSignSDJWT follows GeneralSign', async (t) => {
  const issued = await new GeneralSignSDJWT({ concealed: 'value' })
    .setDisclosurePaths(['/concealed'])
    .addSignature(t.context.issuerPrivateKey)
    .setProtectedHeader({ alg: 'ES256' })
    .addSignature(t.context.secondIssuerPrivateKey)
    .setProtectedHeader({ alg: 'ES256' })
    .sign()

  t.is(issued.signatures.length, 2)
  t.is(issued.signatures[0].header.disclosures.length, 1)
  t.false(Object.hasOwn(issued.signatures[1].header || {}, 'disclosures'))

  const first = await generalSdJwtReceive(issued, t.context.issuerPublicKey)
  const second = await generalSdJwtReceive(issued, t.context.secondIssuerPublicKey)
  t.is(first.payload.concealed, 'value')
  t.is(second.payload.concealed, 'value')
})

test('JSON producers reserve SD-JWT unprotected Header Parameters', (t) => {
  t.throws(
    () =>
      new FlattenedSignSDJWT({ value: true })
        .setProtectedHeader({ alg: 'ES256' })
        .setUnprotectedHeader({ disclosures: [] }),
    { code: 'ERR_JWS_INVALID' },
  )

  t.throws(
    () =>
      new GeneralSignSDJWT({ value: true })
        .addSignature(t.context.issuerPrivateKey)
        .setProtectedHeader({ alg: 'ES256' })
        .setUnprotectedHeader({ kb_jwt: 'a.b.c' }),
    { code: 'ERR_JWS_INVALID' },
  )
})

test('JSON producers require typ to be integrity protected', async (t) => {
  t.throws(
    () =>
      new FlattenedSignSDJWT()
        .setProtectedHeader({ alg: 'ES256' })
        .setUnprotectedHeader({ typ: 'example+sd-jwt' }),
    { code: 'ERR_JWS_INVALID' },
  )

  t.throws(
    () =>
      new GeneralSignSDJWT()
        .addSignature(t.context.issuerPrivateKey)
        .setProtectedHeader({ alg: 'ES256' })
        .setUnprotectedHeader({ typ: 'example+sd-jwt' }),
    { code: 'ERR_JWS_INVALID' },
  )

  await t.notThrowsAsync(
    new FlattenedSignSDJWT()
      .setProtectedHeader({ alg: 'ES256', typ: 'example+sd-jwt' })
      .sign(t.context.issuerPrivateKey),
  )

  await t.notThrowsAsync(
    new GeneralSignSDJWT()
      .addSignature(t.context.issuerPrivateKey)
      .setProtectedHeader({ alg: 'ES256', typ: 'example+sd-jwt' })
      .sign(),
  )
})

test('producer headers are not mutated and caller mutation cannot bypass reservations', async (t) => {
  const unprotected = { kid: 'issuer-key' }
  const flattened = new FlattenedSignSDJWT({ value: true })
    .setProtectedHeader({ alg: 'ES256' })
    .setUnprotectedHeader(unprotected)
    .setDisclosurePaths(['/value'])
  const first = await flattened.sign(t.context.issuerPrivateKey)
  const second = await flattened.sign(t.context.issuerPrivateKey)
  t.deepEqual(unprotected, { kid: 'issuer-key' })
  t.not(first.header.disclosures[0], second.header.disclosures[0])

  const protectedHeader: Record<string, unknown> = { alg: 'ES256' }
  const compact = new SignSDJWT({ value: true }).setProtectedHeader(protectedHeader)
  protectedHeader.disclosures = []
  await t.throwsAsync(compact.sign(t.context.issuerPrivateKey), { code: 'ERR_JWS_INVALID' })
})

test('zero-Disclosure serialization and GeneralSignSDJWT errors', async (t) => {
  const compact = await new SignSDJWT()
    .setProtectedHeader({ alg: 'ES256' })
    .sign(t.context.issuerPrivateKey)
  t.true(compact.endsWith('~'))
  t.is(compact.split('~').length, 2)

  const flattened = await new FlattenedSignSDJWT()
    .setProtectedHeader({ alg: 'ES256' })
    .sign(t.context.issuerPrivateKey)
  t.deepEqual(flattened.header.disclosures, [])

  await t.throwsAsync(new GeneralSignSDJWT().sign(), { code: 'ERR_JWS_INVALID' })
})

test('SD-JWT producers reject JWS Unencoded Payload', async (t) => {
  await t.throwsAsync(
    new SignSDJWT()
      .setProtectedHeader({ alg: 'ES256', crit: ['b64'], b64: false })
      .sign(t.context.issuerPrivateKey),
    { code: 'ERR_JWT_INVALID' },
  )

  await t.throwsAsync(
    new FlattenedSignSDJWT()
      .setProtectedHeader({ alg: 'ES256', crit: ['b64'], b64: false })
      .sign(t.context.issuerPrivateKey),
    { code: 'ERR_JWT_INVALID' },
  )

  await t.throwsAsync(
    new SignSDJWT()
      .setProtectedHeader({ alg: 'ES256', b64: false })
      .sign(t.context.issuerPrivateKey),
    { code: 'ERR_JWT_INVALID' },
  )

  await t.throwsAsync(
    new FlattenedSignSDJWT()
      .setProtectedHeader({ alg: 'ES256' })
      .setUnprotectedHeader({ b64: false })
      .sign(t.context.issuerPrivateKey),
    { code: 'ERR_JWT_INVALID' },
  )

  await t.throwsAsync(
    new GeneralSignSDJWT()
      .addSignature(t.context.issuerPrivateKey)
      .setProtectedHeader({ alg: 'ES256' })
      .setUnprotectedHeader({ b64: false })
      .sign(),
    { code: 'ERR_JWT_INVALID' },
  )
})
