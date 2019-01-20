const test = require('ava')

const { verify } = require('../../lib/jwt')

const fixtures = require('../fixtures')

const oct = Buffer.from('foo')

const empties = {
  HS256: [oct, 'eyJhbGciOiJIUzI1NiJ9.e30.wFzc1AaKc-h2sBmMo-q5Btx4pthqj4E1uI9iieszJB4'],
  HS384: [oct, 'eyJhbGciOiJIUzM4NCJ9.e30.hoxjcQRPLn3wGXBykB2WQFbRiwSM6DQEQaRF1HK8IkBMagxlsXl9tig9jeRmxyr0'],
  HS512: [oct, 'eyJhbGciOiJIUzUxMiJ9.e30.TbtVTdmZC0L9tIR2MrFUQVD1WEdTUIYZRHv6hV14WvbPB7xhxQq0Obf-XcUTlMLEadnc8dsbLkWO4oRAsn3Fgg'],
  RS256: [fixtures.PEM.RSA.private, 'eyJhbGciOiJSUzI1NiJ9.e30.UJ3uM7z7mtwef9cru3MqO-G-8jLFLm4_vvW8kbPwIlLK4-J037vKE0oKHCu6kzFxlV8TwmYG8Otv4MtM3DlnbJED76E0OG0akkjXcAVQmjEVDq1maLePgZwCiwjhiAYOISXJCe__l0-NXkgHSma49uMqF2DDMK46XveOLWveKyj008SPCtGJNMal2mcCWceta1ay6IQ8_bsVnRCziWsN-2x4AM4BjF0hbE0Qv0regEPpPCVERKuFfQg_wT2CpJQFjf0qqgfYwZk-F-hE3AvBpkTnU-zd-5rxh_8ZuPpbj1xnRPVIni9FUkjkcDTtU1ZqY6d1T-WdfISGwRIx-mI9Rw'],
  RS384: [fixtures.PEM.RSA.private, 'eyJhbGciOiJSUzM4NCJ9.e30.dJ78iwcXqKu5x4UqdJjt8Gk88e8XaAm1j4VurNRlWjR7pDQDtJv9a9yMgBpndc1LHgiDUDEPyDEf-PkKFL9LCmsc3QuJCJleJiLpwJAFiSLh4O9M0oCXWA-rNt3zuSAT7TZJOfOWcYoN8JrhJtUMeJbmssRa6q85Umt9-x3GPFq5B5N4N14_hXeoOyq-BfkW7hRfn3s4WaDS1wnRioU_i8FZDhgaYjuToD3qpbh1NODPu4eAGSBiGnFS2B7vL3igSx6o6tufXAMKe3uEeV6A_vLw8CS5PcRBI0SJb1ZoE6PpuG3a_QAhWOrwlEqI7kdrGsBI_6dn6fua37mYz5NDfA'],
  RS512: [fixtures.PEM.RSA.private, 'eyJhbGciOiJSUzUxMiJ9.e30.TjpvzV_wg9tZcCTHoC0WfGocXlx7uHru1JDciJuCH9K2UxR-zKw4oYOeVWAWXfCjdksfq6dFHMcP1XOljjrwZndcd0DxngTePeI7KhNBUuoBRMW6UZgAVUxu6fGGKKIw2_iH-fhnYNcS2uAdJawmtSwrIOIYziSHHY4vPZR2cFQpZDRY_kLLzWVvjVRbYdQgGrAlpV9iwKvdfL24TRPNhDx4_PK8fdr92KFUv7RQEHB5B13n26jEM6hzAaGH9EBdZOj7qdQhDrheedytrkVrQrqsEZnpTY_NaGP9pWYJO0JOSWQFXGEuFwJbuD4pjYcyeyNNNO2LcaVBdlgETaQHmQ'],
  ES256: [fixtures.PEM['P-256'].private, 'eyJhbGciOiJFUzI1NiJ9.e30.oFrJJCBiFG9VKFoB0SUWOE9nc4LP5ftKPupczd23stw8rAG-acek8mSvPtQwteq4C7Ztl4kAvedIwya0nyNdsQ'],
  ES384: [fixtures.PEM['P-384'].private, 'eyJhbGciOiJFUzM4NCJ9.e30.Rl7rliQOo8L8kA83-lkDPiK6kwi_NPanU9tdpYB94Bja3W_fnqQbpkiKgjij9BB1Aaj5mlKcovSzRJFTKLaI0CUAsxETrg6FscHtKC2nog0bXHFRKBtuRjO7vFCg381S'],
  ES512: [fixtures.PEM['P-521'].private, 'eyJhbGciOiJFUzUxMiJ9.e30.AcE4SOw8dm6gXAthcm1eY4m1cVZk844Xnt26X8bsahyc7xcb-zIJpwzqsKRX-H_rYaPM1RUkTgFJbLEnCuYvv8qSAV1mJUvjJqVlWfkQE2NByiLf1eFDR2YA8T5i9dAM6NLobl5B0koUd8m9YHj4tfgRWNdorQs3WZ7tkxfq-jXu1OeP']
}

const jwtverify = (t, jwt, key, ePayload, options) => {
  t.deepEqual(verify(jwt, key, options), ePayload)
}

// TODO: thrown error, description and code assertion
const jwtverifyfails = (t, jwt, key, options) => {
  t.throws(() => verify(jwt, key, options))
}

Object.entries(empties).forEach(([alg, [key, jwt]]) => {
  test(`verifies ${alg}`, jwtverify, jwt, key, {})
})

test('may return complete parsed JWT', jwtverify, empties.HS256[1], oct, {
  header: { alg: 'HS256' },
  payload: {},
  signature: 'wFzc1AaKc-h2sBmMo-q5Btx4pthqj4E1uI9iieszJB4'
}, { algorithms: 'HS256', complete: true })

test('passes alg option', jwtverify, empties.HS256[1], oct, {}, { algorithms: ['HS256'] })
test('verifies alg option', jwtverifyfails, empties.HS256[1], oct, { algorithms: ['HS384'] })

// test.todo passes issuer option
test('verifies issuer option', jwtverifyfails, empties.HS256[1], oct, { issuer: 'foo' })

// test.todo passes subject option
test('verifies subject option', jwtverifyfails, empties.HS256[1], oct, { subject: 'foo' })

// test.todo passes nonce option
test('verifies nonce option', jwtverifyfails, empties.HS256[1], oct, { nonce: 'foo' })

// test.todo passes jti option
test('verifies jti option', jwtverifyfails, empties.HS256[1], oct, { jti: 'foo' })
test('verifies jwtid option', jwtverifyfails, empties.HS256[1], oct, { jwtid: 'foo' })
