import anyTest, { type ExecutionContext, type TestFn } from 'ava'

import {
  CompactSign,
  FlattenedSign,
  GeneralSign,
  SignJWT,
  base64url,
  exportJWK,
  generateKeyPair,
  type CryptoKey,
  type JWK,
  type JWTHeaderParameters,
} from '../../src/index.js'
import {
  FlattenedSignSDJWT,
  GeneralSignSDJWT,
  SignSDJWT,
  flattenedSdJwtReceive,
  flattenedSdJwtVerify,
  generalSdJwtReceive,
  generalSdJwtVerify,
  sdJwtReceive,
  sdJwtVerify,
  type SDJWTKeyBindingVerificationOptions,
} from '../../src/sd-jwt/index.js'
import { calculateSdHash, formatSdJwt, parseSdJwt } from '../../src/lib/sd.js'

const encoder = new TextEncoder()
const audience = 'https://verifier.example'
const nonce = 'transaction-nonce'
const now = 2_000_000_000

interface Context {
  issuerPrivateKey: CryptoKey
  issuerPublicKey: CryptoKey
  secondIssuerPrivateKey: CryptoKey
  secondIssuerPublicKey: CryptoKey
  holderPrivateKey: CryptoKey
  holderPublicKey: CryptoKey
  holderPublicJwk: JWK
  otherPrivateKey: CryptoKey
  otherPublicKey: CryptoKey
}

const test = anyTest as TestFn<Context>

test.before(async (t) => {
  const [issuer, secondIssuer, holder, other] = await Promise.all([
    generateKeyPair('ES256'),
    generateKeyPair('ES256'),
    generateKeyPair('ES256', { extractable: true }),
    generateKeyPair('ES256'),
  ])
  t.context.issuerPrivateKey = issuer.privateKey
  t.context.issuerPublicKey = issuer.publicKey
  t.context.secondIssuerPrivateKey = secondIssuer.privateKey
  t.context.secondIssuerPublicKey = secondIssuer.publicKey
  t.context.holderPrivateKey = holder.privateKey
  t.context.holderPublicKey = holder.publicKey
  t.context.holderPublicJwk = await exportJWK(holder.publicKey)
  t.context.otherPrivateKey = other.privateKey
  t.context.otherPublicKey = other.publicKey
})

function keyBindingPolicy(
  overrides: Partial<SDJWTKeyBindingVerificationOptions> = {},
): SDJWTKeyBindingVerificationOptions {
  return {
    audience,
    nonce,
    algorithms: ['ES256'],
    maxTokenAge: 60,
    currentDate: new Date(now * 1000),
    ...overrides,
  }
}

async function compactWithKeyBinding(
  t: ExecutionContext<Context>,
  payload: Record<string, unknown> = {},
) {
  const issued = await new SignSDJWT({
    permanent: true,
    concealed: 'value',
    cnf: { jwk: t.context.holderPublicJwk },
    ...payload,
  })
    .setProtectedHeader({ alg: 'ES256', typ: 'example+sd-jwt' })
    .setDisclosurePaths(['/concealed'])
    .sign(t.context.issuerPrivateKey)
  const credential = await sdJwtReceive(issued, t.context.issuerPublicKey)
  const presentation = await credential
    .addKeyBinding(t.context.holderPrivateKey)
    .setPayload({ profile_claim: 'custom' })
    .setProtectedHeader({ alg: 'ES256' })
    .setAudience(audience)
    .setNonce(nonce)
    .setIssuedAt(now)
    .present(['/concealed'])
  return { credential, issued, presentation }
}

async function attachCompactKeyBinding(presentation: string, kbJwt: string): Promise<string> {
  const parsed = parseSdJwt(presentation)
  return formatSdJwt(parsed.jws, parsed.disclosures, kbJwt)
}

async function signKeyBinding(
  t: ExecutionContext<Context>,
  payload: Record<string, unknown>,
  protectedHeader: JWTHeaderParameters = { alg: 'ES256', typ: 'kb+jwt' },
): Promise<string> {
  return new SignJWT(payload).setProtectedHeader(protectedHeader).sign(t.context.holderPrivateKey)
}

