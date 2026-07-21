import test from 'ava'

import type * as types from '../../src/types.d.ts'
import * as base64url from '../../src/util/base64url.js'
import {
  calculateSdHash,
  compactSdJwt,
  disclosureDigest,
  formatSdJwt,
  parseDisclosure,
  parseSdJwt,
  processDisclosures,
  selectDisclosures,
} from '../../src/lib/sd.js'

const RFC_DISCLOSURE = 'WyJfMjZiYzRMVC1hYzZxMktJNmNCVzVlcyIsICJmYW1pbHlfbmFtZSIsICJNw7ZiaXVzIl0'
const RFC_DISCLOSURE_DIGEST = 'X9yH0Ajrdm1Oij4tWso9UzzKJvPoDxwmuEcO3XAdRC0'

const invalidJwt = { code: 'ERR_JWT_INVALID' } as const

function encodeJson(value: unknown): string {
  return base64url.encode(JSON.stringify(value))
}

function disclosure(value: unknown[]): string {
  return encodeJson(value)
}

function compactJwt(
  payload: Record<string, unknown> = {},
  header: Record<string, unknown> = { alg: 'ES256' },
): string {
  return `${encodeJson(header)}.${encodeJson(payload)}.AA`
}

function flattenedJws(
  header?: types.JWSHeaderParameters,
  protectedHeader: types.JWSHeaderParameters | undefined = { alg: 'ES256' },
): types.FlattenedJWS {
  const jws: types.FlattenedJWS = {
    payload: encodeJson({}),
    signature: 'AA',
  }
  if (protectedHeader !== undefined) jws.protected = encodeJson(protectedHeader)
  if (header !== undefined) jws.header = header
  return jws
}

function generalJws(
  firstHeader?: types.JWSHeaderParameters,
  secondHeader?: types.JWSHeaderParameters,
): types.GeneralJWS {
  return {
    payload: encodeJson({}),
    signatures: [
      {
        protected: encodeJson({ alg: 'ES256' }),
        signature: 'AA',
        ...(firstHeader === undefined ? undefined : { header: firstHeader }),
      },
      {
        protected: encodeJson({ alg: 'ES256' }),
        signature: 'AQ',
        ...(secondHeader === undefined ? undefined : { header: secondHeader }),
      },
    ],
  }
}

test('RFC 9901 object-property Disclosure vector', async (t) => {
  t.deepEqual(parseDisclosure(RFC_DISCLOSURE), {
    salt: '_26bc4LT-ac6q2KI6cBW5es',
    key: 'family_name',
    value: 'Möbius',
  })
  t.is(await disclosureDigest(RFC_DISCLOSURE), RFC_DISCLOSURE_DIGEST)

  const processed = await processDisclosures(
    { _sd: [RFC_DISCLOSURE_DIGEST], _sd_alg: 'sha-256', permanent: true },
    [RFC_DISCLOSURE],
  )
  t.deepEqual(processed.payload, { permanent: true, family_name: 'Möbius' })
  t.like(processed.disclosureDetails[0], {
    disclosure: RFC_DISCLOSURE,
    digest: RFC_DISCLOSURE_DIGEST,
    key: 'family_name',
    value: 'Möbius',
    path: ['family_name'],
    pointer: '/family_name',
  })
})

test('processed __proto__ claims are safe own data properties', async (t) => {
  const concealed = disclosure(['salt', '__proto__', { polluted: true }])
  const digest = await disclosureDigest(concealed)
  const processed = await processDisclosures({ _sd: [digest] }, [concealed])

  t.true(Object.hasOwn(processed.payload, '__proto__'))
  t.is(Object.getPrototypeOf(processed.payload), Object.prototype)
  t.deepEqual(processed.payload.__proto__, { polluted: true })
  t.is(processed.payload.polluted, undefined)

  const cleartext = JSON.parse('{"__proto__":{"inherited":true}}') as Record<string, unknown>
  const cleartextProcessed = await processDisclosures(cleartext, [])
  t.true(Object.hasOwn(cleartextProcessed.payload, '__proto__'))
  t.is(Object.getPrototypeOf(cleartextProcessed.payload), Object.prototype)
  t.is(cleartextProcessed.payload.inherited, undefined)
})

test('duplicate Disclosures are rejected before processing', async (t) => {
  const digest = await disclosureDigest(RFC_DISCLOSURE)
  await t.throwsAsync(
    processDisclosures({ _sd: [digest] }, [RFC_DISCLOSURE, RFC_DISCLOSURE]),
    invalidJwt,
  )
})

test('Disclosure salts must be strings', async (t) => {
  const invalid = disclosure([42, 'claim', 'value'])
  t.throws(() => parseDisclosure(invalid), invalidJwt)
  await t.throwsAsync(processDisclosures({}, [invalid]), invalidJwt)
})

