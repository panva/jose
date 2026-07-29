import test from 'ava'

const types = 'CryptoKey, KeyObject, JSON Web Key, or Uint8Array'
const asymmetricTypes = 'CryptoKey, KeyObject, or JSON Web Key'

import * as lib from '../../src/index.js'
import { checkKeyType } from '../../src/lib/key.js'
import { keyAlgorithm as E } from '../../src/lib/key_algorithm.js'

test('lib/check_key_type.ts', async (t) => {
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
  let secret = await lib.generateSecret('HS256')
  t.throws(() => checkKeyType(E('PS256'), secret), {
    ...expected,
    message: 'CryptoKey instances for asymmetric algorithms must not be of type "secret"',
  })

  t.notThrows(() => checkKeyType(E('dir'), new Uint8Array()))
  t.notThrows(() => checkKeyType(E('HS256'), new Uint8Array()))
  t.notThrows(() => checkKeyType(E('PBES2-HS256+A128KW'), new Uint8Array()))
  t.notThrows(() => checkKeyType(E('A256GCMKW'), new Uint8Array()))
  t.notThrows(() => checkKeyType(E('A256KW'), new Uint8Array()))

  secret = await lib.generateSecret('A256GCMKW')
  t.notThrows(() => checkKeyType(E('dir'), secret))
  secret = await lib.generateSecret('HS256')
  t.notThrows(() => checkKeyType(E('HS256'), secret))
  secret = await lib.generateSecret('A256GCMKW')
  t.notThrows(() => checkKeyType(E('A256GCMKW'), secret))
  secret = await lib.generateSecret('A256KW')
  t.notThrows(() => checkKeyType(E('A256KW'), secret))

  let keypair = await lib.generateKeyPair('PS256')
  t.throws(() => checkKeyType(E('PS256'), keypair.publicKey, 'sign'), {
    ...expected,
    message: 'CryptoKey instances for asymmetric algorithm signing must be of type "private"',
  })

  t.throws(() => checkKeyType(E('HS256'), keypair.privateKey), {
    ...expected,
    message: 'CryptoKey instances for symmetric algorithms must be of type "secret"',
  })

  t.throws(() => checkKeyType(E('PS256'), keypair.privateKey, 'verify'), {
    ...expected,
    message: 'CryptoKey instances for asymmetric algorithm verifying must be of type "public"',
  })

  keypair = await lib.generateKeyPair('ECDH-ES')
  t.throws(() => checkKeyType(E('ECDH-ES'), keypair.publicKey, 'decrypt'), {
    ...expected,
    message: 'CryptoKey instances for asymmetric algorithm decryption must be of type "private"',
  })

  t.throws(() => checkKeyType(E('ECDH-ES'), keypair.privateKey, 'encrypt'), {
    ...expected,
    message: 'CryptoKey instances for asymmetric algorithm encryption must be of type "public"',
  })
})
