const test = require('ava')
const { createSecretKey } = require('crypto')
const { hasProperty, hasNoProperties } = require('../macros')

const errors = require('../../lib/errors')
const OctKey = require('../../lib/jwk/key/oct')
const { JWK: { importKey } } = require('../..')

const keyObject = createSecretKey(Buffer.from('secret'))
const key = new OctKey(keyObject)

test(`RSA key .algorithms invalid operation`, t => {
  t.throws(() => key.algorithms('foo'), { instanceOf: TypeError, message: 'invalid key operation' })
})

test('oct key (with alg)', hasProperty, new OctKey(keyObject, { alg: 'HS256' }), 'alg', 'HS256')
test('oct key (with kid)', hasProperty, new OctKey(keyObject, { kid: 'foobar' }), 'kid', 'foobar')
test('oct key (with use)', hasProperty, new OctKey(keyObject, { use: 'sig' }), 'use', 'sig')
test('oct key', hasNoProperties, key, 'e', 'n', 'd', 'p', 'q', 'dp', 'dq', 'qi', 'crv', 'x', 'y')
test('oct key', hasProperty, key, 'alg', undefined)
test('oct key', hasProperty, key, 'k', 'c2VjcmV0')
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

test(`oct keys (odd bits) wrap/unwrap algorithms do not have "dir"`, t => {
  const key = OctKey.generateSync(136)

  t.false(key.algorithms().has('dir'))
})

test(`oct keys (odd bits) wrap/unwrap algorithms only have "PBES2"`, t => {
  const key = OctKey.generateSync(136)
  const result = key.algorithms('wrapKey')
  t.is(result.constructor, Set)
  t.deepEqual([...result], ['PBES2-HS256+A128KW', 'PBES2-HS384+A192KW', 'PBES2-HS512+A256KW'])
})

;[128, 192, 256].forEach((len) => {
  test(`oct keys (${len} bits) wrap/unwrap algorithms have "KW / GCMKW"`, t => {
    const key = OctKey.generateSync(len)

    t.true(key.algorithms().has(`A${len}KW`))
    t.true(key.algorithms().has(`A${len}GCMKW`))
  })
})

Object.entries({
  128: ['A128GCM'],
  192: ['A192GCM'],
  256: ['A128CBC-HS256', 'A256GCM'],
  384: ['A192CBC-HS384'],
  512: ['A256CBC-HS512']
}).forEach(([len, encAlgs]) => {
  len = parseInt(len)

  test(`oct key (${len} bits) can encrypt`, t => {
    const key = OctKey.generateSync(len)

    const result = key.algorithms('encrypt')
    t.is(result.constructor, Set)
    t.deepEqual([...result], encAlgs)
  })

  test(`oct keys (${len} bits) wrap/unwrap algorithms have "dir"`, t => {
    const key = OctKey.generateSync(len)

    t.true(key.algorithms().has('dir'))
  })
})

test('oct keys may not be generated as public', t => {
  t.throws(() => {
    OctKey.generateSync(undefined, undefined, false)
  }, { instanceOf: TypeError, message: '"oct" keys cannot be generated as public' })
})

test('they may be imported from', t => {
  const key = importKey({
    kty: 'oct',
    kid: '4p9o4_DcKoT6Qg2BI_mSgMP_MsXwFqogKuI26CunKAM'
  })

  t.is(key.kid, '4p9o4_DcKoT6Qg2BI_mSgMP_MsXwFqogKuI26CunKAM')
  t.is(key.k, undefined)
  t.false(key.private)
  t.false(key.public)
  t.deepEqual([...key.algorithms()], [])
})

test('they may be imported from (no kid)', t => {
  const key = importKey({
    kty: 'oct'
  })

  t.is(key.k, undefined)
  t.false(key.private)
  t.false(key.public)
  t.deepEqual([...key.algorithms()], [])
  t.throws(() => {
    key.kid // eslint-disable-line no-unused-expressions
  }, { instanceOf: TypeError, message: 'reference "oct" keys without "k" cannot have their "kid" calculated' })
})

test('they may be imported so long as there was no k', t => {
  t.throws(() => {
    importKey({
      kty: 'oct',
      kid: '4p9o4_DcKoT6Qg2BI_mSgMP_MsXwFqogKuI26CunKAM',
      k: undefined
    })
  }, { instanceOf: errors.JWKImportFailed, message: 'import failed' })
})