test('Disclosure base64url and UTF-8 decoding is strict', (t) => {
  const invalidUtf8 = base64url.encode(Uint8Array.of(0xc3, 0x28))

  for (const encoded of [`${RFC_DISCLOSURE}=`, 'AB', invalidUtf8, encodeJson({ claim: true })]) {
    t.throws(() => parseDisclosure(encoded), invalidJwt)
  }
})

test('nested _sd_alg is rejected, including in recursive Disclosures', async (t) => {
  await t.throwsAsync(processDisclosures({ nested: { _sd_alg: 'sha-256' } }, []), invalidJwt)

  const nested = disclosure(['salt', 'nested', { _sd_alg: 'sha-256' }])
  const digest = await disclosureDigest(nested)
  await t.throwsAsync(processDisclosures({ _sd: [digest] }, [nested]), invalidJwt)
})

test('malformed and cleartext ellipsis objects are rejected', async (t) => {
  const digest = await disclosureDigest(RFC_DISCLOSURE)
  const invalidPayloads: Record<string, unknown>[] = [
    { array: [{ '...': digest, additional: true }] },
    { array: [{ '...': 42 }] },
    { nested: { '...': digest } },
    { '...': digest },
  ]

  for (const payload of invalidPayloads) {
    await t.throwsAsync(processDisclosures(payload, []), invalidJwt)
  }
})

test('reserved object-property Disclosure names are rejected', (t) => {
  for (const claim of ['_sd', '_sd_alg', '...']) {
    t.throws(() => parseDisclosure(disclosure(['salt', claim, true])), invalidJwt)
  }
})

test('malformed _sd values and digest lengths are rejected', async (t) => {
  await t.throwsAsync(processDisclosures({ _sd: 'digest' }, []), invalidJwt)
  await t.throwsAsync(processDisclosures({ _sd: [42] }, []), invalidJwt)
  await t.throwsAsync(processDisclosures({ _sd: ['AA'] }, []), invalidJwt)
  await t.throwsAsync(processDisclosures({ _sd_alg: 42 }, []), invalidJwt)
})

test('unreferenced and repeatedly embedded Disclosure digests are rejected', async (t) => {
  await t.throwsAsync(processDisclosures({}, [RFC_DISCLOSURE]), invalidJwt)
  await t.throwsAsync(
    processDisclosures({ _sd: [RFC_DISCLOSURE_DIGEST, RFC_DISCLOSURE_DIGEST] }, [RFC_DISCLOSURE]),
    invalidJwt,
  )

  const child = disclosure(['child-salt', 'child', true])
  const childDigest = await disclosureDigest(child)
  const parent = disclosure(['parent-salt', 'parent', { _sd: [childDigest] }])
  const parentDigest = await disclosureDigest(parent)
  await t.throwsAsync(
    processDisclosures({ _sd: [parentDigest, childDigest] }, [child, parent]),
    invalidJwt,
  )
})

test('Disclosure kind and existing-claim conflicts are rejected', async (t) => {
  const arrayDisclosure = disclosure(['salt', 'array value'])
  const arrayDigest = await disclosureDigest(arrayDisclosure)
  await t.throwsAsync(processDisclosures({ _sd: [arrayDigest] }, [arrayDisclosure]), invalidJwt)

  const objectDisclosure = disclosure(['salt', 'property', true])
  const objectDigest = await disclosureDigest(objectDisclosure)
  await t.throwsAsync(
    processDisclosures({ array: [{ '...': objectDigest }] }, [objectDisclosure]),
    invalidJwt,
  )
  await t.throwsAsync(
    processDisclosures({ property: false, _sd: [objectDigest] }, [objectDisclosure]),
    invalidJwt,
  )
})

test('recursive Disclosure metadata and dependency selection', async (t) => {
  const child = disclosure(['child-salt', 'street', 'Main Street'])
  const childDigest = await disclosureDigest(child)
  const parent = disclosure(['parent-salt', 'address', { _sd: [childDigest] }])
  const parentDigest = await disclosureDigest(parent)
  const processed = await processDisclosures({ _sd: [parentDigest] }, [child, parent])

  t.deepEqual(processed.payload, { address: { street: 'Main Street' } })
  t.like(processed.disclosureDetails[0], {
    pointer: '/address/street',
    parentDigest,
  })
  t.like(processed.disclosureDetails[1], {
    pointer: '/address',
  })
  t.deepEqual(
    selectDisclosures(processed.disclosureDetails, ({ pointer }) => pointer === '/address/street'),
    [child, parent],
  )
})

