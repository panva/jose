import test from 'ava'

import { compactVerify, importJWK, type JWK, type JWTPayload } from '../../src/index.js'
import { sdJwtVerify } from '../../src/sd-jwt/index.js'
import {
  calculateSdHash,
  disclosureDigest,
  parseDisclosure,
  parseSdJwt,
  processDisclosures,
} from '../../src/lib/sd.js'

// RFC 9901, Appendix A.3 and A.5:
// https://www.rfc-editor.org/rfc/rfc9901.html#appendix-A.3

const ISSUER_PUBLIC_JWK = {
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

const ISSUER_JWS =
  'eyJhbGciOiAiRVMyNTYiLCAidHlwIjogImRjK3NkLWp3dCJ9.' +
  'eyJfc2QiOiBbIjBIWm1uU0lQejMzN2tTV2U3QzM0bC0tODhnekppLWVCSjJWel9ISndBVGciLCAiMUNybjAzV21VZVJXcDR6d1B2dkNLWGw5WmFRcC1jZFFWX2dIZGFHU1dvdyIsICIycjAwOWR6dkh1VnJXclJYVDVrSk1tSG5xRUhIbldlME1MVlp3OFBBVEI4IiwgIjZaTklTRHN0NjJ5bWxyT0FrYWRqZEQ1WnVsVDVBMjk5Sjc4U0xoTV9fT3MiLCAiNzhqZzc3LUdZQmVYOElRZm9FTFB5TDBEWVBkbWZabzBKZ1ZpVjBfbEtDTSIsICI5MENUOEFhQlBibjVYOG5SWGtlc2p1MWkwQnFoV3FaM3dxRDRqRi1xREdrIiwgIkkwMGZjRlVvRFhDdWNwNXl5MnVqcVBzc0RWR2FXTmlVbGlOel9hd0QwZ2MiLCAiS2pBWGdBQTlONVdIRUR0UkloNHU1TW4xWnNXaXhoaFdBaVgtQTRRaXdnQSIsICJMYWk2SVU2ZDdHUWFnWFI3QXZHVHJuWGdTbGQzejhFSWdfZnYzZk9aMVdnIiwgIkxlemphYlJxaVpPWHpFWW1WWmY4Uk1pOXhBa2QzX00xTFo4VTdFNHMzdTQiLCAiUlR6M3FUbUZOSGJwV3JyT01aUzQxRjQ3NGtGcVJ2M3ZJUHF0aDZQVWhsTSIsICJXMTRYSGJVZmZ6dVc0SUZNanBTVGIxbWVsV3hVV2Y0Tl9vMmxka2tJcWM4IiwgIldUcEk3UmNNM2d4WnJ1UnBYemV6U2JrYk9yOTNQVkZ2V3g4d29KM2oxY0UiLCAiX29oSlZJUUlCc1U0dXBkTlM0X3c0S2IxTUhxSjBMOXFMR3NoV3E2SlhRcyIsICJ5NTBjemMwSVNDaHlfYnNiYTFkTW9VdUFPUTVBTW1PU2ZHb0VlODF2MUZVIl0sICJpc3MiOiAiaHR0cHM6Ly9waWQtaXNzdWVyLmJ1bmQuZGUuZXhhbXBsZSIsICJpYXQiOiAxNjgzMDAwMDAwLCAiZXhwIjogMTg4MzAwMDAwMCwgInZjdCI6ICJ1cm46ZXVkaTpwaWQ6ZGU6MSIsICJfc2RfYWxnIjogInNoYS0yNTYiLCAiY25mIjogeyJqd2siOiB7Imt0eSI6ICJFQyIsICJjcnYiOiAiUC0yNTYiLCAieCI6ICJUQ0FFUjE5WnZ1M09IRjRqNFc0dmZTVm9ISVAxSUxpbERsczd2Q2VHZW1jIiwgInkiOiAiWnhqaVdXYlpNUUdIVldLVlE0aGJTSWlyc1ZmdWVjQ0U2dDRqVDlGMkhaUSJ9fX0.' +
  'ZOZQTqmq8X1mCyFXi0wbV8xjctX1AlEa5TkdnkKOyWvLfW40XDb5oj9tzkgwff5s44IDnrfAdgLtmTcojs97_Q'

const AGE_EQUAL_OR_OVER_DISCLOSURE =
  'WyJlSzVvNXBIZmd1cFBwbHRqMXFoQUp3IiwgImFnZV9lcXVhbF9vcl9vdmVyIiwgeyJfc2QiOiBbIjF0RWl5elBSWU9Lc2Y3U3NZR01nUFpLc09UMWxRWlJ4SFhBMHI1X0J3a2siLCAiQ1ZLbmx5NVA5MHlKczNFd3R4UWlPdFVjemFYQ1lOQTRJY3pSYW9ock1EZyIsICJhNDQtZzJHcjhfM0FtSncyWFo4a0kxeTBRel96ZTlpT2NXMlczUkxwWEdnIiwgImdrdnkwRnV2QkJ2ajBoczJaTnd4Y3FPbGY4bXUyLWtDRTctTmIyUXh1QlUiLCAiaHJZNEhubUY1YjVKd0M5ZVR6YUZDVWNlSVFBYUlkaHJxVVhRTkNXYmZaSSIsICJ5NlNGclZGUnlxNTBJYlJKdmlUWnFxalFXejB0TGl1Q21NZU8wS3FhekdJIl19XQ'
const AGE_18_DISCLOSURE = 'WyJPQktsVFZsdkxnLUFkd3FZR2JQOFpBIiwgIjE4IiwgdHJ1ZV0'
const NATIONALITIES_DISCLOSURE =
  'WyJsa2x4RjVqTVlsR1RQVW92TU5JdkNBIiwgIm5hdGlvbmFsaXRpZXMiLCBbIkRFIl1d'

const DISCLOSURES = [
  AGE_EQUAL_OR_OVER_DISCLOSURE,
  AGE_18_DISCLOSURE,
  NATIONALITIES_DISCLOSURE,
] as const

const AGE_EQUAL_OR_OVER_DIGEST = '2r009dzvHuVrWrRXT5kJMmHnqEHHnWe0MLVZw8PATB8'
const AGE_18_DIGEST = 'CVKnly5P90yJs3EwtxQiOtUczaXCYNA4IczRaohrMDg'
const NATIONALITIES_DIGEST = 'y50czc0ISChy_bsba1dMoUuAOQ5AMmOSfGoEe81v1FU'

const EXPECTED_SD_HASH = 'PjMYfM07VbJdMxLIluvRNb88JFljSX4n-G43Uc_BSRM'

const KB_JWT =
  'eyJhbGciOiAiRVMyNTYiLCAidHlwIjogImtiK2p3dCJ9.' +
  'eyJub25jZSI6ICIxMjM0NTY3ODkwIiwgImF1ZCI6ICJodHRwczovL3ZlcmlmaWVyLmV4YW1wbGUub3JnIiwgImlhdCI6IDE3NDg1MzcyNDQsICJzZF9oYXNoIjogIlBqTVlmTTA3VmJKZE14TElsdXZSTmI4OEpGbGpTWDRuLUc0M1VjX0JTUk0ifQ.' +
  'f3TeS_1BWEG78EbIJRh5wgv8nYumk7euzu6xgbgpNB4pbQQqgRPWK-vQjlhhgU1EFGZ9LFakFX_0mgul1G_3mw'

const PRESENTATION_WITHOUT_KB = `${ISSUER_JWS}~${DISCLOSURES.join('~')}~`
const PRESENTATION = `${PRESENTATION_WITHOUT_KB}${KB_JWT}`

const ISSUER_PAYLOAD = {
  _sd: [
    '0HZmnSIPz337kSWe7C34l--88gzJi-eBJ2Vz_HJwATg',
    '1Crn03WmUeRWp4zwPvvCKXl9ZaQp-cdQV_gHdaGSWow',
    AGE_EQUAL_OR_OVER_DIGEST,
    '6ZNISDst62ymlrOAkadjdD5ZulT5A299J78SLhM__Os',
    '78jg77-GYBeX8IQfoELPyL0DYPdmfZo0JgViV0_lKCM',
    '90CT8AaBPbn5X8nRXkesju1i0BqhWqZ3wqD4jF-qDGk',
    'I00fcFUoDXCucp5yy2ujqPssDVGaWNiUliNz_awD0gc',
    'KjAXgAA9N5WHEDtRIh4u5Mn1ZsWixhhWAiX-A4QiwgA',
    'Lai6IU6d7GQagXR7AvGTrnXgSld3z8EIg_fv3fOZ1Wg',
    'LezjabRqiZOXzEYmVZf8RMi9xAkd3_M1LZ8U7E4s3u4',
    'RTz3qTmFNHbpWrrOMZS41F474kFqRv3vIPqth6PUhlM',
    'W14XHbUffzuW4IFMjpSTb1melWxUWf4N_o2ldkkIqc8',
    'WTpI7RcM3gxZruRpXzezSbkbOr93PVFvWx8woJ3j1cE',
    '_ohJVIQIBsU4updNS4_w4Kb1MHqJ0L9qLGshWq6JXQs',
    NATIONALITIES_DIGEST,
  ],
  iss: 'https://pid-issuer.bund.de.example',
  iat: 1683000000,
  exp: 1883000000,
  vct: 'urn:eudi:pid:de:1',
  _sd_alg: 'sha-256',
  cnf: { jwk: HOLDER_PUBLIC_JWK },
} satisfies JWTPayload

const PRESENTED_PAYLOAD = {
  iss: 'https://pid-issuer.bund.de.example',
  iat: 1683000000,
  exp: 1883000000,
  vct: 'urn:eudi:pid:de:1',
  cnf: { jwk: HOLDER_PUBLIC_JWK },
  age_equal_or_over: { '18': true },
  nationalities: ['DE'],
}

function decodeJson(bytes: Uint8Array): unknown {
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes))
}

