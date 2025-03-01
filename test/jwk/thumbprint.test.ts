import test from 'ava'

import { calculateJwkThumbprint, calculateJwkThumbprintUri } from '../../src/index.js'

const jwk = {
  kty: 'RSA',
  n: '0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78LhWx4cbbfAAtVT86zwu1RK7aPFFxuhDR1L6tSoc_BJECPebWKRXjBZCiFV4n3oknjhMstn64tZ_2W-5JsGY4Hc5n9yBXArwl93lqt7_RN5w6Cf0h4QyQ5v-65YGjQR0_FDW2QvzqY368QQMicAtaSqzs8KJZgnYb9c7d0zgdAZHzu6qMQvRL5hajrn1n91CbOpbISD08qNLyrdkt-bFTWhAI4vMQFh6WeZu0fM4lFd2NcRwr3XPksINHaQ-G_xBniIqbw0Ls1jF44-csFCur-kEgU8awapJzKnqDKgw',
  e: 'AQAB',
  alg: 'RS256',
}

test('https://www.rfc-editor.org/rfc/rfc7638#section-3.1', async (t) => {
  t.is(await calculateJwkThumbprint(jwk), 'NzbLsXh8uDCcd-6MNwXF4W_7noWXFZAfHkxZsRGC9Xs')
  t.is(await calculateJwkThumbprint(jwk, 'sha256'), 'NzbLsXh8uDCcd-6MNwXF4W_7noWXFZAfHkxZsRGC9Xs')
  t.is(
    await calculateJwkThumbprint(jwk, 'sha384'),
    'R9_OfJjSjaw8Fuum86UzK5ixTdN9bo9BaqPSiseq89DWfmqCdpSgUHus-cxDUNc8',
  )
  t.is(
    await calculateJwkThumbprint(jwk, 'sha512'),
    'DpvEwocfn3FjeWWQjcJHzWrpKTIymKwgoL1xVgQcud48-qZDSRCr1zfWZQdHAJn_ciqXqPTSARyg-L-NyNGpVA',
  )
})

test('https://www.rfc-editor.org/rfc/rfc9278', async (t) => {
  t.is(
    await calculateJwkThumbprintUri(jwk),
    'urn:ietf:params:oauth:jwk-thumbprint:sha-256:NzbLsXh8uDCcd-6MNwXF4W_7noWXFZAfHkxZsRGC9Xs',
  )
  t.is(
    await calculateJwkThumbprintUri(jwk, 'sha256'),
    'urn:ietf:params:oauth:jwk-thumbprint:sha-256:NzbLsXh8uDCcd-6MNwXF4W_7noWXFZAfHkxZsRGC9Xs',
  )
  t.is(
    await calculateJwkThumbprintUri(jwk, 'sha384'),
    'urn:ietf:params:oauth:jwk-thumbprint:sha-384:R9_OfJjSjaw8Fuum86UzK5ixTdN9bo9BaqPSiseq89DWfmqCdpSgUHus-cxDUNc8',
  )
  t.is(
    await calculateJwkThumbprintUri(jwk, 'sha512'),
    'urn:ietf:params:oauth:jwk-thumbprint:sha-512:DpvEwocfn3FjeWWQjcJHzWrpKTIymKwgoL1xVgQcud48-qZDSRCr1zfWZQdHAJn_ciqXqPTSARyg-L-NyNGpVA',
  )
})