test('Compact receive, present, and verify require an explicit Key Binding policy', async (t) => {
  const issued = await new SignSDJWT({ permanent: true, first: 'one', second: 'two' })
    .setProtectedHeader({ alg: 'ES256' })
    .setDisclosurePaths(['/first', '/second'])
    .sign(t.context.issuerPrivateKey)

  const credential = await sdJwtReceive(issued, t.context.issuerPublicKey)
  t.deepEqual(credential.payload, { permanent: true, first: 'one', second: 'two' })

  const presentation = await credential.present(['/first'])
  const verified = await sdJwtVerify(presentation, t.context.issuerPublicKey, {
    keyBinding: false,
  })
  t.deepEqual(verified.payload, { permanent: true, first: 'one' })
  t.deepEqual(
    verified.disclosures.map(({ path }) => path),
    ['/first'],
  )
  t.false(Object.hasOwn(verified, 'keyBinding'))

  await t.throwsAsync(sdJwtVerify(presentation, t.context.issuerPublicKey, {} as never), {
    instanceOf: TypeError,
  })
  await t.throwsAsync(
    sdJwtVerify(presentation, t.context.issuerPublicKey, {
      keyBinding: keyBindingPolicy(),
    }),
    { code: 'ERR_JWT_INVALID' },
  )
})

test('recursive child presentation automatically selects its parent Disclosure', async (t) => {
  const issued = await new SignSDJWT({
    address: { street: 'Main Street', locality: 'Vienna' },
    permanent: true,
  })
    .setProtectedHeader({ alg: 'ES256' })
    .setDisclosurePaths(['/address/street', '/address'])
    .sign(t.context.issuerPrivateKey)

  const credential = await sdJwtReceive(issued, t.context.issuerPublicKey)
  t.deepEqual(credential.disclosures.map(({ path }) => path).sort(), [
    '/address',
    '/address/street',
  ])

  const childPresentation = await credential.present(['/address/street'])
  const child = await sdJwtVerify(childPresentation, t.context.issuerPublicKey, {
    keyBinding: false,
  })
  t.deepEqual(child.payload, {
    address: { street: 'Main Street', locality: 'Vienna' },
    permanent: true,
  })
  t.deepEqual(child.disclosures.map(({ path }) => path).sort(), ['/address', '/address/street'])

  const parentPresentation = await credential.present(['/address'])
  const parent = await sdJwtVerify(parentPresentation, t.context.issuerPublicKey, {
    keyBinding: false,
  })
  t.deepEqual(parent.payload, {
    address: { locality: 'Vienna' },
    permanent: true,
  })
})

test('Verifier Disclosure paths use projected array indices', async (t) => {
  const issued = await new SignSDJWT({ items: ['first', 'second'] })
    .setProtectedHeader({ alg: 'ES256' })
    .setDisclosurePaths(['/items/0', '/items/1'])
    .sign(t.context.issuerPrivateKey)

  const credential = await sdJwtReceive(issued, t.context.issuerPublicKey)
  t.deepEqual(
    credential.disclosures.map(({ path }) => path),
    ['/items/0', '/items/1'],
  )

  const presentation = await credential.present(['/items/1'])
  const verified = await sdJwtVerify(presentation, t.context.issuerPublicKey, {
    keyBinding: false,
  })
  t.deepEqual(verified.payload.items, ['second'])
  t.deepEqual(
    verified.disclosures.map(({ path }) => path),
    ['/items/0'],
  )
})