test('Compact SD-JWT grammar requires an unambiguous trailing component', (t) => {
  const issuerJwt = compactJwt({ _sd: [RFC_DISCLOSURE_DIGEST] })
  const kbJwt = compactJwt({ nonce: 'nonce', aud: 'verifier', iat: 1, sd_hash: 'hash' })

  t.deepEqual(parseSdJwt(`${issuerJwt}~`), {
    jws: issuerJwt,
    disclosures: [],
    kbJwt: undefined,
    serialization: 'compact',
  })
  t.deepEqual(parseSdJwt(`${issuerJwt}~${RFC_DISCLOSURE}~`), {
    jws: issuerJwt,
    disclosures: [RFC_DISCLOSURE],
    kbJwt: undefined,
    serialization: 'compact',
  })
  t.deepEqual(parseSdJwt(`${issuerJwt}~${RFC_DISCLOSURE}~${kbJwt}`), {
    jws: issuerJwt,
    disclosures: [RFC_DISCLOSURE],
    kbJwt,
    serialization: 'compact',
  })

  for (const invalid of [
    issuerJwt,
    `${issuerJwt}~${RFC_DISCLOSURE}`,
    `${issuerJwt}~~`,
    `${issuerJwt}~not-a-jwt`,
    `${issuerJwt}~${RFC_DISCLOSURE}~${kbJwt}~`,
  ]) {
    t.throws(() => parseSdJwt(invalid), invalidJwt)
  }

  t.is(formatSdJwt(issuerJwt, [RFC_DISCLOSURE]), `${issuerJwt}~${RFC_DISCLOSURE}~`)
})

test('Flattened JSON transport parameters are optional, unprotected, and type checked', (t) => {
  const omitted = parseSdJwt(flattenedJws({ kid: 'issuer-key' }))
  t.deepEqual(omitted.disclosures, [])
  t.deepEqual(omitted.jws.header, { kid: 'issuer-key' })

  const kbJwt = compactJwt({ nonce: 'nonce' })
  const input = flattenedJws({
    kid: 'issuer-key',
    disclosures: [RFC_DISCLOSURE],
    kb_jwt: kbJwt,
  })
  const parsed = parseSdJwt(input)
  t.deepEqual(parsed.disclosures, [RFC_DISCLOSURE])
  t.is(parsed.kbJwt, kbJwt)
  t.deepEqual(parsed.jws.header, { kid: 'issuer-key' })
  t.true(Object.hasOwn(input.header!, 'disclosures'))
  t.true(Object.hasOwn(input.header!, 'kb_jwt'))

  for (const header of [
    { disclosures: 'not-an-array' },
    { disclosures: [42] },
    { kb_jwt: '' },
    { kb_jwt: 42 },
  ]) {
    t.throws(() => parseSdJwt(flattenedJws(header)), invalidJwt)
  }

  t.throws(() => parseSdJwt(flattenedJws(undefined, { alg: 'ES256', disclosures: [] })), invalidJwt)
})

test('JWS protected and unprotected header collisions are checked before extraction', (t) => {
  t.throws(
    () =>
      parseSdJwt(
        flattenedJws({ kid: 'unprotected', disclosures: [] }, { alg: 'ES256', kid: 'protected' }),
      ),
    invalidJwt,
  )
})

test('General JSON transport parameters are restricted to the first unprotected header', (t) => {
  const valid = generalJws({ disclosures: [RFC_DISCLOSURE], kid: 'first' }, { kid: 'second' })
  const parsed = parseSdJwt(valid)
  t.is(parsed.serialization, 'general')
  t.deepEqual(parsed.disclosures, [RFC_DISCLOSURE])
  t.deepEqual(parsed.jws.signatures[0].header, { kid: 'first' })
  t.deepEqual(parsed.jws.signatures[1].header, { kid: 'second' })
  t.true(Object.hasOwn(valid.signatures[0].header!, 'disclosures'))

  t.throws(() => parseSdJwt(generalJws(undefined, { disclosures: [] })), invalidJwt)
  t.throws(() => parseSdJwt(generalJws(undefined, { kb_jwt: compactJwt() })), invalidJwt)
})

test('JSON formatting is non-mutating and exact Compact reconstruction uses the first signature', async (t) => {
  const issuer = generalJws({ kid: 'first' }, { kid: 'second' })
  const formatted = formatSdJwt(issuer, [RFC_DISCLOSURE])
  t.false(Object.hasOwn(issuer.signatures[0].header!, 'disclosures'))
  t.deepEqual(formatted.signatures[0].header, {
    kid: 'first',
    disclosures: [RFC_DISCLOSURE],
  })
  t.deepEqual(formatted.signatures[1].header, { kid: 'second' })

  const expected = `${issuer.signatures[0].protected}.${issuer.payload}.${issuer.signatures[0].signature}~${RFC_DISCLOSURE}~`
  t.is(compactSdJwt(issuer, [RFC_DISCLOSURE]), expected)

  const expectedHash = base64url.encode(
    new Uint8Array(await crypto.subtle.digest('sha-256', new TextEncoder().encode(expected))),
  )
  t.is(await calculateSdHash(issuer, [RFC_DISCLOSURE]), expectedHash)
})
