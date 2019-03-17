const test = require('ava')
const { createPrivateKey, createPublicKey } = require('crypto')
const { hasProperty, hasNoProperties, hasProperties } = require('../macros')
const fixtures = require('../fixtures')

const RSAKey = require('../../lib/jwk/key/rsa')

test(`RSA key .algorithms invalid operation`, t => {
  const key = new RSAKey(createPrivateKey(fixtures.PEM.RSA.private))
  t.throws(() => key.algorithms('foo'), { instanceOf: TypeError, message: 'invalid key operation' })
})

// private
;(() => {
  const keyObject = createPrivateKey(fixtures.PEM.RSA.private)
  const key = new RSAKey(keyObject)

  test(`RSA Private key (with alg)`, hasProperty, new RSAKey(keyObject, { alg: 'RS256' }), 'alg', 'RS256')
  test(`RSA Private key (with kid)`, hasProperty, new RSAKey(keyObject, { kid: 'foobar' }), 'kid', 'foobar')
  test(`RSA Private key (with use)`, hasProperty, new RSAKey(keyObject, { use: 'sig' }), 'use', 'sig')
  test(`RSA Private key`, hasNoProperties, key, 'k', 'x', 'y')
  test(`RSA Private key`, hasProperties, key, 'e', 'n', 'p', 'q', 'dp', 'dq', 'qi', 'd')
  test(`RSA Private key`, hasProperty, key, 'alg', undefined)
  test(`RSA Private key`, hasProperty, key, 'kid', 'Bj1ccHv-y_ZoejJKWhAhBHLpnGSlawNAQUAMEQBd5L8')
  test(`RSA Private key`, hasProperty, key, 'kty', 'RSA')
  test(`RSA Private key`, hasProperty, key, 'length', 2048)
  test(`RSA Private key`, hasProperty, key, 'private', true)
  test(`RSA Private key`, hasProperty, key, 'public', false)
  test(`RSA Private key`, hasProperty, key, 'use', undefined)

  test('RSA Private key algorithms (no operation)', t => {
    const result = key.algorithms()
    t.is(result.constructor, Set)
    t.deepEqual([...result], ['PS256', 'RS256', 'PS384', 'RS384', 'PS512', 'RS512', 'RSA-OAEP', 'RSA1_5'])
  })

  test('RSA Private key algorithms (no operation, w/ alg)', t => {
    const key = new RSAKey(keyObject, { alg: 'RS256' })
    const result = key.algorithms()
    t.is(result.constructor, Set)
    t.deepEqual([...result], ['RS256'])
  })

  test(`RSA Private key supports sign alg (no use)`, t => {
    const result = key.algorithms('sign')
    t.is(result.constructor, Set)
    t.deepEqual([...result], ['PS256', 'RS256', 'PS384', 'RS384', 'PS512', 'RS512'])
  })

  test(`RSA Private key supports verify alg (no use)`, t => {
    const result = key.algorithms('verify')
    t.is(result.constructor, Set)
    t.deepEqual([...result], ['PS256', 'RS256', 'PS384', 'RS384', 'PS512', 'RS512'])
  })

  test(`RSA Private key supports sign alg when \`use\` is "sig")`, t => {
    const sigKey = new RSAKey(keyObject, { use: 'sig' })
    const result = sigKey.algorithms('sign')
    t.is(result.constructor, Set)
    t.deepEqual([...result], ['PS256', 'RS256', 'PS384', 'RS384', 'PS512', 'RS512'])
  })

  test(`RSA Private key supports verify alg when \`use\` is "sig")`, t => {
    const sigKey = new RSAKey(keyObject, { use: 'sig' })
    const result = sigKey.algorithms('verify')
    t.is(result.constructor, Set)
    t.deepEqual([...result], ['PS256', 'RS256', 'PS384', 'RS384', 'PS512', 'RS512'])
  })

  test(`RSA Private key supports single sign alg when \`alg\` is set)`, t => {
    const sigKey = new RSAKey(keyObject, { alg: 'RS256' })
    const result = sigKey.algorithms('sign')
    t.is(result.constructor, Set)
    t.deepEqual([...result], ['RS256'])
  })

  test(`RSA Private key supports single verify alg when \`alg\` is set)`, t => {
    const sigKey = new RSAKey(keyObject, { alg: 'RS256' })
    const result = sigKey.algorithms('verify')
    t.is(result.constructor, Set)
    t.deepEqual([...result], ['RS256'])
  })

  test(`RSA Private key no sign support when \`use\` is "enc"`, t => {
    const encKey = new RSAKey(keyObject, { use: 'enc' })
    const result = encKey.algorithms('sign')
    t.is(result.constructor, Set)
    t.deepEqual([...result], [])
  })

  test(`RSA Private key no verify support when \`use\` is "enc"`, t => {
    const encKey = new RSAKey(keyObject, { use: 'enc' })
    const result = encKey.algorithms('verify')
    t.is(result.constructor, Set)
    t.deepEqual([...result], [])
  })

  test('RSA Private key .algorithms("encrypt")', t => {
    const result = key.algorithms('encrypt')
    t.is(result.constructor, Set)
    t.deepEqual([...result], [])
  })

  test('RSA Private key .algorithms("decrypt")', t => {
    const result = key.algorithms('decrypt')
    t.is(result.constructor, Set)
    t.deepEqual([...result], [])
  })

  test('RSA Private key .algorithms("wrapKey")', t => {
    const result = key.algorithms('wrapKey')
    t.is(result.constructor, Set)
    t.deepEqual([...result], ['RSA-OAEP', 'RSA1_5'])
  })

  test('RSA Private key .algorithms("wrapKey") when use is sig', t => {
    const sigKey = new RSAKey(keyObject, { use: 'sig' })
    const result = sigKey.algorithms('wrapKey')
    t.is(result.constructor, Set)
    t.deepEqual([...result], [])
  })

  test('RSA Private key .algorithms("unwrapKey")', t => {
    const result = key.algorithms('unwrapKey')
    t.is(result.constructor, Set)
    t.deepEqual([...result], ['RSA-OAEP', 'RSA1_5'])
  })

  test('RSA Private key .algorithms("unwrapKey") when use is sig', t => {
    const sigKey = new RSAKey(keyObject, { use: 'sig' })
    const result = sigKey.algorithms('unwrapKey')
    t.is(result.constructor, Set)
    t.deepEqual([...result], [])
  })
})()

