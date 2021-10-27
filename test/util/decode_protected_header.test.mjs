import test from 'ava'

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto'

import(`${root}/util/decode_protected_header`).then(
  ({ decodeProtectedHeader }) => {
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
  },
  (err) => {
    test('failed to import', (t) => {
      console.error(err)
      t.fail()
    })
  },
)