test('credential metadata, payload, and JSON inputs are mutable and isolated', async (t) => {
  const issued = await new FlattenedSignSDJWT({ nested: { concealed: { mutable: true } } })
    .setProtectedHeader({ alg: 'ES256' })
    .setUnprotectedHeader({ kid: 'issuer-key' })
    .setDisclosurePaths(['/nested/concealed'])
    .sign(t.context.issuerPrivateKey)
  const original = structuredClone(issued)

  const credential = await flattenedSdJwtReceive(issued, t.context.issuerPublicKey)
  t.deepEqual(issued, original)
  const mutablePayload = credential.payload as {
    nested: { concealed: { mutable: boolean } }
  }
  mutablePayload.nested.concealed.mutable = false
  const mutableProtectedHeader = credential.protectedHeader as Record<string, unknown>
  mutableProtectedHeader.alg = 'none'
  const mutableUnprotectedHeader = credential.unprotectedHeader as Record<string, unknown>
  mutableUnprotectedHeader.kid = 'changed'
  const publicDisclosures = credential.disclosures as unknown as Array<{ value: unknown }>
  publicDisclosures[0].value = 'changed'
  publicDisclosures.length = 0

  const paths = ['/nested/concealed'] as const
  const first = await credential.present(paths)
  t.deepEqual(paths, ['/nested/concealed'])
  first.header.disclosures.length = 0
  const second = await credential.present(paths)
  t.is(second.header.disclosures.length, 1)
  t.deepEqual(issued, original)

  const verified = await flattenedSdJwtVerify(second, t.context.issuerPublicKey, {
    keyBinding: false,
  })
  t.deepEqual(verified.payload, { nested: { concealed: { mutable: true } } })
  t.is(verified.protectedHeader?.alg, 'ES256')
  t.is(verified.unprotectedHeader?.kid, 'issuer-key')
})

test('Flattened and General JSON serialization receive, present, and verify', async (t) => {
  const flattened = await new FlattenedSignSDJWT({ permanent: true, concealed: 'flat' })
    .setProtectedHeader({ alg: 'ES256' })
    .setUnprotectedHeader({ kid: 'first' })
    .setDisclosurePaths(['/concealed'])
    .sign(t.context.issuerPrivateKey)

  const general = await new GeneralSignSDJWT({ permanent: true, concealed: 'general' })
    .setDisclosurePaths(['/concealed'])
    .addSignature(t.context.issuerPrivateKey)
    .setProtectedHeader({ alg: 'ES256' })
    .setUnprotectedHeader({ kid: 'first' })
    .addSignature(t.context.secondIssuerPrivateKey)
    .setProtectedHeader({ alg: 'ES256' })
    .setUnprotectedHeader({ kid: 'second' })
    .sign()

  const flattenedCredential = await flattenedSdJwtReceive(flattened, t.context.issuerPublicKey)
  const flattenedPresentation = await flattenedCredential.present(['/concealed'])
  const flattenedResult = await flattenedSdJwtVerify(
    flattenedPresentation,
    t.context.issuerPublicKey,
    { keyBinding: false },
  )
  t.deepEqual(flattenedResult.payload, { permanent: true, concealed: 'flat' })
  t.is(flattenedResult.unprotectedHeader?.kid, 'first')

  // General verification may succeed through a later signature while transport metadata remains
  // anchored to the first signature as required by RFC 9901.
  const generalCredential = await generalSdJwtReceive(general, t.context.secondIssuerPublicKey)
  const generalPresentation = await generalCredential.present(['/concealed'])
  const generalResult = await generalSdJwtVerify(
    generalPresentation,
    t.context.secondIssuerPublicKey,
    { keyBinding: false },
  )
  t.deepEqual(generalResult.payload, { permanent: true, concealed: 'general' })
  t.is(generalResult.unprotectedHeader?.kid, 'second')
  t.is(generalPresentation.signatures[0].header?.disclosures?.length, 1)
  t.false(Object.hasOwn(generalPresentation.signatures[1].header || {}, 'disclosures'))

  await t.throwsAsync(sdJwtReceive(flattened as never, t.context.issuerPublicKey), {
    code: 'ERR_JWT_INVALID',
  })
  await t.throwsAsync(flattenedSdJwtReceive(general as never, t.context.secondIssuerPublicKey), {
    code: 'ERR_JWT_INVALID',
  })
  await t.throwsAsync(
    generalSdJwtVerify(flattenedPresentation as never, t.context.issuerPublicKey, {
      keyBinding: false,
    }),
    { code: 'ERR_JWT_INVALID' },
  )
})

