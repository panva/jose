const test = require('ava')

const { createSecretKey } = require('../../lib/help/key_object')
const { hasProperty, hasNoProperties } = require('../macros')

const errors = require('../../lib/errors')
const OctKey = require('../../lib/jwk/key/oct')
const { JWK: { asKey } } = require('../..')
const { generateSync } = require('../../lib/jwk/generate')

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
test('oct key', hasProperty, key, 'type', 'secret')
test('oct key', hasProperty, key, 'public', false)
test('oct key', hasProperty, key, 'secret', true)
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

if (!('electron' in process.versions)) {
  test(`oct keys (odd bits) deriveKey algorithms only have "PBES2"`, t => {
    const key = generateSync('oct', 136)
    const result = key.algorithms('deriveKey')
    t.is(result.constructor, Set)
    t.deepEqual([...result], ['PBES2-HS256+A128KW', 'PBES2-HS384+A192KW', 'PBES2-HS512+A256KW'])
  })
} else {
  test(`oct keys (odd bits) deriveKey don't even have "PBES2"`, t => {
    const key = generateSync('oct', 136)
    const result = key.algorithms('deriveKey')
    t.is(result.constructor, Set)
    t.deepEqual([...result], [])
  })
}

test(`oct keys (odd bits) wrap/unwrap algorithms cant wrap`, t => {
  const key = generateSync('oct', 136)
  const result = key.algorithms('wrapKey')
  t.is(result.constructor, Set)
  t.deepEqual([...result], [])
})

;[128, 192, 256].forEach((len) => {
  test(`oct keys (${len} bits) wrap/unwrap algorithms have "GCMKW"`, t => {
    const key = generateSync('oct', len)
    t.true(key.algorithms().has(`A${len}GCMKW`))
  })

  if (!('electron' in process.versions)) {
    test(`oct keys (${len} bits) wrap/unwrap algorithms have "KW"`, t => {
      const key = generateSync('oct', len)
      t.true(key.algorithms().has(`A${len}KW`))
    })
  } else {
    test(`oct keys (${len} bits) wrap/unwrap algorithms dont have "KW"`, t => {
      const key = generateSync('oct', len)
      t.false(key.algorithms().has(`A${len}KW`))
    })
  }
})

test('oct keys may not be generated as public', t => {
  t.throws(() => {
    generateSync('oct', undefined, undefined, false)
  }, { instanceOf: TypeError, message: '"oct" keys cannot be generated as public' })
})

test('they may be imported from', t => {
  const key = asKey({
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
  const key = asKey({
    kty: 'oct'
  })

  t.is(key.k, undefined)
  t.false(key.private)
  t.false(key.public)
  t.deepEqual([...key.algorithms()], [])
  t.throws(() => {
    key.kid // eslint-disable-line no-unused-expressions
  }, { instanceOf: TypeError, message: 'reference "oct" keys without "k" cannot have their thumbprint calculated' })
})

test('they may be imported so long as there was no k', t => {
  t.throws(() => {
    asKey({
      kty: 'oct',
      kid: '4p9o4_DcKoT6Qg2BI_mSgMP_MsXwFqogKuI26CunKAM',
      k: undefined
    })
  }, { instanceOf: errors.JWKImportFailed, message: 'import failed' })
})
