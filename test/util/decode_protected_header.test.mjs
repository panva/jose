import test from 'ava'

const { decodeProtectedHeader } = await import('#dist')

test('invalid inputs', (t) => {
  t.throws(() => decodeProtectedHeader(null), {
    instanceOf: TypeError,
    message: 'Invalid Token or Protected Header formatting',
  })

  t.throws(() => decodeProtectedHeader('.'), {
    instanceOf: TypeError,
    message: 'Invalid Token or Protected Header formatting',
  })

  t.throws(() => decodeProtectedHeader('ew..'), {
    instanceOf: TypeError,
    message: 'Invalid Token or Protected Header formatting',
  })

  t.throws(() => decodeProtectedHeader('bnVsbA..'), {
    instanceOf: TypeError,
    message: 'Invalid Token or Protected Header formatting',
  })

  t.throws(() => decodeProtectedHeader('W10..'), {
    instanceOf: TypeError,
    message: 'Invalid Token or Protected Header formatting',
  })

  t.throws(() => decodeProtectedHeader('...'), {
    instanceOf: TypeError,
    message: 'Invalid Token or Protected Header formatting',
  })

  t.throws(() => decodeProtectedHeader('ew....'), {
    instanceOf: TypeError,
    message: 'Invalid Token or Protected Header formatting',
  })

  t.throws(() => decodeProtectedHeader('bnVsbA....'), {
    instanceOf: TypeError,
    message: 'Invalid Token or Protected Header formatting',
  })

  t.throws(() => decodeProtectedHeader('W10....'), {
    instanceOf: TypeError,
    message: 'Invalid Token or Protected Header formatting',
  })

  t.throws(() => decodeProtectedHeader('.....'), {
    instanceOf: TypeError,
    message: 'Invalid Token or Protected Header formatting',
  })

  t.throws(() => decodeProtectedHeader({ protected: null }), {
    instanceOf: TypeError,
    message: 'Invalid Token or Protected Header formatting',
  })

  t.throws(() => decodeProtectedHeader({ protected: 'ew' }), {
    instanceOf: TypeError,
    message: 'Invalid Token or Protected Header formatting',
  })

  t.throws(() => decodeProtectedHeader({ protected: 'bnVsbA' }), {
    instanceOf: TypeError,
    message: 'Invalid Token or Protected Header formatting',
  })

  t.throws(() => decodeProtectedHeader({ protected: 'W10' }), {
    instanceOf: TypeError,
    message: 'Invalid Token or Protected Header formatting',
  })

  t.throws(() => decodeProtectedHeader({}), {
    instanceOf: TypeError,
    message: 'Token does not contain a Protected Header',
  })

  t.deepEqual(decodeProtectedHeader('eyJhbGciOiJIUzI1NiJ9..'), { alg: 'HS256' })
  t.deepEqual(decodeProtectedHeader('eyJhbGciOiJIUzI1NiJ9....'), { alg: 'HS256' })
  t.deepEqual(decodeProtectedHeader({ protected: 'eyJhbGciOiJIUzI1NiJ9' }), { alg: 'HS256' })
})
