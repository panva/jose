const test = require('ava')

const { errors, JWK: { generateSync, None, isKey }, JWS } = require('../..')

const properKey = generateSync('oct')

test('JWS.None is an instance of a key but not really', t => {
  t.true(isKey(None))
  t.is(None.alg, 'none')
  t.is(None.type, 'unsecured')
  t.true(None.algorithms() instanceof Set)
  t.deepEqual([...None.algorithms()], ['none'])
  t.deepEqual([...None.algorithms('sign')], ['none'])
  t.deepEqual([...None.algorithms('verify')], ['none'])
  t.deepEqual([...None.algorithms('encrypt')], [])
  t.deepEqual([...None.algorithms('foobar')], [])
  t.is(None.thumbprint, undefined)
  t.is(None.kid, undefined)
})

test('JWS.None "signs"', t => {
  const unsignedJWS = JWS.sign('foo', None)
  t.deepEqual(
    JWS.verify(unsignedJWS, None, { complete: true }),
    {
      key: None,
      payload: Buffer.from('foo'),
      protected: {
        alg: 'none'
      }
    }
  )
})

test('JWS.None "signs" flattened', t => {
  const unsignedJWS = JWS.sign.flattened('foo', None)
  t.deepEqual(
    unsignedJWS,
    {
      payload: 'Zm9v',
      protected: 'eyJhbGciOiJub25lIn0',
      signature: ''
    }
  )
  t.deepEqual(
    JWS.verify(unsignedJWS, None, { complete: true }),
    {
      key: None,
      payload: Buffer.from('foo'),
      protected: {
        alg: 'none'
      }
    }
  )
})

test('JWS.None "signs" general', t => {
  const sign = new JWS.Sign('foo')
  sign.recipient(None)
  sign.recipient(None)
  const unsignedJWS = sign.sign('general')

  t.deepEqual(
    unsignedJWS,
    {
      payload: 'Zm9v',
      signatures: [
        {
          protected: 'eyJhbGciOiJub25lIn0',
          signature: ''
        },
        {
          protected: 'eyJhbGciOiJub25lIn0',
          signature: ''
        }
      ]
    }
  )
  t.deepEqual(
    JWS.verify(unsignedJWS, None, { complete: true }),
    {
      key: None,
      payload: Buffer.from('foo'),
      protected: {
        alg: 'none'
      }
    }
  )
})

test('JWS.None fails to verify real tokens', t => {
  const signedToken = JWS.sign('foo', properKey)
  t.throws(() => {
    JWS.verify(signedToken, None)
  }, {
    instanceOf: errors.JWKKeySupport,
    code: 'ERR_JWK_KEY_SUPPORT',
    message: 'the key does not support HS256 verify algorithm'
  })
})

test('JWS.None fails to verify None signed tokens with a signature', t => {
  const unsignedJWS = JWS.sign('foo', None)
  t.throws(() => {
    JWS.verify(`${unsignedJWS}fooba`, None)
  }, {
    instanceOf: errors.JWSVerificationFailed,
    code: 'ERR_JWS_VERIFICATION_FAILED',
    message: 'signature verification failed'
  })
})