test('Flattened and General JSON inputs need no SD-JWT transport header', async (t) => {
  const payload = encoder.encode(JSON.stringify({ permanent: true }))
  const flattened = await new FlattenedSign(payload)
    .setProtectedHeader({ alg: 'ES256' })
    .sign(t.context.issuerPrivateKey)

  t.false(Object.hasOwn(flattened, 'header'))

  const flattenedCredential = await flattenedSdJwtReceive(flattened, t.context.issuerPublicKey)
  const flattenedPresentation = await flattenedCredential.present()
  t.deepEqual(flattenedPresentation.header?.disclosures, [])

  for (const input of [flattened, flattenedPresentation]) {
    const result = await flattenedSdJwtVerify(input, t.context.issuerPublicKey, {
      keyBinding: false,
    })
    t.deepEqual(result.payload, { permanent: true })
    t.false(Object.hasOwn(result, 'unprotectedHeader'))
  }

  const general = await new GeneralSign(payload)
    .addSignature(t.context.issuerPrivateKey)
    .setProtectedHeader({ alg: 'ES256' })
    .sign()

  t.false(Object.hasOwn(general.signatures[0], 'header'))

  const generalCredential = await generalSdJwtReceive(general, t.context.issuerPublicKey)
  const generalPresentation = await generalCredential.present()
  t.deepEqual(generalPresentation.signatures[0].header?.disclosures, [])

  for (const input of [general, generalPresentation]) {
    const result = await generalSdJwtVerify(input, t.context.issuerPublicKey, {
      keyBinding: false,
    })
    t.deepEqual(result.payload, { permanent: true })
    t.false(Object.hasOwn(result, 'unprotectedHeader'))
  }
})

