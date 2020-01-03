const test = require('ava')

const { createPrivateKey, createPublicKey } = require('crypto')
const { hasProperty, hasNoProperties, hasProperties } = require('../macros')
const fixtures = require('../fixtures')

const OKPKey = require('../../lib/jwk/key/okp')

test('OKP key .algorithms invalid operation', t => {
  const key = new OKPKey(createPrivateKey(fixtures.PEM.X25519.private))
  t.throws(() => key.algorithms('foo'), { instanceOf: TypeError, message: 'invalid key operation' })
})

Object.entries({
  X25519: 'P-c1F5P-1BckI7vasmrM8384J2IBYaYc_EtEXxOZYuI',
  X448: 'a-2MwPMAhM3QY0zU0YBP9lzipRk67tsOY9uUhiT2Fos'
}).forEach(([crv, kid]) => {
  const alg = 'ECDH-ES'

  // private
  ;(() => {
    const keyObject = createPrivateKey(fixtures.PEM[crv].private)
    const key = new OKPKey(keyObject)

    test(`${crv} OKP Private key (with alg)`, hasProperty, new OKPKey(keyObject, { alg }), 'alg', alg)
    test(`${crv} OKP Private key (with kid)`, hasProperty, new OKPKey(keyObject, { kid: 'foobar' }), 'kid', 'foobar')
    test(`${crv} OKP Private key (with use)`, hasProperty, new OKPKey(keyObject, { use: 'enc' }), 'use', 'enc')
    test(`${crv} OKP Private key`, hasNoProperties, key, 'k', 'e', 'n', 'p', 'q', 'dp', 'dq', 'qi', 'y')
    test(`${crv} OKP Private key`, hasProperties, key, 'x', 'd')
    test(`${crv} OKP Private key`, hasProperty, key, 'alg', undefined)
    test(`${crv} OKP Private key`, hasProperty, key, 'kid', kid)
    test(`${crv} OKP Private key`, hasProperty, key, 'kty', 'OKP')
    test(`${crv} OKP Private key`, hasProperty, key, 'private', true)
    test(`${crv} OKP Private key`, hasProperty, key, 'public', false)
    test(`${crv} OKP Private key`, hasProperty, key, 'secret', false)
    test(`${crv} OKP Private key`, hasProperty, key, 'type', 'private')
    test(`${crv} OKP Private key`, hasProperty, key, 'use', undefined)

    test(`${crv} OKP Private key algorithms (no operation)`, t => {
      const result = key.algorithms()
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])//, 'ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW'])
    })

    test(`${crv} OKP Private key algorithms (no operation, w/ alg)`, t => {
      const key = new OKPKey(keyObject, { alg })
      const result = key.algorithms()
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])// [alg])
    })

    test(`${crv} OKP Private key does not support sign alg (no use)`, t => {
      const result = key.algorithms('sign')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} OKP Private key does not support verify alg (no use)`, t => {
      const result = key.algorithms('verify')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} OKP Private key .algorithms("encrypt")`, t => {
      const result = key.algorithms('encrypt')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} OKP Private key .algorithms("decrypt")`, t => {
      const result = key.algorithms('decrypt')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} OKP Private key .algorithms("wrapKey")`, t => {
      const result = key.algorithms('wrapKey')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])// ['ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW'])
    })

    test(`${crv} OKP Private key .algorithms("wrapKey") when use is sig`, t => {
      const sigKey = new OKPKey(keyObject, { use: 'sig' })
      const result = sigKey.algorithms('wrapKey')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} OKP Private key .algorithms("unwrapKey")`, t => {
      const result = key.algorithms('unwrapKey')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])// ['ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW'])
    })
  })()

  // public
  ;(() => {
    const keyObject = createPublicKey(fixtures.PEM[crv].public)
    const key = new OKPKey(keyObject)

    test(`${crv} OKP Public key (with alg)`, hasProperty, new OKPKey(keyObject, { alg }), 'alg', alg)
    test(`${crv} OKP Public key (with kid)`, hasProperty, new OKPKey(keyObject, { kid: 'foobar' }), 'kid', 'foobar')
    test(`${crv} OKP Public key (with use)`, hasProperty, new OKPKey(keyObject, { use: 'sig' }), 'use', 'sig')
    test(`${crv} OKP Public key`, hasNoProperties, key, 'k', 'e', 'n', 'p', 'q', 'dp', 'dq', 'qi', 'd', 'y')
    test(`${crv} OKP Public key`, hasProperties, key, 'x')
    test(`${crv} OKP Public key`, hasProperty, key, 'alg', undefined)
    test(`${crv} OKP Public key`, hasProperty, key, 'kid', kid)
    test(`${crv} OKP Public key`, hasProperty, key, 'kty', 'OKP')
    test(`${crv} OKP Public key`, hasProperty, key, 'private', false)
    test(`${crv} OKP Public key`, hasProperty, key, 'public', true)
    test(`${crv} OKP Public key`, hasProperty, key, 'secret', false)
    test(`${crv} OKP Public key`, hasProperty, key, 'type', 'public')
    test(`${crv} OKP Public key`, hasProperty, key, 'use', undefined)

    test(`${crv} OKP Public key algorithms (no operation)`, t => {
      const result = key.algorithms()
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])//, 'ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW'])
    })

    test(`${crv} OKP Public key algorithms (no operation, w/ alg)`, t => {
      const key = new OKPKey(keyObject, { alg })
      const result = key.algorithms()
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])// [alg])
    })

    test(`${crv} OKP Public key cannot sign`, t => {
      const result = key.algorithms('sign')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} OKP Public key does not support verify alg (no use)`, t => {
      const result = key.algorithms('verify')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} OKP Public key .algorithms("encrypt")`, t => {
      const result = key.algorithms('encrypt')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} OKP Public key .algorithms("decrypt")`, t => {
      const result = key.algorithms('decrypt')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} OKP Public key .algorithms("wrapKey")`, t => {
      const result = key.algorithms('wrapKey')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])// ['ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW'])
    })

    test(`${crv} OKP Public key .algorithms("unwrapKey")`, t => {
      const result = key.algorithms('unwrapKey')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })
  })()
})
