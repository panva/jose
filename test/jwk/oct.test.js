const test = require('ava')
const { createSecretKey } = require('crypto')
const { hasProperty, hasNoProperties, hasProperties } = require('../macros')

const OctKey = require('../../lib/jwk/key/oct')

const keyObject = createSecretKey(Buffer.from('secret'))
const key = new OctKey(keyObject)

test(`RSA key .algorithms invalid operation`, t => {
  t.throws(() => key.algorithms('foo'), { instanceOf: TypeError, message: 'invalid key operation' })
})

test('oct key .thumbprintMaterial()', hasProperties, key.thumbprintMaterial(), 'k', 'kty')
test('oct key (with alg)', hasProperty, new OctKey(keyObject, { alg: 'HS256' }), 'alg', 'HS256')
test('oct key (with kid)', hasProperty, new OctKey(keyObject, { kid: 'foobar' }), 'kid', 'foobar')
test('oct key (with use)', hasProperty, new OctKey(keyObject, { use: 'sig' }), 'use', 'sig')
test('oct key', hasNoProperties, key, 'e', 'n', 'd', 'p', 'q', 'dp', 'dq', 'qi', 'crv', 'x', 'y')
test('oct key', hasProperty, key, 'alg', undefined)
test('oct key', hasProperty, key, 'k', 'c2VjcmV0')
test('oct key', hasProperty, key, 'keyObject', keyObject)
test('oct key', hasProperty, key, 'kid', 'DWBh0SEIAPYh1x5uvot4z3AhaikHkxNJa3Ada2fT-Cg')
test('oct key', hasProperty, key, 'kty', 'oct')
test('oct key', hasProperty, key, 'length', 48)
test('oct key', hasProperty, key, 'private', false)
test('oct key', hasProperty, key, 'public', false)
test('oct key', hasProperty, key, 'use', undefined)

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