test('Key must be one of type CryptoKey, KeyObject, or JSON Web Key.', async (t) => {
  await t.throwsAsync(calculateJwkThumbprint(true), {
    instanceOf: TypeError,
    message: /Key must be one of type CryptoKey, KeyObject, or JSON Web Key./,
  })
  await t.throwsAsync(calculateJwkThumbprint(null), {
    instanceOf: TypeError,
    message: /Key must be one of type CryptoKey, KeyObject, or JSON Web Key./,
  })
  await t.throwsAsync(calculateJwkThumbprint(Boolean), {
    instanceOf: TypeError,
    message: /Key must be one of type CryptoKey, KeyObject, or JSON Web Key./,
  })
  await t.throwsAsync(calculateJwkThumbprint([]), {
    instanceOf: TypeError,
    message: /Key must be one of type CryptoKey, KeyObject, or JSON Web Key./,
  })
  await t.throwsAsync(calculateJwkThumbprint(''), {
    instanceOf: TypeError,
    message: /Key must be one of type CryptoKey, KeyObject, or JSON Web Key./,
  })
  const nullPrototype = Object.create(null)
  nullPrototype.crv = 'P-256'
  nullPrototype.kty = 'EC'
  nullPrototype.x = 'q3zAwR_kUwtdLEwtB2oVfucXiLHmEhu9bJUFYjJxYGs'
  nullPrototype.y = '8h0D-ONoU-iZqrq28TyUxEULxuGwJZGMJYTMbeMshvI'
  await t.notThrowsAsync(calculateJwkThumbprint(nullPrototype))
})

test('JWK kty must be recognized', async (t) => {
  await t.throwsAsync(calculateJwkThumbprint({ kty: 'unrecognized' }), {
    code: 'ERR_JOSE_NOT_SUPPORTED',
    message: '"kty" (Key Type) Parameter missing or unsupported',
  })
})

test('EC JWK', async (t) => {
  const ec = {
    crv: 'P-256',
    kty: 'EC',
    x: 'q3zAwR_kUwtdLEwtB2oVfucXiLHmEhu9bJUFYjJxYGs',
    y: '8h0D-ONoU-iZqrq28TyUxEULxuGwJZGMJYTMbeMshvI',
  }

  await t.throwsAsync(calculateJwkThumbprint({ ...ec, crv: undefined }), {
    code: 'ERR_JWK_INVALID',
    message: '"crv" (Curve) Parameter missing or invalid',
  })
  await t.throwsAsync(calculateJwkThumbprint({ ...ec, x: undefined }), {
    code: 'ERR_JWK_INVALID',
    message: '"x" (X Coordinate) Parameter missing or invalid',
  })
  await t.throwsAsync(calculateJwkThumbprint({ ...ec, y: undefined }), {
    code: 'ERR_JWK_INVALID',
    message: '"y" (Y Coordinate) Parameter missing or invalid',
  })
  t.is(await calculateJwkThumbprint(ec), 'ZrBaai73Hi8Fg4MElvDGzIne2NsbI75RHubOViHYE5Q')
})

test('OKP JWK', async (t) => {
  const okp = {
    crv: 'Ed25519',
    kty: 'OKP',
    x: '5fL1GDeyNTIxtuzTeFnvZTo4Oz0EkMfAdhIJA-EFn0w',
  }

  await t.throwsAsync(calculateJwkThumbprint({ ...okp, crv: undefined }), {
    code: 'ERR_JWK_INVALID',
    message: '"crv" (Subtype of Key Pair) Parameter missing or invalid',
  })
  await t.throwsAsync(calculateJwkThumbprint({ ...okp, x: undefined }), {
    code: 'ERR_JWK_INVALID',
    message: '"x" (Public Key) Parameter missing or invalid',
  })
  t.is(await calculateJwkThumbprint(okp), '1OzNmMHhNzbSJyoePAtdoVedRZlFvER3K3RAzCrfX0k')
})

