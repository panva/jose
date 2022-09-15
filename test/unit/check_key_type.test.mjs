import test from 'ava'
import { root, keyRoot } from '../dist.mjs'

let types = 'KeyObject or Uint8Array'
let asymmetricTypes = 'KeyObject'
if ('WEBCRYPTO' in process.env || 'WEBAPI' in process.env) {
  types = 'CryptoKey or Uint8Array'
  asymmetricTypes = 'CryptoKey'
} else if (parseInt(process.versions.node) >= 16) {
  types = 'KeyObject, CryptoKey, or Uint8Array'
  asymmetricTypes = 'KeyObject or CryptoKey'
}

const { default: checkKeyType } = await import(`${root}/lib/check_key_type`)
const { generateKeyPair, generateSecret } = await import(keyRoot)

test('lib/check_key_type.ts', async (t) => {
  const expected = {
    instanceOf: TypeError,
    message: new RegExp(`^Key for the .+ algorithm must be (?:one )?of type ${types}\\.`),
  }

  t.throws(() => checkKeyType('HS256'), expected)
  t.throws(() => checkKeyType('HS256', undefined), expected)
  t.throws(() => checkKeyType('HS256', null), expected)
  t.throws(() => checkKeyType('HS256', 1), expected)
  t.throws(() => checkKeyType('HS256', 0), expected)
  t.throws(() => checkKeyType('HS256', true), expected)
  t.throws(() => checkKeyType('HS256', Boolean), expected)
  t.throws(() => checkKeyType('HS256', []), expected)
  t.throws(() => checkKeyType('HS256', ''), expected)
  t.throws(() => checkKeyType('HS256', 'foo'), expected)

  t.throws(() => checkKeyType('PS256', new Uint8Array()), {
    ...expected,
    message: new RegExp(`^Key for the .+ algorithm must be (?:one )?of type ${asymmetricTypes}\\.`),
  })
  let secret = await generateSecret('HS256')
  t.throws(() => checkKeyType('PS256', secret), {
    ...expected,
    message: `${asymmetricTypes} instances for asymmetric algorithms must not be of type "secret"`,
  })

  t.notThrows(() => checkKeyType('dir', new Uint8Array()))
  t.notThrows(() => checkKeyType('HS256', new Uint8Array()))
  t.notThrows(() => checkKeyType('PBES2-HS256+A128KW', new Uint8Array()))
  t.notThrows(() => checkKeyType('A256GCMKW', new Uint8Array()))
  t.notThrows(() => checkKeyType('A256KW', new Uint8Array()))

  secret = await generateSecret('A256GCMKW')
  t.notThrows(() => checkKeyType('dir', secret))
  secret = await generateSecret('HS256')
  t.notThrows(() => checkKeyType('HS256', secret))
  secret = await generateSecret('A256GCMKW')
  t.notThrows(() => checkKeyType('A256GCMKW', secret))
  secret = await generateSecret('A256KW')
  t.notThrows(() => checkKeyType('A256KW', secret))

  let keypair = await generateKeyPair('PS256')
  t.throws(() => checkKeyType('PS256', keypair.publicKey, 'sign'), {
    ...expected,
    message: `${asymmetricTypes} instances for asymmetric algorithm signing must be of type "private"`,
  })

  t.throws(() => checkKeyType('HS256', keypair.privateKey), {
    ...expected,
    message: `${asymmetricTypes} instances for symmetric algorithms must be of type "secret"`,
  })

  if (keyRoot.includes('web')) {
    t.throws(() => checkKeyType('PS256', keypair.privateKey, 'verify'), {
      ...expected,
      message: `${asymmetricTypes} instances for asymmetric algorithm verifying must be of type "public"`,
    })
  } else {
    t.notThrows(() => checkKeyType('PS256', keypair.privateKey, 'verify'))
  }

  keypair = await generateKeyPair('ECDH-ES')
  t.throws(() => checkKeyType('ECDH-ES', keypair.publicKey, 'decrypt'), {
    ...expected,
    message: `${asymmetricTypes} instances for asymmetric algorithm decryption must be of type "private"`,
  })

  if (keyRoot.includes('web')) {
    t.throws(() => checkKeyType('ECDH-ES', keypair.privateKey, 'encrypt'), {
      ...expected,
      message: `${asymmetricTypes} instances for asymmetric algorithm encryption must be of type "public"`,
    })
  } else {
    t.notThrows(() => checkKeyType('ECDH-ES', keypair.privateKey, 'encrypt'))
  }
})
