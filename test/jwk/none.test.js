const test = require('ava')

const { JWK, JWKS } = require('../..')

test('JWK.None', t => {
  const k = JWK.None
  t.truthy(k)
  t.true(JWK.isKey(k))
  t.is(k.kty, undefined)
  for (const prop of ['kid', 'kty', 'thumbprint', 'toJWK', 'toPEM']) {
    k[prop] = 'foo'
    t.is(k[prop], undefined)
  }
  t.deepEqual([...k.algorithms()], ['none'])
  k.type = 'foo'
  t.is(k.type, 'unsecured')
  t.throws(() => new JWKS.KeyStore(k), { instanceOf: TypeError })
  const ks = new JWKS.KeyStore()
  t.throws(() => ks.add(k), { instanceOf: TypeError })
})
