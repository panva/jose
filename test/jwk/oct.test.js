const test = require('ava')
const { createSecretKey } = require('crypto')
const { hasProperty, hasNoProperty } = require('../macros')

const OctKey = require('../../lib/jwk/oct')

const keyObject = createSecretKey(Buffer.from('secret'))
const key = new OctKey(keyObject)

test('has property `kty`', hasProperty, key, 'kty', 'oct')
test('has property `k`', hasProperty, key, 'k', 'c2VjcmV0')
test('has calculated property `length`', hasProperty, key, 'length', 48)
test('has calculated property `kid`', hasProperty, key, 'kid', 'DWBh0SEIAPYh1x5uvot4z3AhaikHkxNJa3Ada2fT-Cg')
test('has property `keyObject`', hasProperty, key, 'keyObject', keyObject)
test('is not private', hasProperty, key, 'private', false)
test('is not public', hasProperty, key, 'public', false)
test('retains `kid` if passed in', hasProperty, new OctKey(keyObject, { kid: 'foobar' }), 'kid', 'foobar')
test('has property `alg` if passed in', hasProperty, new OctKey(keyObject, { alg: 'HS256' }), 'alg', 'HS256')
test('has property `use` if passed in', hasProperty, new OctKey(keyObject, { use: 'sig' }), 'use', 'sig')

test('does not have `alg` and `use` unless passed in', hasNoProperty, keyObject, 'alg', 'use')
test('does not have key components of other key types', hasNoProperty, keyObject, 'e', 'n', 'd', 'p', 'q', 'dp', 'dq', 'qi', 'crv', 'x', 'y')

test('supports all sign algs (no use)', t => {
  const result = key.algorithms('sign')
  t.is(result.constructor, Set)
  t.deepEqual([...result], ['HS256', 'HS384', 'HS512'])
})

test('supports all verify algs (no use)', t => {
  const result = key.algorithms('verify')
  t.is(result.constructor, Set)
  t.deepEqual([...result], ['HS256', 'HS384', 'HS512'])
})

test('supports all sign algs when `use` is "sig")', t => {
  const sigKey = new OctKey(keyObject, { use: 'sig' })
  const result = sigKey.algorithms('sign')
  t.is(result.constructor, Set)
  t.deepEqual([...result], ['HS256', 'HS384', 'HS512'])
})

test('supports all verify algs when `use` is "sig")', t => {
  const sigKey = new OctKey(keyObject, { use: 'sig' })
  const result = sigKey.algorithms('verify')
  t.is(result.constructor, Set)
  t.deepEqual([...result], ['HS256', 'HS384', 'HS512'])
})

test('supports single sign alg when `alg` is set)', t => {
  const sigKey = new OctKey(keyObject, { alg: 'HS256' })
  const result = sigKey.algorithms('sign')
  t.is(result.constructor, Set)
  t.deepEqual([...result], ['HS256'])
})

test('supports single verify alg when `alg` is set)', t => {
  const sigKey = new OctKey(keyObject, { alg: 'HS256' })
  const result = sigKey.algorithms('verify')
  t.is(result.constructor, Set)
  t.deepEqual([...result], ['HS256'])
})

test('no sign support when `use` is "enc"', t => {
  const encKey = new OctKey(keyObject, { use: 'enc' })
  const result = encKey.algorithms('sign')
  t.is(result.constructor, Set)
  t.deepEqual([...result], [])
})

test('no verify support when `use` is "enc"', t => {
  const encKey = new OctKey(keyObject, { use: 'enc' })
  const result = encKey.algorithms('verify')
  t.is(result.constructor, Set)
  t.deepEqual([...result], [])
})

test.todo('algorithms() no arg')
test.todo('algorithms("encrypt")')
test.todo('algorithms("decrypt")')
test.todo('algorithms("wrapKey")')
test.todo('algorithms("unwrapKey")')