test('RFC 9901 Appendix A.3 exact Issuer-signed JWT verifies', async (t) => {
  const key = await importJWK(ISSUER_PUBLIC_JWK, 'ES256')
  const verified = await compactVerify(ISSUER_JWS, key)

  t.deepEqual(verified.protectedHeader, { alg: 'ES256', typ: 'dc+sd-jwt' })
  t.deepEqual(decodeJson(verified.payload), ISSUER_PAYLOAD)
})

test('RFC 9901 Appendix A.3 Disclosure encodings, digests, and recursion', async (t) => {
  t.deepEqual(parseDisclosure(AGE_18_DISCLOSURE), {
    salt: 'OBKlTVlvLg-AdwqYGbP8ZA',
    key: '18',
    value: true,
  })
  t.deepEqual(parseDisclosure(NATIONALITIES_DISCLOSURE), {
    salt: 'lklxF5jMYlGTPUovMNIvCA',
    key: 'nationalities',
    value: ['DE'],
  })

  t.deepEqual(await Promise.all(DISCLOSURES.map((item) => disclosureDigest(item))), [
    AGE_EQUAL_OR_OVER_DIGEST,
    AGE_18_DIGEST,
    NATIONALITIES_DIGEST,
  ])

  const processed = await processDisclosures(ISSUER_PAYLOAD, DISCLOSURES)
  t.deepEqual(processed.payload, PRESENTED_PAYLOAD)
  t.deepEqual(
    processed.disclosureDetails.map(({ digest, pointer, parentDigest }) => ({
      digest,
      pointer,
      parentDigest,
    })),
    [
      {
        digest: AGE_EQUAL_OR_OVER_DIGEST,
        pointer: '/age_equal_or_over',
        parentDigest: undefined,
      },
      {
        digest: AGE_18_DIGEST,
        pointer: '/age_equal_or_over/18',
        parentDigest: AGE_EQUAL_OR_OVER_DIGEST,
      },
      {
        digest: NATIONALITIES_DIGEST,
        pointer: '/nationalities',
        parentDigest: undefined,
      },
    ],
  )
})

