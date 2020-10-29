const test = require('ava')

const { keyObjectSupported } = require('../../lib/help/runtime_support')
const errors = require('../../lib/errors')

const fixtures = require('../fixtures')

if (!keyObjectSupported) {
  const JWK = require('../../lib/jwk')
  ;[
    [fixtures.PEM.Ed25519.public, 'Ed25519'],
    [fixtures.PEM.Ed25519.private, 'Ed25519'],
    [fixtures.PEM.Ed448.public, 'Ed448'],
    [fixtures.PEM.Ed448.private, 'Ed448'],
    [fixtures.PEM.X25519.public, 'X25519'],
    [fixtures.PEM.X25519.private, 'X25519'],
    [fixtures.PEM.X448.public, 'X448'],
    [fixtures.PEM.X448.private, 'X448'],
    [fixtures.JWK.Ed25519, 'Ed25519'],
    [fixtures.JWK.Ed448, 'Ed448'],
    [fixtures.JWK.X25519, 'X25519'],
    [fixtures.JWK.X448, 'X448'],
    [{ ...fixtures.JWK.Ed25519, d: undefined }, 'Ed25519'],
    [{ ...fixtures.JWK.Ed448, d: undefined }, 'Ed448'],
    [{ ...fixtures.JWK.X25519, d: undefined }, 'X25519'],
    [{ ...fixtures.JWK.X448, d: undefined }, 'X448']
  ].forEach(([input, label], i, { length }) => {
    test(`OKP ${i + 1} / ${length}`, t => {
      t.throws(() => {
        JWK.asKey(input)
      }, { instanceOf: errors.JOSENotSupported, code: 'ERR_JOSE_NOT_SUPPORTED', message: `${label} is not supported in your Node.js runtime version` })
    })
  })
} else {
  const { createPrivateKey, createPublicKey } = require('crypto')
  const { hasProperty, hasNoProperties, hasProperties } = require('../macros')

  const OKPKey = require('../../lib/jwk/key/okp')

  test('OKP key .algorithms invalid operation', t => {
    const key = new OKPKey(createPrivateKey(fixtures.PEM.Ed25519.private))
    t.throws(() => key.algorithms('foo'), { instanceOf: TypeError, message: 'invalid key operation' })
  })

  Object.entries({
    Ed25519: 'YeOxXoX_a0317nVDSwtlinj0RuJnSI0lYnxCM6qSC4c',
    Ed448: 'eaEfshTya3PWdLWK4CfotnZcHKNJbpQviiTOqwOyFfE'
  }).forEach(([crv, kid]) => {
    if ('electron' in process.versions && crv === 'Ed448') return
    const alg = 'EdDSA'

    // private
    ;(() => {
      const keyObject = createPrivateKey(fixtures.PEM[crv].private)
      const key = new OKPKey(keyObject)

      test(`${crv} OKP Private key (with alg)`, hasProperty, new OKPKey(keyObject, { alg }), 'alg', alg)
      test(`${crv} OKP Private key (with kid)`, hasProperty, new OKPKey(keyObject, { kid: 'foobar' }), 'kid', 'foobar')
      test(`${crv} OKP Private key (with use)`, hasProperty, new OKPKey(keyObject, { use: 'sig' }), 'use', 'sig')
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
        t.deepEqual([...result], [alg])
      })

      test(`${crv} OKP Private key algorithms (no operation, w/ alg)`, t => {
        const key = new OKPKey(keyObject, { alg })
        const result = key.algorithms()
        t.is(result.constructor, Set)
        t.deepEqual([...result], [alg])
      })

      test(`${crv} OKP Private key supports sign alg (no use)`, t => {
        const result = key.algorithms('sign')
        t.is(result.constructor, Set)
        t.deepEqual([...result], [alg])
      })

      test(`${crv} OKP Private key supports verify alg (no use)`, t => {
        const result = key.algorithms('verify')
        t.is(result.constructor, Set)
        t.deepEqual([...result], [alg])
      })

      test(`${crv} OKP Private key supports sign alg when \`use\` is "sig")`, t => {
        const sigKey = new OKPKey(keyObject, { use: 'sig' })
        const result = sigKey.algorithms('sign')
        t.is(result.constructor, Set)
        t.deepEqual([...result], [alg])
      })

      test(`${crv} OKP Private key supports verify alg when \`use\` is "sig")`, t => {
        const sigKey = new OKPKey(keyObject, { use: 'sig' })
        const result = sigKey.algorithms('verify')
        t.is(result.constructor, Set)
        t.deepEqual([...result], [alg])
      })

      test(`${crv} OKP Private key supports single sign alg when \`alg\` is set)`, t => {
        const sigKey = new OKPKey(keyObject, { alg })
        const result = sigKey.algorithms('sign')
        t.is(result.constructor, Set)
        t.deepEqual([...result], [alg])
      })

      test(`${crv} OKP Private key supports single verify alg when \`alg\` is set)`, t => {
        const sigKey = new OKPKey(keyObject, { alg })
        const result = sigKey.algorithms('verify')
        t.is(result.constructor, Set)
        t.deepEqual([...result], [alg])
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
        t.deepEqual([...result], [])
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
        t.deepEqual([...result], [])
      })

      test(`${crv} OKP Private key .algorithms("unwrapKey") when use is sig`, t => {
        const sigKey = new OKPKey(keyObject, { use: 'sig' })
        const result = sigKey.algorithms('unwrapKey')
        t.is(result.constructor, Set)
        t.deepEqual([...result], [])
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
        t.deepEqual([...result], [alg])
      })

      test(`${crv} OKP Public key algorithms (no operation, w/ alg)`, t => {
        const key = new OKPKey(keyObject, { alg })
        const result = key.algorithms()
        t.is(result.constructor, Set)
        t.deepEqual([...result], [alg])
      })

      test(`${crv} OKP Public key cannot sign`, t => {
        const result = key.algorithms('sign')
        t.is(result.constructor, Set)
        t.deepEqual([...result], [])
      })

      test(`${crv} OKP Public key supports verify alg (no use)`, t => {
        const result = key.algorithms('verify')
        t.is(result.constructor, Set)
        t.deepEqual([...result], [alg])
      })

      test(`${crv} OKP Public key cannot sign even when \`use\` is "sig")`, t => {
        const sigKey = new OKPKey(keyObject, { use: 'sig' })
        const result = sigKey.algorithms('sign')
        t.is(result.constructor, Set)
        t.deepEqual([...result], [])
      })

      test(`${crv} OKP Public key supports verify alg when \`use\` is "sig")`, t => {
        const sigKey = new OKPKey(keyObject, { use: 'sig' })
        const result = sigKey.algorithms('verify')
        t.is(result.constructor, Set)
        t.deepEqual([...result], [alg])
      })

      test(`${crv} OKP Public key cannot sign even when \`alg\` is set)`, t => {
        const sigKey = new OKPKey(keyObject, { alg })
        const result = sigKey.algorithms('sign')
        t.is(result.constructor, Set)
        t.deepEqual([...result], [])
      })

      test(`${crv} OKP Public key supports single verify alg when \`alg\` is set)`, t => {
        const sigKey = new OKPKey(keyObject, { alg })
        const result = sigKey.algorithms('verify')
        t.is(result.constructor, Set)
        t.deepEqual([...result], [alg])
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
        t.deepEqual([...result], [])
      })

      test(`${crv} OKP Public key .algorithms("wrapKey") when use is sig`, t => {
        const sigKey = new OKPKey(keyObject, { use: 'sig' })
        const result = sigKey.algorithms('wrapKey')
        t.is(result.constructor, Set)
        t.deepEqual([...result], [])
      })

      test(`${crv} OKP Public key .algorithms("unwrapKey")`, t => {
        const result = key.algorithms('unwrapKey')
        t.is(result.constructor, Set)
        t.deepEqual([...result], [])
      })
    })()
  })
}
