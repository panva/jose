const test = require('ava')

const { errors, JWK: { generateSync, None }, JWT } = require('../..')

const properKey = generateSync('oct')

const PAYLOAD = { sub: 'foobar', iat: 0 }

test('JWS.None "signs" (JWT)', t => {
  const unsignedJWS = JWT.sign(PAYLOAD, None, { iat: false })
  t.deepEqual(
    JWT.verify(unsignedJWS, None, { complete: true }),
    {
      key: None,
      payload: {
        ...PAYLOAD
      },
      header: {
        alg: 'none'
      },
      signature: ''
    }
  )
})

test('JWS.None fails to verify real tokens (JWT)', t => {
  const signedToken = JWT.sign(PAYLOAD, properKey)
  t.throws(() => {
    JWT.verify(signedToken, None)
  }, {
    instanceOf: errors.JWKKeySupport,
    code: 'ERR_JWK_KEY_SUPPORT',
    message: 'the key does not support HS256 verify algorithm'
  })
})

test('JWS.None fails to verify None signed tokens with a signature (JWT)', t => {
  const unsignedJWS = JWT.sign(PAYLOAD, None)
  t.throws(() => {
    JWT.verify(`${unsignedJWS}fooba`, None)
  }, {
    instanceOf: errors.JWSVerificationFailed,
    code: 'ERR_JWS_VERIFICATION_FAILED',
    message: 'signature verification failed'
  })
})
