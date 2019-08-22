const test = require('ava')
const { createPrivateKey, createPublicKey } = require('../../lib/help/key_object')
const { hasProperty, hasNoProperties, hasProperties } = require('../macros')
const { generateKeyPairSync } = require('../macros/generate')
const fixtures = require('../fixtures')
const errors = require('../../lib/errors')

const ECKey = require('../../lib/jwk/key/ec')

test(`EC key .algorithms invalid operation`, t => {
  const key = new ECKey(createPrivateKey(fixtures.PEM['P-256'].private))
  t.throws(() => key.algorithms('foo'), { instanceOf: TypeError, message: 'invalid key operation' })
})

if (!('electron' in process.versions)) {
  test('Unusable with unsupported curves', t => {
    const kp = generateKeyPairSync('ec', { namedCurve: 'secp224k1' })
    t.throws(
      () => new ECKey(kp.privateKey),
      { instanceOf: errors.JOSENotSupported, code: 'ERR_JOSE_NOT_SUPPORTED', message: 'unsupported EC key curve' }
    )
    t.throws(
      () => new ECKey(kp.publicKey),
      { instanceOf: errors.JOSENotSupported, code: 'ERR_JOSE_NOT_SUPPORTED', message: 'unsupported EC key curve' }
    )
  })
}

Object.entries({
  'P-256': ['ES256', 'rDd6H6t9-nJUoz72nTpz8tInvypVWhE2iQoPznj8ZY8'],
  secp256k1: ['ES256K', 'kWx_DzFzKNHUQz1FkNzj8KmSRingv9EQQzdVY3td21w'],
  'P-384': ['ES384', '5gebayAhpztJCs4Pxo-z1hhsN0upoyG2NAoKpiiH2b0'],
  'P-521': ['ES512', 'BQtkbSY3xgN4M2ZP3IHMLG7-Rp1L29teCMfNqgJHtTY']
}).forEach(([crv, [alg, kid]]) => {
  const ECDH = ['ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW']
  if ('electron' in process.versions) {
    if (crv === 'secp256k1') return
    ECDH.splice(1, ECDH.length - 1)
  }
  if (crv === 'secp256k1' && 'electron' in process.versions) return
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
      t.deepEqual([...result], [alg, ...ECDH])
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
      t.deepEqual([...result], ECDH)
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
      t.deepEqual([...result], [alg, ...ECDH])
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
      t.deepEqual([...result], ECDH)
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
