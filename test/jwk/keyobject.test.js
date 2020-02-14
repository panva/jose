const test = require('ava')

const { keyObjectSupported } = require('../../lib/help/runtime_support')

if (keyObjectSupported) {
  return
}

const fixtures = require('../fixtures')
const { createPrivateKey, createPublicKey, createSecretKey } = require('../../lib/help/key_object')
const errors = require('../../lib/errors')

const types = {
  RSA: {
    private: ['pkcs8', 'pkcs1'],
    public: ['pkcs1', 'spki']
  },
  EC: {
    private: ['pkcs8', 'sec1'],
    public: ['spki']
  }
}

test('secret KeyObject is not a valid input for createPublicKey', t => {
  t.throws(() => {
    createPublicKey(createSecretKey(Buffer.from('foo')))
  }, { instanceOf: TypeError, message: 'Invalid key object type secret, expected private.' })
})

test('invalid create*Key inputs', t => {
  [Buffer.alloc(0), 'foo', 1, true, false, Number].forEach((input) => {
    t.throws(() => {
      createSecretKey(input)
    }, { instanceOf: TypeError, message: 'input must be a non-empty Buffer instance' })
  })

  ;[1, true, false, Number].forEach((input) => {
    t.throws(() => {
      createPublicKey(input)
    }, { instanceOf: TypeError, message: 'input must be a string, Buffer or an object' })
  })

  ;[1, true, false, Number].forEach((input) => {
    t.throws(() => {
      createPrivateKey(input)
    }, { instanceOf: TypeError, message: 'input must be a string, Buffer or an object' })
  })

  t.throws(() => {
    createPrivateKey({ key: 'foo', passphrase: 'foo' })
  }, { instanceOf: errors.JOSENotSupported, message: 'encrypted private keys are not supported in your Node.js runtime version' })
})

test('createPublicKey format option must be recognized', t => {
  t.throws(() => {
    createPublicKey({ key: 'foo', type: 'foo', format: 'spki' })
  }, { instanceOf: TypeError, message: 'format must be one of "pem" or "der"' })
})

test('createPrivateKey format option must be recognized', t => {
  t.throws(() => {
    createPrivateKey({ key: 'foo', type: 'foo', format: 'spki' })
  }, { instanceOf: TypeError, message: 'format must be one of "pem" or "der"' })
})

Object.entries({
  RSA: fixtures.PEM.RSA,
  EC: fixtures.PEM['P-256']
}).forEach(([kty, { private: priv, public: pub }]) => {
  types[kty].private.forEach((type) => {
    test(`${kty} private can get re-exported as PEM ${type}`, t => {
      const ko = createPrivateKey(priv)
      t.throws(() => {
        ko.export({ type: 'foo' })
      }, { instanceOf: TypeError, message: 'The value foo is invalid for option "type"' })
      let key
      t.notThrows(() => {
        key = ko.export({ format: 'pem', type })
      })
      t.notThrows(() => {
        createPrivateKey({ key, format: 'pem', type })
        createPublicKey({ key, format: 'pem', type })
      })
    })

    test(`${kty} private can get re-exported as DER ${type}`, t => {
      const ko = createPrivateKey(priv)
      let key
      t.notThrows(() => {
        key = ko.export({ format: 'der', type })
      })
      t.notThrows(() => {
        createPrivateKey({ key, format: 'der', type })
        createPublicKey({ key, format: 'der', type })
      })
    })
  })

  types[kty].public.forEach((type) => {
    test(`${kty} public can get re-exported as PEM ${type}`, t => {
      const ko = createPublicKey(pub)
      t.throws(() => {
        ko.export({ type: 'foo' })
      }, { instanceOf: TypeError, message: 'The value foo is invalid for option "type"' })
      let key
      t.notThrows(() => {
        key = ko.export({ format: 'pem', type })
      })
      t.notThrows(() => {
        createPublicKey({ key, format: 'pem', type })
      })
      t.throws(() => {
        createPrivateKey(pub)
      })
      t.throws(() => {
        createPrivateKey({ key, format: 'pem', type })
      })
    })

    test(`${kty} public can get re-exported as DER ${type}`, t => {
      const ko = createPublicKey(pub)
      let key
      t.notThrows(() => {
        key = ko.export({ format: 'der', type })
      })
      t.notThrows(() => {
        createPublicKey({ key, format: 'der', type })
      })
      t.throws(() => {
        createPrivateKey(pub)
      })
      t.throws(() => {
        createPrivateKey({ key, format: 'der', type })
      })
    })
  })
})