test('RFC 9901 Appendix A.3 exact Key Binding presentation verifies', async (t) => {
  const parsed = parseSdJwt(PRESENTATION)
  t.is(parsed.jws, ISSUER_JWS)
  t.deepEqual(parsed.disclosures, [...DISCLOSURES])
  t.is(parsed.kbJwt, KB_JWT)
  t.is(await calculateSdHash(parsed.jws, parsed.disclosures), EXPECTED_SD_HASH)

  const holderKey = await importJWK(HOLDER_PUBLIC_JWK, 'ES256')
  const verifiedKbJwt = await compactVerify(KB_JWT, holderKey)
  t.deepEqual(verifiedKbJwt.protectedHeader, { alg: 'ES256', typ: 'kb+jwt' })
  t.deepEqual(decodeJson(verifiedKbJwt.payload), {
    nonce: '1234567890',
    aud: 'https://verifier.example.org',
    iat: 1748537244,
    sd_hash: EXPECTED_SD_HASH,
  })

  const issuerKey = await importJWK(ISSUER_PUBLIC_JWK, 'ES256')
  const verified = await sdJwtVerify(PRESENTATION, issuerKey, {
    algorithms: ['ES256'],
    typ: 'dc+sd-jwt',
    issuer: 'https://pid-issuer.bund.de.example',
    requiredClaims: ['vct', 'exp'],
    currentDate: new Date(1748537244 * 1000),
    keyBinding: {
      audience: 'https://verifier.example.org',
      nonce: '1234567890',
      algorithms: ['ES256'],
      maxTokenAge: 60,
      currentDate: new Date(1748537244 * 1000),
    },
  })

  t.deepEqual(verified.payload, PRESENTED_PAYLOAD)
  t.deepEqual(
    verified.disclosures.map(({ path }) => path),
    ['/age_equal_or_over', '/age_equal_or_over/18', '/nationalities'],
  )
  t.deepEqual(verified.keyBinding?.protectedHeader, { alg: 'ES256', typ: 'kb+jwt' })
  t.deepEqual(verified.keyBinding?.payload, {
    nonce: '1234567890',
    aud: 'https://verifier.example.org',
    iat: 1748537244,
    sd_hash: EXPECTED_SD_HASH,
  })
})