test('AKP JWK', async (t) => {
  const akp = {
    kty: 'AKP',
    alg: 'ML-DSA-65',
    pub: 'QksvJn5Y1bO0TXGs_Gpla7JpUNV8YdsciAvPof6rRD8JQquL2619cIq7w1YHj22ZolInH-YsdAkeuUr7m5JkxQqIjg3-2AzV-yy9NmfmDVOevkSTAhnNT67RXbs0VaJkgCufSbzkLudVD-_91GQqVa3mk4aKRgy-wD9PyZpOMLzP-opHXlOVOWZ067galJN1h4gPbb0nvxxPWp7kPN2LDlOzt_tJxzrfvC1PjFQwNSDCm_l-Ju5X2zQtlXyJOTZSLQlCtB2C7jdyoAVwrftUXBFDkisElvgmoKlwBks23fU0tfjhwc0LVWXqhGtFQx8GGBQ-zol3e7P2EXmtIClf4KbgYq5u7Lwu848qwaItyTt7EmM2IjxVth64wHlVQruy3GXnIurcaGb_qWg764qZmteoPl5uAWwuTDX292Sa071S7GfsHFxue5lydxIYvpVUu6dyfwuExEubCovYMfz_LJd5zNTKMMatdbBJg-Qd6JPuXznqc1UYC3CccEXCLTOgg_auB6EUdG0b_cy-5bkEOHm7Wi4SDipGNig_ShzUkkot5qSqPZnd2I9IqqToi_0ep2nYLBB3ny3teW21Qpccoom3aGPt5Zl7fpzhg7Q8zsJ4sQ2SuHRCzgQ1uxYlFx21VUtHAjnFDSoMOkGyo4gH2wcLR7-z59EPPNl51pljyNefgCnMSkjrBPyz1wiET-uqi23f8Bq2TVk1jmUFxOwdfLsU7SIS30WOzvwD_gMDexUFpMlEQyL1-Y36kaTLjEWGCi2tx1FTULttQx5JpryPW6lW5oKw5RMyGpfRliYCiRyQePYqipZGoxOHpvCWhCZIN4meDY7H0RxWWQEpiyCzRQgWkOtMViwao6Jb7wZWbLNMebwLJeQJXWunk-gTEeQaMykVJobwDUiX-E_E7fSybVRTZXherY1jrvZKh8C5Gi5VADg5Vs319uN8-dVILRyOOlvjjxclmsRcn6HEvTvxd9MS7lKm2gI8BXIqhzgnTdqNGwTpmDHPV8hygqJWxWXCltBSSgY6OkGkioMAmXjZjYq_Ya9o6AE7WU_hUdm-wZmQLExwtJWEIBdDxrUxA9L9JL3weNyQtaGItPjXcheZiNBBbJTUxXwIYLnXtT1M0mHzMqGFFWXVKsN_AIdHyv4yDzY9m-tuQRfbQ_2K7r5eDOL1Tj8DZ-s8yXG74MMBqOUvlglJNgNcbuPKLRPbSDoN0E3BYkfeDgiUrXy34a5-vU-PkAWCsgAh539wJUUBxqw90V1Du7eTHFKDJEMSFYwusbPhEX4ZTwoeTHg--8Ysn4HCFWLQ00pfBCteqvMvMflcWwVfTnogcPsJb1bEFVSc3nTzhk6Ln8J-MplyS0Y5mGBEtVko_WlyeFsoDCWj4hqrgU7L-ww8vsCRSQfskH8lodiLzj0xmugiKjWUXbYq98x1zSnB9dmPy5P3UNwwMQdpebtR38N9I-jup4Bzok0-JsaOe7EORZ8ld7kAgDWa4K7BAxjc2eD540Apwxs-VLGFVkXbQgYYeDNG2tW1Xt20-XezJqZVUl6-IZXsqc7DijwNInO3fT5o8ZAcLKUUlzSlEXe8sIlHaxjLoJ-oubRtlKKUbzWOHeyxmYZSxYqQhSQj4sheedGXJEYWJ-Y5DRqB-xpy-cftxL10fdXIUhe1hWFBAoQU3b5xRY8KCytYnfLhsFF4O49xhnax3vuumLpJbCqTXpLureoKg5PvWfnpFPB0P-ZWQN35mBzqbb3ZV6U0rU55DvyXTuiZOK2Z1TxbaAd1OZMmg0cpuzewgueV-Nh_UubIqNto5RXCd7vqgqdXDUKAiWyYegYIkD4wbGMqIjxV8Oo2ggOcSj9UQPS1rD5u0rLckAzsxyty9Q5JsmKa0w8Eh7Jwe4Yob4xPVWWbJfm916avRgzDxXo5gmY7txdGFYHhlolJKdhBU9h6f0gtKEtbiUzhp4IWsqAR8riHQs7lLVEz6P537a4kL1r5FjfDf_yjJDBQmy_kdWMDqaNln-MlKK8eENjUO-qZGy0Ql4bMZtNbHXjfJUuSzapA-RqYfkqSLKgQUOW8NTDKhUk73yqCU3TQqDEKaGAoTsPscyMm7u_8QrvUK8kbc-XnxrWZ0BZJBjdinzh2w-QvjbWQ5mqFp4OMgY94__tIU8vvCUNJiYA1RdyodlfPfH5-avpxOCvBD6C7ZIDyQ-6huGEQEAb6DP8ydWIZQ8xY603DoEKKXkJWcP6CJo3nHFEdj_vcEbDQ-WESDpcQFa1fRIiGuALj-sEWcjGdSHyE8QATOcuWl4TLVzRPKAf4tCXx1zyvhJbXQu0jf0yfzVpOhPun4n-xqK4SxPBCeuJOkQ2VG9jDXWH4pnjbAcrqjveJqVti7huMXTLGuqU2uoihBw6mGqu_WSlOP2-XTEyRyvxbv2t-z9V6GPt1V9ceBukA0oGwtJqgD-q7NXFK8zhw7desI5PZMXf3nuVgbJ3xdvAlzkmm5f9RoqQS6_hqwPQEcclq1MEZ3yML5hc99TDtZWy9gGkhR0Hs3QJxxgP7bEqGFP-HjTPnJsrGaT6TjKP7qCxJlcFKLUr5AU_kxMULeUysWWtSGJ9mpxBvsyW1Juo',
  }

  await t.throwsAsync(calculateJwkThumbprint({ ...akp, alg: undefined }), {
    code: 'ERR_JWK_INVALID',
    message: '"alg" (JWK Algorithm) Parameter missing or invalid',
  })
  await t.throwsAsync(calculateJwkThumbprint({ ...akp, pub: undefined }), {
    code: 'ERR_JWK_INVALID',
    message: '"pub" (Public Key) Parameter missing or invalid',
  })
  t.is(await calculateJwkThumbprint(akp), 'Suiu29qbfuaBaR4Ats-c6XQBePB_OpAxAwcTR_0KXVM')
})