// public
;(() => {
  const keyObject = createPublicKey(fixtures.PEM.RSA.public)
  const key = new RSAKey(keyObject)

  test(`RSA Public key (with alg)`, hasProperty, new RSAKey(keyObject, { alg: 'RS256' }), 'alg', 'RS256')
  test(`RSA Public key (with kid)`, hasProperty, new RSAKey(keyObject, { kid: 'foobar' }), 'kid', 'foobar')
  test(`RSA Public key (with use)`, hasProperty, new RSAKey(keyObject, { use: 'sig' }), 'use', 'sig')
  test(`RSA Public key`, hasNoProperties, key, 'k', 'x', 'y', 'd', 'p', 'q', 'dp', 'dq', 'qi')
  test(`RSA Public key`, hasProperties, key, 'e', 'n')
  test(`RSA Public key`, hasProperty, key, 'alg', undefined)
  test(`RSA Public key`, hasProperty, key, 'kid', 'Bj1ccHv-y_ZoejJKWhAhBHLpnGSlawNAQUAMEQBd5L8')
  test(`RSA Public key`, hasProperty, key, 'kty', 'RSA')
  test(`RSA Public key`, hasProperty, key, 'length', 2048)
  test(`RSA Public key`, hasProperty, key, 'private', false)
  test(`RSA Public key`, hasProperty, key, 'public', true)
  test(`RSA Public key`, hasProperty, key, 'use', undefined)

  test('RSA EC Public key algorithms (no operation)', t => {
    const result = key.algorithms()
    t.is(result.constructor, Set)
    t.deepEqual([...result], ['PS256', 'RS256', 'PS384', 'RS384', 'PS512', 'RS512', 'RSA-OAEP', 'RSA1_5'])
  })

  test('RSA EC Public key algorithms (no operation, w/ alg)', t => {
    const key = new RSAKey(keyObject, { alg: 'RS256' })
    const result = key.algorithms()
    t.is(result.constructor, Set)
    t.deepEqual([...result], ['RS256'])
  })

  test(`RSA Public key cannot sign`, t => {
    const result = key.algorithms('sign')
    t.is(result.constructor, Set)
    t.deepEqual([...result], [])
  })

  test(`RSA Public key supports verify alg (no use)`, t => {
    const result = key.algorithms('verify')
    t.is(result.constructor, Set)
    t.deepEqual([...result], ['PS256', 'RS256', 'PS384', 'RS384', 'PS512', 'RS512'])
  })

  test(`RSA Public key cannot sign even when \`use\` is "sig")`, t => {
    const sigKey = new RSAKey(keyObject, { use: 'sig' })
    const result = sigKey.algorithms('sign')
    t.is(result.constructor, Set)
    t.deepEqual([...result], [])
  })

  test(`RSA Public key supports verify alg when \`use\` is "sig")`, t => {
    const sigKey = new RSAKey(keyObject, { use: 'sig' })
    const result = sigKey.algorithms('verify')
    t.is(result.constructor, Set)
    t.deepEqual([...result], ['PS256', 'RS256', 'PS384', 'RS384', 'PS512', 'RS512'])
  })

  test(`RSA Public key cannot sign even when \`alg\` is set)`, t => {
    const sigKey = new RSAKey(keyObject, { alg: 'RS256' })
    const result = sigKey.algorithms('sign')
    t.is(result.constructor, Set)
    t.deepEqual([...result], [])
  })

  test(`RSA Public key supports single verify alg when \`alg\` is set)`, t => {
    const sigKey = new RSAKey(keyObject, { alg: 'RS256' })
    const result = sigKey.algorithms('verify')
    t.is(result.constructor, Set)
    t.deepEqual([...result], ['RS256'])
  })

  test(`RSA Public key no sign support when \`use\` is "enc"`, t => {
    const encKey = new RSAKey(keyObject, { use: 'enc' })
    const result = encKey.algorithms('sign')
    t.is(result.constructor, Set)
    t.deepEqual([...result], [])
  })

  test(`RSA Public key no verify support when \`use\` is "enc"`, t => {
    const encKey = new RSAKey(keyObject, { use: 'enc' })
    const result = encKey.algorithms('verify')
    t.is(result.constructor, Set)
    t.deepEqual([...result], [])
  })

  test('RSA Public key .algorithms("encrypt")', t => {
    const result = key.algorithms('encrypt')
    t.is(result.constructor, Set)
    t.deepEqual([...result], [])
  })

  test('RSA Public key .algorithms("decrypt")', t => {
    const result = key.algorithms('decrypt')
    t.is(result.constructor, Set)
    t.deepEqual([...result], [])
  })

  test('RSA Public key .algorithms("wrapKey")', t => {
    const result = key.algorithms('wrapKey')
    t.is(result.constructor, Set)
    t.deepEqual([...result], ['RSA-OAEP', 'RSA1_5'])
  })

  test('RSA Public key .algorithms("wrapKey") when use is sig', t => {
    const sigKey = new RSAKey(keyObject, { use: 'sig' })
    const result = sigKey.algorithms('wrapKey')
    t.is(result.constructor, Set)
    t.deepEqual([...result], [])
  })

  test('RSA Public key .algorithms("unwrapKey")', t => {
    const result = key.algorithms('unwrapKey')
    t.is(result.constructor, Set)
    t.deepEqual([...result], [])
  })

  test('any RSA key can do RS256 and RSA1_5', t => {
    const k = RSAKey.generateSync(512)
    const result = k.algorithms()
    t.is(result.constructor, Set)
    t.deepEqual([...result], ['RS256', 'RSA1_5'])
  })

  test('RSA key >= 528 bits can do PS256', t => {
    const k = RSAKey.generateSync(528)
    t.true(k.algorithms().has('PS256'))
  })

  test('RSA key >= 592 bits can do RSA-OAEP', t => {
    const k = RSAKey.generateSync(592)
    t.true(k.algorithms().has('RSA-OAEP'))
  })

  test('RSA key >= 624 bits can do RS384', t => {
    const k = RSAKey.generateSync(624)
    t.true(k.algorithms().has('RS384'))
  })

  test('RSA key >= 752 bits can do RS512', t => {
    const k = RSAKey.generateSync(752)
    t.true(k.algorithms().has('RS512'))
  })

  test('RSA key >= 784 bits can do PS384', t => {
    const k = RSAKey.generateSync(784)
    t.true(k.algorithms().has('PS384'))
  })

  test('RSA key >= 1040 bits can do PS512', t => {
    const k = RSAKey.generateSync(1040)
    t.true(k.algorithms().has('PS512'))
  })
})()