test('JWT typ validation requires an integrity-protected typ', async (t) => {
  const issued = await new FlattenedSignSDJWT({ value: true })
    .setProtectedHeader({ typ: 'example+sd-jwt' })
    .setUnprotectedHeader({ alg: 'ES256' })
    .sign(t.context.issuerPrivateKey)

  const credential = await flattenedSdJwtReceive(issued, t.context.issuerPublicKey, {
    typ: 'example+sd-jwt',
  })
  t.deepEqual(credential.payload, { value: true })
  t.deepEqual(credential.protectedHeader, { typ: 'example+sd-jwt' })

  const presentation = await credential.present()
  const verified = await flattenedSdJwtVerify(presentation, t.context.issuerPublicKey, {
    typ: 'example+sd-jwt',
    keyBinding: false,
  })
  t.deepEqual(verified.protectedHeader, { typ: 'example+sd-jwt' })

  await t.throwsAsync(
    flattenedSdJwtReceive(issued, t.context.issuerPublicKey, { typ: 'different+sd-jwt' }),
    { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED' },
  )

  const payload = encoder.encode(JSON.stringify({ value: true }))
  const unprotected = await new FlattenedSign(payload)
    .setUnprotectedHeader({ alg: 'ES256', typ: 'example+sd-jwt' })
    .sign(t.context.issuerPrivateKey)
  await t.throwsAsync(
    flattenedSdJwtReceive(unprotected, t.context.issuerPublicKey, {
      typ: 'example+sd-jwt',
    }),
    { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED' },
  )
})

test('Issuer verification rejects MACs and unencoded-payload headers', async (t) => {
  const payload = encoder.encode(JSON.stringify({ value: true }))
  const secret = crypto.getRandomValues(new Uint8Array(32))
  const mac = await new CompactSign(payload).setProtectedHeader({ alg: 'HS256' }).sign(secret)
  await t.throwsAsync(sdJwtReceive(`${mac}~`, secret as never), {
    code: 'ERR_JWT_INVALID',
  })

  for (const input of [
    await new FlattenedSign(payload)
      .setProtectedHeader({ alg: 'ES256', b64: false })
      .sign(t.context.issuerPrivateKey),
    await new FlattenedSign(payload)
      .setProtectedHeader({ alg: 'ES256' })
      .setUnprotectedHeader({ b64: false })
      .sign(t.context.issuerPrivateKey),
  ]) {
    await t.throwsAsync(flattenedSdJwtReceive(input, t.context.issuerPublicKey), {
      code: 'ERR_JWT_INVALID',
    })
  }
})

test('Holder and bare Verifier reject malformed or conflicting cnf claims', async (t) => {
  const privateJwk = await exportJWK(t.context.holderPrivateKey)
  for (const cnf of [
    null,
    [],
    'holder-key',
    { jwk: privateJwk },
    { jwk: { kty: 'oct', k: base64url.encode(crypto.getRandomValues(new Uint8Array(32))) } },
    { jwk: { kty: 'EC', crv: 'P-256', x: 'missing-y' } },
    { jwk: t.context.holderPublicJwk, jwe: 'encrypted-key' },
    { jwk: t.context.holderPublicJwk, jku: 'https://holder.example/jwks' },
    { jwe: 'encrypted-key', jku: 'https://holder.example/jwks' },
  ]) {
    const issuerSignedJwt = await new CompactSign(encoder.encode(JSON.stringify({ cnf })))
      .setProtectedHeader({ alg: 'ES256' })
      .sign(t.context.issuerPrivateKey)
    const issued = `${issuerSignedJwt}~`

    await t.throwsAsync(sdJwtReceive(issued, t.context.issuerPublicKey), {
      code: 'ERR_JWT_INVALID',
    })
    await t.throwsAsync(
      sdJwtVerify(issued, t.context.issuerPublicKey, {
        keyBinding: false,
      }),
      { code: 'ERR_JWT_INVALID' },
    )
  }
})

test('Compact cnf.jwk Key Binding succeeds and is exposed in the result', async (t) => {
  const { presentation } = await compactWithKeyBinding(t)
  const result = await sdJwtVerify(presentation, t.context.issuerPublicKey, {
    keyBinding: keyBindingPolicy(),
  })

  t.deepEqual(result.payload, {
    permanent: true,
    concealed: 'value',
    cnf: { jwk: t.context.holderPublicJwk },
  })
  t.is(result.disclosures.length, 1)
  t.true(Object.hasOwn(result, 'keyBinding'))
  t.is(result.keyBinding?.protectedHeader.typ, 'kb+jwt')
  t.is(result.keyBinding?.protectedHeader.alg, 'ES256')
  t.is(result.keyBinding?.payload.aud, audience)
  t.is(result.keyBinding?.payload.nonce, nonce)
  t.is(result.keyBinding?.payload.iat, now)
  t.is(result.keyBinding?.payload.profile_claim, 'custom')
  t.deepEqual(result.keyBinding?.key, t.context.holderPublicJwk)

  await t.throwsAsync(sdJwtVerify(presentation, t.context.issuerPublicKey, { keyBinding: false }), {
    code: 'ERR_JWT_INVALID',
  })
  await t.throwsAsync(sdJwtReceive(presentation, t.context.issuerPublicKey), {
    code: 'ERR_JWT_INVALID',
  })
})

test('Flattened and General Key Binding use RFC Compact reconstruction for sd_hash', async (t) => {
  const flattened = await new FlattenedSignSDJWT({
    concealed: 'flat',
    cnf: { jwk: t.context.holderPublicJwk },
  })
    .setProtectedHeader({ alg: 'ES256' })
    .setUnprotectedHeader({ kid: 'first' })
    .setDisclosurePaths(['/concealed'])
    .sign(t.context.issuerPrivateKey)
  const flattenedCredential = await flattenedSdJwtReceive(flattened, t.context.issuerPublicKey)
  const flattenedPresentation = await flattenedCredential
    .addKeyBinding(t.context.holderPrivateKey)
    .setProtectedHeader({ alg: 'ES256' })
    .setAudience(audience)
    .setNonce(nonce)
    .setIssuedAt(now)
    .present(['/concealed'])
  const flattenedResult = await flattenedSdJwtVerify(
    flattenedPresentation,
    t.context.issuerPublicKey,
    { keyBinding: keyBindingPolicy() },
  )
  t.is(flattenedResult.payload.concealed, 'flat')

  const general = await new GeneralSignSDJWT({
    concealed: 'general',
    cnf: { jwk: t.context.holderPublicJwk },
  })
    .setDisclosurePaths(['/concealed'])
    .addSignature(t.context.issuerPrivateKey)
    .setProtectedHeader({ alg: 'ES256' })
    .addSignature(t.context.secondIssuerPrivateKey)
    .setProtectedHeader({ alg: 'ES256' })
    .sign()
  const generalCredential = await generalSdJwtReceive(general, t.context.secondIssuerPublicKey)
  const generalPresentation = await generalCredential
    .addKeyBinding(t.context.holderPrivateKey)
    .setProtectedHeader({ alg: 'ES256' })
    .setAudience(audience)
    .setNonce(nonce)
    .setIssuedAt(now)
    .present(['/concealed'])
  const generalResult = await generalSdJwtVerify(
    generalPresentation,
    t.context.secondIssuerPublicKey,
    { keyBinding: keyBindingPolicy() },
  )
  t.is(generalResult.payload.concealed, 'general')
})

test('Key Binding enforces expected nonce, audience, algorithm, and maximum age', async (t) => {
  const { presentation, credential } = await compactWithKeyBinding(t)

  await t.throwsAsync(
    sdJwtVerify(presentation, t.context.issuerPublicKey, {
      keyBinding: keyBindingPolicy({ nonce: 'different' }),
    }),
    { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED' },
  )
  await t.throwsAsync(
    sdJwtVerify(presentation, t.context.issuerPublicKey, {
      keyBinding: keyBindingPolicy({ audience: 'https://other.example' }),
    }),
    { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED' },
  )
  await t.throwsAsync(
    sdJwtVerify(presentation, t.context.issuerPublicKey, {
      keyBinding: keyBindingPolicy({ algorithms: ['ES384'] }),
    }),
    { code: 'ERR_JOSE_ALG_NOT_ALLOWED' },
  )

  const stale = await credential
    .addKeyBinding(t.context.holderPrivateKey)
    .setProtectedHeader({ alg: 'ES256' })
    .setAudience(audience)
    .setNonce(nonce)
    .setIssuedAt(now - 120)
    .present(['/concealed'])
  await t.throwsAsync(
    sdJwtVerify(stale, t.context.issuerPublicKey, {
      keyBinding: keyBindingPolicy({ maxTokenAge: 60 }),
    }),
    { code: 'ERR_JWT_EXPIRED' },
  )
})

test('Key Binding rejects array audience, wrong sd_hash, wrong typ, and invalid signature', async (t) => {
  const issued = await new SignSDJWT({
    concealed: 'value',
    cnf: { jwk: t.context.holderPublicJwk },
  })
    .setProtectedHeader({ alg: 'ES256' })
    .setDisclosurePaths(['/concealed'])
    .sign(t.context.issuerPrivateKey)
  const credential = await sdJwtReceive(issued, t.context.issuerPublicKey)
  const bare = await credential.present(['/concealed'])

  const variants = [
    await signKeyBinding(t, {
      aud: [audience],
      nonce,
      iat: now,
      sd_hash: 'irrelevant',
    }),
    await signKeyBinding(t, {
      aud: audience,
      nonce,
      iat: now,
      sd_hash: 'wrong',
    }),
    await signKeyBinding(
      t,
      { aud: audience, nonce, iat: now, sd_hash: 'wrong' },
      { alg: 'ES256', typ: 'JWT' },
    ),
  ]

  for (const kbJwt of variants) {
    const presentation = await attachCompactKeyBinding(bare, kbJwt)
    await t.throwsAsync(
      sdJwtVerify(presentation, t.context.issuerPublicKey, {
        keyBinding: keyBindingPolicy(),
      }),
      { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED' },
    )
  }

  const { presentation: valid } = await compactWithKeyBinding(t)
  const parsed = parseSdJwt(valid)
  const segments = parsed.kbJwt!.split('.')
  segments[2] = `${segments[2][0] === 'A' ? 'B' : 'A'}${segments[2].slice(1)}`
  const invalidSignature = formatSdJwt(parsed.jws, parsed.disclosures, segments.join('.'))
  await t.throwsAsync(
    sdJwtVerify(invalidSignature, t.context.issuerPublicKey, {
      keyBinding: keyBindingPolicy(),
    }),
    { code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' },
  )
})

test('Key Binding rejects missing or mismatched Holder-key association', async (t) => {
  const withoutConfirmation = await new SignSDJWT({ concealed: 'value' })
    .setProtectedHeader({ alg: 'ES256' })
    .setDisclosurePaths(['/concealed'])
    .sign(t.context.issuerPrivateKey)
  const unboundCredential = await sdJwtReceive(withoutConfirmation, t.context.issuerPublicKey)
  const unboundPresentation = await unboundCredential
    .addKeyBinding(t.context.holderPrivateKey)
    .setProtectedHeader({ alg: 'ES256' })
    .setAudience(audience)
    .setNonce(nonce)
    .setIssuedAt(now)
    .present(['/concealed'])
  await t.throwsAsync(
    sdJwtVerify(unboundPresentation, t.context.issuerPublicKey, {
      keyBinding: keyBindingPolicy(),
    }),
    { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED' },
  )

  const issued = await new SignSDJWT({
    concealed: 'value',
    cnf: { jwk: t.context.holderPublicJwk },
  })
    .setProtectedHeader({ alg: 'ES256' })
    .setDisclosurePaths(['/concealed'])
    .sign(t.context.issuerPrivateKey)
  const credential = await sdJwtReceive(issued, t.context.issuerPublicKey)
  const wrongKey = await credential
    .addKeyBinding(t.context.otherPrivateKey)
    .setProtectedHeader({ alg: 'ES256' })
    .setAudience(audience)
    .setNonce(nonce)
    .setIssuedAt(now)
    .present(['/concealed'])
  await t.throwsAsync(
    sdJwtVerify(wrongKey, t.context.issuerPublicKey, {
      keyBinding: keyBindingPolicy(),
    }),
    { code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' },
  )
})

test('Key Binding rejects malformed, conflicting, private, and symmetric cnf.jwk values', async (t) => {
  const privateJwk = await exportJWK(t.context.holderPrivateKey)
  const confirmations = [
    { jwk: privateJwk },
    { jwk: { kty: 'oct', k: base64url.encode(crypto.getRandomValues(new Uint8Array(32))) } },
    { jwk: { kty: 'EC', crv: 'P-256', x: 'missing-y' } },
    { jwk: { ...t.context.holderPublicJwk, p: 'private-material' } },
    { jwk: t.context.holderPublicJwk, jwe: 'encrypted-key' },
    { jwk: t.context.holderPublicJwk, jku: 'https://holder.example/jwks' },
  ]

  for (const cnf of confirmations) {
    const jws = await new CompactSign(encoder.encode(JSON.stringify({ cnf })))
      .setProtectedHeader({ alg: 'ES256' })
      .sign(t.context.issuerPrivateKey)
    const sdHash = await calculateSdHash(jws, [])
    const kbJwt = await signKeyBinding(t, {
      aud: audience,
      nonce,
      iat: now,
      sd_hash: sdHash,
    })

    await t.throwsAsync(
      sdJwtVerify(formatSdJwt(jws, [], kbJwt), t.context.issuerPublicKey, {
        keyBinding: keyBindingPolicy(),
      }),
      { code: 'ERR_JWT_INVALID' },
    )
  }
})

test('custom confirmation method resolver binds and validates the Holder key', async (t) => {
  const issued = await new SignSDJWT({
    concealed: 'value',
    cnf: { kid: 'holder-key' },
  })
    .setProtectedHeader({ alg: 'ES256' })
    .setDisclosurePaths(['/concealed'])
    .sign(t.context.issuerPrivateKey)
  const credential = await sdJwtReceive(issued, t.context.issuerPublicKey)
  const presentation = await credential
    .addKeyBinding(t.context.holderPrivateKey)
    .setProtectedHeader({ alg: 'ES256' })
    .setAudience(audience)
    .setNonce(nonce)
    .setIssuedAt(now)
    .present(['/concealed'])

  let calls = 0
  const result = await sdJwtVerify(presentation, t.context.issuerPublicKey, {
    keyBinding: keyBindingPolicy({
      getKey(protectedHeader, token, confirmation, payload) {
        calls++
        t.is(protectedHeader.typ, 'kb+jwt')
        t.truthy(token.signature)
        t.deepEqual(confirmation, { kid: 'holder-key' })
        t.deepEqual(payload.cnf, confirmation)
        return t.context.holderPublicKey
      },
    }),
  })
  t.is(calls, 1)
  t.is(result.keyBinding?.key, t.context.holderPublicKey)

  await t.throwsAsync(
    sdJwtVerify(presentation, t.context.issuerPublicKey, {
      keyBinding: keyBindingPolicy({ getKey: () => t.context.otherPublicKey }),
    }),
    { code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' },
  )
})

test('Holder rejects an issued SD-JWT+KB and invalid Key Binding inputs', async (t) => {
  const { credential, presentation } = await compactWithKeyBinding(t)
  await t.throwsAsync(sdJwtReceive(presentation, t.context.issuerPublicKey), {
    code: 'ERR_JWT_INVALID',
  })

  for (const claim of ['aud', 'nonce', 'iat', 'sd_hash'] as const) {
    t.throws(
      () =>
        credential
          .addKeyBinding(t.context.holderPrivateKey)
          .setPayload({ [claim]: 'application-controlled' }),
      {
        instanceOf: TypeError,
        message: `Key Binding JWT ${claim} is managed by the builder`,
      },
    )
  }

  await t.throwsAsync(
    credential
      .addKeyBinding(crypto.getRandomValues(new Uint8Array(32)) as never)
      .setProtectedHeader({ alg: 'ES256' })
      .setAudience(audience)
      .setNonce(nonce)
      .present(['/concealed']),
    { instanceOf: TypeError },
  )
  await t.throwsAsync(
    credential
      .addKeyBinding(t.context.holderPrivateKey)
      .setProtectedHeader({ alg: 'HS256' })
      .setAudience(audience)
      .setNonce(nonce)
      .present(['/concealed']),
    { instanceOf: TypeError },
  )
  await t.throwsAsync(
    credential
      .addKeyBinding(t.context.holderPrivateKey)
      .setAudience(audience)
      .setNonce(nonce)
      .present(['/concealed']),
    { instanceOf: TypeError },
  )
})

test('JWT claims are validated only after applying Disclosures', async (t) => {
  const subject = await new SignSDJWT({ sub: 'selectively-disclosed' })
    .setProtectedHeader({ alg: 'ES256' })
    .setDisclosurePaths(['/sub'])
    .sign(t.context.issuerPrivateKey)
  const credential = await sdJwtReceive(subject, t.context.issuerPublicKey, {
    subject: 'selectively-disclosed',
  })
  t.is(credential.payload.sub, 'selectively-disclosed')
  const subjectPresentation = await credential.present(['/sub'])
  const subjectResult = await sdJwtVerify(subjectPresentation, t.context.issuerPublicKey, {
    subject: 'selectively-disclosed',
    keyBinding: false,
  })
  t.is(subjectResult.payload.sub, 'selectively-disclosed')

  // The safe producer forbids selectively disclosing exp, so construct the signed regression
  // vector directly to prove that an expired disclosed claim cannot bypass validation.
  const disclosure = base64url.encode(JSON.stringify(['salt', 'exp', 1]))
  const digest = base64url.encode(
    new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(disclosure))),
  )
  const jws = await new CompactSign(encoder.encode(JSON.stringify({ _sd: [digest] })))
    .setProtectedHeader({ alg: 'ES256' })
    .sign(t.context.issuerPrivateKey)
  const expired = formatSdJwt(jws, [disclosure])

  await t.throwsAsync(sdJwtReceive(expired, t.context.issuerPublicKey), {
    code: 'ERR_JWT_EXPIRED',
  })
  await t.throwsAsync(sdJwtVerify(expired, t.context.issuerPublicKey, { keyBinding: false }), {
    code: 'ERR_JWT_EXPIRED',
  })
})