test('RSA JWK', async (t) => {
  const rsa = {
    e: 'AQAB',
    kty: 'RSA',
    n: 'ok6WYUlmj2J1p-Sm0kwaZlAbWetUooe2LR6iAOJfntavWlyBO0shK_550YG3lQ6R1YeKisNAqbQ1pjqo3vwvR_v_AWtZ1gY1h6KX4DhCv0nNMexZ4g67LxEweoQ4_InMMiwMyQ3CRVJ3P1w0TQZYqzfSye-llY39tyzHeHeuotgrZrM427iUuIJdN38nZ2vW9VpK3bo_Nsvl12ZBe6x7DBzWEFHqQDFyjy8lH8EZyxqDArLA7T5OAcEdkm3RI8jBbsrUD9IySCE5SdEU3n0VGNGkT88DFU85QGvLpL2ITbGX0amaJvxYjIRhIYTfZS6Mqoxr6K1LIwP8pu0VD2Ca5Q',
  }

  await t.throwsAsync(calculateJwkThumbprint({ ...rsa, e: undefined }), {
    code: 'ERR_JWK_INVALID',
    message: '"e" (Exponent) Parameter missing or invalid',
  })
  await t.throwsAsync(calculateJwkThumbprint({ ...rsa, n: undefined }), {
    code: 'ERR_JWK_INVALID',
    message: '"n" (Modulus) Parameter missing or invalid',
  })
  t.is(await calculateJwkThumbprint(rsa), 'dQiQXSGtV4XcPK143Cu2-ZSsQtVNjQZrleUMs9nLnKQ')
})

test('oct JWK', async (t) => {
  const oct = {
    k: 'FyCq1CKBflh3I5gikEjpYrdOXllzxB_yc02za8ERknI',
    kty: 'oct',
  }

  await t.throwsAsync(calculateJwkThumbprint({ ...oct, k: undefined }), {
    code: 'ERR_JWK_INVALID',
    message: '"k" (Key Value) Parameter missing or invalid',
  })
  t.is(await calculateJwkThumbprint(oct), 'prDKy90VJzrDTpm8-W2Q_pv_kzrX_zyZ7ANjRAasDxc')
})
