import test from 'ava'

import { JOSEError, JOSENotSupported, JWEInvalid } from '../../src/util/errors.js'

const marker = Symbol.for('panva.jose.error')

function foreignError(code: string, branded = true): Error & { code: string } {
  const error = Object.assign(new Error('from another package copy'), { code })
  if (branded) Object.defineProperty(error, marker, { value: code })
  return error
}

test('JOSE errors preserve instanceof semantics across package copies', (t) => {
  const invalid = foreignError(JWEInvalid.code)

  t.true(invalid instanceof JOSEError)
  t.true(invalid instanceof JWEInvalid)
  t.false(invalid instanceof JOSENotSupported)
  t.false(foreignError(JWEInvalid.code, false) instanceof JWEInvalid)

  class Child extends JWEInvalid {}
  t.false(invalid instanceof Child)

  const descriptor = Object.getOwnPropertyDescriptor(new JWEInvalid(), marker)
  t.deepEqual(descriptor, {
    configurable: false,
    enumerable: false,
    value: 'ERR_JWE_INVALID',
    writable: false,
  })

  const local = new JWEInvalid('local')
  local.code = JOSENotSupported.code
  t.true(local instanceof JWEInvalid)
})
