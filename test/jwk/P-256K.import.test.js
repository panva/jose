// require 'secp256k1' renamed to 'P-256K'
require('../../P-256K')

const test = require('ava')

if ('electron' in process.versions) return

const { createPrivateKey, createPublicKey } = require('crypto')
const { hasProperty, hasNoProperties, hasProperties } = require('../macros')
const fixtures = require('../fixtures')

const ECKey = require('../../lib/jwk/key/ec')

Object.entries({
  'P-256K': ['ES256K', 'zZYrH69YCAAihM7ZCoRj90VI55H5MmQscSpf-JuUS50']
}).forEach(([crv, [alg, kid]]) => {
  // private
  ;(() => {
    const keyObject = createPrivateKey(fixtures.PEM[crv].private)
    const key = new ECKey(keyObject)

    test(`${crv} EC Private key`, hasProperty, key, 'crv', crv)
    test(`${crv} EC Private key (with alg)`, hasProperty, new ECKey(keyObject, { alg }), 'alg', alg)
    test(`${crv} EC Private key (with kid)`, hasProperty, new ECKey(keyObject, { kid: 'foobar' }), 'kid', 'foobar')
    test(`${crv} EC Private key (with use)`, hasProperty, new ECKey(keyObject, { use: 'sig' }), 'use', 'sig')
    test(`${crv} EC Private key`, hasNoProperties, key, 'k', 'e', 'n', 'p', 'q', 'dp', 'dq', 'qi')
    test(`${crv} EC Private key`, hasProperties, key, 'x', 'y', 'd')
    test(`${crv} EC Private key`, hasProperty, key, 'alg', undefined)
    test(`${crv} EC Private key`, hasProperty, key, 'kid', kid)
    test(`${crv} EC Private key`, hasProperty, key, 'kty', 'EC')
    test(`${crv} EC Private key`, hasProperty, key, 'private', true)
    test(`${crv} EC Private key`, hasProperty, key, 'public', false)
    test(`${crv} EC Private key`, hasProperty, key, 'secret', false)
    test(`${crv} EC Private key`, hasProperty, key, 'type', 'private')
    test(`${crv} EC Private key`, hasProperty, key, 'use', undefined)

    test(`${crv} EC Private key algorithms (no operation)`, t => {
      const result = key.algorithms()
      t.is(result.constructor, Set)
      t.deepEqual([...result], [alg, 'ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW'])
    })

    test(`${crv} EC Private key algorithms (no operation, w/ alg)`, t => {
      const key = new ECKey(keyObject, { alg })
      const result = key.algorithms()
      t.is(result.constructor, Set)
      t.deepEqual([...result], [alg])
    })

    test(`${crv} EC Private key supports sign alg (no use)`, t => {
      const result = key.algorithms('sign')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [alg])
    })

    test(`${crv} EC Private key supports verify alg (no use)`, t => {
      const result = key.algorithms('verify')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [alg])
    })

    test(`${crv} EC Private key supports sign alg when \`use\` is "sig")`, t => {
      const sigKey = new ECKey(keyObject, { use: 'sig' })
      const result = sigKey.algorithms('sign')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [alg])
    })

    test(`${crv} EC Private key supports verify alg when \`use\` is "sig")`, t => {
      const sigKey = new ECKey(keyObject, { use: 'sig' })
      const result = sigKey.algorithms('verify')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [alg])
    })

    test(`${crv} EC Private key supports single sign alg when \`alg\` is set)`, t => {
      const sigKey = new ECKey(keyObject, { alg })
      const result = sigKey.algorithms('sign')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [alg])
    })

    test(`${crv} EC Private key supports single verify alg when \`alg\` is set)`, t => {
      const sigKey = new ECKey(keyObject, { alg })
      const result = sigKey.algorithms('verify')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [alg])
    })

    test(`${crv} EC Private key no sign support when \`use\` is "enc"`, t => {
      const encKey = new ECKey(keyObject, { use: 'enc' })
      const result = encKey.algorithms('sign')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} EC Private key no verify support when \`use\` is "enc"`, t => {
      const encKey = new ECKey(keyObject, { use: 'enc' })
      const result = encKey.algorithms('verify')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} EC Private key .algorithms("encrypt")`, t => {
      const result = key.algorithms('encrypt')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} EC Private key .algorithms("decrypt")`, t => {
      const result = key.algorithms('decrypt')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} EC Private key .algorithms("wrapKey")`, t => {
      const result = key.algorithms('wrapKey')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} EC Private key .algorithms("deriveKey")`, t => {
      const result = key.algorithms('deriveKey')
      t.is(result.constructor, Set)
      t.deepEqual([...result], ['ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW'])
    })

    test(`${crv} EC Private key .algorithms("wrapKey") when use is sig`, t => {
      const sigKey = new ECKey(keyObject, { use: 'sig' })
      const result = sigKey.algorithms('wrapKey')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} EC Private key .algorithms("unwrapKey")`, t => {
      const result = key.algorithms('unwrapKey')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} EC Private key .algorithms("deriveKey") when use is sig`, t => {
      const sigKey = new ECKey(keyObject, { use: 'sig' })
      const result = sigKey.algorithms('deriveKey')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })
  })()

  // public
  ;(() => {
    const keyObject = createPublicKey(fixtures.PEM[crv].public)
    const key = new ECKey(keyObject)

    test(`${crv} EC Public key`, hasProperty, key, 'crv', crv)
    test(`${crv} EC Public key (with alg)`, hasProperty, new ECKey(keyObject, { alg }), 'alg', alg)
    test(`${crv} EC Public key (with kid)`, hasProperty, new ECKey(keyObject, { kid: 'foobar' }), 'kid', 'foobar')
    test(`${crv} EC Public key (with use)`, hasProperty, new ECKey(keyObject, { use: 'sig' }), 'use', 'sig')
    test(`${crv} EC Public key`, hasNoProperties, key, 'k', 'e', 'n', 'p', 'q', 'dp', 'dq', 'qi', 'd')
    test(`${crv} EC Public key`, hasProperties, key, 'x', 'y')
    test(`${crv} EC Public key`, hasProperty, key, 'alg', undefined)
    test(`${crv} EC Public key`, hasProperty, key, 'kid', kid)
    test(`${crv} EC Public key`, hasProperty, key, 'kty', 'EC')
    test(`${crv} EC Public key`, hasProperty, key, 'private', false)
    test(`${crv} EC Public key`, hasProperty, key, 'public', true)
    test(`${crv} EC Public key`, hasProperty, key, 'secret', false)
    test(`${crv} EC Public key`, hasProperty, key, 'type', 'public')
    test(`${crv} EC Public key`, hasProperty, key, 'use', undefined)

    test(`${crv} EC Public key algorithms (no operation)`, t => {
      const result = key.algorithms()
      t.is(result.constructor, Set)
      t.deepEqual([...result], [alg, 'ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW'])
    })

    test(`${crv} EC Public key algorithms (no operation, w/ alg)`, t => {
      const key = new ECKey(keyObject, { alg })
      const result = key.algorithms()
      t.is(result.constructor, Set)
      t.deepEqual([...result], [alg])
    })

    test(`${crv} EC Public key cannot sign`, t => {
      const result = key.algorithms('sign')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} EC Public key supports verify alg (no use)`, t => {
      const result = key.algorithms('verify')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [alg])
    })

    test(`${crv} EC Public key cannot sign even when \`use\` is "sig")`, t => {
      const sigKey = new ECKey(keyObject, { use: 'sig' })
      const result = sigKey.algorithms('sign')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} EC Public key supports verify alg when \`use\` is "sig")`, t => {
      const sigKey = new ECKey(keyObject, { use: 'sig' })
      const result = sigKey.algorithms('verify')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [alg])
    })

    test(`${crv} EC Public key cannot sign even when \`alg\` is set)`, t => {
      const sigKey = new ECKey(keyObject, { alg })
      const result = sigKey.algorithms('sign')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} EC Public key supports single verify alg when \`alg\` is set)`, t => {
      const sigKey = new ECKey(keyObject, { alg })
      const result = sigKey.algorithms('verify')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [alg])
    })

    test(`${crv} EC Public key no sign support when \`use\` is "enc"`, t => {
      const encKey = new ECKey(keyObject, { use: 'enc' })
      const result = encKey.algorithms('sign')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} EC Public key no verify support when \`use\` is "enc"`, t => {
      const encKey = new ECKey(keyObject, { use: 'enc' })
      const result = encKey.algorithms('verify')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} EC Public key .algorithms("encrypt")`, t => {
      const result = key.algorithms('encrypt')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} EC Public key .algorithms("decrypt")`, t => {
      const result = key.algorithms('decrypt')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} EC Public key .algorithms("wrapKey")`, t => {
      const result = key.algorithms('wrapKey')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} EC Public key .algorithms("deriveKey")`, t => {
      const result = key.algorithms('deriveKey')
      t.is(result.constructor, Set)
      t.deepEqual([...result], ['ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW'])
    })

    test(`${crv} EC Public key .algorithms("wrapKey") when use is sig`, t => {
      const sigKey = new ECKey(keyObject, { use: 'sig' })
      const result = sigKey.algorithms('wrapKey')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })

    test(`${crv} EC Public key .algorithms("unwrapKey")`, t => {
      const result = key.algorithms('unwrapKey')
      t.is(result.constructor, Set)
      t.deepEqual([...result], [])
    })
  })()
})
