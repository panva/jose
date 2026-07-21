import test from 'ava'

import { createLocalJWKSet, decodeJwt, generateKeyPair, type JWK } from '../../src/index.js'
import { SignSDJWT, sdJwtReceive, sdJwtVerify } from '../../src/sd-jwt/index.js'

// draft-ietf-oauth-sd-jwt-vc-17, Figure 7:
// https://datatracker.ietf.org/doc/html/draft-ietf-oauth-sd-jwt-vc-17#section-2.3.2
const FIGURE_7_PRESENTATION =
  'eyJhbGciOiAiRVMyNTYiLCAidHlwIjogImRjK3NkLWp3dCIsICJraWQiOiAiZG9jLXNp' +
  'Z25lci0wNS0yNS0yMDIyIn0.eyJfc2QiOiBbIjA5dktySk1PbHlUV00wc2pwdV9wZE9C' +
  'VkJRMk0xeTNLaHBINTE1blhrcFkiLCAiMnJzakdiYUMwa3k4bVQwcEpyUGlvV1RxMF9k' +
  'YXcxc1g3NnBvVWxnQ3diSSIsICJFa084ZGhXMGRIRUpidlVIbEVfVkNldUM5dVJFTE9p' +
  'ZUxaaGg3WGJVVHRBIiwgIklsRHpJS2VpWmREd3BxcEs2WmZieXBoRnZ6NUZnbldhLXNO' +
  'NndxUVhDaXciLCAiSnpZakg0c3ZsaUgwUjNQeUVNZmVadTZKdDY5dTVxZWhabzdGN0VQ' +
  'WWxTRSIsICJQb3JGYnBLdVZ1Nnh5bUphZ3ZrRnNGWEFiUm9jMkpHbEFVQTJCQTRvN2NJ' +
  'IiwgIlRHZjRvTGJnd2Q1SlFhSHlLVlFaVTlVZEdFMHc1cnREc3JaemZVYW9tTG8iLCAi' +
  'amRyVEU4WWNiWTRFaWZ1Z2loaUFlX0JQZWt4SlFaSUNlaVVRd1k5UXF4SSIsICJqc3U5' +
  'eVZ1bHdRUWxoRmxNXzNKbHpNYVNGemdsaFFHMERwZmF5UXdMVUs0Il0sICJpc3MiOiAi' +
  'aHR0cHM6Ly9leGFtcGxlLmNvbS9pc3N1ZXIiLCAiaWF0IjogMTY4MzAwMDAwMCwgImV4' +
  'cCI6IDE4ODMwMDAwMDAsICJ2Y3QiOiAiaHR0cHM6Ly9jcmVkZW50aWFscy5leGFtcGxl' +
  'LmNvbS9pZGVudGl0eV9jcmVkZW50aWFsIiwgIl9zZF9hbGciOiAic2hhLTI1NiIsICJj' +
  'bmYiOiB7Imp3ayI6IHsia3R5IjogIkVDIiwgImNydiI6ICJQLTI1NiIsICJ4IjogIlRD' +
  'QUVSMTladnUzT0hGNGo0VzR2ZlNWb0hJUDFJTGlsRGxzN3ZDZUdlbWMiLCAieSI6ICJa' +
  'eGppV1diWk1RR0hWV0tWUTRoYlNJaXJzVmZ1ZWNDRTZ0NGpUOUYySFpRIn19fQ.1XKF1' +
  'HAIY_WPlufVk1lldmKghT9H1k8Ku4XkWpuKAY6McEHu2s9OBdiUNjZxmL9IqyA2bywY6' +
  'exyOYWHK3Pm-w~WyJsa2x4RjVqTVlsR1RQVW92TU5JdkNBIiwgImlzX292ZXJfNjUiLC' +
  'B0cnVlXQ~WyJRZ19PNjR6cUF4ZTQxMmExMDhpcm9BIiwgImFkZHJlc3MiLCB7InN0cmV' +
  'ldF9hZGRyZXNzIjogIjEyMyBNYWluIFN0IiwgImxvY2FsaXR5IjogIkFueXRvd24iLCA' +
  'icmVnaW9uIjogIkFueXN0YXRlIiwgImNvdW50cnkiOiAiVVMifV0~eyJhbGciOiAiRVM' +
  'yNTYiLCAidHlwIjogImtiK2p3dCJ9.eyJub25jZSI6ICIxMjM0NTY3ODkwIiwgImF1ZC' +
  'I6ICJodHRwczovL2V4YW1wbGUuY29tL3ZlcmlmaWVyIiwgImlhdCI6IDE3ODMzNDU3NT' +
  'gsICJzZF9oYXNoIjogIk9aME41TUZTX2tHQnQ1ajhxeGRxcVUxT1pQMHlYeWRxYzV0NW' +
  'FqS3BqZncifQ.CTBtPvZNEfOsOxAZcVI0z0tmC3uI93NvOW7Kr3xsR66HOPj3TmC1cVG' +
  'b8jbHkbMMIhDocF37_epLOi3lZSZgHA'

