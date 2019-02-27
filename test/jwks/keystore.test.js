const test = require('ava')

const KeyStore = require('../../lib/jwks/keystore')
const { generateSync } = require('../../lib/jwk')

test('constructor', t => {
  t.notThrows(() => {
    new KeyStore() // eslint-disable-line no-new
  })
  t.notThrows(() => {
    new KeyStore(generateSync('ec')) // eslint-disable-line no-new
  })
  t.notThrows(() => {
    new KeyStore(generateSync('ec'), generateSync('ec')) // eslint-disable-line no-new
  })
  t.notThrows(() => {
    new KeyStore([generateSync('ec')], generateSync('ec')) // eslint-disable-line no-new
  })
  t.notThrows(() => {
    new KeyStore([[generateSync('ec')], generateSync('ec')]) // eslint-disable-line no-new
  })
})

test('constructor only accepts Key instances created through JWK.importKey', t => {
  t.throws(() => {
    new KeyStore({}) // eslint-disable-line no-new
  }, { instanceOf: TypeError, message: 'all keys must be an instances of a key instantiated by JWK.importKey' })
})

test('.generate()', async t => {
  const ks = new KeyStore()
  await ks.generate('ec')
  t.is(ks.size, 1)
})

test('.generateSync()', t => {
  const ks = new KeyStore()
  ks.generateSync('ec')
  t.is(ks.size, 1)
})

test('.add()', t => {
  const ks = new KeyStore()
  const k = generateSync('ec')
  ks.add(k)
  ks.add(k)
  t.is(ks.size, 1)
  t.throws(() => {
    ks.add({})
  }, { instanceOf: TypeError, message: 'key must be an instance of a key instantiated by JWK.importKey' })
})

test('.remove()', t => {
  const k = generateSync('ec')
  const ks = new KeyStore(k)
  ks.remove(k)
  t.is(ks.size, 0)
  ks.remove(k)
  t.throws(() => {
    ks.remove({})
  }, { instanceOf: TypeError, message: 'key must be an instance of a key instantiated by JWK.importKey' })
})

test('.all() and .get() use filter', t => {
  const k = generateSync('rsa', undefined, { use: 'sig' })
  const ks = new KeyStore(k)
  t.deepEqual(ks.all({ use: 'enc' }), [])
  t.deepEqual(ks.all({ use: 'sig' }), [k])
  t.is(ks.get({ use: 'enc' }), undefined)
  t.is(ks.get({ use: 'sig' }), k)
})

test('.all() and .get() use sort', t => {
  const k = generateSync('rsa')
  const k2 = generateSync('rsa', undefined, { use: 'sig' })
  const ks = new KeyStore(k, k2)
  t.deepEqual(ks.all({ use: 'sig' }), [k2, k])
  t.is(ks.get({ use: 'sig' }), k2)
})

test('.all() and .get() kid filter', t => {
  const k = generateSync('rsa', undefined, { kid: 'foobar' })
  const ks = new KeyStore(k)
  t.deepEqual(ks.all({ kid: 'baz' }), [])
  t.deepEqual(ks.all({ kid: 'foobar' }), [k])
  t.is(ks.get({ kid: 'baz' }), undefined)
  t.is(ks.get({ kid: 'foobar' }), k)
})

test('.all() and .get() kty filter', t => {
  const ks = new KeyStore()
  ks.generateSync('rsa')
  ks.generateSync('ec')
  ks.generateSync('oct')
  t.is(ks.all({ kty: 'oct' }).length, 1)
  t.is(ks.all({ kty: 'RSA' }).length, 1)
  t.is(ks.all({ kty: 'EC' }).length, 1)
})

test('.all() and .get() alg filter', t => {
  const k = generateSync('rsa')
  const ks = new KeyStore(k)
  t.deepEqual(ks.all({ alg: 'HS256' }), [])
  t.deepEqual(ks.all({ alg: 'RS256' }), [k])
  t.is(ks.get({ alg: 'HS256' }), undefined)
  t.is(ks.get({ alg: 'RS256' }), k)
})

test('.all() and .get() alg sort', t => {
  const k = generateSync('rsa')
  const k2 = generateSync('rsa', undefined, { alg: 'RS256' })
  const ks = new KeyStore(k, k2)
  t.deepEqual(ks.all({ alg: 'HS256' }), [])
  t.deepEqual(ks.all({ alg: 'RS256' }), [k2, k])
  t.is(ks.get({ alg: 'HS256' }), undefined)
  t.is(ks.get({ alg: 'RS256' }), k2)
})

test('.fromJWKS()', t => {
  const ks = new KeyStore()
  ks.generateSync('ec')
  ks.generateSync('rsa')

  const ks2 = KeyStore.fromJWKS(ks.toJWKS())
  t.is(ks2.size, 2)
})

test('.fromJWKS() input validation', t => {
  [Buffer, 1, false, '', 'foo', {}, { foo: 'bar' }].forEach((val) => {
    t.throws(() => {
      KeyStore.fromJWKS(val)
    }, { instanceOf: TypeError, message: 'jwks must be a JSON Web Key Set formatted object' })
    t.throws(() => {
      KeyStore.fromJWKS({ keys: val })
    }, { instanceOf: TypeError, message: 'jwks must be a JSON Web Key Set formatted object' })
    t.throws(() => {
      KeyStore.fromJWKS({ keys: [val] })
    }, { instanceOf: TypeError, message: 'jwks must be a JSON Web Key Set formatted object' })
  })
})
