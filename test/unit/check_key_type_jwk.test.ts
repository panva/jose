import test from 'ava'

const types = 'CryptoKey, KeyObject, JSON Web Key, or Uint8Array'
const asymmetricTypes = 'CryptoKey, KeyObject, or JSON Web Key'

import { checkKeyType } from '../../src/lib/check_key_type.js'
import { keyAlgorithm as E } from '../../src/lib/key_algorithm.js'

test('lib/check_key_type.ts with JWK', async (t) => {
  const expected = {
    instanceOf: TypeError,
    message: new RegExp(`^Key for the .+ algorithm must be (?:one )?of type ${types}\\.`),
  }

  t.throws(() => checkKeyType(E('HS256')), expected)
  t.throws(() => checkKeyType(E('HS256'), undefined), expected)
  t.throws(() => checkKeyType(E('HS256'), null), expected)
  t.throws(() => checkKeyType(E('HS256'), 1), expected)
  t.throws(() => checkKeyType(E('HS256'), 0), expected)
  t.throws(() => checkKeyType(E('HS256'), true), expected)
  t.throws(() => checkKeyType(E('HS256'), Boolean), expected)
  t.throws(() => checkKeyType(E('HS256'), []), expected)
  t.throws(() => checkKeyType(E('HS256'), ''), expected)
  t.throws(() => checkKeyType(E('HS256'), 'foo'), expected)

  t.throws(() => checkKeyType(E('PS256'), new Uint8Array()), {
    ...expected,
    message: new RegExp(`^Key for the .+ algorithm must be (?:one )?of type ${asymmetricTypes}\\.`),
  })

  t.notThrows(() => checkKeyType(E('HS256'), { kty: 'oct', k: '' }, 'sign'))
  t.notThrows(() => checkKeyType(E('HS256'), { kty: 'oct', k: '', use: 'sig' }, 'sign'))
  t.notThrows(() => checkKeyType(E('HS256'), { kty: 'oct', k: '', key_ops: ['sign'] }, 'sign'))
  t.notThrows(() => checkKeyType(E('HS256'), { kty: 'oct', k: '', alg: 'HS256' }))

  t.throws(() => checkKeyType(E('HS256'), { kty: 'oct', k: '', use: 'enc' }, 'sign'), {
    ...expected,
    message: 'Invalid key for this operation, its "use" must be "sig" when present',
  })

  t.throws(() => checkKeyType(E('HS256'), { kty: 'oct', k: '', alg: 'HS384' }, 'sign'), {
    ...expected,
    message: 'Invalid key for this operation, its "alg" must be "HS256" when present',
  })

  t.throws(() => checkKeyType(E('HS256'), { kty: 'RSA' }), {
    ...expected,
    message:
      'JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present',
  })

  t.notThrows(() => checkKeyType(E('PS256'), { kty: 'RSA' }, 'verify'))
  t.throws(() => checkKeyType(E('PS256'), { kty: 'RSA', d: '' }, 'verify'), {
    ...expected,
    message: 'JSON Web Key for this operation must be a public JWK',
  })

  t.notThrows(() => checkKeyType(E('PS256'), { kty: 'RSA', d: '' }, 'sign'))
  t.throws(() => checkKeyType(E('PS256'), { kty: 'RSA' }, 'sign'), {
    ...expected,
    message: 'JSON Web Key for this operation must be a private JWK',
  })
})

test('lib/check_key_type.ts key_ops per operation', (t) => {
  // Deriving with a recipient's public ECDH key implies no key_ops value, so an empty or absent
  // key_ops must not be rejected. The private half does imply "deriveBits".
  t.notThrows(() => checkKeyType(E('ECDH-ES'), { kty: 'EC', key_ops: [] }, 'encrypt'))
  t.notThrows(() => checkKeyType(E('ECDH-ES'), { kty: 'EC', key_ops: ['deriveBits'] }, 'encrypt'))
  t.notThrows(() =>
    checkKeyType(E('ECDH-ES'), { kty: 'EC', d: '', key_ops: ['deriveBits'] }, 'decrypt'),
  )
  t.throws(() => checkKeyType(E('ECDH-ES'), { kty: 'EC', d: '', key_ops: ['sign'] }, 'decrypt'), {
    instanceOf: TypeError,
    message: 'Invalid key for this operation, its "key_ops" must include "deriveBits" when present',
  })

  t.throws(
    () => checkKeyType(E('A256KW'), { kty: 'oct', k: '', key_ops: ['encrypt'] }, 'encrypt'),
    {
      instanceOf: TypeError,
      message: 'Invalid key for this operation, its "key_ops" must include "wrapKey" when present',
    },
  )
  t.notThrows(() =>
    checkKeyType(E('A256GCMKW'), { kty: 'oct', k: '', key_ops: ['encrypt'] }, 'encrypt'),
  )
})