const ISSUER_PUBLIC_JWK = {
  kid: 'doc-signer-05-25-2022',
  kty: 'EC',
  crv: 'P-256',
  x: 'b28d4MwZMjw8-00CG4xfnn9SLMVMM19SlqZpVb_uNtQ',
  y: 'Xv5zWwuoaTgdS6hV43yI6gBwTnjukmFQQnJ_kCxzqk8',
} satisfies JWK

const HOLDER_PUBLIC_JWK = {
  kty: 'EC',
  crv: 'P-256',
  x: 'TCAER19Zvu3OHF4j4W4vfSVoHIP1ILilDls7vCeGemc',
  y: 'ZxjiWWbZMQGHVWKVQ4hbSIirsVfuecCE6t4jT9F2HZQ',
} satisfies JWK

test('draft-ietf-oauth-sd-jwt-vc-17 Figure 7 presentation verifies', async (t) => {
  const currentDate = new Date(1783345758 * 1000)
  const issuerKeyResolver = createLocalJWKSet({ keys: [ISSUER_PUBLIC_JWK] })

  const verified = await sdJwtVerify(FIGURE_7_PRESENTATION, issuerKeyResolver, {
    typ: 'dc+sd-jwt',
    issuer: 'https://example.com/issuer',
    algorithms: ['ES256'],
    requiredClaims: ['vct'],
    currentDate,
    keyBinding: {
      audience: 'https://example.com/verifier',
      nonce: '1234567890',
      algorithms: ['ES256'],
      maxTokenAge: 60,
      currentDate,
    },
  })

  t.deepEqual(verified.protectedHeader, {
    alg: 'ES256',
    typ: 'dc+sd-jwt',
    kid: 'doc-signer-05-25-2022',
  })
  t.deepEqual(verified.payload, {
    iss: 'https://example.com/issuer',
    iat: 1683000000,
    exp: 1883000000,
    vct: 'https://credentials.example.com/identity_credential',
    cnf: { jwk: HOLDER_PUBLIC_JWK },
    is_over_65: true,
    address: {
      street_address: '123 Main St',
      locality: 'Anytown',
      region: 'Anystate',
      country: 'US',
    },
  })
  t.deepEqual(
    verified.disclosures.map(({ path }) => path),
    ['/is_over_65', '/address'],
  )
  t.deepEqual(verified.keyBinding.protectedHeader, { alg: 'ES256', typ: 'kb+jwt' })
  t.deepEqual(verified.keyBinding.payload, {
    nonce: '1234567890',
    aud: 'https://example.com/verifier',
    iat: 1783345758,
    sd_hash: 'OZ0N5MFS_kGBt5j8qxdqqU1OZP0yXydqc5t5ajKpjfw',
  })
  t.truthy(verified.key)
})

test('SD-JWT VC roundtrip without selectively disclosable claims', async (t) => {
  const issuer = 'https://issuer.example'
  const vct = 'https://credentials.example.com/identity_credential'
  const now = 2_000_000_000
  const currentDate = new Date(now * 1000)
  const { privateKey, publicKey } = await generateKeyPair('ES256')

  const issued = await new SignSDJWT({ vct, given_name: 'Alice' })
    .setProtectedHeader({ alg: 'ES256', typ: 'dc+sd-jwt' })
    .setIssuer(issuer)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(privateKey)

  const [issuerSignedJwt, ...components] = issued.split('~')
  t.deepEqual(components, [''])
  t.false(Object.hasOwn(decodeJwt(issuerSignedJwt), '_sd'))

  const credential = await sdJwtReceive(issued, publicKey, {
    typ: 'dc+sd-jwt',
    issuer,
    algorithms: ['ES256'],
    requiredClaims: ['vct'],
    currentDate,
  })
  t.deepEqual(credential.disclosures, [])

  const presentation = await credential.present()
  t.is(presentation, issued)

  const verified = await sdJwtVerify(presentation, publicKey, {
    typ: 'dc+sd-jwt',
    issuer,
    algorithms: ['ES256'],
    requiredClaims: ['vct'],
    currentDate,
    keyBinding: false,
  })
  t.deepEqual(verified.payload, {
    vct,
    given_name: 'Alice',
    iss: issuer,
    iat: now,
    exp: now + 3600,
  })
  t.deepEqual(verified.disclosures, [])

  await t.throwsAsync(
    sdJwtVerify(presentation, publicKey, {
      typ: 'vc+sd-jwt',
      issuer,
      algorithms: ['ES256'],
      requiredClaims: ['vct'],
      currentDate,
      keyBinding: false,
    }),
    { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED' },
  )

  const missingVct = await new SignSDJWT()
    .setProtectedHeader({ alg: 'ES256', typ: 'dc+sd-jwt' })
    .setIssuer(issuer)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(privateKey)
  await t.throwsAsync(
    sdJwtVerify(missingVct, publicKey, {
      typ: 'dc+sd-jwt',
      issuer,
      algorithms: ['ES256'],
      requiredClaims: ['vct'],
      currentDate,
      keyBinding: false,
    }),
    { code: 'ERR_JWT_CLAIM_VALIDATION_FAILED' },
  )
})
