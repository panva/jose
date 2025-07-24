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

test('AKP JWK', async (t) => {
  const akp = {
    kty: 'AKP',
    alg: 'ML-DSA-44',
    pub: 'unH59k4RuutY-pxvu24U5h8YZD2rSVtHU5qRZsoBmBMcRPgmu9VuNOVdteXi1zNIXjnqJg_GAAxepLqA00Vc3lO0bzRIKu39VFD8Lhuk8l0V-cFEJC-zm7UihxiQMMUEmOFxe3x1ixkKZ0jqmqP3rKryx8tSbtcXyfea64QhT6XNje2SoMP6FViBDxLHBQo2dwjRls0k5a-XSQSu2OTOiHLoaWsLe8pQ5FLNfTDqmkrawDEdZyxr3oSWJAsHQxRjcIiVzZuvwxYy1zl2STiP2vy_fTBaPemkleynQzqPg7oPCyXEE8bjnJbrfWkbNNN8438e6tHPIX4l7zTuzz98YPhLjt_d6EBdT4MldsYe-Y4KLyjaGHcAlTkk9oa5RhRwW89T0z_t1DSO3dvfKLUGXh8gd1BD6Fz5MfgpF5NjoafnQEqDjsAAhrCXY4b-Y3yYJEdX4_dp3dRGdHG_rWcPmgX4JG7lCnser4f8QGnDriqiAzJYEXeS8LzUngg_0bx0lqv_KcyU5IaLISFO0xZSU5mmEPvdSoDnyAcV8pV44qhLtAvd29n0ehG259oRihtljTWeiu9V60a1N2tbZVl5mEqSK-6_xZvNYA1TCdzNctvweH24unV7U3wer9XA9Q6kvJWDVJ4oKaQsKMrCSMlteBJMRxWbGK7ddUq6F7GdQw-3j2M-qdJvVKm9UPjY9rc1lPgol25-oJxTu7nxGlbJUH-4m5pevAN6NyZ6lfhbjWTKlxkrEKZvQXs_Yf6cpXEwpI_ZJeriq1UC1XHIpRkDwdOY9MH3an4RdDl2r9vGl_IwlKPNdh_5aF3jLgn7PCit1FNJAwC8fIncAXgAlgcXIpRXdfJk4bBiO89GGccSyDh2EgXYdpG3XvNgGWy7npuSoNTE7WIyblAk13UQuO4sdCbMIuriCdyfE73mvwj15xgb07RZRQtFGlFTmnFcIdZ90zDrWXDbANntv7KCKwNvoTuv64bY3HiGbj-NQ-U9eMylWVpvr4hrXcES8c9K3PqHWADZC0iIOvlzFv4VBoc_wVflcOrL_SIoaNFCNBAZZq-2v5lAgpJTqVOtqJ_HVraoSfcKy5g45p-qULunXj6Jwq21fobQiKubBKKOZwcJFyJD7F4ACKXOrz-HIvSHMCWW_9dVrRuCpJw0s0aVFbRqopDNhu446nqb4_EDYQM1tTHMozPd_jKxRRD0sH75X8ZoToxFSpLBDbtdWcenxj-zBf6IGWfZnmaetjKEBYJWC7QDQx1A91pJVJCEgieCkoIfTqkeQuePpIyu48g2FG3P1zjRF-kumhUTfSjo5qS0YiZQy0E1BMs6M11EvuxXRsHClLHoy5nLYI2Sj4zjVjYyxSHyPRPGGo9hwB34yWxzYNtPPGiqXS_dNCpi_zRZwRY4lCGrQ-hYTEWIK1Dm5OlttvC4_eiQ1dv63NiGkLRJ5kJA3bICN0fzCDY-MBqnd1cWn8YVBijVkgtaoascjL9EywDgJdeHnXK0eeOvUxHHhXJVkNqcibn8O4RQdpVU60TSA-uiu675ytIjcBHC6kTv8A8pmkj_4oypPd-F92YIJC741swkYQoeIHj8rE-ThcMUkF7KqC5VORbZTRp8HsZSqgiJcIPaouuxd1-8Rxrid3fXkE6p8bkrysPYoxWEJgh7ZFsRCPDWX-yTeJwFN0PKFP1j0F6YtlLfK5wv-c4F8ZQHA_-yc_gODicy7KmWDZgbTP07e7gEWzw4MFRrndjbDQ',
  }

  await t.throwsAsync(calculateJwkThumbprint({ ...akp, alg: undefined }), {
    code: 'ERR_JWK_INVALID',
    message: '"alg" (Algorithm) Parameter missing or invalid',
  })

  await t.throwsAsync(calculateJwkThumbprint({ ...akp, pub: undefined }), {
    code: 'ERR_JWK_INVALID',
    message: '"pub" (Public key) Parameter missing or invalid',
  })

  t.is(await calculateJwkThumbprint(akp), 'T4xl70S7MT6Zeq6r9V9fPJGVn76wfnXJ21-gyo0Gu6o')
})
